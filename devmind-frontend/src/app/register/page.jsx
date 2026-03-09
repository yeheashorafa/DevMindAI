"use client";

import { useState, useEffect } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/register", { name, email, password });
      localStorage.setItem("token", res.data.token);
      // Trigger storage event so Navbar updates
      window.dispatchEvent(new Event("storage"));
      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4 py-16">
      <div className="mesh-bg"></div>

      <div
        className={`
        w-full max-w-md glass-card px-8 py-10 relative overflow-hidden transition-all duration-700
        ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"}
      `}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500"></div>

        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-3 shadow-lg shadow-blue-500/20">
            <span className="text-white font-bold text-xl">D</span>
          </div>
          <h1 className="text-3xl font-black mb-2 tracking-tight text-white">
            Join DevMind AI
          </h1>
          <p className="text-gray-400 text-sm">
            Start your advanced AI code analysis
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleRegister}>
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 focus:border-blue-500/50 focus:bg-white/[0.06] outline-none transition-all placeholder:text-gray-600 text-white text-sm"
              required
              autoComplete="name"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 focus:border-blue-500/50 focus:bg-white/[0.06] outline-none transition-all placeholder:text-gray-600 text-white text-sm"
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 focus:border-blue-500/50 focus:bg-white/[0.06] outline-none transition-all placeholder:text-gray-600 text-white text-sm"
              required
              autoComplete="new-password"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full btn-primary py-4 rounded-xl mt-2 flex items-center justify-center ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="mt-6 text-center pt-6 border-t border-white/5">
          <p className="text-gray-400 text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-400 font-bold hover:text-blue-300 transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>

      <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />
    </div>
  );
}
