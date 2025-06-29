// src/utils/runPathAlgorithm.ts
import { bfs } from "../lib/algo/pathnavigating/bfs";
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
  speed: SpeedType;
}): Promise<void> {
  let result: { traversedTiles: TileType[]; path: TileType[] } | null = null;

  switch (algorithm) {
    case "BFS":
      result = bfs(grid, startTile, endTile);
      break;
    // case "Dijkstra":
    //   result = dijkstra(grid, startTile, endTile);
    //   break;
    // case "AStar":
    //   result = aStar(grid, startTile, endTile);
    //   break;
    // case "DFS":
    //   result = dfs(grid, startTile, endTile);
    //   break;
    default:
      result = bfs(grid, startTile, endTile);
  }

  if (!result) return;
  const { traversedTiles, path } = result;

  // This Promise only resolves after the last CSS animation ends
  await animatePath(traversedTiles, path, startTile, endTile, speed);
}
