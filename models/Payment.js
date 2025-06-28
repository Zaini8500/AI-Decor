import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  email: { type: String, required: true },
  amount: { type: Number, required: true },
  credits: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
