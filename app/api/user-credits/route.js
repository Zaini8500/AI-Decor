import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 }); // ✅ return JSON
  }

  await dbConnect();
  const user = await User.findOne({ email: session.user.email });

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 }); // ✅ return JSON
  }

  return Response.json({ credits: user.credits || 0 }); // ✅ safe JSON
}
