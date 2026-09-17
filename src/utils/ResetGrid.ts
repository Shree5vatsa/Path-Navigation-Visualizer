import { endTile_config, startTile_config, tileStyle } from "./constants";
import { isEqual } from "./helpers";
import type { GridType, TileType } from "./types";

export const ResetGrid = ({
  grid,
  startTile = startTile_config,
  endTile = endTile_config,
}: {
  grid: GridType;
  startTile?: TileType;
  endTile?: TileType;
}) => {
  const numRows = grid.length;
  const numCols = grid[0]?.length || 0;

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const tile = grid[row][col];
      const isStart = isEqual(startTile, tile);
      tile.distance = isStart ? 0 : Infinity;
      tile.isTraversed = false;
      tile.isPath = false;
      tile.parent = null;
      tile.isWall = false;

      if (!isEqual(startTile, tile) && !isEqual(endTile, tile)) {
        const tileElement = document.getElementById(`${tile.row}-${tile.col}`);

        if (tileElement) {
          const borderB = tile.row === numRows - 1 ? " border-b" : "";
          const borderL = tile.col === 0 ? " border-l" : "";
          tileElement.className = `${tileStyle}${borderB}${borderL}`.trim();
        }
      }
    }
  }
};