import { twMerge } from "tailwind-merge";
import { usePathAlgo } from "../hooks/usePathAlgo";
import { maxCols, maxRows } from "../utils/constants";
import { Tile } from "./tile";
import { useRef, useState, type MutableRefObject } from "react";
import { checkIfStartOrEnd, createNewGrid } from "../utils/helpers";

function getTileIndices(e: React.MouseEvent): { row: number; col: number } | null {
  const el = document.elementFromPoint(e.clientX, e.clientY);
  if (!el || !(el instanceof HTMLElement)) return null;
  const [row, col] = el.id.split("-").map(Number);
  return !isNaN(row) && !isNaN(col) && row >= 0 && row < maxRows && col >= 0 && col < maxCols
    ? { row, col }
    : null;
}

function interpolateTiles(from: { row: number; col: number }, to: { row: number; col: number }) {
  const tiles = [];
  const dr = to.row - from.row, dc = to.col - from.col, steps = Math.max(Math.abs(dr), Math.abs(dc));
  for (let i = 1; i <= steps; i++)
    tiles.push({
      row: Math.round(from.row + (dr * i) / steps),
      col: Math.round(from.col + (dc * i) / steps),
    });
  return tiles;
}

export function Grid({ isNavigationRunningRef }: { isNavigationRunningRef: MutableRefObject<boolean> }) {
  const { grid, setGrid } = usePathAlgo();
  const [isMouseDown, setIsMouseDown] = useState(false);
  const lastTileRef = useRef<{ row: number; col: number } | null>(null);

  const handleGridMouseDown = (e: React.MouseEvent) => {
    if (isNavigationRunningRef.current) return;
    const indices = getTileIndices(e);
    if (!indices || checkIfStartOrEnd(indices.row, indices.col)) return;
    setIsMouseDown(true);
    lastTileRef.current = indices;
    setGrid(createNewGrid({ grid, row: indices.row, col: indices.col }));
  };

  const handleGridMouseUp = () => {
    setIsMouseDown(false);
    lastTileRef.current = null;
  };

  const handleGridMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || isNavigationRunningRef.current) return;
    const indices = getTileIndices(e);
    if (!indices || checkIfStartOrEnd(indices.row, indices.col)) return;
    const last = lastTileRef.current;
    if (!last || (last.row === indices.row && last.col === indices.col)) return;
    let newGrid = grid;
    for (const tile of interpolateTiles(last, indices))
      if (!checkIfStartOrEnd(tile.row, tile.col))
        newGrid = createNewGrid({ grid: newGrid, row: tile.row, col: tile.col });
    setGrid(newGrid);
    lastTileRef.current = indices;
  };

  return (
    <div
      className={twMerge(
        "flex items-center flex-col justify-center border-sky-300 mt-10",
        `lg:min-h-[${maxRows * 22}px] md:min-h-[${maxRows * 18}px] xs:min-h-[${maxRows * 11}px] min-h-[${maxRows * 9}px]`,
        `lg:w-[${maxCols * 22}px] md:w-[${maxCols * 18}px] xs:w-[${maxCols * 11}px] w-[${maxCols * 9}px]`
      )}
      onMouseDown={handleGridMouseDown}
      onMouseUp={handleGridMouseUp}
      onMouseLeave={handleGridMouseUp}
      onMouseMove={handleGridMouseMove}
    >
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((tile, tileIndex) => (
            <Tile
              key={tileIndex}
              row={tile.row}
              col={tile.col}
              isEnd={tile.isEnd}
              isStart={tile.isStart}
              isPath={tile.isPath}
              isTraversed={tile.isTraversed}
              isWall={tile.isWall}
              handleMouseDown={() => {}}
              handleMouseUp={() => {}}
              handleMouseEnter={() => {}}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
