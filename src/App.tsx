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
import { Grid } from './components/Grid';


function AppContent() {
  const isNavigationRunningRef = useRef(false);
  const { toast, hideToast } = useToast();

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-950 text-white overflow-hidden select-none">
      <Nav isNavigationRunningRef={isNavigationRunningRef} />
      <main className="flex-1 overflow-auto flex items-start sm:items-center justify-start sm:justify-center p-2 sm:p-4 pb-24 sm:pb-16 custom-scrollbar touch-pan-x touch-pan-y">
        <Grid isNavigationRunningRef={isNavigationRunningRef} />
      </main>
      
      {/* Unified Bottom Dock: Index & Author Credential */}
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-t border-gray-800 shadow-2xl z-30 px-3 py-1.5 sm:px-4 sm:py-2">
        <div className="w-full relative flex flex-col md:flex-row items-center justify-center gap-2">
          {/* Centered Legend */}
          <div className="flex items-center justify-center">
            <Legend />
          </div>

          {/* Right / Bottom-Right Author Credential */}
          <div className="md:absolute md:right-2 lg:right-4 flex items-center justify-end">
            <AuthorCredits />
          </div>
        </div>
      </footer>

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
