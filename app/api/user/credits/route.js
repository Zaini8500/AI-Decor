// app/api/user/credits/route.js

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return Response.json({ credits: 0 }, { status: 401 });
  }

  await dbConnect();
  
  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return Response.json({ credits: 0 }, { status: 404 });
  }

  return Response.json({ credits: user.credits || 0 });
}
