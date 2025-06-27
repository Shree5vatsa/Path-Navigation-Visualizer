import { useRef } from "react";
import { Grid } from "./components/grid";
import { PathAlgoProvider } from "./context/PathAlgoContext";
import { SpeedProvider } from "./context/SpeedContext";
import { TileProvider } from "./context/TileContext";
import { Nav } from "./components/Nav";



function App() {
  const isNavigationRunningRef = useRef(false);

  return (
    <PathAlgoProvider>
      <TileProvider>
        <SpeedProvider>
          <div className="h-screen w-screen flex flex-col">
            <Nav isNavigationRunningRef={isNavigationRunningRef} />
            <Grid isNavigationRunningRef={isNavigationRunningRef} />
          </div>
        </SpeedProvider>
      </TileProvider>
    </PathAlgoProvider>
  );
}

export default App;
