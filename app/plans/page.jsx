"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export default function PlansPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const themeColor = "oklch(55.8% 0.288 302.321)";

  if (status === "loading") {
    return <p className="text-center mt-10">Checking login status...</p>;
  }

  const handleBuy = async (credits) => {
    if (!session) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credits }),
      });

      const text = await res.text();
      try {
        const data = JSON.parse(text);
        if (data.url) {
          router.push(data.url);
        } else {
          alert("⚠️ Unexpected response from server.");
        }
      } catch {
        alert("❌ Error: " + text);
      }
    } catch (err) {
      console.error("🔥 Fetch error:", err);
      alert("❌ Network or server error occurred.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-extrabold mb-2" style={{ color: themeColor }}>
          Choose Your Plan
        </h1>
        <p className="text-gray-600 text-lg">Buy credits to generate room designs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {[1, 3, 5].map((num) => (
          <div
            key={num}
            className="bg-white p-8 rounded-lg shadow border flex flex-col justify-between"
          >
            <div>
              <h2 className="text-2xl font-bold mb-2">{num} Credit{num > 1 ? "s" : ""}</h2>
              <p className="text-4xl font-extrabold mb-4">${num}.00</p>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>✅ {num} Room Design{num > 1 ? "s" : ""}</li>
                <li>✅ Instant Generation</li>
                <li>✅ High-Quality Output</li>
              </ul>
            </div>
            <Button
              onClick={() => handleBuy(num)}
              className="mt-6 w-full text-white text-lg font-semibold"
              style={{ backgroundColor: themeColor }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#000")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = themeColor)}
            >
              Buy Now
            </Button>
          </div>
        ))}
      </div>

      <p className="text-center text-gray-500 text-sm mt-12">
        All plans include access to all design styles and room types.
      </p>
    </div>
  );
}
