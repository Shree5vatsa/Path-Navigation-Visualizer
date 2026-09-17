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
      }, 4000); // Increased duration to 4 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : "bg-blue-500";
  const textColor = "text-white";

  return (
    <div className="fixed bottom-12 sm:bottom-16 left-3 sm:left-4 right-3 sm:right-auto sm:max-w-md z-50 pointer-events-auto">
      <div
        className={`${bgColor} ${textColor} px-4 py-2.5 sm:px-5 sm:py-3.5 rounded-xl shadow-2xl animate-slide-in border border-white/20 backdrop-blur-md`}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs sm:text-sm font-medium">{message}</p>
          <button
            onClick={onClose}
            className="text-lg leading-none hover:opacity-75 font-bold flex-shrink-0 p-1"
            aria-label="Close message"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
