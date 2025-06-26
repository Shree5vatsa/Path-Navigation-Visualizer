import { maxCols, maxRows } from "./constants";
import type { GridType, TileType } from "./types";

export const getUntraversedNeighbours = (grid: GridType,tile: TileType): TileType[] => {//yesko return maa bichar garnu
  const { row, col } = tile;
  const neighbours = [];

  if (row > 0) {
    neighbours.push(grid[row - 1][col]); // Up
  }
  if (row < maxRows - 1) {
    neighbours.push(grid[row + 1][col]); // Down
  }

  if (col > 0) {
    neighbours.push(grid[row][col - 1]); // Left
  }
  if (col < maxCols - 1) {
    neighbours.push(grid[row][col + 1]); // Right
  }
  return neighbours.filter((neighbours) => !neighbours.isTraversed);
};
