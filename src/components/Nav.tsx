import { useState } from "react";
import type { AlgorithmType, MazeType, TileType } from "../utils/types";
import { usePathAlgo } from "../hooks/usePathAlgo";
import { useTile } from "../hooks/useTile";
import { useSpeed } from "../hooks/useSpeed";
import { ResetGrid } from "../utils/ResetGrid";
import { runMazeAlgo } from "../utils/runMazeAlgo";
import {
  GRID_SIZE_PRESETS,
  MAZES,
  MAX_GRID_COLS,
  MAX_GRID_ROWS,
  MIN_GRID_COLS,
  MIN_GRID_ROWS,
  NavigatingAlgorithms,
  endTileStyle,
  startTileStyle,
  tileStyle,
  wallTileStyle,
} from "../utils/constants";
import { runPathAlgorithm } from "../utils/runPathAlgorithm";
import { createGrid } from "../utils/helpers";
import type { MutableRefObject } from "react";
import { useToast } from "../hooks/useToast";
import { GridSizeModal } from "./GridSizeModal";
import { SpeedControl } from "./SpeedControl";

interface NavProps {
  isNavigationRunningRef: MutableRefObject<boolean>;
}

export function Nav({ isNavigationRunningRef }: NavProps) {
  const [isDisabled, setIsDisabled] = useState(false);
  const [showCustomSizeModal, setShowCustomSizeModal] = useState(false);
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
  const { startTile, setStartTile, endTile, setEndTile } = useTile();
  const { speed, setSpeed, speedRef } = useSpeed();
  const { showToast } = useToast();

  const currentRows = grid.length;
  const currentCols = grid[0]?.length || 0;
  const currentKey = `${currentRows}x${currentCols}`;
  const isPresetMatch = GRID_SIZE_PRESETS.some(
    (p) => p.rows === currentRows && p.cols === currentCols
  );

  const handleResizeGrid = (newRows: number, newCols: number) => {
    let r = Math.max(MIN_GRID_ROWS, Math.min(MAX_GRID_ROWS, Math.floor(newRows)));
    let c = Math.max(MIN_GRID_COLS, Math.min(MAX_GRID_COLS, Math.floor(newCols)));

    // Ensure odd dimensions for proper maze rooms, corridor symmetry and start/goal placement
    if (r % 2 === 0) r += 1;
    if (c % 2 === 0) c += 1;

    const newStartTile: TileType = {
      row: 1,
      col: 1,
      isStart: true,
      isEnd: false,
      isWall: false,
      isPath: false,
      distance: 0,
      parent: null,
      isTraversed: false,
    };

    const newEndTile: TileType = {
      row: r - 2,
      col: c - 2,
      isStart: false,
      isEnd: true,
      isWall: false,
      isPath: false,
      distance: 0,
      parent: null,
      isTraversed: false,
    };

    setStartTile(newStartTile);
    setEndTile(newEndTile);
    setGrid(createGrid(newStartTile, newEndTile, r, c));
    setIsGraphVisualized(false);
    showToast(
      `📐 Grid set to ${r} × ${c} (Start: [1, 1], Goal: [${r - 2}, ${c - 2}])`,
      "info"
    );
  };

  const handlePresetChange = (value: string) => {
    if (value === "custom") {
      setShowCustomSizeModal(true);
      return;
    }
    const [r, c] = value.split("x").map(Number);
    if (!isNaN(r) && !isNaN(c)) {
      handleResizeGrid(r, c);
    }
  };

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
      `🧩 Generating ${maze.replace("_", " ").toLowerCase()} maze...`,
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
      speed: speedRef,
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
      handleClearPath();
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
      const { pathFound, pathLength, traversedCount } = await runPathAlgorithm({
        algorithm,
        grid,
        startTile,
        endTile,
        speed: speedRef,
      });

      // Only update grid state after animation completes
      setGrid(grid.map((row) => row.map((tile) => ({ ...tile }))));
      setIsGraphVisualized(true);

      // Show completion message with exact metrics
      if (pathFound) {
        showToast(
          `🎯 Path found! Length: ${pathLength} steps (${traversedCount} nodes explored) using ${algorithm}!`,
          "success"
        );
      } else {
        showToast(
          `❌ No path found! Explored ${traversedCount} nodes without reaching target (${algorithm}).`,
          "info"
        );
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

    const numRows = grid.length;
    grid.forEach((row) => {
      row.forEach((tile) => {
        if (tile.isTraversed || tile.isPath) {
          const el = document.getElementById(`${tile.row}-${tile.col}`);
          if (el) {
            // Remove all animation classes
            el.classList.remove("animate-traversed", "animate-path");

            const borderB = tile.row === numRows - 1 ? " border-b" : "";
            const borderL = tile.col === 0 ? " border-l" : "";

            if (tile.isStart) {
              el.className = `${startTileStyle}${borderB}${borderL}`.trim();
            } else if (tile.isEnd) {
              el.className = `${endTileStyle}${borderB}${borderL}`.trim();
            } else if (tile.isWall) {
              el.className = `${wallTileStyle}${borderB}${borderL}`.trim();
            } else {
              el.className = `${tileStyle}${borderB}${borderL}`.trim();
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
    showToast("🔄 Path reset successfully!", "info");
  };

  const handleClearGrid = () => {
    if (isDisabled) return;

    ResetGrid({ grid, startTile, endTile });
    setGrid(grid.map((row) => row.map((tile) => ({ ...tile }))));
    setIsGraphVisualized(false);
    showToast("🗑️ Grid cleared successfully!", "info");
  };

  return (
    <>
      <header className="bg-zinc-900 text-zinc-100 px-3 py-2.5 sm:px-6 sm:py-3 border-b border-zinc-800 shadow-sm z-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-2">
            <h1 className="text-sm sm:text-base md:text-lg font-bold tracking-wide text-zinc-100 inline-flex items-center gap-2">
              <span className="text-indigo-400 text-base sm:text-xl">🧭</span> PATH NAVIGATION VISUALIZER
            </h1>
          </div>

          {/* Responsive Control Ribbon */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4">
            {/* Grid Size Group */}
            <div className="flex items-center gap-1.5 bg-zinc-800/90 p-1 sm:p-1.5 rounded-lg border border-zinc-700/80 shadow-xs">
              <div className="flex flex-col">
                <label className="text-xs text-zinc-300 font-medium px-1 flex items-center justify-between gap-1.5">
                  <span>Grid Size</span>
                  <span className="text-[10px] text-indigo-400 font-mono font-semibold">
                    {currentRows}×{currentCols}
                  </span>
                </label>
                <select
                  disabled={isDisabled}
                  className="bg-zinc-900 text-zinc-100 px-2 py-1 rounded text-xs sm:text-sm border border-zinc-700 focus:border-indigo-500 focus:outline-none hover:border-zinc-600 transition-colors max-w-[125px] sm:max-w-[155px]"
                  value={isPresetMatch ? currentKey : "custom"}
                  onChange={(e) => handlePresetChange(e.target.value)}
                >
                  {GRID_SIZE_PRESETS.map((preset) => (
                    <option
                      key={`${preset.rows}x${preset.cols}`}
                      value={`${preset.rows}x${preset.cols}`}
                    >
                      {preset.name}
                    </option>
                  ))}
                  <option value="custom">⚙️ Custom...</option>
                </select>
              </div>
              <button
                disabled={isDisabled}
                onClick={() => setShowCustomSizeModal(true)}
                className="self-end bg-gray-700 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed px-2 py-1 sm:py-1.5 rounded text-xs sm:text-sm font-semibold transition-all border border-gray-600 active:scale-95 shadow"
                title="Customize Grid Dimensions"
              >
                📐
              </button>
            </div>

            {/* Maze Generation Group */}
            <div className="flex items-center gap-1.5 bg-gray-800/80 p-1 sm:p-1.5 rounded-lg border border-gray-700/60 shadow-inner">
              <div className="flex flex-col">
                <label className="text-xs sm:text-sm text-gray-300 font-semibold px-1">
                  Maze Type
                </label>
                <select
                  disabled={isDisabled}
                  className="bg-gray-700/90 text-white px-2 py-1 rounded text-xs sm:text-sm border border-gray-600 focus:border-blue-400 focus:outline-none hover:bg-gray-600 transition-colors max-w-[110px] sm:max-w-[140px]"
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
              <button
                disabled={isDisabled}
                onClick={handleGenerateMaze}
                className="self-end bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed px-2.5 py-1 sm:py-1.5 rounded text-xs sm:text-sm font-semibold transition-all shadow hover:shadow-cyan-500/20 active:scale-95"
                title="Generate Maze"
              >
                🧩 Maze
              </button>
            </div>

            {/* Speed Control - Distinct Tachometer Gauge & 1-Click Segmented Pills */}
            <SpeedControl speed={speed} setSpeed={setSpeed} />

            {/* Algorithm Group */}
            <div className="flex items-center gap-1.5 bg-gray-800/80 p-1 sm:p-1.5 rounded-lg border border-gray-700/60 shadow-inner">
              <div className="flex flex-col">
                <label className="text-xs sm:text-sm text-gray-300 font-semibold px-1">
                  Algorithm
                </label>
                <select
                  disabled={isDisabled}
                  className="bg-gray-700/90 text-white px-2 py-1 rounded text-xs sm:text-sm border border-gray-600 focus:border-blue-400 focus:outline-none hover:bg-gray-600 transition-colors max-w-[120px] sm:max-w-[150px]"
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
            </div>

            {/* Primary Actions (Clear Grid on left, Start/Reset as rightmost anchor) */}
            <div className="flex items-center gap-1.5 self-end">
              <button
                disabled={isDisabled}
                onClick={handleClearGrid}
                className="bg-rose-700/90 hover:bg-rose-600 disabled:opacity-40 disabled:cursor-not-allowed px-2.5 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all border border-rose-600/80 active:scale-95 shadow-sm"
                title="Clear all walls and reset entire grid"
              >
                🗑️ Clear Grid
              </button>

              <button
                disabled={isDisabled}
                onClick={handlerRunVisualizer}
                className={`px-3.5 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-1.5 border active:scale-95 ${
                  isGraphVisualized
                    ? "bg-amber-600 hover:bg-amber-500 border-amber-500 text-white shadow-amber-600/30"
                    : "bg-emerald-600 hover:bg-emerald-500 border-emerald-500 text-white shadow-emerald-600/30"
                } disabled:opacity-40 disabled:cursor-not-allowed`}
                title={isGraphVisualized ? "Reset Path" : "Start Pathfinding"}
              >
                {isGraphVisualized ? "🔄 Reset" : "▶️ Start"}
              </button>
            </div>
          </div>
        </div>
      </header>

      <GridSizeModal
        isOpen={showCustomSizeModal}
        onClose={() => setShowCustomSizeModal(false)}
        currentRows={currentRows}
        currentCols={currentCols}
        onApply={handleResizeGrid}
      />
    </>
  );
}

