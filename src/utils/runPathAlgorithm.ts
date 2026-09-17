// src/utils/runPathAlgorithm.ts
import type { MutableRefObject } from "react";
import { aStar } from "../lib/algo/pathnavigating/aStar";
import { bfs } from "../lib/algo/pathnavigating/bfs";
import { dfs } from "../lib/algo/pathnavigating/dfs";
import { dijkstra } from "../lib/algo/pathnavigating/dijkstra";
import { animatePath } from "./animatePath";
import type { AlgorithmType, GridType, SpeedType, TileType } from "./types";

/**
 * Runs the selected pathfinding algorithm, animates its traversal+path,
 * and only resolves once *all* CSS animations have finished.
 */
export async function runPathAlgorithm({
  algorithm,
  grid,
  startTile,
  endTile,
  speed,
}: {
  algorithm: AlgorithmType;
  grid: GridType;
  startTile: TileType;
  endTile: TileType;
  speed: SpeedType | MutableRefObject<SpeedType>;
}): Promise<{
  pathFound: boolean;
  pathLength: number;
  traversedCount: number;
}> {
  let result: { traversedTiles: TileType[]; path: TileType[] } | null = null;

  switch (algorithm) {
    case "BFS":
      result = bfs(grid, startTile, endTile);
      break;
    case "DFS":
      result = dfs(grid, startTile, endTile);
      break;
    case "Dijkstra":
      result = dijkstra(grid, startTile, endTile);
      break;
    case "AStar":
      result = aStar(grid, startTile, endTile);
      break;
    default:
      result = bfs(grid, startTile, endTile);
  }

  if (!result) return { pathFound: false, pathLength: 0, traversedCount: 0 };
  const { traversedTiles, path } = result;

  // This Promise only resolves after the last CSS animation ends
  await animatePath(traversedTiles, path, startTile, endTile, speed);

  const pathFound = path.length > 0;
  const pathLength = pathFound ? Math.max(0, path.length - 1) : 0;
  const traversedCount = traversedTiles.length;
  return { pathFound, pathLength, traversedCount };
}


