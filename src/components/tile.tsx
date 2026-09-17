import { twMerge } from "tailwind-merge";
import {
  endTileStyle,
  pathTileStyle,
  startTileStyle,
  tileStyle,
  traversedTileStyle,
  wallTileStyle,
} from "../utils/constants";

interface MouseFunc {
  (row: number, col: number): void;
}

export function Tile({
  row,
  col,
  isStart,
  isEnd,
  isWall,
  isPath,
  isTraversed,
  isBottomEdge,
  handleMouseDown,
  handleMouseUp,
  handleMouseEnter,
}: {
  row: number;
  col: number;
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
  isPath: boolean;
  isTraversed: boolean;
  isBottomEdge?: boolean;
  handleMouseDown: MouseFunc;
  handleMouseUp: MouseFunc;
  handleMouseEnter: MouseFunc;
}) {
  let tileTypeStyle;

  if (isStart) {
    tileTypeStyle = startTileStyle;
  } else if (isEnd) {
    tileTypeStyle = endTileStyle;
  } else if (isWall) {
    tileTypeStyle = wallTileStyle;
  } else if (isPath) {
    tileTypeStyle = pathTileStyle;
  } else if (isTraversed) {
    tileTypeStyle = traversedTileStyle;
  } else {
    tileTypeStyle = tileStyle;
  }

  const borderStyle = isBottomEdge ? "border-b" : col === 0 ? "border-l" : "";
  const edgeStyle = isBottomEdge && col === 0 ? "border-l" : "";

  return (
    <div
      className={twMerge(tileTypeStyle, borderStyle, edgeStyle)}
      id={`${row}-${col}`}
      onMouseDown={() => handleMouseDown(row, col)}
      onMouseUp={() => handleMouseUp(row, col)}
      onMouseOver={() => handleMouseEnter(row, col)}
    />
  );
}
