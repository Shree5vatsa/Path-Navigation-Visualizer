import { useState } from "react";
import type { AlgorithmType, MazeType, SpeedType } from "../utils/types";
import { usePathAlgo } from "../hooks/usePathAlgo";
import { useTile } from "../hooks/useTile";
import { useSpeed } from "../hooks/useSpeed";
import { ResetGrid } from "../utils/ResetGrid";
import { runMazeAlgo } from "../utils/runMazeAlgo";
import { MAZES, NavigatingAlgorithms, SPEEDS } from "../utils/constants";
import { runPathAlgorithm } from "../utils/runPathAlgorithm";
import type { MutableRefObject } from "react";
import { useToast } from "../hooks/useToast";

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
  const { showToast } = useToast();

  const handleMazeSelection = (selectedMaze: MazeType) => {
    setMaze(selectedMaze);
  };

  const handleGenerateMaze = async () => {
    if (maze === "NONE") {
      showToast("Please select a maze type first", "info");
      return;
    }

    setIsDisabled(true);
    showToast(
      `🔄 Generating ${maze.replace("_", " ").toLowerCase()} maze...`,
      "info"
    );

    ResetGrid({ grid, startTile, endTile });
    setGrid(grid.map((row) => row.map((tile) => ({ ...tile }))));

    await runMazeAlgo({
      maze,
      grid,
      startTile,
      endTile,
      setIsDisabled,
      speed,
    });

    setGrid(grid.map((row) => row.map((tile) => ({ ...tile }))));
    setIsGraphVisualized(false);
    setIsDisabled(false);
    showToast(
      `✅ ${maze.replace("_", " ").toLowerCase()} maze generated successfully!`,
      "success"
    );
  };

  const handlerRunVisualizer = async () => {
    if (isGraphVisualized) {
      setIsGraphVisualized(false);
      ResetGrid({ grid: grid.slice(), startTile, endTile });
      setGrid(grid.map((row) => row.map((tile) => ({ ...tile }))));
      showToast("🔄 Grid reset successfully!", "info");
      return;
    }

    setIsDisabled(true);
    isNavigationRunningRef.current = true;
    showToast(`🔍 Running ${algorithm} algorithm...`, "info");

    // Reset any previous path/traversed states before starting
    grid.forEach((row) => {
      row.forEach((tile) => {
        tile.isTraversed = false;
        tile.isPath = false;
        tile.parent = null;
        if (!tile.isStart) {
          tile.distance = Infinity;
        }
      });
    });

    try {
      await runPathAlgorithm({
        algorithm,
        grid,
        startTile,
        endTile,
        speed,
      });

      // Only update grid state after animation completes
      setGrid(grid.map((row) => row.map((tile) => ({ ...tile }))));
      setIsGraphVisualized(true);

      // Count path length from grid state to ensure accuracy
      let pathLength = 0;
      grid.forEach((row) => {
        row.forEach((tile) => {
          if (tile.isPath) pathLength++;
        });
      });

      // Show completion message
      if (pathLength > 0) {
        showToast(
          `🎯 Path found with ${pathLength} steps using ${algorithm}!`,
          "success"
        );
      } else {
        showToast("❌ No path found!", "info");
      }
    } catch (error) {
      showToast("❌ Error running pathfinding algorithm!", "info");
      console.error("Pathfinding error:", error);
    } finally {
      setIsDisabled(false);
      isNavigationRunningRef.current = false;
    }
  };

  const handleClearPath = () => {
    if (isDisabled) return;

    grid.forEach((row) => {
      row.forEach((tile) => {
        if (tile.isTraversed || tile.isPath) {
          const el = document.getElementById(`${tile.row}-${tile.col}`);
          if (el) {
            // Preserve border classes
            const borderClasses = [];
            if (el.className.includes("border-b"))
              borderClasses.push("border-b");
            if (el.className.includes("border-l"))
              borderClasses.push("border-l");

            // Remove all animation and state classes
            el.classList.remove("animate-traversed", "animate-path");

            if (tile.isStart) {
              el.className = `transition-all lg:w-[15px] md:w-[13px] xs:w-[8px] w-[7px] lg:h-[15px] md:h-[13px] xs:h-[8px] h-[7px] border-t border-r border-sky-200 bg-green-400 ${borderClasses.join(
                " "
              )}`;
            } else if (tile.isEnd) {
              el.className = `transition-all lg:w-[15px] md:w-[13px] xs:w-[8px] w-[7px] lg:h-[15px] md:h-[13px] xs:h-[8px] h-[7px] border-t border-r border-sky-200 bg-red-400 ${borderClasses.join(
                " "
              )}`;
            } else if (tile.isWall) {
              el.className = `transition-all lg:w-[15px] md:w-[13px] xs:w-[8px] w-[7px] lg:h-[15px] md:h-[13px] xs:h-[8px] h-[7px] border-t border-r border-sky-200 bg-gray-300 ${borderClasses.join(
                " "
              )}`;
            } else {
              el.className = `transition-all lg:w-[15px] md:w-[13px] xs:w-[8px] w-[7px] lg:h-[15px] md:h-[13px] xs:h-[8px] h-[7px] border-t border-r border-sky-200 ${borderClasses.join(
                " "
              )}`;
            }
          }

          // Clear all states including for A* algorithm
          tile.isTraversed = false;
          tile.isPath = false;
          tile.parent = null;
          tile.distance = tile.isStart ? 0 : Infinity;
        }
      });
    });

    setGrid(grid.map((row) => row.map((tile) => ({ ...tile }))));
    setIsGraphVisualized(false);
    showToast("✨ Path and visited tiles cleared successfully!", "info");
  };

  const handleClearGrid = () => {
    if (isDisabled) return;

    ResetGrid({ grid, startTile, endTile });
    setGrid(grid.map((row) => row.map((tile) => ({ ...tile }))));
    setIsGraphVisualized(false);
    setMaze("NONE");
    showToast("🗑️ Grid cleared successfully!", "info");
  };

  return (
    <div className="bg-gray-800 text-white p-3 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-3">
          <h1 className="text-xl font-bold text-white">
            PATH NAVIGATION VISUALIZER
          </h1>
        </div>

        <div className="flex flex-wrap justify-center items-end gap-4 mb-3">
          <div className="flex flex-col items-center">
            <label className="text-xs text-gray-300 mb-1 font-medium">
              Maze Generation
            </label>
            <select
              disabled={isDisabled}
              className="bg-gray-700 text-white px-2 py-1.5 rounded-md border border-gray-600 focus:border-blue-500 focus:outline-none hover:bg-gray-600 transition-colors min-w-[120px] text-sm"
              value={maze}
              onChange={(e) => handleMazeSelection(e.target.value as MazeType)}
            >
              {MAZES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col items-center">
            <label className="text-xs text-gray-300 mb-1 font-medium">
              Generate
            </label>
            <button
              disabled={isDisabled}
              onClick={handleGenerateMaze}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1.5 rounded-md text-sm font-medium transition-colors shadow-sm"
            >
              🔄 Maze
            </button>
          </div>

          <div className="flex flex-col items-center">
            <label className="text-xs text-gray-300 mb-1 font-medium">
              Pathfinding Algorithm
            </label>
            <select
              disabled={isDisabled}
              className="bg-gray-700 text-white px-2 py-1.5 rounded-md border border-gray-600 focus:border-blue-500 focus:outline-none hover:bg-gray-600 transition-colors min-w-[140px] text-sm"
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as AlgorithmType)}
            >
              {NavigatingAlgorithms.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col items-center">
            <label className="text-xs text-gray-300 mb-1 font-medium">
              Speed
            </label>
            <select
              className="bg-gray-700 text-white px-2 py-1.5 rounded-md border border-gray-600 focus:border-blue-500 focus:outline-none hover:bg-gray-600 transition-colors min-w-[80px] text-sm"
              value={speed}
              onChange={(e) =>
                setSpeed(parseFloat(e.target.value) as SpeedType)
              }
            >
              {SPEEDS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col items-center">
            <label className="text-xs text-gray-300 mb-1 font-medium">
              Visualize
            </label>
            <button
              disabled={isDisabled}
              onClick={handlerRunVisualizer}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1 shadow-sm"
            >
              {isGraphVisualized ? "🔄" : "▶️"}{" "}
              {isGraphVisualized ? "Reset" : "Start"}
            </button>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <button
            disabled={isDisabled}
            onClick={handleClearPath}
            className="bg-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1 shadow-sm"
          >
            🧹 Clear Path
          </button>
          <button
            disabled={isDisabled}
            onClick={handleClearGrid}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1 shadow-sm"
          >
            🗑️ Clear Grid
          </button>
        </div>
      </div>
    </div>
  );
}
