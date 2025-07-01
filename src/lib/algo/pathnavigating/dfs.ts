import { getUntraversedNeighbours } from "../../../utils/getuntraversedneighBours";
import { checkStack, isEqual } from "../../../utils/helpers";
import type { GridType, TileType } from "../../../utils/types";

export const dfs = (grid: GridType, startTile: TileType, endTile: TileType) => {
  const traversedTiles = [];
  const base = grid[startTile.row][startTile.col];
  base.distance = 0;

  const unTraversedTiles = [base];

  while (unTraversedTiles.length > 0) {
    const currentTile = unTraversedTiles.pop();
    if (!currentTile) continue;
    if (currentTile.isWall) continue;
    if (currentTile.distance == Infinity) break;
    currentTile.isTraversed = true;
    // Only add to traversed tiles for animation, don't set visual state
    traversedTiles.push(currentTile);
    if (isEqual(currentTile, endTile)) break;

    const neighbours = getUntraversedNeighbours(grid, currentTile);
    for (let i = 0; i < neighbours.length; i++) {
      if (!checkStack(neighbours[i], unTraversedTiles)) {
        //stack maa  chaina bhne
        neighbours[i].distance = currentTile.distance + 1;
        neighbours[i].parent = currentTile;
        unTraversedTiles.push(neighbours[i]);
      }
    }
  }
  const path = [];
  let current: TileType | null = grid[endTile.row][endTile.col];
  if (current.parent || isEqual(current, startTile)) {
    // Only backtrack if reachable
    while (current != null) {
      path.unshift(current);
      current = current.parent;
    }
  }
  return { traversedTiles, path };
};
