"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast"; // ✅ only toast, no Toaster

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      toast.error("Invalid email or password");
    } else {
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
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-6" style={{ color: "oklch(55.8% 0.288 302.321)" }}>
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

          <div className="relative mb-6">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full border border-gray-300 rounded px-4 py-3 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600 text-xl"
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <Button
            onClick={handleLogin}
            disabled={loading}
            className="w-full text-white py-3 text-lg font-semibold rounded"
            style={{
              backgroundColor: "oklch(55.8% 0.288 302.321)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#000")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "oklch(55.8% 0.288 302.321)")
            }
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Logging in...
              </span>
            ) : (
              "Log in"
            )}
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
        </div>
      </div>
    </div>
  );
}
