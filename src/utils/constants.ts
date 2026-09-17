import type {
  AlgorithmSelectType,
  MazeSelectType,
  SpeedSelectType,
} from "./types";

export const maxRows = 47;
export const maxCols = 87;

export const startTile_config = {
  row: 1,
  col: 1,
  isEnd: false,
  isWall: false,
  isPath: false,
  distance: 0,
  isStart: true,
  parent: null,
  isTraversed: false,
};

export const endTile_config = {
  row: maxRows - 2,
  col: maxCols - 2,
  isEnd: true,
  isWall: false,
  isPath: false,
  distance: 0,
  isStart: false,
  parent: null,
  isTraversed: false,
};

export const tileStyle =
  "w-[8px] h-[8px] sm:w-[11px] sm:h-[11px] md:w-[13px] md:h-[13px] lg:w-[15px] lg:h-[15px] border-t border-r border-sky-200/50";

export const traversedTileStyle = tileStyle + " bg-cyan-400";
export const startTileStyle = tileStyle + " bg-green-400";
export const endTileStyle = tileStyle + " bg-red-400";

export const wallTileStyle = tileStyle + " bg-gray-300";
export const pathTileStyle = tileStyle + " bg-green-500";

export const MAZES: MazeSelectType[] = [
  { name: "Not Selected", value: "NONE" },
  { name: "Binary Tree", value: "BINARY_TREE" },
  { name: "Recursive Division", value: "RECURSIVE_DIVISION" },
];

export const NavigatingAlgorithms: AlgorithmSelectType[] = [
  { name: "Dijkstra", value: "Dijkstra" },
  { name: "A* Search", value: "AStar" },
  { name: "Breadth First Search", value: "BFS" },
  { name: "Depth First Search", value: "DFS" },
];

export const SPEEDS: SpeedSelectType[] = [
  { name: "Slow", value: 2 },
  { name: "Medium", value: 1 },
  { name: "Fast", value: 0.5 },
];

export interface GridSizePreset {
  name: string;
  rows: number;
  cols: number;
}

export const GRID_SIZE_PRESETS: GridSizePreset[] = [
  { name: "47 × 87 (Huge - Default)", rows: 47, cols: 87 },
  { name: "35 × 65 (Large)", rows: 35, cols: 65 },
  { name: "25 × 47 (Medium)", rows: 25, cols: 47 },
  { name: "19 × 35 (Compact)", rows: 19, cols: 35 },
  { name: "15 × 25 (Small)", rows: 15, cols: 25 },
  { name: "9 × 17 (Mini)", rows: 9, cols: 17 },
];

export const MIN_GRID_ROWS = 7;
export const MAX_GRID_ROWS = 65;
export const MIN_GRID_COLS = 7;
export const MAX_GRID_COLS = 105;

// Improved timing constants for smoother animations
export const SLEEP_TIME = 4;
export const extendedSLEEP_TIME = 15;

// Optimized speed multipliers for seamless 60fps coordination (snappy & synchronized)
export const SPEED_MULTIPLIERS = {
  WALL_CREATION: {
    2: 3,     // Slow
    1: 1.5,   // Medium
    0.5: 0.8, // Fast
  },
  WALL_DESTRUCTION: {
    2: 3.5,   // Slow - clear and steady (< 2.5s total)
    1: 1.5,   // Medium - silky smooth (< 1.2s total)
    0.5: 0.6, // Fast - instant (< 0.6s total)
  },
  PATHFINDING: {
    2: 12,    // Slow
    1: 6,     // Medium
    0.5: 2,   // Fast
  },
  PATH_ANIMATION: {
    2: 18,    // Slow
    1: 9,     // Medium
    0.5: 4,   // Fast
  },
};
