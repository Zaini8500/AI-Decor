"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function GeneratedImageModal({ imageUrl, onClose }) {
  if (!imageUrl) return null;

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl, { mode: "cors" });
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "generated-image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up memory
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Could not download the image.");
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col items-center justify-center">
      {/* Close Button */}
      <button
        className="absolute top-6 right-6 text-white text-3xl hover:text-red-400"
        onClick={onClose}
        aria-label="Close Modal"
      >
        ✕
      </button>

      {/* Static Image Display */}
      <div className="max-w-[90%] max-h-[80%] overflow-hidden rounded shadow-lg">
        <img
          src={imageUrl}
          alt="Generated Design"
          className="max-w-full max-h-full object-contain"
          style={{ transition: "none" }}
        />
      </div>

      {/* Download Button */}
      <div className="mt-6">
        <Button
          onClick={handleDownload}
          className="bg-white text-black hover:bg-gray-200 border border-gray-400"
        >
          ⬇️ Download
        </Button>
      </div>
    </div>
  );
}
