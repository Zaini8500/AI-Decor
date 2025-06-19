import mongoose from "mongoose";

const GeneratedImageSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  prompt: { type: String },
  style: { type: String, required: true },
  userEmail: { type: String }, // from session
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.GeneratedImage || mongoose.model("GeneratedImage", GeneratedImageSchema);
