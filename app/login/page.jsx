"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { loginWithEmail, registerWithEmail, loginWithGoogle } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState("login"); // "login" | "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password);
      }
      router.push("/dashboard");
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    try {
      await loginWithGoogle();
      router.push("/dashboard");
    } catch (err) {
      setError(friendlyError(err.code));
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f0b] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background grain overlay */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div className="bg-[#111a13] border border-white/[.08] rounded-2xl px-8 py-10 shadow-[0_24px_80px_rgba(0,0,0,.5)]">

          {/* Header */}
          <header className="mb-8">
            <h1 className="font-semibold text-2xl text-white tracking-tight mb-1.5">
              {mode === "login" ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-sm text-white/40">
              {mode === "login"
                ? "Sign in to continue studying."
                : "Start your learning journey."}
            </p>
          </header>

          {/* Error */}
          {error && (
            <p className="mb-5 text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          {/* Form */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-white/50 tracking-wide">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="bg-white/[.05] border border-white/[.09] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#4ade80]/50 focus:bg-white/[.07] transition-all duration-150"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-white/50 tracking-wide">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "register" ? "Min. 6 characters" : "••••••••"}
                required
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                className="bg-white/[.05] border border-white/[.09] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#4ade80]/50 focus:bg-white/[.07] transition-all duration-150"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full py-3.5 bg-[#4ade80] text-[#0a1a10] text-sm font-medium rounded-xl transition-all duration-150 hover:opacity-85 hover:-translate-y-px hover:shadow-[0_6px_28px_rgba(74,222,128,.2)] active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              {loading ? "..." : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/[.07]" />
            <span className="text-xs text-white/25">or</span>
            <div className="flex-1 h-px bg-white/[.07]" />
          </div>

          {/* Google button */}
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-white/[.05] border border-white/[.09] rounded-xl text-sm text-white/70 transition-all duration-150 hover:bg-white/[.09] hover:text-white hover:-translate-y-px active:translate-y-0"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Toggle */}
          <p className="mt-6 text-center text-xs text-white/30">
            {mode === "login" ? "No account yet?" : "Already have one?"}{" "}
            <button
              className="text-[#4ade80]/80 hover:text-[#4ade80] transition-colors underline-offset-2 hover:underline"
              onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
            >
              {mode === "login" ? "Register" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
    </svg>
  );
}

function friendlyError(code) {
  const map = {
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password.",
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/popup-closed-by-user": "Google sign-in was cancelled.",
  };
  return map[code] || "Something went wrong. Please try again.";
}