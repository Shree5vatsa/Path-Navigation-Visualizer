// src/lib/algo/maze/horizontalDivision.ts
import { SPEEDS, wallTileStyle } from "../../../utils/constants";
import { getRandInt, isEqual, sleep } from "../../../utils/helpers";
import type { GridType, SpeedType, TileType } from "../../../utils/types";
import recursiveDivision from "./recursiveDivision";

export async function horizontalDivision({
  grid,
  startTile,
  endTile,
  row,
  col,
  height,
  width,
  setIsDisabled,
  speed,
}: {
  grid: GridType;
  startTile: TileType;
  endTile: TileType;
  row: number;
  col: number;
  height: number;
  width: number;
  setIsDisabled: (d: boolean) => void;
  speed: SpeedType;
}) {
  // choose a wall-row at an odd offset
  const wallRow = row + getRandInt(0, height - 2) * 2 + 1;
  // choose exactly one column (even offset) to leave open
  const passageCol = col + getRandInt(0, width - 1) * 2;

  // build the wall left→right
  for (let x = 0; x < 2 * width - 1; x++) {
    const c = col + x;
    if (c === passageCol) continue;
    if (
      !isEqual(grid[wallRow][c], startTile) &&
      !isEqual(grid[wallRow][c], endTile)
    ) {
      grid[wallRow][c].isWall = true;
      document.getElementById(
        `${wallRow}-${c}`
      )!.className = `${wallTileStyle} animate-wall`;
      await sleep(10 * SPEEDS.find((s) => s.value === speed)!.value - 5);
    }
  }

  // split top region
  await recursiveDivision({
    grid,
    startTile,
    endTile,
    row,
    col,
    height: (wallRow - row + 1) / 2,
    width,
    setIsDisabled,
    speed,
  });
  // split bottom region
  await recursiveDivision({
    grid,
    startTile,
    endTile,
    row: wallRow + 1,
    col,
    height: height - (wallRow - row + 1) / 2,
    width,
    setIsDisabled,
    speed,
  });
}
