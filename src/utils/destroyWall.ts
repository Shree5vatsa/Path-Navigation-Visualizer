import { SPEED_MULTIPLIERS, tileStyle } from "./constants";
import { sleep } from "./helpers";
import type { GridType, SpeedType } from "./types";

export function restoreTileStyle(el: HTMLElement, animationClass?: string) {
  const borderClasses = [];
  if (el.className.includes("border-b")) borderClasses.push("border-b");
  if (el.className.includes("border-l")) borderClasses.push("border-l");
  const anim = animationClass ? ` ${animationClass}` : "";
  el.className = `${tileStyle}${anim} ${borderClasses.join(" ")}`.trim();
}

export const destroyWallSingle = (
  grid: GridType,
  row: number,
  col: number,
  isRight: number,
  animationClass?: string
) => {
  if (isRight && grid[row]?.[col + 1]) {
    grid[row][col + 1].isWall = false;
    const element = document.getElementById(`${row}-${col + 1}`);
    if (element) {
      restoreTileStyle(element, animationClass);
    }
  } else if (grid[row + 1]?.[col]) {
    grid[row + 1][col].isWall = false;
    const element = document.getElementById(`${row + 1}-${col}`);
    if (element) {
      restoreTileStyle(element, animationClass);
    }
  } else if (grid[row]?.[col]) {
    grid[row][col].isWall = false;
    const element = document.getElementById(`${row}-${col}`);
    if (element) {
      restoreTileStyle(element, animationClass);
    }
  }
};

export const destroyWall = async (
  grid: GridType,
  row: number,
  col: number,
  isRight: number,
  speed: SpeedType
) => {
  destroyWallSingle(grid, row, col, isRight);
  const delay = SPEED_MULTIPLIERS.WALL_DESTRUCTION[speed];
  if (delay > 0) await sleep(delay);
};

