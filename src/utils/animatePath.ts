// src/utils/animatePath.ts
import {
  SLEEP_TIME,
  extendedSLEEP_TIME,
  SPEEDS,
  traversedTileStyle,
  pathTileStyle,
} from "./constants";
import { isEqual } from "./helpers";
import type { SpeedType, TileType } from "./types";

/**
 * Animate BFS traversal and final path with pop‑in scales.
 * Returns a Promise that resolves only after ALL CSS animations complete
 * (including the 1.5s path animation).
 */
export function animatePath(
  traversedTiles: TileType[],
  path: TileType[],
  startTile: TileType,
  endTile: TileType,
  speed: SpeedType
): Promise<void> {
  const speedVal = SPEEDS.find((s) => s.value === speed)!.value;
  const traverseDelay = SLEEP_TIME * speedVal;
  const pathDelay = extendedSLEEP_TIME * speedVal;

  // 1) Kick off BFS traversal “pop” animations
  traversedTiles.forEach((tile, i) => {
    setTimeout(() => {
      if (isEqual(tile, startTile) || isEqual(tile, endTile)) return;
      const el = document.getElementById(`${tile.row}-${tile.col}`);
      if (!el) return;
      el.className = `${traversedTileStyle} animate-traversed`;
    }, i * traverseDelay);
  });

  // 2) Schedule final path “pop” animations
  const whenPathStarts = traversedTiles.length * traverseDelay + 50;
  path.forEach((tile, i) => {
    setTimeout(() => {
      if (isEqual(tile, startTile) || isEqual(tile, endTile)) return;
      const el = document.getElementById(`${tile.row}-${tile.col}`);
      if (!el) return;
      el.className = `${pathTileStyle} animate-path`;
    }, whenPathStarts + i * pathDelay);
  });

  // 3) Return a promise that resolves after the last CSS animation ends
  const lastIndex = path.length - 1;
  const lastAnimationStart = whenPathStarts + lastIndex * pathDelay;
  const cssPathDuration = 1500; // matches "1.5s" in your CSS
  const buffer = 100; // small extra buffer

  return new Promise((resolve) => {
    setTimeout(resolve, lastAnimationStart + cssPathDuration + buffer);
  });
}
