"use client";

import { useState, useEffect } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Auth guard: redirect to dashboard if already logged in
    const existingToken = localStorage.getItem("token");
    if (existingToken) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      // Trigger storage event so Navbar updates
      window.dispatchEvent(new Event("storage"));
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Don't render form until mounted (prevents redirect flash)
  if (!mounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4 py-20">
      <div className="mesh-bg"></div>

      <div
        className={`
        w-full max-w-[440px] glass-card p-8 md:p-12 relative overflow-hidden transition-all duration-700
        ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"}
      `}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500"></div>

        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/20">
            <span className="text-white font-bold text-2xl">D</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tight text-white">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Continue your journey with DevMind AI
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 focus:border-blue-500/50 focus:bg-white/[0.06] outline-none transition-all placeholder:text-gray-600 text-white text-sm"
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 focus:border-blue-500/50 focus:bg-white/[0.06] outline-none transition-all placeholder:text-gray-600 text-white text-sm"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full btn-primary py-4 rounded-xl flex items-center justify-center gap-2 mt-2 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-8 text-center pt-8 border-t border-white/5">
          <p className="text-gray-400 text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-blue-400 font-bold hover:text-blue-300 transition-colors"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>

      <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />
    </div>
  );
}
