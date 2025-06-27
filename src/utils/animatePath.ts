import {
    extendedSLEEP_TIME,
    pathTileStyle,
    SLEEP_TIME,
    SPEEDS,
    traversedTileStyle,
  } from "./constants";
  import { isEqual } from "./helpers";
  import type { SpeedType, TileType } from "./types";
  
export const animatePath = (
    traversedTiles: TileType[],
    path: TileType[],
    startTile: TileType,
    endTile: TileType,
    speed: SpeedType
) => {
    for (let i = 0; i < traversedTiles.length; i++) {
        setTimeout(() => {
            const tile = traversedTiles[i];
            if (!isEqual(tile, startTile) && !isEqual(tile, endTile)) {
                document.getElementById(
                  `${tile.row}-${tile.col}`
                )!.className = `${traversedTileStyle} animate-traversed`;
            }
        }, SLEEP_TIME * i * SPEEDS.find((s) => s.value === speed)!.value);
    }
  
    setTimeout(() => {
        for (let i = 0; i < path.length; i++) {
            setTimeout(() => {
                const tile = path[i];
                if (!isEqual(tile, startTile) && !isEqual(tile, endTile)) {
                    document.getElementById(
                      `${tile.row}-${tile.col}`
                    )!.className = `${pathTileStyle} animate-path`;
                }
            }, extendedSLEEP_TIME * i * SPEEDS.find((s) => s.value === speed)!.value);
        }
    }, SLEEP_TIME * traversedTiles.length * SPEEDS.find((s) => s.value === speed)!.value);
};