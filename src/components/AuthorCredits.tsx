
export function AuthorCredits() {
  return (
    <div className="flex items-center gap-2 text-xs bg-gray-800/80 hover:bg-gray-800/95 backdrop-blur-md px-3 py-1 sm:py-1.5 rounded-lg border border-gray-700/80 shadow-md transition-all">
      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        <span className="text-gray-400 text-[11px] sm:text-xs">Created by</span>
        <a
          href="https://github.com/Shree5vatsa"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-sky-300 hover:text-sky-200 transition-colors inline-flex items-center gap-1 hover:underline"
          title="Author GitHub Profile"
        >
          <span>Shreevatsa Acharya</span>
        </a>
        <span className="text-gray-600 hidden sm:inline">•</span>
        <a
          href="mailto:shreevatsa076@gmail.com"
          className="text-[10px] sm:text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1 hover:underline font-mono"
          title="Send Email"
        >
          <span>✉️</span>
          <span>shreevatsa076@gmail.com</span>
        </a>
      </div>
    </div>
  );
}

