"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Customloading from "../_components/Customloading";
import GeneratedImageModal from "../_components/GeneratedImageModal";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function FormPage() {
  const { data: session } = useSession();
  const isAuthenticated = !!session;
  const router = useRouter();

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [roomType, setRoomType] = useState("");
  const [prompt, setPrompt] = useState("");
  const [width, setWidth] = useState("");
  const [length, setLength] = useState("");
  const [unit, setUnit] = useState("feet");

  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState("");
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const designStyles = [
    { name: "Traditional", src: "/traditional.jpg" },
    { name: "Rustic", src: "/rustic.jpg" },
    { name: "Minimalist", src: "/minimalist.jpg" },
    { name: "Modern", src: "/modern.jpg" },
    { name: "Industrial", src: "/industrial.jpg" },
    { name: "Bohemian", src: "/bohemian.jpg" },
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleStyleSelect = (styleName) => {
    setSelectedStyle(styleName);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile || !selectedStyle || !roomType || !width || !length) {
      toast.error("Please complete all required fields.");
      return;
    }

    if (!isAuthenticated) {
      setShowLoginAlert(true);
      return;
    }

    setLoading(true);
    setResultImage("");

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("style", selectedStyle);
    formData.append("prompt", prompt);
    formData.append("roomType", roomType);
    formData.append("width", width);
    formData.append("length", length);
    formData.append("unit", unit);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data?.imageUrl) {
        setResultImage(data.imageUrl);
      } else {
        if (data?.error === "Not enough credits") {
          toast.error("You have no credits left to generate an image.");
          setTimeout(() => router.push("/plans"), 2000); // Redirect to Buy Credits
        } else {
          toast.error("Failed to generate image.");
        }
      }
    } catch (error) {
      toast.error("Something went wrong.");
      console.error("Generation error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        {/* ✅ Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <img src="/loading.gif" alt="Loading..." className="w-24 h-24" />
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center p-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-purple-700">Experience the Magic of AI Remodeling</h1>
          <p className="text-gray-600 mt-2 text-sm max-w-2xl mx-auto">
            Transform any room with a click. Select a space, choose a style, add dimensions, and watch AI redesign your space.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-6xl">
          {/* Upload Section */}
          <div className="space-y-6">
            <label className="block font-semibold text-left">Upload Image of your room</label>
            <div className="flex gap-4 flex-wrap items-center">
              <Button type="button" onClick={() => fileInputRef.current?.click()} className="bg-purple-600 text-white hover:bg-black">Upload Image</Button>
              <Button type="button" onClick={() => cameraInputRef.current?.click()} className="bg-purple-600 text-white hover:bg-black">Use Camera</Button>

              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleImageChange} className="hidden" />
            </div>

            <div className="border w-full h-64 bg-gray-100 flex items-center justify-center rounded-md">
              {imagePreview ? (
                <Image src={imagePreview} width={300} height={300} alt="Preview" className="object-cover h-full rounded-md" />
              ) : (
                <p className="text-gray-400">Image Preview</p>
              )}
            </div>
          </div>

          {/* Form Inputs */}
          <div className="space-y-6">
            <div>
              <label className="block font-semibold mb-1">Select Room Type</label>
              <select value={roomType} onChange={(e) => setRoomType(e.target.value)} className="w-full border px-3 py-2 rounded-md">
                <option value="">-- Select --</option>
                <option>Living Room</option>
                <option>Bedroom</option>
                <option>Kitchen</option>
                <option>Office</option>
                <option>Bathroom</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-2">Select Design Style</label>
              <div className="grid grid-cols-3 gap-3">
                {designStyles.map((style) => (
                  <div
                    key={style.name}
                    onClick={() => handleStyleSelect(style.name)}
                    className={`cursor-pointer border rounded-md p-2 transition ${
                      selectedStyle === style.name ? "border-purple-600 ring-2 ring-purple-400" : "border-gray-200"
                    }`}
                  >
                    <Image src={style.src} alt={style.name} width={100} height={100} className="rounded-md mx-auto hover:scale-105 transition-transform" />
                    <p className="text-xs mt-1 text-center font-medium">{style.name}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Room Width</label>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g., 12"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="w-full border px-3 py-2 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Room Length</label>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g., 14"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="w-full border px-3 py-2 rounded-md"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Measurement Unit</label>
              <select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full border px-3 py-2 rounded-md">
                <option value="feet">Feet</option>
                <option value="meters">Meters</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Additional Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full border px-3 py-2 rounded-md"
                rows="3"
              />
            </div>

            <Button type="submit" className="w-full bg-purple-600 text-white hover:bg-black" disabled={loading}>
              {loading ? "Generating..." : "Generate"}
            </Button>
          </div>
        </div>
      </form>

      {isAuthenticated && resultImage && (
        <GeneratedImageModal imageUrl={resultImage} onClose={() => setResultImage("")} />
      )}

      <AlertDialog open={showLoginAlert} onOpenChange={setShowLoginAlert}>
        <AlertDialogContent>
          <AlertDialogTitle>Please login first</AlertDialogTitle>
          <p className="text-gray-600">You must be logged in and have credits to generate designs.</p>
          <Button className="mt-4 bg-purple-600 text-white hover:bg-black" onClick={() => {
            setShowLoginAlert(false);
            router.push("/login");
          }}>
            Go to Login
          </Button>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
