import {
  maxCols,
  maxRows,
  wallTileStyle,
} from "./constants";
import { isTileSame } from "./helpers";
import type { SpeedType, TileType } from "./types";

export const createWall = async (
  startTile: TileType,
  endTile: TileType,
  speed: SpeedType
) => {
  const animationClass =
    speed === 0.5
      ? "animate-wall-fast"
      : speed === 2
      ? "animate-wall-slow"
      : "animate-wall";

  // Collect all valid wall elements organized in sequential scan order
  const wallElements: HTMLElement[] = [];

  for (let row = 0; row < maxRows; row++) {
    for (let col = 0; col < maxCols; col++) {
      if (row % 2 === 0 || col % 2 === 0) {
        if (
          !isTileSame(row, col, startTile) &&
          !isTileSame(row, col, endTile)
        ) {
          const element = document.getElementById(`${row}-${col}`);
          if (element) {
            wallElements.push(element);
          }
        }
      }
    }
  }

  // Smooth continuous tile-by-tile rendering matching pathfinding animation model
  const delayMs = speed === 0.5 ? 0.25 : speed === 2 ? 1.0 : 0.5;

  return new Promise<void>((resolve) => {
    wallElements.forEach((element, i) => {
      setTimeout(() => {
        const borderClasses = [];
        if (element.className.includes("border-b")) borderClasses.push("border-b");
        if (element.className.includes("border-l")) borderClasses.push("border-l");
        element.className = `${wallTileStyle} ${animationClass} ${borderClasses.join(" ")}`.trim();
      }, i * delayMs);
    });

    setTimeout(() => {
      resolve();
    }, wallElements.length * delayMs);
  });
};

