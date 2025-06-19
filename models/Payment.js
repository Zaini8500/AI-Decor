// models/Payment.js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  email: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
