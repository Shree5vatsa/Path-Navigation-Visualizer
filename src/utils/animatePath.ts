import {
  SPEED_MULTIPLIERS,
  traversedTileStyle,
  pathTileStyle,
} from "./constants";
import { isEqual } from "./helpers";
import type { SpeedType, TileType } from "./types";

/**
 * Animate pathfinding traversal and final path with proper sequencing.
 * Returns a Promise that resolves only after ALL CSS animations complete.
 */
export function animatePath(
  traversedTiles: TileType[],
  path: TileType[],
  startTile: TileType,
  endTile: TileType,
  speed: SpeedType
): Promise<void> {
  const traverseDelay = SPEED_MULTIPLIERS.PATHFINDING[speed];
  const pathDelay = SPEED_MULTIPLIERS.PATH_ANIMATION[speed];

  // Get animation classes based on speed
  const traversedAnimClass =
    speed === 0.5
      ? "animate-traversed-fast"
      : speed === 2
      ? "animate-traversed-slow"
      : "animate-traversed";
  const pathAnimClass =
    speed === 0.5
      ? "animate-path-fast"
      : speed === 2
      ? "animate-path-slow"
      : "animate-path";

  return new Promise((resolve) => {
    // Clear any existing states first
    [...traversedTiles, ...path].forEach((tile) => {
      tile.isTraversed = false;
      tile.isPath = false;
    });

    // 1) Animate traversal tiles first with improved timing
    traversedTiles.forEach((tile, i) => {
      setTimeout(() => {
        if (isEqual(tile, startTile) || isEqual(tile, endTile)) return;
        const el = document.getElementById(`${tile.row}-${tile.col}`);
        if (!el) return;
        el.className = `${traversedTileStyle} ${traversedAnimClass}`;
        tile.isTraversed = true;
      }, i * traverseDelay);
    });

    // 2) After traversal animation completes, start path animation
    const whenPathStarts =
      traversedTiles.length * traverseDelay +
      (speed === 0.5 ? 150 : speed === 2 ? 400 : 250);

    path.forEach((tile, i) => {
      setTimeout(() => {
        if (isEqual(tile, startTile) || isEqual(tile, endTile)) return;
        const el = document.getElementById(`${tile.row}-${tile.col}`);
        if (!el) return;
        el.className = `${pathTileStyle} ${pathAnimClass}`;
        tile.isPath = true;
      }, whenPathStarts + i * pathDelay);
    });

    // 3) Clean up animation classes after all animations complete
    const lastIndex = Math.max(0, path.length - 1);
    const lastAnimationStart = whenPathStarts + lastIndex * pathDelay;
    const cssPathDuration = speed === 0.5 ? 800 : speed === 2 ? 2800 : 1400; // Updated for new CSS durations
    const buffer = speed === 0.5 ? 200 : speed === 2 ? 500 : 350;

    setTimeout(() => {
      // Remove animation classes and clean up borders
      [...traversedTiles, ...path].forEach((tile) => {
        if (isEqual(tile, startTile) || isEqual(tile, endTile)) return;
        const el = document.getElementById(`${tile.row}-${tile.col}`);
        if (!el) return;

        // Remove animation classes
        el.classList.remove(
          "animate-traversed",
          "animate-path",
          "animate-traversed-fast",
          "animate-traversed-slow",
          "animate-path-fast",
          "animate-path-slow"
        );

        // Clean up borders and apply final styles
        const borderClasses = [];
        if (el.className.includes("border-b")) borderClasses.push("border-b");
        if (el.className.includes("border-l")) borderClasses.push("border-l");

        if (tile.isPath) {
          el.className = `${pathTileStyle} ${borderClasses.join(" ")}`;
        } else if (tile.isTraversed) {
          el.className = `${traversedTileStyle} ${borderClasses.join(" ")}`;
        }
      });

      resolve();
    }, lastAnimationStart + cssPathDuration + buffer);
  });
}
