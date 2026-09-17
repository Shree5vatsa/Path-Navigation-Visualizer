import { wallTileStyle } from "../../../utils/constants";
import { getRandInt, isEqual } from "../../../utils/helpers";
import type { GridType, TileType } from "../../../utils/types";

export function addVerticalDivisionSteps({
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
  const wallCol = col + getRandInt(0, width - 2) * 2 + 1;
  const passageRow = row + getRandInt(0, height - 1) * 2;

  for (let y = 0; y < 2 * height - 1; y++) {
    const curRow = row + y;
    if (curRow === passageRow) continue;
    if (
      !isEqual(grid[curRow][wallCol], startTile) &&
      !isEqual(grid[curRow][wallCol], endTile)
    ) {
      const curR = curRow;
      const curC = wallCol;
      steps.push(() => {
        grid[curR][curC].isWall = true;
        const element = document.getElementById(`${curR}-${curC}`);
        if (element) {
          const borderB = curR === numRows - 1 ? " border-b" : "";
          const borderL = wallCol === 0 ? " border-l" : "";
          element.className = `${wallTileStyle} ${animClass}${borderB}${borderL}`.trim();
        }
      });
    }
  }

  return { wallCol };
}
