import { twMerge } from "tailwind-merge";
import { usePathAlgo } from "../hooks/usePathAlgo";
import { maxCols, maxRows } from "../utils/constants";
import { Tile } from "./tile";
import * as React from "react";
import { checkIfStartOrEnd, createNewGrid } from "../utils/helpers";

export function Grid({isNavigationRunningRef,}: {isNavigationRunningRef: React.RefObject<boolean>;}) {
  // Using custom hook to access path algorithm context
  // This hook provides access to the grid and other pathfinding algorithm related state
  // and functions.
  const { grid, setGrid } = usePathAlgo();

  const [isMouseDown, setIsMouseDown] = React.useState(false);

  const handleMouseDown = (row: number, col: number) => {
    if (isNavigationRunningRef.current || checkIfStartOrEnd(row, col)) return;
    setIsMouseDown(true);
    const newGrid = createNewGrid({ grid, row, col });
    setGrid(newGrid);
  };

  const handleMouseUp = (row: number, col: number) => {
    if (isNavigationRunningRef.current || checkIfStartOrEnd(row, col)) return;
    setIsMouseDown(false);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isNavigationRunningRef.current || checkIfStartOrEnd(row, col)) return;
    if (isMouseDown) {
      const newGrid = createNewGrid({ grid, row, col });
      setGrid(newGrid);
    }
  };
  return (
    <div
      className={twMerge(
        //BASE CLASS
        "flex items-center flex-col justify-center border-ski-300 mt-10",
        //control height
        `lg:min-h-[${maxRows * 17}px] md:min-h-[${maxRows * 15}px] xs:min-h-[${
          maxRows * 8
        }px] min-h-[${maxRows * 7}px]`,
        //control width
        `lg:min-w-[${maxCols * 17}px] md:min-w-[${maxCols * 15}px] xs:min-w-[${
          maxCols * 8
        }px] min-w-[${maxCols * 7}px]`
      )}
    >
      {grid.map((roww, rowIndex) => (
        <div key={rowIndex} className="flex">
          {roww.map((tile, tileIndex) => {
            const { row, col, isEnd, isStart, isWall, isPath, isTraversed } =
              tile; //destructuring tile properties
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
