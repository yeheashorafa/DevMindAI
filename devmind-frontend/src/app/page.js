"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen pt-32 pb-20 overflow-hidden bg-linear-to-br">
      {/* Mesh Background */}
      <div className="mesh-bg"></div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center">
          <div
            className={`
            inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-blue-500/20 mb-8 animate-fade
            ${mounted ? "opacity-100" : "opacity-0"}
          `}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-blue-100 text-xs font-bold uppercase tracking-widest">
              Powered by GPT-4
            </span>
          </div>

          <h1
            className={`
            text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight transition-all duration-1000
            ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}
          `}
          >
            Elevate Your <br />
            <span className="text-gradient">Code Intelligence</span>
          </h1>

          <p
            className={`
            max-w-2xl text-lg md:text-xl text-gray-400 mb-10 leading-relaxed transition-all duration-1000 delay-300
            ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}
          `}
          >
            The ultimate AI-driven platform for developers to analyze, optimize,
            and document code with professional precision.
          </p>

          <div
            className={`
            flex flex-col sm:flex-row gap-6 transition-all duration-1000 delay-500
            ${mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}
          `}
          >
            <Link
              href="/register"
              className="btn-primary text-lg px-10 py-4 flex items-center gap-3 group"
            >
              Get Started Free
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:translate-x-1 transition-transform"
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </Link>
            <Link
              href="/login"
              className="px-10 py-4 glass-card border-white/5 font-bold text-lg hover:border-white/20 transition-all flex items-center justify-center"
            >
              View Demo
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div
          className={`
          mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-1000 delay-700
          ${mounted ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"}
        `}
        >
          {[
            {
              title: "Neural Analysis",
              desc: "Identify hidden bugs and architectural flaws using our advanced neural engine.",
              icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
              color: "from-blue-500 to-cyan-500",
            },
            {
              title: "Smart Optimization",
              desc: "Automatically refactor code for peak performance and maximum readability.",
              icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
              color: "from-purple-500 to-indigo-500",
            },
            {
              title: "Auto Documentation",
              desc: "Generate professional JSDoc and MD documentation in seconds with zero effort.",
              icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z",
              color: "from-cyan-500 to-blue-500",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="group glass-card p-8 hover:border-blue-500/30 transition-all hover:-translate-y-1.5 relative overflow-hidden"
            >
              <div
                className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br ${feature.color} opacity-0 group-hover:opacity-5 blur-2xl transition-opacity`}
              ></div>
              <div
                className={`w-12 h-12 rounded-xl bg-linear-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg shadow-blue-500/10`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={feature.icon}></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Background Decorative Circles */}
      <div className="absolute top-1/4 -left-64 w-lg h-lg bg-blue-600/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-64 w-lg h-lg bg-purple-600/10 rounded-full blur-[120px] -z-10 animate-pulse delay-700"></div>
    </div>
  );
}
