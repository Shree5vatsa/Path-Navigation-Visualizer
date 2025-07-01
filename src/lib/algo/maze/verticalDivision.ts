// src/lib/algo/maze/verticalDivision.ts
import { SPEED_MULTIPLIERS, wallTileStyle } from "../../../utils/constants";
import { getRandInt, isEqual, sleep } from "../../../utils/helpers";
import type { GridType, SpeedType, TileType } from "../../../utils/types";
import recursiveDivision from "./recursiveDivision";

export async function verticalDivision({
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
  const delay = SPEED_MULTIPLIERS.WALL_DESTRUCTION[speed] * 0.5;
  const animationClass =
    speed === 0.5
      ? "animate-wall-fast"
      : speed === 2
      ? "animate-wall-slow"
      : "animate-wall";

  // choose a wall‐column at an odd offset
  const wallCol = col + getRandInt(0, width - 2) * 2 + 1;
  // choose exactly one row (even offset) to leave open
  const passageRow = row + getRandInt(0, height - 1) * 2;

  // build the wall top→bottom
  for (let y = 0; y < 2 * height - 1; y++) {
    const r = row + y;
    if (r === passageRow) continue;
    if (
      !isEqual(grid[r][wallCol], startTile) &&
      !isEqual(grid[r][wallCol], endTile)
    ) {
      grid[r][wallCol].isWall = true;
      const element = document.getElementById(`${r}-${wallCol}`);
      if (element) {
        element.className = `${wallTileStyle} ${animationClass}`;
      }
      await sleep(delay);
    }
  }

  // split left region
  await recursiveDivision({
    grid,
    startTile,
    endTile,
    row,
    col,
    height,
    width: (wallCol - col + 1) / 2,
    setIsDisabled,
    speed,
  });
  // split right region
  await recursiveDivision({
    grid,
    startTile,
    endTile,
    row,
    col: wallCol + 1,
    height,
    width: width - (wallCol - col + 1) / 2,
    setIsDisabled,
    speed,
  });
}
