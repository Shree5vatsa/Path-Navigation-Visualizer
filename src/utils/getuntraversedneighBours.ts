import type { GridType, TileType } from "./types";

export const getUntraversedNeighbours = (grid: GridType, tile: TileType): TileType[] => {
  const { row, col } = tile;
  const numRows = grid.length;
  const numCols = grid[0]?.length || 0;
  const neighbours = [];

  if (row > 0) {
    neighbours.push(grid[row - 1][col]); // Up
  }
  if (row < numRows - 1) {
    neighbours.push(grid[row + 1][col]); // Down
  }

  if (col > 0) {
    neighbours.push(grid[row][col - 1]); // Left
  }
  if (col < numCols - 1) {
    neighbours.push(grid[row][col + 1]); // Right
  }
  return neighbours.filter((neighbour) => !neighbour.isTraversed && !neighbour.isWall);
};
