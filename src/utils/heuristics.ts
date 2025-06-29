import { maxCols, maxRows } from "./constants";
import type { GridType, TileType } from "./types";


const retireveheuristicCost = (currentTile: TileType, endTile: TileType) => {
    const manhattanDist = 1;
    const row = Math.abs(currentTile.row - endTile.row);
    const col = Math.abs(currentTile.col - endTile.col);
    return manhattanDist * (row + col);
}

export const initHeuristicCost = (grid: GridType, endTile: TileType)=>{
    const heuristicCost = [];
    for (let i = 0; i < maxRows; i++){
        const row = [];
        for (let j = 0; j < maxCols; j++){
            row.push(retireveheuristicCost(grid[i][j], endTile));
        }
        heuristicCost.push(row);
    }
    return heuristicCost;
}

export const initFunctionCost = () => {
    const functionCost = [];
    for (let i = 0; i < maxRows; i++){
        const row = [];
        for (let j = 0; j < maxCols; j++){
            row.push(Infinity);
        }
        functionCost.push(row);
    }
    return functionCost;
}