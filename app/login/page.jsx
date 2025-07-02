"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLogin = async () => {
    toast.dismiss();

    if (!emailRegex.test(email)) {
      toast.error("❌ Please enter a valid email address");
      return;
    }

    if (!password.trim()) {
      toast.error("❌ Password is required");
      return;
    }

    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      toast.error("❌ Invalid email or password");
    } else {
      toast.success("✅ Login successful");
      router.push("/dashboard");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="p-6 flex items-center gap-3">
        <Image src="/logo.svg" alt="AI Decor" width={40} height={40} />
        <span
          className="text-2xl font-bold"
          style={{ color: "oklch(55.8% 0.288 302.321)" }}
        >
          AI Decor
        </span>
      </div>

      {/* Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="max-w-md w-full bg-white rounded-xl shadow-lg p-8"
        >
          <h1
            className="text-3xl font-bold text-center mb-6"
            style={{ color: "oklch(55.8% 0.288 302.321)" }}
          >
            Welcome back
          </h1>

          <input
            type="email"
            placeholder="Email address"
            className="w-full border border-gray-300 rounded px-4 py-3 mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded px-4 py-3 mb-6"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full text-white py-3 text-lg font-semibold rounded"
            style={{ backgroundColor: "oklch(55.8% 0.288 302.321)" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#000")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "oklch(55.8% 0.288 302.321)")
            }
          >
            {loading ? "Logging in..." : "Log in"}
          </Button>

          <div className="my-4 text-center text-gray-500 text-sm">or</div>

          <Button
            variant="outline"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full py-3 text-sm flex items-center justify-center gap-2"
          >
            <Image src="/google-logo.png" alt="Google" width={20} height={20} />
            Continue with Google
          </Button>

          <div className="text-center text-sm mt-6">
            Don’t have an account?{" "}
            <a
              href="/register"
              style={{ color: "oklch(55.8% 0.288 302.321)" }}
              className="underline"
            >
              Sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}