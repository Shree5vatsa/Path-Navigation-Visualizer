import type { MutableRefObject } from "react";
import { binaryTree } from "../lib/algo/maze/binaryTree";
import recursiveDivision from "../lib/algo/maze/recursiveDivision";
import type { MazeType, GridType, TileType, SpeedType } from "./types";

export const runMazeAlgo = async ({
  maze,
  grid,
  startTile,
  endTile,
  setIsDisabled,
  speed,
}: {
  maze: MazeType;
  grid: GridType;
  startTile: TileType;
  endTile: TileType;
  setIsDisabled: (isDisabled: boolean) => void;
  speed: SpeedType | MutableRefObject<SpeedType>;
}) => {
  if (maze === "BINARY_TREE") {
    await binaryTree(grid, startTile, endTile, setIsDisabled, speed);
  } else if (maze === "RECURSIVE_DIVISION") {
    await recursiveDivision({
      grid,
      startTile,
      endTile,
      setIsDisabled,
      speed,
    });
  }
};
