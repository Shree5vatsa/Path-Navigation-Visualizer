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
    <div className="fixed bottom-20 left-4 z-50">
      <div
        className={`${bgColor} ${textColor} px-6 py-4 rounded-lg shadow-lg max-w-sm animate-slide-in border border-gray-300`}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium pr-4">{message}</p>
          <button
            onClick={onClose}
            className="text-lg leading-none hover:opacity-70 font-bold flex-shrink-0"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
