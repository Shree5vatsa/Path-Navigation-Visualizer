import type { MutableRefObject } from "react";
import { wallTileStyle } from "./constants";
import { isEqual, runFrameAnimation } from "./helpers";
import type { GridType, SpeedType, TileType } from "./types";

function getSpeed(speedInput: SpeedType | MutableRefObject<SpeedType>): SpeedType {
  return typeof speedInput === "object" && speedInput !== null && "current" in speedInput
    ? speedInput.current
    : speedInput;
}

export async function constructBorder(
  grid: GridType,
  startTile: TileType,
  endTile: TileType,
  speed: SpeedType | MutableRefObject<SpeedType> = 1
) {
  const numRows = grid.length;
  const numCols = grid[0]?.length || 0;

  const shape = [
    { row: 0, col: 1 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
    { row: -1, col: 0 },
  ];

  const steps: (() => void)[] = [];
  let row = 0;
  let col = 0;

  for (let i = 0; i < 4; i++) {
    const direction = shape[i];

    while (
      row + direction.row >= 0 &&
      row + direction.row < numRows &&
      col + direction.col >= 0 &&
      col + direction.col < numCols
    ) {
      row += direction.row;
      col += direction.col;

      if (
        !isEqual(grid[row][col], startTile) &&
        !isEqual(grid[row][col], endTile)
      ) {
        const r = row;
        const c = col;
        steps.push(() => {
          grid[r][c].isWall = true;
          const tileElement = document.getElementById(`${r}-${c}`);
          if (tileElement) {
            const currentSpeed = getSpeed(speed);
            const animationClass =
              currentSpeed === 0.5
                ? "animate-wall-fast"
                : currentSpeed === 2
                ? "animate-wall-slow"
                : "animate-wall";
            const borderB = r === numRows - 1 ? " border-b" : "";
            const borderL = c === 0 ? " border-l" : "";
            tileElement.className = `${wallTileStyle} ${animationClass}${borderB}${borderL}`.trim();
          }
        });
      }
    }

    if (row < 0) row = 0;
    if (row >= numRows) row = numRows - 1;
    if (col < 0) col = 0;
    if (col >= numCols) col = numCols - 1;
  }

  // Snappy & smooth border tracing matching algorithm speed
  const getRate = () => {
    const s = getSpeed(speed);
    return s === 0.5 ? 0.6 : s === 2 ? 2.5 : 1.2;
  };
  await runFrameAnimation(steps, getRate);
}


