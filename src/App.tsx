import { useRef } from "react";

import { PathAlgoProvider } from "./context/PathAlgoContext";
import { SpeedProvider } from "./context/SpeedContext";
import { TileProvider } from "./context/TileContext";
import { ToastProvider } from "./context/ToastContext";
import { Nav } from "./components/Nav";
import { Legend } from "./components/Legend";
import { Toast } from "./components/Toast";
import { AuthorCredits } from "./components/AuthorCredits";
import { useToast } from "./hooks/useToast";
import { Grid } from "./components/Grid";


function AppContent() {
  const isNavigationRunningRef = useRef(false);
  const { toast, hideToast } = useToast();

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-900 overflow-hidden">
      <Nav isNavigationRunningRef={isNavigationRunningRef} />
      <div className="flex-1 overflow-auto pb-12">
        <Grid isNavigationRunningRef={isNavigationRunningRef} />
      </div>
      <Legend />
      <AuthorCredits />
      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
        type={toast.type}
      />
    </div>
  );
}

function App() {
  return (
    <PathAlgoProvider>
      <TileProvider>
        <SpeedProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </SpeedProvider>
      </TileProvider>
    </PathAlgoProvider>
  );
}

export default App;
