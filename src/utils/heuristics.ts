import type { GridType, TileType } from "./types";

const retireveheuristicCost = (currentTile: TileType, endTile: TileType) => {
    const manhattanDist = 1;
    const row = Math.abs(currentTile.row - endTile.row);
    const col = Math.abs(currentTile.col - endTile.col);
    return manhattanDist * (row + col);
}

export const initHeuristicCost = (grid: GridType, endTile: TileType) => {
    const numRows = grid.length;
    const numCols = grid[0]?.length || 0;
    const heuristicCost = [];
    for (let i = 0; i < numRows; i++) {
        const row = [];
        for (let j = 0; j < numCols; j++) {
            row.push(retireveheuristicCost(grid[i][j], endTile));
        }
        heuristicCost.push(row);
    }
    return heuristicCost;
}

export const initFunctionCost = (grid?: GridType) => {
    const numRows = grid ? grid.length : 47;
    const numCols = grid ? (grid[0]?.length || 87) : 87;
    const functionCost = [];
    for (let i = 0; i < numRows; i++) {
        const row = [];
        for (let j = 0; j < numCols; j++) {
            row.push(Infinity);
        }
        functionCost.push(row);
    }
    return functionCost;
}