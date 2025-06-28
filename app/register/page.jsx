"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const nameRegex = /^[A-Za-z]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/;

  const handleRegister = async () => {
    toast.dismiss();

    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      toast.error("❌ Name must contain alphabets only");
      return;
    }

    if (!emailRegex.test(email)) {
      toast.error("❌ Invalid email address");
      return;
    }

    if (!passwordRegex.test(password)) {
      toast.error("❌ Password must be 8+ chars with A-Z, a-z, 0-9 & symbol");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("❌ Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("✅ Account created");
        setTimeout(() => router.push("/login"), 1000);
      } else {
        toast.error(data.error || "❌ Registration failed");
      }
    } catch (err) {
      toast.error("🚫 Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ❌ REMOVED DUPLICATE TOASTER */}

      {/* Logo */}
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
            handleRegister();
          }}
          className="max-w-md w-full bg-white rounded-xl shadow-lg p-8"
        >
          <h1
            className="text-3xl font-bold text-center mb-6"
            style={{ color: "oklch(55.8% 0.288 302.321)" }}
          >
            Create your account
          </h1>

          {/* Name Fields */}
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="First Name"
              className="w-1/2 border border-gray-300 rounded px-4 py-3"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-1/2 border border-gray-300 rounded px-4 py-3"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <input
            type="email"
            placeholder="Email address"
            className="w-full border border-gray-300 rounded px-4 py-3 mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password */}
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create password"
              className="w-full border border-gray-300 rounded px-4 py-3 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600 text-lg"
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {/* Confirm Password */}
          <div className="relative mb-6">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              className="w-full border border-gray-300 rounded px-4 py-3 pr-10"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600 text-lg"
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {/* Sign Up Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full text-white py-3 text-lg font-semibold rounded transition-all duration-200"
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
                Signing up...
              </span>
            ) : (
              "Sign up"
            )}
          </Button>

          {/* Divider */}
          <div className="my-4 text-center text-gray-500 text-sm">or</div>

          {/* Google Auth */}
          <Button
            variant="outline"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full py-3 text-sm flex items-center justify-center gap-2"
          >
            <Image src="/google-logo.png" alt="Google" width={20} height={20} />
            Continue with Google
          </Button>

          {/* Already Have Account */}
          <div className="text-center text-sm mt-6">
            Already have an account?{" "}
            <a
              href="/login"
              style={{ color: "oklch(55.8% 0.288 302.321)" }}
              className="underline"
            >
              Log in
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
