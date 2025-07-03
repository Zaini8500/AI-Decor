import Replicate from "replicate";
import cloudinary from "@/lib/cloudinary";
import dbConnect from "@/lib/dbConnect";
import GeneratedImage from "@/models/GeneratedImage";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import fs from "fs/promises";
import path from "path";
import axios from "axios";

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

  // Upload room image to Cloudinary
  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadedOriginal = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ resource_type: "image" }, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    }).end(buffer);
  });

  // Construct AI Prompt
  let prompt = `Interior design of a ${roomType.toLowerCase()} styled in ${style.toLowerCase()} decor.`;
  if (width && length && unit) {
    prompt += ` The room dimensions are approximately ${width} by ${length} ${unit}.`;
  }
  if (userPrompt?.trim()) {
    prompt += ` Additional features: ${userPrompt.trim()}.`;
  }

  console.log("🧠 Final AI Prompt:", prompt);

  let depthUrl = null;
  const isLocalhost = process.env.NODE_ENV !== "production";

  if (isLocalhost) {
    try {
      const depthPath = path.join("output", "input-dpt_beit_large_512.png");
      const depthBuffer = await fs.readFile(depthPath);

      const uploadedDepth = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ resource_type: "image" }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }).end(depthBuffer);
      });

      depthUrl = uploadedDepth.secure_url;
    } catch (err) {
      console.warn("⚠ Depth image not found locally. Proceeding without depth.");
    }
  }

  // Generate image with Replicate
  let prediction;
  try {
    const input = {
      image: uploadedOriginal.secure_url,
      prompt,
      ...(depthUrl && { depth_map: depthUrl }),
    };

    prediction = await replicate.predictions.create({
      version: "06d6fae3b75ab68a28cd2900afa6033166910dd09fd9751047043a5bbb4c184b", // Lucataco ControlNet + SDXL
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
      return new Response(JSON.stringify({ error: "AI generation failed" }), { status: 500 });
    }
  } catch (err) {
    console.error("🔥 Replicate API error:", err);
    return new Response(JSON.stringify({ error: "Replicate API error" }), { status: 500 });
  }

  // Download result image
  const replicateImageUrl = Array.isArray(prediction.output)
    ? prediction.output[0]
    : prediction.output;

  let imageBuffer;
  try {
    const response = await axios.get(replicateImageUrl, { responseType: "arraybuffer" });
    imageBuffer = response.data;
  } catch (err) {
    console.error("❌ Failed to download image:", err);
    return new Response(JSON.stringify({ error: "Image download failed" }), { status: 500 });
  }

  // Upload final image to Cloudinary
  const uploadedFinal = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ resource_type: "image" }, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    }).end(imageBuffer);
  });

  const finalImageUrl = uploadedFinal.secure_url;

  // Save to DB
  await new GeneratedImage({
    imageUrl: finalImageUrl,
    prompt,
    style,
    roomType,
    userEmail: session.user.email,
  }).save();

  // Deduct 1 credit
  await User.updateOne({ email: session.user.email }, { $inc: { credits: -1 } });

  return new Response(JSON.stringify({
    success: true,
    imageUrl: finalImageUrl,
    uploadedImage: uploadedOriginal.secure_url,
    prompt,
    style,
    roomType,
  }), { status: 200 });
}