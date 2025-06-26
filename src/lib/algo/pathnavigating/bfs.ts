import { Tile } from "../../../components/tile";
import { getUntraversedNeighbours } from "../../../utils/getuntraversedneighBours";
import { isEqual } from "../../../utils/helpers";
import { isPresentinQueue } from "../../../utils/ispresentinQueue";
import type { GridType, TileType } from "../../../utils/types";

export const bfs = (grid: GridType, startTile: TileType, endTile: TileType) => {
    const traversedTiles: TileType[] = [];
    const base = grid[startTile.row][startTile.col];
    base.distance = 0;
    base.isTraversed = true;
    const unTraversed = [ base ];//it is a queue for bfs

    while (unTraversed.length) {
        const tile = unTraversed.shift();//pop first element
        if (!tile) {
            continue; // Skip if tile is undefined
        }
        if(tile.isWall) {
            continue; // Skip walls
        }
        if (tile.distance === Infinity) break;//terminate if unreachable tile is found
        
        tile.isTraversed = true;
        traversedTiles.push(tile);
        if (isEqual(tile, endTile)) break;
        
        const neighbours = getUntraversedNeighbours(grid, tile);
        
        for (let i = 0;i<neighbours.length;i++) {
            if(!isPresentinQueue(neighbours[i], unTraversed)) {
                const neighbour = neighbours[i];
                neighbour.distance = tile.distance + 1;
                neighbour.parent = tile;
                unTraversed.push(neighbour);
            }
        }
        const path = [];
        let pathTile: TileType | null = grid[endTile.row][endTile.col];
        while (pathTile != null) {
            pathTile.isPath = true;
            path.unshift(pathTile);
            pathTile = pathTile.parent;
            
        }
        return { traversedTiles, path };
    }
}