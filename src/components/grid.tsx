import { twMerge } from "tailwind-merge";
import { usePathAlgo } from "../hooks/usePathAlgo";
import { maxCols, maxRows } from "../utils/constants";
import { Tile } from "./tile";
import * as React from "react";
import { checkIfStartOrEnd, createNewGrid } from "../utils/helpers";

export function Grid({
  isNavigationRunningRef,
}: {
  isNavigationRunningRef: React.RefObject<boolean>;
}) {
  const { grid, setGrid } = usePathAlgo();
  const [isMouseDown, setIsMouseDown] = React.useState(false);

  // Block all mouse events if animation is running
  const isBlocked = isNavigationRunningRef.current;

  const handleMouseDown = (row: number, col: number) => {
    if (isBlocked || checkIfStartOrEnd(row, col)) return;
    setIsMouseDown(true);
    const newGrid = createNewGrid({ grid, row, col });
    setGrid(newGrid);
  };

  const handleMouseUp = (row: number, col: number) => {
    if (isBlocked || checkIfStartOrEnd(row, col)) return;
    setIsMouseDown(false);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isBlocked || checkIfStartOrEnd(row, col)) return;
    if (isMouseDown) {
      const newGrid = createNewGrid({ grid, row, col });
      setGrid(newGrid);
    }
  };

  return (
    <div
      className={twMerge(
        "flex items-center flex-col justify-center border-ski-300 mt-10",
        `lg:min-h-[${maxRows * 17}px] md:min-h-[${maxRows * 15}px] xs:min-h-[${
          maxRows * 8
        }px] min-h-[${maxRows * 7}px]`,
        `lg:min-w-[${maxCols * 17}px] md:min-w-[${maxCols * 15}px] xs:min-w-[${
          maxCols * 8
        }px] min-w-[${maxCols * 7}px]`
      )}
      style={isBlocked ? { pointerEvents: "none", opacity: 0.7 } : {}}
    >
      {grid.map((roww, rowIndex) => (
        <div key={rowIndex} className="flex">
          {roww.map((tile, tileIndex) => {
            const { row, col, isEnd, isStart, isWall, isPath, isTraversed } =
              tile;
            return (
              <Tile
                key={tileIndex}
                row={tile.row}
                col={tile.col}
                isStart={isStart}
                isEnd={isEnd}
                isWall={isWall}
                isPath={isPath}
                isTraversed={isTraversed}
                handleMouseDown={() => handleMouseDown(row, col)}
                handleMouseUp={() => handleMouseUp(row, col)}
                handleMouseEnter={() => handleMouseEnter(row, col)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
