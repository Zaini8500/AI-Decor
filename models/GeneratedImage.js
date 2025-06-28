// models/GeneratedImage.js
import mongoose from "mongoose";

const GeneratedImageSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  prompt: { type: String },
  style: { type: String, required: true },
  roomType: { type: String }, // ✅ Add this line
  userEmail: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.GeneratedImage || mongoose.model("GeneratedImage", GeneratedImageSchema);
