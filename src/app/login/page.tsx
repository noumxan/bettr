"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Mail, ScanFace, KeyRound, Eye, EyeOff } from "lucide-react";

type Step = "options" | "email" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [step, setStep] = useState<Step>("options");
  const [jiscMessage, setJiscMessage] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams?.get("jisc") === "unconfigured") {
      setJiscMessage("University sign-in is not set up for this app. Use Continue with Email instead.");
    }
  }, [searchParams]);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const un = step === "email" ? (email.includes("@") ? email : email) : username;
    const toSend = step === "signup" ? username : (email.includes("@") ? email : un);
    const result = await login(toSend, password);
    setLoading(false);
    if (result.ok && result.user) {
      router.push(result.user.role === "admin" ? "/admin" : "/");
      router.refresh();
    } else if (result.ok) {
      router.push(toSend === "admin" ? "/admin" : "/");
      router.refresh();
    } else {
      setError(result.error ?? "Login failed");
    }
  };

  const handleSignupNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError("Fill in all fields");
      return;
    }
    setLoading(true);
    login(username.trim(), password).then((result) => {
      setLoading(false);
      if (result.ok && result.user) {
        router.push(result.user.role === "admin" ? "/admin" : "/");
        router.refresh();
      } else if (result.ok) {
        router.push(username.trim() === "admin" ? "/admin" : "/");
        router.refresh();
      } else {
        setError(result.error ?? "Sign up failed");
      }
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-bettr-dark">
      {/* Abstract iridescent background */}
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, #ff6b9d 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 80% 20%, #a855f7 0%, transparent 45%), radial-gradient(ellipse 70% 50% at 20% 60%, #3b82f6 0%, transparent 45%), radial-gradient(ellipse 50% 40% at 90% 80%, #f97316 0%, transparent 40%)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

      <div className="relative flex min-h-screen flex-col items-center justify-between px-6 pt-12 pb-8">
        {/* Logo + tagline */}
        <div className="flex flex-col items-center text-center">
          {step !== "options" && (
            <button
              type="button"
              onClick={() => setStep("options")}
              className="absolute left-6 top-12 flex items-center gap-1 text-white/90 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-lg" style={{ textShadow: "0 0 24px rgba(168,255,0,0.3)" }}>
            Bettr
          </h1>
          <p className="mt-1 text-sm text-white/80">Social. But Bettr.</p>
          {jiscMessage && (
            <p className="mt-3 rounded-lg bg-amber-500/20 px-3 py-2 text-xs text-amber-200 border border-amber-500/30">
              {jiscMessage}
            </p>
          )}
        </div>

        {/* Card */}
        <div className="w-full max-w-sm rounded-3xl bg-bettr-dark-card/95 p-6 shadow-2xl backdrop-blur-sm border border-white/10">
          {step === "options" && (
            <>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => { setStep("email"); setError(""); }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-bettr-lime py-3.5 font-semibold text-black transition hover:bg-bettr-lime-dim"
                >
                  <Mail className="h-5 w-5" />
                  Continue with Email
                </button>
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-bettr-lime py-3.5 font-semibold text-black transition hover:bg-bettr-lime-dim"
                >
                  <ScanFace className="h-5 w-5" />
                  Sign in via Face ID
                </button>
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-bettr-lime py-3.5 font-semibold text-black transition hover:bg-bettr-lime-dim"
                >
                  <KeyRound className="h-5 w-5" />
                  Sign in via PIN
                </button>
                <a
                  href="/api/auth/jisc?action=login"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-bettr-lime/50 bg-bettr-lime/10 py-3.5 font-semibold text-bettr-lime transition hover:bg-bettr-lime/20"
                >
                  Sign in with university (Jisc/OpenAthens)
                </a>
              </div>
              <p className="mt-6 text-center text-sm text-zinc-400">
                Don&apos;t have an account?{" "}
                <button type="button" onClick={() => { setStep("signup"); setError(""); }} className="font-semibold text-bettr-lime hover:underline">
                  Sign up
                </button>
              </p>
            </>
          )}

          {step === "email" && (
            <>
              <h2 className="text-center text-lg font-semibold text-white">Login</h2>
              <form onSubmit={handleLogin} className="mt-4 space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-400">Email</label>
                  <input
                    type="text"
                    placeholder="Email or username"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    className="w-full rounded-xl border border-zinc-600 bg-zinc-800/80 px-4 py-3 text-white placeholder:text-zinc-500 focus:border-bettr-lime focus:outline-none focus:ring-1 focus:ring-bettr-lime"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-400">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
                      className="w-full rounded-xl border border-zinc-600 bg-zinc-800/80 px-4 py-3 pr-12 text-white placeholder:text-zinc-500 focus:border-bettr-lime focus:outline-none focus:ring-1 focus:ring-bettr-lime"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                {error && <p className="text-sm text-red-400">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-bettr-lime py-3.5 font-semibold text-black transition hover:bg-bettr-lime-dim disabled:opacity-60"
                >
                  {loading ? "Logging in…" : "Log In"}
                </button>
              </form>
              <p className="mt-6 text-center text-sm text-zinc-400">
                Don&apos;t have an account?{" "}
                <button type="button" onClick={() => { setStep("signup"); setError(""); }} className="font-semibold text-bettr-lime hover:underline">
                  Sign up
                </button>
              </p>
            </>
          )}

          {step === "signup" && (
            <>
              <h2 className="text-center text-lg font-semibold text-white">Create Your Account</h2>
              <form onSubmit={handleSignupNext} className="mt-4 space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-400">Username</label>
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setError(""); }}
                    className="w-full rounded-xl border border-zinc-600 bg-zinc-800/80 px-4 py-3 text-white placeholder:text-zinc-500 focus:border-bettr-lime focus:outline-none focus:ring-1 focus:ring-bettr-lime"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-400">Email</label>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    className="w-full rounded-xl border border-zinc-600 bg-zinc-800/80 px-4 py-3 text-white placeholder:text-zinc-500 focus:border-bettr-lime focus:outline-none focus:ring-1 focus:ring-bettr-lime"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-400">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
                      className="w-full rounded-xl border border-zinc-600 bg-zinc-800/80 px-4 py-3 pr-12 text-white placeholder:text-zinc-500 focus:border-bettr-lime focus:outline-none focus:ring-1 focus:ring-bettr-lime"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                {error && <p className="text-sm text-red-400">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-bettr-lime py-3.5 font-semibold text-black transition hover:bg-bettr-lime-dim disabled:opacity-60"
                >
                  {loading ? "Creating…" : "Next"}
                </button>
              </form>
              <p className="mt-6 text-center text-sm text-zinc-400">
                Already Registered?{" "}
                <button type="button" onClick={() => { setStep("email"); setError(""); }} className="font-semibold text-bettr-lime hover:underline">
                  Sign In
                </button>
              </p>
            </>
          )}
        </div>

        <div className="h-8" />
      </div>
    </div>
  );
}
