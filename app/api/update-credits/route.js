// app/api/update-credits/route.js

import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
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

  try {
    await dbConnect();

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $inc: { credits: creditAmount } },
      { new: true }
    );

    if (!updatedUser) {
      return new Response("User not found", { status: 404 });
    }

    return Response.json({
      success: true,
      credits: updatedUser.credits,
      message: "Credits updated successfully",
    });
  } catch (err) {
    console.error("❌ Error updating credits:", err);
    return new Response("Server error", { status: 500 });
  }
}
