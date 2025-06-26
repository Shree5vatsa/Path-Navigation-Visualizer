import { useState } from "react";
import type { AlgorithmType, MazeType } from "../utils/types";
import { usePathAlgo } from "../hooks/usePathAlgo";
import { useTile } from "../hooks/useTile";
import { useSpeed } from "../hooks/useSpeed";
import { ResetGrid } from "../utils/ResetGrid";
import { runMazeAlgo } from "../utils/runMazeAlgo";
import { Select } from "./Select";
import { MAZES, NavigatingAlgorithms } from "../utils/constants";
import { PlayBtn } from "./PlayBtn";
import { runPathAlgorithm } from "../utils/runPathAlgorithm";

export function Nav() {
  const [isDisabled, setIsDisabled] = useState(false);
  const { maze, setMaze, grid, setGrid, isGraphVisualized, setIsGraphVisualized, algorithm, setAlgorithm } = usePathAlgo();
  const { startTile, endTile } = useTile();
  const { speed } = useSpeed();

  const handleGenerateMaze = (maze: MazeType) => {
    setMaze(maze);

    if (maze === "NONE") {
      ResetGrid({ grid, startTile, endTile });
      setGrid(grid.map((row) => row.map((tile) => ({ ...tile }))));
      setIsDisabled(false);
      return;
    }

    setIsDisabled(true);
    runMazeAlgo({
      maze,
      grid,
      startTile,
      endTile,
      setIsDisabled,
      speed,
    });
    const newGrid = grid.slice();
    setGrid(newGrid);
    setIsGraphVisualized(false);
  };

  const handlerRunVisualizer = () => {
    if (isGraphVisualized) {
      setIsGraphVisualized(false);
      ResetGrid({ grid:grid.slice(), startTile, endTile });
      return;
    }
    const result = runPathAlgorithm({//hoss garrum

      algorithm,
      grid,
      startTile,
      endTile,
    });

    if (result) {
      const { traversedTiles, path } = result;
      console.log("Traversed Tiles:", traversedTiles);
      console.log("Path:", path);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[5.2rem] border-b shadow-gray-800 sm:px-5 px-0">
      <div className="flex items-center lg:justify-between justify-center w-full sm:w-[52rem]">
        <h1 className="lg:flex hidden w-[80%] text-2xl pl-1">
          Path Navigation Visualizer
        </h1>
        <div className="flex sm:items-end items-center justify-start sm:justify-between sm:flex-row flex-col sm:space-y-0 space-y-3 sm:py-0 py-4 sm:space-x-4">
          <Select
            label="Maze"
            value={maze}
            options={MAZES}
            onChange={(e) => {
              handleGenerateMaze(e.target.value as MazeType);
            }}
          />
          <Select 
            label="Graph"
            value={algorithm}
            options={NavigatingAlgorithms}
            onChange={(e) => {
              setAlgorithm(e.target.value as AlgorithmType);
            }}
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
