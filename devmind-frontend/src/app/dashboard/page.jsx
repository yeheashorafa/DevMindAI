"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CodeEditor from "../../components/CodeEditor";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Dashboard() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      // Redirect to login instead of showing "Access Denied"
      router.replace("/login");
      return;
    }
    setToken(storedToken);
    setMounted(true);
  }, [router]);

  // Show nothing while checking auth / during SSR
  if (!mounted) return null;

  return (
    <div className="min-h-screen pt-28 md:pt-32 pb-12 px-4 sm:px-6 lg:px-12">
      <div className="mesh-bg"></div>

      <div className="max-w-7xl mx-auto">
        <header className="mb-8 md:mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 animate-fade">
          <div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-2">
              Dev Labs
            </h1>
            <p className="text-gray-400 text-sm md:text-base font-medium">
              Workspace / <span className="text-blue-400">Code Analysis</span>
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="glass-card px-4 py-2 border-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
              API Status: Online
            </div>
          </div>
        </header>

        <div className="animate-fade" style={{ animationDelay: "0.2s" }}>
          <CodeEditor token={token} />
        </div>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        theme="dark"
        toastClassName="glass-card !bg-black/80 !border-white/10"
      />
    </div>
  );
}
