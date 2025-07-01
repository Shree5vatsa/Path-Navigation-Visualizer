import { SPEED_MULTIPLIERS, tileStyle } from "./constants";
import { sleep } from "./helpers";
import type { GridType, SpeedType } from "./types";

export const destroyWall = async (
  grid: GridType,
  row: number,
  col: number,
  isRight: number,
  speed: SpeedType
) => {
  const delay = SPEED_MULTIPLIERS.WALL_DESTRUCTION[speed];

  if (isRight && grid[row][col + 1]) {
    grid[row][col + 1].isWall = false;
    const element = document.getElementById(`${row}-${col + 1}`);
    if (element) {
      element.className = tileStyle;
    }
    await sleep(delay);
  } else if (grid[row + 1]) {
    grid[row + 1][col].isWall = false;
    const element = document.getElementById(`${row + 1}-${col}`);
    if (element) {
      element.className = tileStyle;
    }
    await sleep(delay);
  } else {
    grid[row][col].isWall = false;
    const element = document.getElementById(`${row}-${col}`);
    if (element) {
      element.className = tileStyle;
    }
    await sleep(delay);
  }
};
