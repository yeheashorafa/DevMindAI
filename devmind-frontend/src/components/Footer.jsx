export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-12 py-6 px-4 sm:px-8 bg-black/40 backdrop-blur">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
            <span className="text-white font-semibold text-sm">D</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-white">
              DevMind <span className="text-blue-400">AI</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-gray-500">
              Code Intelligence Workspace
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://x.com/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors"
          >
            Twitter
          </a>
          <a
            href="mailto:support@devmind.local"
            className="hover:text-white transition-colors"
          >
            Contact
          </a>
        </div>

        <p className="text-[10px] text-gray-500 text-center sm:text-right">
          © {new Date().getFullYear()} DevMind AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
