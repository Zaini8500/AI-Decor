// /app/api/admin/reports/route.js
import dbConnect from "@/lib/dbConnect";
import GeneratedImage from "@/models/GeneratedImage";
import Payment from "@/models/Payment";

export async function GET(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const date = searchParams.get("date");
  const email = searchParams.get("email");
  const roomType = searchParams.get("roomType");
  const style = searchParams.get("style");

  let result = [];

  if (type === "design") {
    const allDesigns = await GeneratedImage.find({}).sort({ createdAt: -1 });

    result = allDesigns.filter((item) => {
      const emailMatch = !email || item.userEmail === email;
      const styleMatch = !style || item.style === style;
      const dateMatch = !date || (
        new Date(item.createdAt).toDateString() === new Date(date).toDateString()
      );

      const roomMatch =
        !roomType ||
        item.roomType?.toLowerCase() === roomType.toLowerCase() ||
        (item.prompt?.toLowerCase().includes(roomType.toLowerCase()));

      return emailMatch && styleMatch && dateMatch && roomMatch;
    });
  }

  if (type === "payment") {
    const query = {};
    if (email) query.email = email;
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      query.createdAt = { $gte: start, $lt: end };
    }

    result = await Payment.find(query).sort({ createdAt: -1 });
  }

  return Response.json({ success: true, result });
}
