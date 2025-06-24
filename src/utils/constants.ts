import type { MazeSelectType, SpeedSelectType } from "./types";

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

export const tileStyle = "lg:w-[17px] md:w-[15px] xs:w-[7px] w-[7px] lg:h-[17px] md:h-[15px] xs:h-[8px] h-[7px] border-t border-r border-sky-200 bg-gray-800";

export const traversedTileStyle = tileStyle + " bg-cyan-400";
export const startTileStyle = tileStyle + " bg-green-400";
export const endTileStyle = tileStyle + " bg-red-400";

export const wallTileStyle = tileStyle + " bg-gray-400";
export const pathTileStyle = tileStyle + " bg-green-500";

export const MAZES: MazeSelectType[] = [
    { name: "Not Selected", value: "NONE" },
    { name: "Binary Tree", value: "BINARY_TREE" },
    { name: "Recursive Division", value: "RECURSIVE_DIVISION" },
    
];


export const SPEEDS: SpeedSelectType[] = [
    { name: "Slow", value: 2 },
    { name: "Medium", value: 1 },
    { name: "Fast", value: 0.5 },
    
];