import { twMerge } from "tailwind-merge";
import { usePathAlgo } from "../hooks/usePathAlgo";
import { useTile } from "../hooks/useTile";
import { wallTileStyle, tileStyle } from "../utils/constants";
import { Tile } from "./tile";
import { useRef, useState, type MutableRefObject } from "react";
import { checkIfStartOrEnd } from "../utils/helpers";

function getTileIndicesFromPoint(
  clientX: number,
  clientY: number,
  numRows: number,
  numCols: number
): { row: number; col: number } | null {
  const el = document.elementFromPoint(clientX, clientY);
  if (!el || !(el instanceof HTMLElement)) return null;
  const [row, col] = el.id.split("-").map(Number);
  return !isNaN(row) &&
    !isNaN(col) &&
    row >= 0 &&
    row < numRows &&
    col >= 0 &&
    col < numCols
    ? { row, col }
    : null;
}

function interpolateTiles(
  from: { row: number; col: number },
  to: { row: number; col: number }
) {
  const tiles: { row: number; col: number }[] = [];
  const dr = to.row - from.row,
    dc = to.col - from.col;
  const steps = Math.max(Math.abs(dr), Math.abs(dc));
  for (let i = 1; i <= steps; i++) {
    tiles.push({
      row: Math.round(from.row + (dr * i) / steps),
      col: Math.round(from.col + (dc * i) / steps),
    });
  }
  return tiles;
}

export function Grid({
  isNavigationRunningRef,
}: {
  isNavigationRunningRef: MutableRefObject<boolean>;
}) {
  const { grid, setGrid } = usePathAlgo();
  const { startTile, endTile } = useTile();
  const [isMouseDown, setIsMouseDown] = useState(false);
  const lastTileRef = useRef<{ row: number; col: number } | null>(null);
  const wallSetRef = useRef<Set<string>>(new Set());
  const dragActionRef = useRef<"wall" | "normal" | null>(null);

  const numRows = grid.length;
  const numCols = grid[0]?.length || 0;

  // If navigation is running, we block *all* pointer events on the wrapper DIV
  const wrapperPointerClass = isNavigationRunningRef.current
    ? "pointer-events-none"
    : "";

  const handleGridMouseDown = (e: React.MouseEvent) => {
    if (isNavigationRunningRef.current) return;
    const indices = getTileIndicesFromPoint(e.clientX, e.clientY, numRows, numCols);
    if (!indices || checkIfStartOrEnd(indices.row, indices.col, startTile, endTile)) return;
    setIsMouseDown(true);
    lastTileRef.current = indices;
    wallSetRef.current.clear();
    const el = document.getElementById(`${indices.row}-${indices.col}`);
    const isWall = el?.className.includes("bg-gray-300");
    dragActionRef.current = isWall ? "normal" : "wall";
    drawToggle(indices.row, indices.col);
  };

  const handleGridMouseUp = () => {
    if (isNavigationRunningRef.current) return;
    setIsMouseDown(false);
    lastTileRef.current = null;
    dragActionRef.current = null;
    // sync DOM→state
    const newGrid = grid.map((row) =>
      row.map((tile) => {
        const el = document.getElementById(`${tile.row}-${tile.col}`);
        return {
          ...tile,
          isWall: el?.className.includes("bg-gray-300") ?? false,
        };
      })
    );
    setGrid(newGrid);
  };

  function drawToggle(row: number, col: number) {
    const key = `${row}-${col}`;
    if (wallSetRef.current.has(key)) return;
    wallSetRef.current.add(key);
    if (checkIfStartOrEnd(row, col, startTile, endTile)) return;
    const el = document.getElementById(key);
    if (!el) return;
    const borderB = row === numRows - 1 ? " border-b" : "";
    const borderL = col === 0 ? " border-l" : "";
    if (dragActionRef.current === "wall") {
      el.className = `${wallTileStyle}${borderB}${borderL}`.trim();
    } else {
      el.className = `${tileStyle}${borderB}${borderL}`.trim();
    }
  }

  const handleGridMouseMove = (e: React.MouseEvent) => {
    if (isNavigationRunningRef.current || !isMouseDown) return;
    const indices = getTileIndicesFromPoint(e.clientX, e.clientY, numRows, numCols);
    if (!indices || checkIfStartOrEnd(indices.row, indices.col, startTile, endTile)) return;
    const last = lastTileRef.current;
    if (!last || (last.row === indices.row && last.col === indices.col)) return;
    for (const tile of interpolateTiles(last, indices)) {
      drawToggle(tile.row, tile.col);
    }
    lastTileRef.current = indices;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isNavigationRunningRef.current || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const indices = getTileIndicesFromPoint(touch.clientX, touch.clientY, numRows, numCols);
    if (!indices || checkIfStartOrEnd(indices.row, indices.col, startTile, endTile)) return;
    setIsMouseDown(true);
    lastTileRef.current = indices;
    wallSetRef.current.clear();
    const el = document.getElementById(`${indices.row}-${indices.col}`);
    const isWall = el?.className.includes("bg-gray-300");
    dragActionRef.current = isWall ? "normal" : "wall";
    drawToggle(indices.row, indices.col);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isNavigationRunningRef.current || !isMouseDown || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const indices = getTileIndicesFromPoint(touch.clientX, touch.clientY, numRows, numCols);
    if (!indices || checkIfStartOrEnd(indices.row, indices.col, startTile, endTile)) return;
    const last = lastTileRef.current;
    if (!last || (last.row === indices.row && last.col === indices.col)) return;
    for (const tile of interpolateTiles(last, indices)) {
      drawToggle(tile.row, tile.col);
    }
    lastTileRef.current = indices;
  };

  const handleTouchEnd = () => {
    if (isNavigationRunningRef.current) return;
    handleGridMouseUp();
  };

  return (
    <div
      className={twMerge(
        "inline-flex flex-col m-auto shadow-2xl rounded-sm border border-sky-400/30 bg-gray-950/80 backdrop-blur-sm select-none",
        wrapperPointerClass
      )}
      onMouseDown={handleGridMouseDown}
      onMouseUp={handleGridMouseUp}
      onMouseLeave={handleGridMouseUp}
      onMouseMove={handleGridMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {grid.map((row, r) => (
        <div key={r} className="flex">
          {row.map((tile, c) => (
            <Tile
              key={c}
              row={tile.row}
              col={tile.col}
              isEnd={tile.isEnd}
              isStart={tile.isStart}
              isPath={tile.isPath}
              isTraversed={tile.isTraversed}
              isWall={tile.isWall}
              isBottomEdge={r === numRows - 1}
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
