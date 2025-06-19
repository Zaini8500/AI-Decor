"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import GeneratedImageModal from "./GeneratedImageModal";

export default function GenerateForm() {
  const [imageUrl, setImageUrl] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);
  const [roomType, setRoomType] = useState("Bedroom");
  const [style, setStyle] = useState("Modern");
  const [prompt, setPrompt] = useState("");

  const handleGenerate = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return alert("Please upload a room image.");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("roomType", roomType);
    formData.append("style", style);
    formData.append("prompt", prompt);

    try {
      setLoading(true);
      const res = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok && data.imageUrl) {
        setImageUrl(data.imageUrl);
        setModalOpen(true);
      } else {
        alert(data.error || "Generation failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-purple-700">
        Experience the Magic of AI Remodeling
      </h2>
      <p className="text-center mb-8 text-gray-600">
        Transform any room with a click.
      </p>

      {/* Upload Image */}
      <div className="border-2 border-dashed rounded-lg flex justify-center items-center h-64 bg-gray-100 mb-4 relative">
        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          className="absolute w-full h-full opacity-0 cursor-pointer"
        />
        <div className="text-center text-gray-500">Click to upload image</div>
      </div>

      {/* Room Type & Prompt */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block mb-1">Select Room Type *</label>
          <select
            className="w-full p-3 border rounded-lg"
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
          >
            <option>Bedroom</option>
            <option>Living Room</option>
            <option>Kitchen</option>
            <option>Office</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Additional Requirements</label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg"
            placeholder="e.g., Add plants or lights"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
      </div>

      {/* Styles Grid */}
      <div className="mb-6">
        <label className="block mb-2">Interior Design Style</label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {["Rustic", "Modern", "Minimalist", "Industrial", "Bohemian", "Traditional"].map((styleName) => (
            <div
              key={styleName}
              className={`cursor-pointer border rounded-lg overflow-hidden hover:ring-2 transition-all ${
                style === styleName ? "ring-2 ring-purple-500" : ""
              }`}
              onClick={() => setStyle(styleName)}
            >
              <Image
                src={`/styles/${styleName.toLowerCase()}.jpg`}
                alt={styleName}
                width={100}
                height={100}
                className="w-full h-20 object-cover"
              />
              <p className="text-center text-sm font-medium p-2">{styleName}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Button */}
      <p className="text-sm text-gray-500 mb-2">
        NOTE: 1 credit will be used to redesign your room
      </p>
      <Button
        className="bg-purple-600 text-white w-full hover:bg-purple-700"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate"}
      </Button>

      {/* Modal */}
      <GeneratedImageModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        imageUrl={imageUrl}
      />
    </div>
  );
}
