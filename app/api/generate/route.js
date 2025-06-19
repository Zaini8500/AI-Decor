import Replicate from "replicate";
import cloudinary from "@/lib/cloudinary";
import dbConnect from "@/lib/dbConnect";
import GeneratedImage from "@/models/GeneratedImage";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// Init Replicate
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");
  const roomType = formData.get("roomType") || "room";
  const style = formData.get("style") || "modern";
  const userPrompt = formData.get("prompt") || "";
  const prompt = `A ${roomType} with a ${style} interior style. ${userPrompt}`;

  if (!file) {
    return Response.json({ error: "No file uploaded" }, { status: 400 });
  }

  await dbConnect();

  // Fetch user from DB
  const user = await User.findOne({ email: session.user.email });
  if (!user || user.credits <= 0) {
    return Response.json({ error: "Not enough credits" }, { status: 403 });
  }

  // Upload to Cloudinary
  const buffer = Buffer.from(await file.arrayBuffer());
  const cloudinaryUpload = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    ).end(buffer);
  });

  const input = {
    image: cloudinaryUpload.secure_url,
    prompt,
  };

  // Generate design via Replicate
  let prediction;
  try {
    prediction = await replicate.predictions.create({
      version: "76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38",
      input,
    });

    // Poll until generation is done
    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed" &&
      prediction.status !== "canceled"
    ) {
      await new Promise((r) => setTimeout(r, 2000));
      prediction = await replicate.predictions.get(prediction.id);
    }

    if (prediction.status !== "succeeded") {
      return Response.json(
        { error: "Prediction failed", status: prediction.status },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("Replicate Prediction Error:", err);
    return Response.json({ error: "Replicate error", detail: err.message }, { status: 500 });
  }

  const imageUrl = Array.isArray(prediction.output)
    ? prediction.output[0]
    : prediction.output;

  // Save to MongoDB
  const newImage = new GeneratedImage({
    imageUrl,
    prompt,
    style,
    userEmail: session.user.email,
  });
  await newImage.save();

  // Deduct 1 credit after successful generation
  await User.updateOne(
    { email: session.user.email },
    { $inc: { credits: -1 } }
  );

  return Response.json({
    success: true,
    imageUrl,
    uploadedImage: cloudinaryUpload.secure_url,
    prompt,
    style,
  });
}
