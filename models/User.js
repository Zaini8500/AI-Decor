import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  image: String,
  credits: {
    type: Number,
    default: 0, // 🔥 Required!
  },
});

export default mongoose.models.User || mongoose.model("User", userSchema);
