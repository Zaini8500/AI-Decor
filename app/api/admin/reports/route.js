// app/api/admin/reports/route.js

import dbConnect from "@/lib/dbConnect";
import GeneratedImage from "@/models/GeneratedImage";
import Payment from "@/models/Payment";

export async function GET() {
  try {
    await dbConnect();

    const totalDesigns = await GeneratedImage.countDocuments();

    const payments = await Payment.find().sort({ date: -1 }).limit(10);
    const totalPaymentsAgg = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalAmount = totalPaymentsAgg[0]?.total || 0;

    return Response.json({
      totalDesigns,
      totalPayments: totalAmount,
      recentPayments: payments.map((p) => ({
        email: p.email,
        amount: p.amount,
        date: p.date,
      })),
    });
  } catch (err) {
    console.error("❌ Report fetch error:", err);
    return new Response("Error fetching report", { status: 500 });
  }
}
