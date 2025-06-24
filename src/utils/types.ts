export type AlgorithmType = "Dijkstra" | "AStar" | "BFS" | "DFS" | "GreedyBestFirstSearch";
export type MazeType = "NONE" | "BINARY_TREE" | "RECURSIVE_DIVISION";

export interface MazeSelectType{
    name: string;
    value: MazeType;
}
export type TileType = {
    row: number;
    col: number;
    isStart: boolean;
    isEnd: boolean;
    isWall: boolean;
    distance: number;
    parent: TileType | null;
    isPath: boolean;
    isTraversed: boolean;
};

export type GridType = TileType[][];

export type SpeedType = 2 | 1 | 0.5;

export interface SpeedSelectType {
    name: string;
    value: SpeedType;
}