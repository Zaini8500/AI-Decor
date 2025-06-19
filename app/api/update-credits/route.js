import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import payment from "@/models/Payment"; // ✅ Make sure you have this model
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { credits } = await req.json();
  const creditAmount = parseInt(credits);

  if (!creditAmount || creditAmount <= 0) {
    return new Response("Invalid credit amount", { status: 400 });
  }

  await dbConnect();

  // 1. Update user credits
  const updatedUser = await User.findOneAndUpdate(
    { email: session.user.email },
    { $inc: { credits: creditAmount } },
    { new: true }
  );

  if (!updatedUser) {
    return new Response("User not found", { status: 404 });
  }

  // 2. Log payment in Payment model
  await Payment.create({
    userEmail: session.user.email,
    amount: creditAmount, // Or multiply by $1 per credit if needed
    credits: creditAmount,
    date: new Date(),
  });

  return Response.json({
    success: true,
    credits: updatedUser.credits,
    message: "Credits updated and payment recorded",
  });
}
