// app/api/save-payment/route.js

import dbConnect from "@/lib/dbConnect";
import Payment from "@/models/Payment";

export async function POST(req) {
  const { email, amount } = await req.json();

  if (!email || !amount) {
    return new Response("Invalid data", { status: 400 });
  }

  try {
    await dbConnect();
    await Payment.create({ email, amount });

    return new Response("Payment saved", { status: 200 });
  } catch (err) {
    console.error("❌ Error saving payment:", err);
    return new Response("Server error", { status: 500 });
  }
}
