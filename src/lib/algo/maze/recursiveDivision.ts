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

export default async function recursiveDivision({
  grid,
  startTile,
  endTile,
  setIsDisabled,
  speed,
}: {
  grid: GridType;
  startTile: TileType;
  endTile: TileType;
  setIsDisabled: (disabled: boolean) => void;
  speed: SpeedType | MutableRefObject<SpeedType>;
}) {
  const numRows = grid.length;
  const numCols = grid[0]?.length || 0;

  const steps: (() => void)[] = [];

  // Helper to record a wall animation step with dynamic speed class
  const addWallStep = (r: number, c: number) => {
    steps.push(() => {
      const currentSpeed = getSpeed(speed);
      const wallAnimClass =
        currentSpeed === 0.5
          ? "animate-wall-fast"
          : currentSpeed === 2
          ? "animate-wall-slow"
          : "animate-wall";
      setWallTile(grid, r, c, startTile, endTile, wallAnimClass, numRows, numCols);
    });
  };

  // 1) Border tracing steps (clockwise: Top -> Right -> Bottom -> Left)
  const shape = [
    { row: 0, col: 1 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
    { row: -1, col: 0 },
  ];

  let borderRow = 0;
  let borderCol = 0;

  for (let i = 0; i < 4; i++) {
    const direction = shape[i];

    while (
      borderRow + direction.row >= 0 &&
      borderRow + direction.row < numRows &&
      borderCol + direction.col >= 0 &&
      borderCol + direction.col < numCols
    ) {
      borderRow += direction.row;
      borderCol += direction.col;

      addWallStep(borderRow, borderCol);
    }

    if (borderRow < 0) borderRow = 0;
    if (borderRow >= numRows) borderRow = numRows - 1;
    if (borderCol < 0) borderCol = 0;
    if (borderCol >= numCols) borderCol = numCols - 1;
  }

  // 2) Recursive chamber division steps
  function divide(
    row: number,
    col: number,
    height: number,
    width: number
  ) {
    if (height < 2 || width < 2) return;

    if (height > width) {
      // Horizontal division line
      const wallRow = row + getRandInt(0, height - 2) * 2 + 1;
      const passageCol = col + getRandInt(0, width - 1) * 2;

      for (let x = 0; x < 2 * width - 1; x++) {
        const curCol = col + x;
        if (curCol === passageCol) continue;

        addWallStep(wallRow, curCol);
      }

      // Recurse top & bottom chambers
      divide(row, col, (wallRow - row + 1) / 2, width);
      divide(wallRow + 1, col, height - (wallRow - row + 1) / 2, width);
    } else {
      // Vertical division line
      const wallCol = col + getRandInt(0, width - 2) * 2 + 1;
      const passageRow = row + getRandInt(0, height - 1) * 2;

      for (let y = 0; y < 2 * height - 1; y++) {
        const curRow = row + y;
        if (curRow === passageRow) continue;

        addWallStep(curRow, wallCol);
      }

      // Recurse left & right chambers
      divide(row, col, height, (wallCol - col + 1) / 2);
      divide(row, wallCol + 1, height, width - (wallCol - col + 1) / 2);
    }
  }

  divide(
    1,
    1,
    Math.floor((numRows - 1) / 2),
    Math.floor((numCols - 1) / 2)
  );

  // 3) Dynamic live rate getter (ms per step) - tailored for educational clarity
  const getRate = () => {
    const s = getSpeed(speed);
    return s === 0.5 ? 0.85 : s === 2 ? 6.5 : 3.2;
  };

  await runFrameAnimation(steps, getRate);

  // Buffer for final CSS wall keyframes to complete before React state updates
  const sFinal = getSpeed(speed);
  const cssDuration = sFinal === 0.5 ? 180 : sFinal === 2 ? 700 : 380;
  await sleep(cssDuration);

  setIsDisabled(false);
}
