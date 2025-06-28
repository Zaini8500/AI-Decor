"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function DashboardContent() {
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

          await fetch("/api/update-credits", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ credits: creditsToAdd }),
          });

          await fetch("/api/save-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: session.user.email,
              credits: creditsToAdd,
              amount: creditsToAdd * 1,
            }),
          });

          router.replace("/dashboard");
        }

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
      {/* Existing dashboard content unchanged */}
      {/* ... your existing JSX ... */}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
