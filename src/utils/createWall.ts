import {
  maxCols,
  maxRows,
  SPEED_MULTIPLIERS,
  wallTileStyle,
} from "./constants";
import { isTileSame } from "./helpers";
import type { SpeedType, TileType } from "./types";

export const createWall = async (
  startTile: TileType,
  endTile: TileType,
  speed: SpeedType
) => {
  const baseDelay = SPEED_MULTIPLIERS.WALL_CREATION[speed];
  const animationClass =
    speed === 0.5
      ? "animate-wall-fast"
      : speed === 2
      ? "animate-wall-slow"
      : "animate-wall";

  // Collect all valid tiles organized by row for smooth processing
  const validTilesByRow: {
    [key: number]: Array<{ element: HTMLElement; col: number }>;
  } = {};

  for (let row = 0; row < maxRows; row++) {
    validTilesByRow[row] = [];
    for (let col = 0; col < maxCols; col++) {
      if (row % 2 === 0 || col % 2 === 0) {
        if (
          !isTileSame(row, col, startTile) &&
          !isTileSame(row, col, endTile)
        ) {
          const element = document.getElementById(`${row}-${col}`);
          if (element) {
            validTilesByRow[row].push({ element, col });
          }
        }
      }
    }
  }

  // Much faster sequential animation - optimized for coordination with destroyWall
  for (let row = 0; row < maxRows; row++) {
    const validTiles = validTilesByRow[row] || [];

    if (validTiles.length === 0) continue;

    // Animate each tile in the row with optimized timing
    const rowPromises = validTiles.map(({ element }, tileIndex) => {
      return new Promise<void>((resolve) => {
        // Much faster timing for each tile in the row
        const tileDelay = tileIndex * (baseDelay * 0.008); // Even faster column progression

        setTimeout(() => {
          requestAnimationFrame(() => {
            // Apply smooth animation with proper transforms
            element.style.transform = "scale(0.1)";
            element.style.opacity = "0.3";
            element.className = `${wallTileStyle} ${animationClass}`;

            // Faster cleanup after animation
            const cleanupDelay = speed === 0.5 ? 80 : speed === 2 ? 200 : 120;
            setTimeout(() => {
              element.style.transform = "";
              element.style.opacity = "";
              resolve();
            }, cleanupDelay);
          });
        }, tileDelay);
      });
    });

    // Wait for all tiles in current row to complete
    await Promise.all(rowPromises);

    // Faster transition between rows
    if (row < maxRows - 1) {
      await new Promise((resolve) => setTimeout(resolve, baseDelay * 0.02));
    }
  }
};
