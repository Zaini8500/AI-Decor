"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [displayText, setDisplayText] = useState("");
  const fullText = "Welcome to AI Decor";
  const router = useRouter();

  useEffect(() => {
    let index = 0;
    let direction = 1;

    const interval = setInterval(() => {
      setDisplayText(fullText.slice(0, index));
      if (direction === 1) {
        if (index < fullText.length) {
          index++;
        } else {
          direction = -1;
        }
      } else {
        if (index > 0) {
          index--;
        } else {
          direction = 1;
        }
      }
    }, 120);

    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    router.push("/dashboard/form"); // Navigates to Form UI
  };

  return (
    <main className="min-h-screen bg-white font-sans">
      {/* Animated Welcome Text */}
      <div
        className="text-center text-5xl md:text-6xl font-extrabold pt-8 animate-pulse"
        style={{ color: "oklch(55.8% 0.288 302.321)" }}
      >
        {displayText}
      </div>

      {/* Hero Section */}
      <section className="text-center px-6 pt-6 pb-8">
        <h1 className="text-3xl md:text-4xl font-semibold text-black">
          AI Room and Home{" "}
          <span style={{ color: "oklch(55.8% 0.288 302.321)" }}>
            Interior Design Generator
          </span>
        </h1>
        <p className="text-gray-700 mt-4 text-lg">
          Transform Your Space with AI: Effortless Room & Home Interior Design
          at Your Fingertips!
        </p>

        {/* Button with black hover effect */}
        <Button
          onClick={handleStart}
          className="mt-6 text-white text-lg px-6 py-2 rounded-lg transition-all duration-300"
          style={{
            backgroundColor: "oklch(55.8% 0.288 302.321)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#000")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "oklch(55.8% 0.288 302.321)")
          }
        >
          Get started
        </Button>
      </section>

      {/* Transformation Visual */}
      <section className="flex flex-col md:flex-row items-center justify-center gap-10 py-10 px-6 bg-white">
        <img
          src="/before.jpg"
          alt="Before room"
          className="w-full md:w-1/3 rounded-lg shadow-lg"
        />
        <div className="text-6xl">➡️</div>
        <img
          src="/after.jpg"
          alt="After room"
          className="w-full md:w-1/3 rounded-lg shadow-lg"
        />
      </section>

      {/* Steps */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 px-6 pb-16 text-center">
        <div>
          <div className="text-2xl mb-2">📤</div>
          <h2 className="text-lg font-semibold">Upload</h2>
          <p className="text-sm text-gray-600">Upload Your Room Picture</p>
        </div>
        <div>
          <div className="text-2xl mb-2">🎨</div>
          <h2 className="text-lg font-semibold">Select Design</h2>
          <p className="text-sm text-gray-600">
            Select Design and Room Type
          </p>
        </div>
        <div>
          <div className="text-2xl mb-2">📝</div>
          <h2 className="text-lg font-semibold">Write Prompt</h2>
          <p className="text-sm text-gray-600">
            Enter your design ideas for better results
          </p>
        </div>
        <div>
          <div className="text-2xl mb-2">💬</div>
          <h2 className="text-lg font-semibold">Ready to Download</h2>
          <p className="text-sm text-gray-600">
            Your Room / Home Interior Design is Ready
          </p>
        </div>
      </section>
    </main>
  );
}
