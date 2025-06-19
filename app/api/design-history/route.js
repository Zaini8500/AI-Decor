import dbConnect from "@/lib/dbConnect";
import GeneratedImage from "@/models/GeneratedImage";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  await dbConnect();

  const images = await GeneratedImage.find({ userEmail: session.user.email }).sort({ createdAt: -1 });

  return Response.json(images);
}
