import { maxCols, maxRows, SPEEDS, wallTileStyle } from "./constants";
import { isTileSame } from "./helpers";
import type { SpeedType, TileType } from "./types";


export const createWall = async(
  startTile: TileType,
  endTile: TileType,
  speed: SpeedType
) => {
  const delay = 6 * SPEEDS.find((s) => s.value === speed)!.value - 1;

  for (let row = 0; row <maxRows; row++) {
    setTimeout(() => {
      for (let col = 0; col < maxCols; col++) {
        if (row % 2 === 0 || col % 2 === 0) {
          if (
            !isTileSame(row, col, startTile) &&
            !isTileSame(row, col, endTile)
          ) {
            setTimeout(() => {
                document.getElementById(
                  `${row}-${col}`
                )!.className = `${wallTileStyle} animate-wall`;
            }, delay * col);
          }
        }
      }
    }, delay * (maxRows / 2) * row);
  }
};
