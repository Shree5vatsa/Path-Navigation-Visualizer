
import { createContext, useState, type ReactNode } from "react";

interface ToastContextInterface {
  showToast: (message: string, type?: "success" | "info" | "error") => void;
  toast: {
    message: string;
    isVisible: boolean;
    type?: "success" | "info" | "error";
  };
  hideToast: () => void;
}

export const ToastContext = createContext<ToastContextInterface | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<{
    message: string;
    isVisible: boolean;
    type?: "success" | "info" | "error";
  }>({
    message: "",
    isVisible: false,
    type: "info"
  });

  const showToast = (message: string, type: "success" | "info" | "error" = "info") => {
    setToast({ message, isVisible: true, type });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast, toast, hideToast }}>
      {children}
    </ToastContext.Provider>
  );
};
