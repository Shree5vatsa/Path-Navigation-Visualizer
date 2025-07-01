import { initFunctionCost, initHeuristicCost } from "../../../utils/heuristics";
import type { GridType, TileType } from "../../../utils/types";
import { dropNeighbourFromQueue, isEqual } from "../../../utils/helpers";
import { getUntraversedNeighbours } from "../../../utils/getuntraversedneighBours";

export const aStar = (
  grid: GridType,
  startTile: TileType,
  endTile: TileType
) => {
  const traversedTiles = [];
  const heuristicCost = initHeuristicCost(grid, endTile);

  const functionCost = initFunctionCost(); //2d array banayo fucntion store garna Lai

  const base = grid[startTile.row][startTile.col];
  base.distance = 0;
  functionCost[base.row][base.col] =
    base.distance + heuristicCost[base.row][base.col];

  const unTraversedTiles = [base];

  while (unTraversedTiles.length > 0) {
    unTraversedTiles.sort((a, b) => {
      if (functionCost[a.row][a.col] === functionCost[b.row][b.col]) {
        return b.distance - a.distance;
      }
      return functionCost[a.row][a.col] - functionCost[b.row][b.col];
    });

    const currentTile = unTraversedTiles.shift();
    if (!currentTile) continue;
    if (currentTile.isWall) continue;
    if (currentTile.distance === Infinity) break;

    // Only add to traversed tiles for animation, don't set visual state
    traversedTiles.push(currentTile);
    if (isEqual(currentTile, endTile)) break;

    const neighbours = getUntraversedNeighbours(grid, currentTile);

    for (let i = 0; i < neighbours.length; i++) {
      const distance2Neighbour = currentTile.distance + 1;
      if (distance2Neighbour < neighbours[i].distance) {
        dropNeighbourFromQueue(neighbours[i], unTraversedTiles);

        neighbours[i].distance = distance2Neighbour;

        functionCost[neighbours[i].row][neighbours[i].col] =
          neighbours[i].distance +
          heuristicCost[neighbours[i].row][neighbours[i].col];

        neighbours[i].parent = currentTile;

        unTraversedTiles.push(neighbours[i]);
      }
    }
  }

  //path bana
  const path = [];
  let curr: TileType | null = grid[endTile.row][endTile.col];

  while (curr != null) {
    path.unshift(curr);
    curr = curr.parent;
  }
  return { traversedTiles, path };
};
