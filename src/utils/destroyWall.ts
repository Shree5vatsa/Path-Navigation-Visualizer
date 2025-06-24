import { SPEEDS, tileStyle } from "./constants";
import { sleep } from "./helpers";
import type { GridType, SpeedType } from "./types";


export const destroyWall = async (
  grid: GridType,
  row: number,
  col: number,
  isRight: number,
  speed: SpeedType
) => {
  if (isRight && grid[row][col + 1]) {
    grid[row][col + 1].isWall = false;
    document.getElementById(`${row}-${col + 1}`)!.className = tileStyle;
    await sleep(20 * SPEEDS.find((s) => s.value === speed)!.value - 5);
  } else if (grid[row + 1]) {
    grid[row + 1][col].isWall = false;
    document.getElementById(`${row + 1}-${col}`)!.className = tileStyle;
    await sleep(20 * SPEEDS.find((s) => s.value === speed)!.value - 5);
  } else {
    grid[row][col].isWall = false;
    document.getElementById(`${row}-${col}`)!.className = tileStyle;
    await sleep(20 * SPEEDS.find((s) => s.value === speed)!.value - 5);
  }
};
