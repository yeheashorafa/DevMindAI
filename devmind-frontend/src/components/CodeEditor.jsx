"use client";

import React, { useState, useEffect, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { toast } from "react-toastify";
import api from "@/services/api";

export default function CodeEditor({ token }) {
  const [code, setCode] = useState(
    "// Paste your code here...\n\nfunction example() {\n  console.log('Hello DevMind!');\n}",
  );
  const [language, setLanguage] = useState("javascript");
  const [responseLanguage, setResponseLanguage] = useState("English");
  const [result, setResult] = useState({
    analysis: "",
    explanation: "",
    optimization: "",
    documentation: "",
  });
  const [activeTab, setActiveTab] = useState("analysis");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [splitView, setSplitView] = useState(false);

  const fetchHistory = useCallback(async () => {
    if (!token) return;
    setHistoryLoading(true);
    try {
      const res = await api.get("/analysis/history");
      setHistory(res.data);
    } catch (error) {
      console.error("Failed to fetch history:", error.message);
    } finally {
      setHistoryLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleAnalyze = async () => {
    if (!code.trim()) return toast.warn("Please enter some code");
    setLoading(true);
    try {
      const res = await api.post("/analysis", { code, language, responseLanguage });
      setResult({
        analysis: res.data.analysis || "",
        explanation: res.data.explanation || "",
        optimization: res.data.optimization || "",
        documentation: res.data.documentation || "",
      });
      setActiveTab("analysis");
      fetchHistory();
      toast.success("Analysis complete!");
    } catch (error) {
      const msg = error.response?.data?.error || "Analysis failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const loadFromHistory = (item) => {
    setCode(item.code);
    setLanguage(item.language);
    toast.info("Code loaded from history");
  };

  const tabs = ["analysis", "explanation", "optimization", "documentation"];

  const handleCopyCurrentTab = async () => {
    const content = result[activeTab];
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      toast.info("Copied current tab content");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleApplyOptimization = () => {
    if (!result.optimization) {
      return toast.warn("No optimization suggestions to apply");
    }
    // For now we simply copy optimization text into the editor so the user can adjust it.
    setCode(result.optimization);
    setActiveTab("optimization");
    toast.success("Optimization content applied to editor");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr,0.9fr] xl:grid-cols-[1.05fr,0.95fr] gap-6 items-start">
        {/* ── Editor Area ── */}
        <div className="space-y-0">
          <div className="glass-card overflow-hidden border-white/5 shadow-2xl">
            {/* Editor Header */}
            <div className="bg-white/5 px-4 sm:px-6 py-3 border-b border-white/5 flex justify-between items-center">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
              </div>
              <div className="flex items-center gap-4">
                <select
                  className="bg-transparent text-gray-400 text-[10px] font-bold uppercase tracking-widest outline-none cursor-pointer hover:text-white transition-colors"
                  value={responseLanguage}
                  onChange={(e) => setResponseLanguage(e.target.value)}
                  title="Response Language"
                >
                  <option value="English">English</option>
                  <option value="Arabic">Arabic</option>
                </select>
                <div className="w-px h-4 bg-white/10"></div>
                <select
                  className="bg-transparent text-gray-400 text-[10px] font-bold uppercase tracking-widest outline-none cursor-pointer hover:text-white transition-colors"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  title="Programming Language"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="csharp">C#</option>
                  <option value="go">Go</option>
                  <option value="rust">Rust</option>
                  <option value="php">PHP</option>
                </select>
              </div>
            </div>

            {/* Monaco Editor */}
            <div className="bg-[#0d0d0e]">
              <Editor
                height="clamp(300px, 50vh, 520px)"
                theme="vs-dark"
                language={language}
                value={code}
                options={{
                  fontSize: 13,
                  fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                  fontLigatures: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  lineNumbers: "on",
                  roundedSelection: true,
                  padding: { top: 20, bottom: 20 },
                  lineHeight: 1.7,
                  wordWrap: "on",
                  scrollbar: {
                    verticalScrollbarSize: 4,
                    horizontalScrollbarSize: 4,
                  },
                }}
                onChange={(value) => setCode(value || "")}
              />
            </div>

            {/* Run & View Controls */}
            <div className="p-4 sm:p-5 bg-white/5 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3">
              <p className="text-xs text-gray-600">
                {code.trim().split("\n").length} lines · {language}
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => setSplitView((prev) => !prev)}
                  className="px-4 py-2 rounded-lg border border-white/10 text-[11px] uppercase tracking-widest text-gray-300 hover:border-blue-400/60 hover:text-white transition-all"
                >
                  {splitView ? "Single View" : "Split View"}
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className={`btn-primary px-6 py-2.5 flex items-center justify-center gap-3 text-sm ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m22 2-7 20-4-9-9-4Z"></path>
                        <path d="M22 2 11 13"></path>
                      </svg>
                      <span>Run Neural Intel</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Results & History ── */}
        <div className="space-y-6">
          {/* Results Panel */}
          <div className="glass-card flex flex-col h-[400px] xl:h-[420px] shadow-xl">
            {/* Tabs + Actions */}
            <div className="border-b border-white/5 bg-white/5 px-2 sm:px-4 py-1.5">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex flex-1 rounded-xl bg-black/10 overflow-hidden">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-2.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all text-center ${
                        activeTab === tab
                          ? "text-blue-300 bg-blue-500/20"
                          : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    type="button"
                    onClick={handleCopyCurrentTab}
                    className="hidden sm:inline-flex px-3 py-1.5 rounded-md bg-white/5 text-[10px] uppercase tracking-widest text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    Copy
                  </button>
                  <button
                    type="button"
                    onClick={handleApplyOptimization}
                    className="px-3 py-1.5 rounded-md bg-blue-500/15 text-[10px] uppercase tracking-widest text-blue-300 hover:bg-blue-500/25 transition-colors"
                  >
                    Apply Opt
                  </button>
                </div>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6 overflow-y-auto flex-1 text-sm text-gray-300 leading-relaxed custom-scrollbar">
              {result[activeTab] ? (
                <div className="animate-fade whitespace-pre-wrap">
                  {result[activeTab]}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-600 italic">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mb-4 opacity-20"
                  >
                    <path d="M12 8V4H8"></path>
                    <rect width="16" height="12" x="4" y="8" rx="2"></rect>
                    <path d="M2 14h2"></path>
                    <path d="M20 14h2"></path>
                    <path d="M15 13v2"></path>
                    <path d="M9 13v2"></path>
                  </svg>
                  <p className="text-xs tracking-wide text-center">
                    Run Neural Intel to see results
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* History Panel */}
          <div className="glass-card p-5 flex flex-col h-[220px]">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-2 flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 8v4l3 3"></path>
                <circle cx="12" cy="12" r="10"></circle>
              </svg>
              Recent Activity
            </h2>
            <div className="space-y-2 overflow-y-auto flex-1 custom-scrollbar pr-1">
              {historyLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-9 rounded-lg bg-white/5 animate-pulse"
                    ></div>
                  ))}
                </div>
              ) : history.length === 0 ? (
                <p className="text-xs text-gray-600 italic mt-2">
                  No recent analyses found.
                </p>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => loadFromHistory(item)}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">
                        {item.language}
                      </span>
                      <span className="text-[9px] text-gray-600">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 truncate group-hover:text-gray-300 transition-colors">
                      {item.code}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
