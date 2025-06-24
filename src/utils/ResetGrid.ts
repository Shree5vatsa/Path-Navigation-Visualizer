import { endTile_config, maxCols, maxRows, startTile_config, tileStyle } from "./constants";
import { isEqual } from "./helpers";
import type { GridType, TileType } from "./types";

export const ResetGrid = ({
    grid,
    startTile = startTile_config,
    endTile = endTile_config
}: {
        grid: GridType;
        startTile ?: TileType;
        endTile?: TileType;
    }) => {
    for (let row = 0; row < maxRows; row++){
        for (let col = 0; col < maxCols; col++){
            const tile = grid[row][col];
            tile.distance = Infinity;
            tile.isTraversed = false;
            tile.isPath = false;
            tile.parent = null;
            tile.isWall = false;

            if(!isEqual(startTile,tile) && !isEqual(endTile, tile)){
                const tileElement = document.getElementById(`${tile.row}-${tile.col}`);

                if (tileElement) {
                    tileElement.className = tileStyle;
                }

                if (tile.row === maxRows - 1) {
                    tileElement?.classList.add("border-b");
                }
                if(tile.col===0){
                    tileElement?.classList.add("border-l");
                }
            }
        }
    }
}