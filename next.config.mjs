/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      "replicate.delivery", // ✅ Required for Replicate output images
    ],
  },
};

export default nextConfig;
