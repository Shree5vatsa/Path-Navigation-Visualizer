import { getUntraversedNeighbours } from "../../../utils/getuntraversedneighBours";
import { isEqual } from "../../../utils/helpers";
import { isPresentinQueue } from "../../../utils/isPresentInQueue";
import type { GridType, TileType } from "../../../utils/types";

export const bfs = (grid: GridType, startTile: TileType, endTile: TileType) => {
  const traversedTiles: TileType[] = [];
  const base = grid[startTile.row][startTile.col];
  base.distance = 0;
  const unTraversed = [base]; //queue

  while (unTraversed.length) {
    const tile = unTraversed.shift() as TileType;
    if (tile.isWall) continue;
    if (tile.distance === Infinity) break; //terminate
    tile.isTraversed = true;
    // Only add to traversed tiles for animation, don't set visual state
    traversedTiles.push(tile);
    if (isEqual(tile, endTile)) break; //end break out

    const neighbours = getUntraversedNeighbours(grid, tile);
    for (let i = 0; i < neighbours.length; i++) {
      if (!isPresentinQueue(neighbours[i], unTraversed)) {
        const neighbour = neighbours[i];
        neighbour.distance = tile.distance + 1;
        neighbour.parent = tile;
        unTraversed.push(neighbour);
      }
    }
  }

  const path = [];
  let tile = grid[endTile.row][endTile.col];
  if (tile.parent || isEqual(tile, startTile)) {
    // Only backtrack if reachable
    while (tile !== null) {
      path.unshift(tile);
      tile = tile.parent!;
    }
  }
  return { traversedTiles, path };
};
