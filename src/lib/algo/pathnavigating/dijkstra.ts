import { getUntraversedNeighbours } from "../../../utils/getuntraversedneighBours";
import { dropNeighbourFromQueue, isEqual } from "../../../utils/helpers";
import type { GridType, TileType } from "../../../utils/types";

export const dijkstra = (
  grid: GridType,
  startTile: TileType,
  endTile: TileType
) => {
  const traversedTiles: TileType[] = [];
  const base = grid[startTile.row][startTile.col];
  base.distance = 0;
  const unTraversedTiles = [base]; //queue

  while (unTraversedTiles.length > 0) {
    unTraversedTiles.sort((a, b) => a.distance - b.distance);
    //                                 ascending order
    const currentTile = unTraversedTiles.shift();
    if (!currentTile) continue;
    if (currentTile.isWall) continue;
    if (currentTile.distance === Infinity) break;

    // Only add to traversed tiles for animation, don't set visual state
    traversedTiles.push(currentTile);
    if (isEqual(currentTile, endTile)) break;

    const neighbours = getUntraversedNeighbours(grid, currentTile);

    for (let i = 0; i < neighbours.length; i++) {
      if (currentTile.distance + 1 < neighbours[i].distance) {
        dropNeighbourFromQueue(neighbours[i], unTraversedTiles);
        neighbours[i].distance = currentTile.distance + 1;
        neighbours[i].parent = currentTile;
        unTraversedTiles.push(neighbours[i]);
      }
    }
  }
  const path = [];
  let current: TileType | null = grid[endTile.row][endTile.col];
  while (current !== null) {
    path.unshift(current);
    current = current.parent;
  }
  return { traversedTiles, path };
};
