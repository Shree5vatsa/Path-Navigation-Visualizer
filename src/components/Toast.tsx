import { useEffect } from "react";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  type?: "success" | "info" | "error";
}

export function Toast({
  message,
  isVisible,
  onClose,
  type = "info",
}: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const accentBorder =
    type === "success"
      ? "border-l-emerald-500 shadow-emerald-500/10"
      : type === "error"
      ? "border-l-rose-500 shadow-rose-500/10"
      : "border-l-sky-500 shadow-sky-500/10";

  const badgeIcon =
    type === "success" ? (
      <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
        ✓
      </span>
    ) : type === "error" ? (
      <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
        ✕
      </span>
    ) : (
      <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
        ℹ
      </span>
    );

  return (
    <div className="fixed bottom-4 left-4 z-50 pointer-events-auto max-w-sm sm:max-w-md w-full animate-slide-in">
      <div
        className={`bg-gray-900/90 backdrop-blur-xl border border-gray-700/80 ${accentBorder} border-l-4 rounded-xl shadow-2xl p-3.5 sm:p-4 text-gray-100 flex items-center justify-between gap-3`}
      >
        <div className="flex items-center gap-3 min-w-0">
          {badgeIcon}
          <p className="text-xs sm:text-sm font-medium leading-snug text-gray-100 truncate">
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors text-sm font-bold flex-shrink-0"
          aria-label="Close message"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
