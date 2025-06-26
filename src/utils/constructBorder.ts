import { maxCols, maxRows, wallTileStyle } from "./constants";
import { isEqual, sleep } from "./helpers";
import type { GridType, TileType } from "./types";

const SLEEP_TIME = 10; // milliseconds, adjust as needed

export async function constructBorder(grid: GridType, startTile: TileType, endTile: TileType) {
    const shape=[{row:0,col:1},{row:1,col:0},{row:0,col:-1},{row:-1,col:0}];
//                right          down          left           up
    let row = 0;
    let col = 0;
    //construct a border of walls around the grid excluding start& end by iterating through specied directions and updating each tile's style, anmation,delay
    

    for (let i = 0; i < 4; i++){
        const direction = shape[i];
        while(row+direction.row>=0 && row+direction.row<maxRows && col+direction.col>=0 && col+direction.col<maxCols) {
            row += direction.row;
            col += direction.col;
            if (!isEqual(grid[row][col], startTile) && !isEqual(grid[row][col], endTile)) {
                grid[row][col].isWall = true;
                const tileElement = document.getElementById(`${row}-${col}`);
                if (tileElement) {
                    tileElement.classList.add(...wallTileStyle.split(" "), "animate-wall");
                    
                }
                await sleep(SLEEP_TIME);
            }
        }
        if (row < 0) row = 0;
        if (row >= maxRows) row = maxRows - 1;
        if (col < 0) col = 0;
        if (col >= maxCols) col = maxCols - 1;
    }

} 