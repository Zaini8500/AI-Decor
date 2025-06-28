"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  const [credits, setCredits] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchCredits = async () => {
      if (isLoggedIn) {
        const res = await fetch("/api/user-credits");
        const data = await res.json();
        setCredits(data.credits || 0);
      } else {
        setCredits(0);
      }
    };
    fetchCredits();
  }, [isLoggedIn]);

  const handleBuyCredits = () => {
    if (!isLoggedIn) {
      signIn();
    } else {
      router.push("/plans");
    }
  };

  const handleAdminLogin = () => {
    router.push("/admin/login");
  };

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  const userInitial = session?.user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="fixed top-0 w-full z-50 bg-white shadow flex justify-between items-center px-8 py-4 border-b">
      {/* Logo + Name */}
      <div className="flex items-center gap-3 font-semibold text-lg">
        <Image src="/logo.svg" alt="Logo" width={30} height={30} />
        <span>AI DECOR</span>
      </div>

      {/* Buy Credits */}
      <Button
        onClick={handleBuyCredits}
        variant="outline"
        className="border border-purple-600 text-purple-600 hover:bg-purple-50"
      >
        Buy Credits
      </Button>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Dashboard Button */}
        {isLoggedIn && pathname === "/dashboard/form" && (
          <Button
            onClick={handleGoToDashboard}
            variant="outline"
            className="text-sm"
          >
            Dashboard
          </Button>
        )}

        {/* Credits */}
        {isLoggedIn && (
          <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm">
            <Image src="/star.png" alt="star" width={18} height={18} />
            <span>{credits}</span>
          </div>
        )}

        {/* Auth Buttons */}
        {!isLoggedIn ? (
          <>
            <Button
              onClick={() => signIn()}
              variant="outline"
              className="text-sm flex items-center gap-2"
            >
              <div className="bg-purple-600 w-6 h-6 text-white flex justify-center items-center rounded-full text-xs">
                G
              </div>
              Login
            </Button>
            <Button
              onClick={handleAdminLogin}
              variant="outline"
              className="text-sm"
            >
              Admin
            </Button>
          </>
        ) : (
          <Button
            onClick={() => signOut()}
            variant="outline"
            className="text-sm flex items-center gap-2"
          >
            <div className="bg-purple-600 w-6 h-6 text-white flex justify-center items-center rounded-full text-xs">
              {userInitial}
            </div>
            Sign Out
          </Button>
        )}
      </div>
    </header>
  );
}
