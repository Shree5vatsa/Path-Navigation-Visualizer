import { wallTileStyle } from "../../../utils/constants";
import { getRandInt, isEqual } from "../../../utils/helpers";
import type { GridType, TileType } from "../../../utils/types";

export function addHorizontalDivisionSteps({
  grid,
  startTile,
  endTile,
  row,
  col,
  height,
  width,
  animClass,
  steps,
}: {
  grid: GridType;
  startTile: TileType;
  endTile: TileType;
  row: number;
  col: number;
  height: number;
  width: number;
  animClass: string;
  steps: (() => void)[];
}) {
  const numRows = grid.length;
  const wallRow = row + getRandInt(0, height - 2) * 2 + 1;
  const passageCol = col + getRandInt(0, width - 1) * 2;

  for (let x = 0; x < 2 * width - 1; x++) {
    const curCol = col + x;
    if (curCol === passageCol) continue;
    if (
      !isEqual(grid[wallRow][curCol], startTile) &&
      !isEqual(grid[wallRow][curCol], endTile)
    ) {
      const curR = wallRow;
      const curC = curCol;
      steps.push(() => {
        grid[curR][curC].isWall = true;
        const element = document.getElementById(`${curR}-${curC}`);
        if (element) {
          const borderB = curR === numRows - 1 ? " border-b" : "";
          const borderL = curC === 0 ? " border-l" : "";
          element.className = `${wallTileStyle} ${animClass}${borderB}${borderL}`.trim();
        }
      });
    }
  }

  return { wallRow };
}
