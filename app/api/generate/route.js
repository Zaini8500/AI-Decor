import Replicate from "replicate";
import cloudinary from "@/lib/cloudinary";
import dbConnect from "@/lib/dbConnect";
import GeneratedImage from "@/models/GeneratedImage";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");
  const roomType = formData.get("roomType") || "room";
  const style = formData.get("style") || "modern";
  const userPrompt = formData.get("prompt") || "";
  const width = formData.get("width") || "";
  const length = formData.get("length") || "";
  const unit = formData.get("unit") || "";

  if (!file) {
    return new Response(JSON.stringify({ error: "No file uploaded" }), { status: 400 });
  }

  await dbConnect();

  const user = await User.findOne({ email: session.user.email });
  if (!user || user.credits <= 0) {
    return new Response(JSON.stringify({ error: "Not enough credits" }), { status: 403 });
  }

  // Upload image to Cloudinary
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

  // Construct AI prompt
  let prompt = `A ${roomType} with a ${style} interior style`;
  if (width && length && unit) {
    prompt += ` in a ${width}x${length} ${unit} room.`;
  } else {
    prompt += ".";
  }
  if (userPrompt) prompt += " " + userPrompt;

  const input = {
    image: cloudinaryUpload.secure_url,
    prompt,
  };

  // Generate with Replicate API
  let prediction;
  try {
    prediction = await replicate.predictions.create({
      version: "76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38",
      input,
    });

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed" &&
      prediction.status !== "canceled"
    ) {
      await new Promise((r) => setTimeout(r, 2000));
      prediction = await replicate.predictions.get(prediction.id);
    }

    if (prediction.status !== "succeeded") {
      return new Response(JSON.stringify({ error: "Prediction failed" }), { status: 500 });
    }
  } catch (err) {
    console.error("Replicate Error:", err);
    return new Response(JSON.stringify({ error: "AI generation failed" }), { status: 500 });
  }

  const imageUrl = Array.isArray(prediction.output)
    ? prediction.output[0]
    : prediction.output;

  // ✅ Save design to DB with roomType
  const newImage = new GeneratedImage({
    imageUrl,
    prompt,
    style,
    roomType, // ✅ save this
    userEmail: session.user.email,
  });
  await newImage.save();

  // ✅ Deduct credit
  await User.updateOne(
    { email: session.user.email },
    { $inc: { credits: -1 } }
  );

  return new Response(JSON.stringify({
    success: true,
    imageUrl,
    uploadedImage: cloudinaryUpload.secure_url,
    prompt,
    style,
    roomType,
  }), { status: 200 });
}
