"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
  const [token, setToken] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkToken = () => {
      setToken(localStorage.getItem("token"));
    };

    checkToken();
    window.addEventListener("storage", checkToken);

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("storage", checkToken);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    window.dispatchEvent(new Event("storage"));
    setMobileOpen(false);
    router.push("/login");
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <nav
        className={`
          w-full max-w-6xl mx-auto flex justify-between items-center px-5 py-3
          transition-all duration-500 ease-out rounded-2xl
          ${
            scrolled
              ? "glass-card shadow-2xl"
              : "bg-transparent border border-transparent"
          }
        `}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group flex-shrink-0"
        >
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
            <span className="text-white font-bold text-lg">D</span>
          </div>
          <span className="font-heading font-extrabold text-xl tracking-tight text-white group-hover:text-blue-400 transition-colors">
            DevMind <span className="text-blue-500">AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-gray-400 hover:text-white font-medium transition-colors text-sm uppercase tracking-widest"
          >
            Home
          </Link>
          <div className="h-4 w-px bg-white/10"></div>

          {!token ? (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-gray-300 hover:text-white font-semibold transition-colors text-sm"
              >
                Sign In
              </Link>
              <Link href="/register" className="btn-primary py-2 px-5 text-sm">
                Get Started
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors text-sm"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all font-medium text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 group"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-0.5 bg-gray-300 rounded-full transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`}
          ></span>
          <span
            className={`block w-5 h-0.5 bg-gray-300 rounded-full transition-all duration-300 ${mobileOpen ? "opacity-0 w-0" : ""}`}
          ></span>
          <span
            className={`block w-5 h-0.5 bg-gray-300 rounded-full transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`}
          ></span>
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      <div
        className={`
          md:hidden w-full max-w-6xl mx-auto mt-2 overflow-hidden
          transition-all duration-300 ease-out rounded-2xl
          ${mobileOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="glass-card px-6 py-5 flex flex-col gap-4 border-white/10">
          <Link
            href="/"
            className="text-gray-300 hover:text-white font-medium transition-colors text-sm uppercase tracking-widest"
          >
            Home
          </Link>
          <div className="h-px w-full bg-white/5"></div>

          {!token ? (
            <>
              <Link
                href="/login"
                className="text-gray-300 hover:text-white font-semibold transition-colors"
              >
                Sign In
              </Link>
              <Link href="/register" className="btn-primary py-3 text-center">
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/dashboard"
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="w-full py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all font-medium text-sm"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
