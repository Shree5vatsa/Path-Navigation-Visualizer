import { useRef } from "react";

import { PathAlgoProvider } from "./context/PathAlgoContext";
import { SpeedProvider } from "./context/SpeedContext";
import { TileProvider } from "./context/TileContext";
import { Nav } from "./components/Nav";
import { Legend } from "./components/Legend";

import { Grid } from "./components/grid";
import { Toast } from "./components/Toast";
import { useToast } from "./hooks/useToast";

function App() {
  const isNavigationRunningRef = useRef(false);
  const { toast, hideToast } = useToast();

  return (
    <PathAlgoProvider>
      <TileProvider>
        <SpeedProvider>
          <div className="h-screen w-screen flex flex-col">
            <Nav isNavigationRunningRef={isNavigationRunningRef} />
            <Grid isNavigationRunningRef={isNavigationRunningRef} />
            <Legend />
            <Toast
              message={toast.message}
              isVisible={toast.isVisible}
              onClose={hideToast}
              type={toast.type}
            />
          </div>
        </SpeedProvider>
      </TileProvider>
    </PathAlgoProvider>
  );
}

export default App;
