import type { AlgorithmSelectType, MazeSelectType, SpeedSelectType } from "./types";

export const maxRows = 39;
export const maxCols = 49;

export const startTile_config = {
    row: 1,
    col: 1,
    isEnd: false,
    isWall: false,
    isPath: false,
    distance: 0,
    isStart: true,
    parent: null,
    isTraversed: false
};

export const endTile_config = {
    row:  maxRows - 2,
    col: maxCols - 2,
    isEnd: false,
    isWall: false,
    isPath: false,
    distance: 0,
    isStart: true,
    parent: null,
    isTraversed: false
};

export const tileStyle = "lg:w-[22px] md:w-[19px] xs:w-[10px] w-[10px] lg:h-[22px] md:h-[19px] xs:h-[11px] h-[10px] border-t border-r border-sky-200";

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
    //{ name: "Greedy Best First Search", value: "GreedyBestFirstSearch" },
]

export const SPEEDS: SpeedSelectType[] = [
    { name: "Slow", value: 2 },
    { name: "Medium", value: 1 },
    { name: "Fast", value: 0.5 },
    
];

export const SLEEP_TIME = 8;
export const extendedSLEEP_TIME = 30;