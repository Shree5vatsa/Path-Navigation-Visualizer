import type { MutableRefObject } from "react";
import {
  traversedTileStyle,
  pathTileStyle,
} from "./constants";
import { isEqual, runFrameAnimation, sleep } from "./helpers";
import type { SpeedType, TileType } from "./types";

function getSpeed(speedInput: SpeedType | MutableRefObject<SpeedType>): SpeedType {
  return typeof speedInput === "object" && speedInput !== null && "current" in speedInput
    ? speedInput.current
    : speedInput;
}

/**
 * Animate pathfinding traversal and final path with continuous 60fps/120fps stream.
 * Supports live mid-animation speed changes via dynamic speed getters.
 */
export async function animatePath(
  traversedTiles: TileType[],
  path: TileType[],
  startTile: TileType,
  endTile: TileType,
  speed: SpeedType | MutableRefObject<SpeedType>
): Promise<void> {
  // Reset tile traversal states first
  for (let i = 0; i < traversedTiles.length; i++) {
    traversedTiles[i].isTraversed = false;
    traversedTiles[i].isPath = false;
  }
  for (let i = 0; i < path.length; i++) {
    path[i].isTraversed = false;
    path[i].isPath = false;
  }

  // 1) Build step callbacks for every single traversed tile
  const traversalSteps: (() => void)[] = [];
  for (let i = 0; i < traversedTiles.length; i++) {
    const tile = traversedTiles[i];
    if (isEqual(tile, startTile) || isEqual(tile, endTile)) continue;

    traversalSteps.push(() => {
      const el = document.getElementById(`${tile.row}-${tile.col}`);
      if (!el) return;
      const currentSpeed = getSpeed(speed);
      const animClass =
        currentSpeed === 0.5
          ? "animate-traversed-fast"
          : currentSpeed === 2
          ? "animate-traversed-slow"
          : "animate-traversed";
      const borderB = el.className.includes("border-b") ? " border-b" : "";
      const borderL = el.className.includes("border-l") ? " border-l" : "";
      el.className = `${traversedTileStyle} ${animClass}${borderB}${borderL}`.trim();
      tile.isTraversed = true;
    });
  }

  // Dynamic live rate getter (ms per node)
  const getTraversalRate = () => {
    const s = getSpeed(speed);
    return s === 0.5 ? 2.5 : s === 2 ? 18 : 7;
  };

  // Run continuous stream with live rate adaptation
  await runFrameAnimation(traversalSteps, getTraversalRate);

  // If no path was found, wait for final CSS keyframe to complete and exit
  if (path.length === 0) {
    const s = getSpeed(speed);
    const cssFinishWait = s === 0.5 ? 250 : s === 2 ? 800 : 450;
    await sleep(cssFinishWait);
    return;
  }

  // Smooth breath before path discovery
  const sAfterTraversal = getSpeed(speed);
  const pathPause = sAfterTraversal === 0.5 ? 80 : sAfterTraversal === 2 ? 300 : 160;
  await sleep(pathPause);

  // 2) Build step callbacks for every path tile
  const pathSteps: (() => void)[] = [];
  for (let i = 0; i < path.length; i++) {
    const tile = path[i];
    if (isEqual(tile, startTile) || isEqual(tile, endTile)) continue;

    pathSteps.push(() => {
      const el = document.getElementById(`${tile.row}-${tile.col}`);
      if (!el) return;
      const currentSpeed = getSpeed(speed);
      const animClass =
        currentSpeed === 0.5
          ? "animate-path-fast"
          : currentSpeed === 2
          ? "animate-path-slow"
          : "animate-path";
      const borderB = el.className.includes("border-b") ? " border-b" : "";
      const borderL = el.className.includes("border-l") ? " border-l" : "";
      el.className = `${pathTileStyle} ${animClass}${borderB}${borderL}`.trim();
      tile.isPath = true;
    });
  }

  const getPathRate = () => {
    const s = getSpeed(speed);
    return s === 0.5 ? 6 : s === 2 ? 30 : 14;
  };

  await runFrameAnimation(pathSteps, getPathRate);

  // Buffer for final path keyframes to complete before unlocking
  const sFinal = getSpeed(speed);
  const cssPathDuration = sFinal === 0.5 ? 300 : sFinal === 2 ? 1100 : 600;
  await sleep(cssPathDuration);
}

