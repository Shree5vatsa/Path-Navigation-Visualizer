import { getUntraversedNeighbours } from "../../../utils/getuntraversedneighBours";
import { isEqual } from "../../../utils/helpers";
import { isPresentinQueue } from "../../../utils/isPresentInQueue";
import type { GridType, TileType } from "../../../utils/types";

export const bfs = (grid: GridType, startTile: TileType, endTile: TileType) => {
    const traversedTiles: TileType[] = [];
    const base = grid[startTile.row][startTile.col];
    base.distance = 0;
    base.isTraversed = true;
    const unTraversed = [base];

    while (unTraversed.length) {
        const tile = unTraversed.shift() as TileType;
        if (tile.isWall) continue;
        if (tile.distance === Infinity) break;
        tile.isTraversed = true;
        traversedTiles.push(tile);
        if (isEqual(tile, endTile)) break;

        const neighbours = getUntraversedNeighbours(grid, tile);
        for (let i = 0; i < neighbours.length; i += 1) {
            if (!isPresentinQueue(neighbours[i], unTraversed)) {
                const neighbour = neighbours[i];
                neighbour.distance = tile.distance + 1;
                neighbour.parent = tile;
                unTraversed.push(neighbour);
            }
        }
    }

    const path: TileType[] = [];
    let tile = grid[endTile.row][endTile.col];
    while (tile !== null) {
        tile.isPath = true;
        path.unshift(tile);
        tile = tile.parent!;
    }
    return { traversedTiles, path };
};