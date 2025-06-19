import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String, // hashed password
});

export default mongoose.models.Admin || mongoose.model("Admin", adminSchema);
