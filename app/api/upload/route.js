import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file) return Response.json({ error: "No file uploaded" }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());

  const upload = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ resource_type: "image"  }, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    }).end(buffer);
  });

  return Response.json({ url: upload.secure_url });
}
