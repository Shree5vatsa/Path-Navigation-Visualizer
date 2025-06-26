import { bfs } from "../lib/algo/pathnavigating/bfs";
import { startTileStyle } from "./constants";
import type { AlgorithmType, GridType, TileType } from "./types";

export const runPathAlgorithm = ({
    algorithm,
    grid,
    startTile,
    endTile,
}: {
        algorithm: AlgorithmType;
        grid: GridType;
        startTile: TileType;
        endTile: TileType;
}) => {
    
    switch (algorithm) {
        case "BFS":
            return bfs(grid, startTile, endTile);
        default:
            return bfs(grid, startTile, endTile); // Default to BFS if no valid algorithm is provided
    }
}