// src/components/Nav.tsx
import { useState } from "react";
import type { AlgorithmType, MazeType, SpeedType } from "../utils/types";
import { usePathAlgo } from "../hooks/usePathAlgo";
import { useTile } from "../hooks/useTile";
import { useSpeed } from "../hooks/useSpeed";
import { ResetGrid } from "../utils/ResetGrid";
import { runMazeAlgo } from "../utils/runMazeAlgo";
import { Select } from "./Select";
import { MAZES, NavigatingAlgorithms, SPEEDS } from "../utils/constants";
import { PlayBtn } from "./PlayBtn";
import { runPathAlgorithm } from "../utils/runPathAlgorithm";
import type { MutableRefObject } from "react";

interface NavProps {
  isNavigationRunningRef: MutableRefObject<boolean>;
}

export function Nav({ isNavigationRunningRef }: NavProps) {
  const [isDisabled, setIsDisabled] = useState(false);
  const {
    maze,
    setMaze,
    grid,
    setGrid,
    isGraphVisualized,
    setIsGraphVisualized,
    algorithm,
    setAlgorithm,
  } = usePathAlgo();
  const { startTile, endTile } = useTile();
  const { speed, setSpeed } = useSpeed();

  const handleGenerateMaze = (maze: MazeType) => {
    if (maze === "NONE") {
      setMaze(maze);
      ResetGrid({ grid, startTile, endTile });
      setGrid(grid.map((row) => row.map((tile) => ({ ...tile }))));
      setIsDisabled(false);
      return;
    }
    setMaze(maze);
    setIsDisabled(true);
    runMazeAlgo({
      maze,
      grid,
      startTile,
      endTile,
      setIsDisabled,
      speed,
    });
    setGrid(grid.slice());
    setIsGraphVisualized(false);
  };

  const handlerRunVisualizer = async () => {
    // If already visualized, reset
    if (isGraphVisualized) {
      setIsGraphVisualized(false);
      ResetGrid({ grid: grid.slice(), startTile, endTile });
      return;
    }

    // Start the algorithm + animations
    setIsDisabled(true);
    isNavigationRunningRef.current = true;

    await runPathAlgorithm({
      algorithm,
      grid,
      startTile,
      endTile,
      speed,
    });

    // Once done, sync state and re-enable UI
    setGrid(grid.slice());
    setIsGraphVisualized(true);
    setIsDisabled(false);
    isNavigationRunningRef.current = false;
  };

  return (
    <div className="flex items-center justify-center min-h-[4.5rem] border-b shadow-gray-600 sm:px-5 px-0">
      <div className="flex items-center lg:justify-between justify-center w-full sm:w-[52rem]">
        <h1 className="lg:flex hidden w-[40%] text-2xl pl-1">
          Path Navigation Visualizer
        </h1>
        <div className="flex sm:items-end items-center justify-start sm:justify-between sm:flex-row flex-col sm:space-y-0 space-y-3 sm:py-0 py-4 sm:space-x-4">
          <Select
            label="Maze"
            value={maze}
            options={MAZES}
            isDisabled={isDisabled}
            onChange={(e) => handleGenerateMaze(e.target.value as MazeType)}
          />
          <Select
            label="Graph"
            value={algorithm}
            options={NavigatingAlgorithms}
            isDisabled={isDisabled}
            onChange={(e) => setAlgorithm(e.target.value as AlgorithmType)}
          />
          <Select
            label="Speed"
            value={speed}
            options={SPEEDS}
            onChange={(e) => setSpeed(parseFloat(e.target.value) as SpeedType)}
          />
          <PlayBtn
            isDisabled={isDisabled}
            isPathNavigated={isGraphVisualized}
            handlerRunVisualizer={handlerRunVisualizer}
          />
        </div>
      </div>
    </div>
  );
}
