"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [credits, setCredits] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status !== "authenticated") return;

    const fetchData = async () => {
      try {
        const success = searchParams.get("success");
        const newCredits = searchParams.get("credits");

        if (success && newCredits && session?.user?.email) {
          const creditsToAdd = parseInt(newCredits);

          // 1. Update credits
          await fetch("/api/update-credits", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ credits: creditsToAdd }),
          });

          // 2. Save payment
          await fetch("/api/save-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: session.user.email,
              credits: creditsToAdd,
              amount: creditsToAdd * 1, // $1 per credit
            }),
          });

          // Remove query string
          router.replace("/dashboard");
        }

        // Always fetch credits & history
        const [creditsRes, historyRes] = await Promise.all([
          fetch("/api/user-credits"),
          fetch("/api/design-history"),
        ]);

        const creditsData = await creditsRes.json();
        const historyData = await historyRes.json();

        setCredits(creditsData.credits || 0);
        setHistory(historyData || []);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [status, session]);

  const handleDownload = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "design.jpg";
    link.click();
  };

  const handlePreview = (url) => {
    window.open(url, "_blank");
  };

  if (status === "loading" || loading) {
    return <p className="text-center mt-10">Loading your dashboard...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold">
          Hello, {session?.user?.name?.split(" ")[0] || "Guest"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          You have <span className="font-semibold">{credits}</span> credits
        </p>
      </div>

      <div className="text-center">
        <Image
          src="/room.jpeg"
          alt="Room Design Preview"
          width={200}
          height={200}
          className="mx-auto rounded shadow"
        />
        <p className="text-gray-600 text-sm mt-2">
          Create New AI Interior Design for your room
        </p>
        <Button
          onClick={() => router.push("/dashboard/form")}
          className="mt-4 px-6 py-2 text-white text-sm font-semibold"
          style={{ backgroundColor: "oklch(55.8% 0.288 302.321)" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#000")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "oklch(55.8% 0.288 302.321)")
          }
        >
          + Interior Redesign
        </Button>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Design History</h2>
        {history.length === 0 ? (
          <p className="text-gray-500">No designs generated yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {history.map((item, idx) => (
              <div
                key={idx}
                className="border rounded-lg overflow-hidden shadow hover:shadow-md transition group relative"
              >
                <Image
                  src={item.imageUrl}
                  alt={`Design ${idx}`}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <div className="p-3 text-sm text-gray-700 space-y-1">
                  <p><strong>Room:</strong> {item.roomType}</p>
                  <p><strong>Style:</strong> {item.style}</p>
                  <p><strong>Prompt:</strong> {item.prompt || "—"}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex justify-center items-center gap-3 opacity-0 group-hover:opacity-100 transition">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePreview(item.imageUrl)}
                    className="text-white bg-black/70 hover:bg-black"
                  >
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownload(item.imageUrl)}
                    className="text-white bg-black/70 hover:bg-black"
                  >
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
