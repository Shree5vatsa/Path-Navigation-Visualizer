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
  "transition-all lg:w-[15px] md:w-[13px] xs:w-[8px] w-[7px] lg:h-[15px] md:h-[13px] xs:h-[8px] h-[7px] border-t border-r border-sky-200";

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

// Improved timing constants for smoother animations
export const SLEEP_TIME = 4;
export const extendedSLEEP_TIME = 15;

// Optimized speed multipliers for better coordination between creation and destruction
export const SPEED_MULTIPLIERS = {
  WALL_CREATION: {
    2: 6, // Slow - faster for better coordination
    1: 3, // Medium - faster for better coordination
    0.5: 1, // Fast - already optimal
  },
  WALL_DESTRUCTION: {
    2: 4, // Slow - faster and coordinated
    1: 2, // Medium - faster and coordinated
    0.5: 1, // Fast - optimal speed
  },
  PATHFINDING: {
    2: 15, // Slow
    1: 8, // Medium
    0.5: 3, // Fast
  },
  PATH_ANIMATION: {
    2: 25, // Slow
    1: 12, // Medium
    0.5: 5, // Fast
  },
};
