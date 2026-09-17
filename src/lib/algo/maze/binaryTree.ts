import type { MutableRefObject } from "react";
import { wallTileStyle } from "../../../utils/constants";
import { getRandInt, isEqual, runFrameAnimation, sleep } from "../../../utils/helpers";
import type { GridType, SpeedType, TileType } from "../../../utils/types";

function getSpeed(speedInput: SpeedType | MutableRefObject<SpeedType>): SpeedType {
  return typeof speedInput === "object" && speedInput !== null && "current" in speedInput
    ? speedInput.current
    : speedInput;
}

function setWallTile(
  grid: GridType,
  row: number,
  col: number,
  startTile: TileType,
  endTile: TileType,
  animClass: string,
  numRows: number,
  numCols: number
) {
  if (row < 0 || row >= numRows || col < 0 || col >= numCols) return;
  if (isEqual(grid[row][col], startTile) || isEqual(grid[row][col], endTile))
    return;

  grid[row][col].isWall = true;
  const element = document.getElementById(`${row}-${col}`);
  if (element) {
    const borderB = row === numRows - 1 ? " border-b" : "";
    const borderL = col === 0 ? " border-l" : "";
    element.className = `${wallTileStyle} ${animClass}${borderB}${borderL}`.trim();
  }
}

export const binaryTree = async (
  grid: GridType,
  startTile: TileType,
  endTile: TileType,
  setIsDisabled: (disabled: boolean) => void,
  speed: SpeedType | MutableRefObject<SpeedType>
) => {
  const numRows = grid.length;
  const numCols = grid[0]?.length || 0;

  // 1) Pre-compute the full Binary Tree maze layout in memory
  const isWallMap: boolean[][] = Array.from({ length: numRows }, () =>
    Array(numCols).fill(false)
  );

  // Outer perimeter walls
  for (let c = 0; c < numCols; c++) {
    isWallMap[0][c] = true;
    isWallMap[numRows - 1][c] = true;
  }
  for (let r = 0; r < numRows; r++) {
    isWallMap[r][0] = true;
    isWallMap[r][numCols - 1] = true;
  }

  // Internal junction pillars
  for (let r = 2; r < numRows - 1; r += 2) {
    for (let c = 2; c < numCols - 1; c += 2) {
      isWallMap[r][c] = true;
    }
  }

  // Binary tree carving decisions for each odd room cell (North / East bias)
  for (let r = 1; r < numRows - 1; r += 2) {
    for (let c = 1; c < numCols - 1; c += 2) {
      const isFirstRow = r === 1;
      const isLastCol = c === numCols - 2;

      if (isFirstRow && isLastCol) {
        continue;
      }

      let carveEast: boolean;
      if (isFirstRow) {
        carveEast = true;
      } else if (isLastCol) {
        carveEast = false; // Carve North
      } else {
        carveEast = getRandInt(0, 1) === 1;
      }

      if (carveEast) {
        // Carve East: (r, c + 1) is passage -> (r - 1, c) is wall
        if (r > 1) {
          isWallMap[r - 1][c] = true;
        }
      } else {
        // Carve North: (r - 1, c) is passage -> (r, c + 1) is wall
        if (c + 1 < numCols - 1) {
          isWallMap[r][c + 1] = true;
        }
      }
    }
  }

  // 2) Collect steps for each wall tile with dynamic animation style evaluation
  const steps: (() => void)[] = [];

  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      if (isWallMap[r][c]) {
        const row = r;
        const col = c;
        steps.push(() => {
          const currentSpeed = getSpeed(speed);
          const wallAnimClass =
            currentSpeed === 0.5
              ? "animate-wall-fast"
              : currentSpeed === 2
              ? "animate-wall-slow"
              : "animate-wall";
          setWallTile(grid, row, col, startTile, endTile, wallAnimClass, numRows, numCols);
        });
      }
    }
  }

  // Dynamic live rate getter (ms per wall step)
  const getRate = () => {
    const s = getSpeed(speed);
    return s === 0.5 ? 0.85 : s === 2 ? 2.6 : 1.35;
  };

  await runFrameAnimation(steps, getRate);

  // Buffer for final CSS wall keyframes to complete before React state updates
  const sFinal = getSpeed(speed);
  const cssDuration = sFinal === 0.5 ? 180 : sFinal === 2 ? 600 : 320;
  await sleep(cssDuration);

  setIsDisabled(false);
};
