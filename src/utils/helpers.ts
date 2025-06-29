import type { TileType } from "./types";
import type { GridType } from '../utils/types';
import { maxRows, maxCols } from "./constants";

const createRow = (row: number, startTile: TileType, endTile: TileType): TileType[] => { 
    const currentRow = [];
    for (let col = 0; col < maxCols; col++) { 
        currentRow.push({
            row,
            col,
            isEnd: row == endTile.row && col == endTile.col,
            isWall: false,
            isPath: false,
            distance: Infinity,
            isStart: row === startTile.row && col === startTile.col,
            isTraversed: false,
            parent: null
        })
    }
    return currentRow;
}

export const createGrid = (startTile: TileType, endTile: TileType) => {
    const grid: GridType = [];
    for (let row = 0; row < maxRows; row++){
        grid.push(createRow(row, startTile, endTile));
    }
    return grid;
}

export const checkIfStartOrEnd = (row: number, col: number) => {
    return (
        (row === 1 && col === 1) || (row === maxRows - 2 && col === maxCols - 2) // Check if the tile is start or end
    );
}

export const createNewGrid = (params: { grid: GridType, row: number, col: number }) => {
    const { grid, row, col } = params;
    const newGrid = grid.slice();
    const newTile = {
        ...newGrid[row][col],
        isWall: !newGrid[row][col].isWall,
    };
    newGrid[row][col] = newTile;
    return newGrid;
}

export const isEqual = (t1: TileType, t2: TileType) => {
    return (t1.row === t2.row && t1.col === t2.col);
}

export const isTileSame = (row: number, col: number, tile: TileType) => {
    return row=== tile.row && col === tile.col;
}

export const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export const getRandInt = (min: number, max: number): number => { 
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const checkStack = (tile: TileType, stack: TileType[]): boolean => {
    for (let i = 0; i < stack.length; i++){
        if (isEqual(stack[i], tile)) return true;
    }
    return false;
}

export const dropNeighbourFromQueue = (tile: TileType, queue: TileType[]) => {
    for (let i = 0; i < queue.length; i++){
        if (isEqual(tile, queue[i])) {
            queue.splice(i, 1);
            break;
        }
    }
    
};