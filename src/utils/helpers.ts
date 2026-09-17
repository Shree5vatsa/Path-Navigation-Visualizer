import type { TileType } from "./types";
import type { GridType } from '../utils/types';
import { maxRows, maxCols, startTile_config, endTile_config } from "./constants";
const createRow = (
  row: number,
  cols: number,
  startTile: TileType,
  endTile: TileType
): TileType[] => {
  const currentRow = [];
  for (let col = 0; col < cols; col++) {
    currentRow.push({
      row,
      col,
      isEnd: row === endTile.row && col === endTile.col,
      isWall: false,
      isPath: false,
      distance: Infinity,
      isStart: row === startTile.row && col === startTile.col,
      isTraversed: false,
      parent: null,
    });
  }
  return currentRow;
};

export const createGrid = (
  startTile: TileType = startTile_config,
  endTile: TileType = endTile_config,
  rows: number = maxRows,
  cols: number = maxCols
) => {
  const grid: GridType = [];
  for (let row = 0; row < rows; row++) {
    grid.push(createRow(row, cols, startTile, endTile));
  }
  return grid;
};

export const checkIfStartOrEnd = (
  row: number,
  col: number,
  startTile?: TileType,
  endTile?: TileType
) => {
  if (startTile && row === startTile.row && col === startTile.col) return true;
  if (endTile && row === endTile.row && col === endTile.col) return true;
  return false;
};

export const createNewGrid = (params: { grid: GridType, row: number, col: number }) => {
    const { grid, row, col } = params;
    const newGrid = grid.slice();
    const newTile = {
        ...newGrid[row][col],
        isWall: !newGrid[row][col].isWall,
    };
    newGrid[row][col] = newTile;
    return newGrid;
}

export const isEqual = (t1: TileType, t2: TileType) => {
    return (t1.row === t2.row && t1.col === t2.col);
}

export const isTileSame = (row: number, col: number, tile: TileType) => {
    return row=== tile.row && col === tile.col;
}

export const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export const getRandInt = (min: number, max: number): number => { 
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const checkStack = (tile: TileType, stack: TileType[]): boolean => {
    for (let i = 0; i < stack.length; i++){
        if (isEqual(stack[i], tile)) return true;
    }
    return false;
}

export const dropNeighbourFromQueue = (tile: TileType, queue: TileType[]) => {
    for (let i = 0; i < queue.length; i++){
        if (isEqual(tile, queue[i])) {
            queue.splice(i, 1);
            break;
        }
    }
};

/**
 * Executes a sequence of animation steps smoothly synchronized to the display's refresh rate (60fps/120fps/144fps)
 * using requestAnimationFrame and high-resolution time delta interpolation.
 * Supports dynamic speed getters (e.g. () => msPerStep) so speed can be changed seamlessly mid-animation in real time.
 * Includes background/unfocused tab fallback via real-time timers and visibilitychange listeners so animations
 * never freeze or halt when switching to other apps/windows.
 */
export function runFrameAnimation(
  steps: (() => void)[],
  targetOrRate: number | (() => number)
): Promise<void> {
  if (steps.length === 0) return Promise.resolve();

  return new Promise((resolve) => {
    let currentIndex = 0;
    let lastTime: number | null = null;
    let stepAccumulator = 0;
    let rafId: number | null = null;
    let fallbackTimer: ReturnType<typeof setTimeout> | null = null;
    let isCompleted = false;

    const isDynamicRate = typeof targetOrRate === "function";
    const fixedTargetDuration = typeof targetOrRate === "number" ? targetOrRate : 0;
    const fixedRateMsPerStep =
      fixedTargetDuration > 0 ? fixedTargetDuration / steps.length : 1;

    const cleanup = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      if (fallbackTimer !== null) {
        clearTimeout(fallbackTimer);
        fallbackTimer = null;
      }
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };

    const complete = () => {
      if (isCompleted) return;
      isCompleted = true;
      cleanup();

      // Ensure all remaining steps are executed
      while (currentIndex < steps.length) {
        steps[currentIndex]();
        currentIndex++;
      }

      if (!document.hidden) {
        requestAnimationFrame(() => {
          resolve();
        });
      } else {
        resolve();
      }
    };

    const stepToNow = (now: number) => {
      if (isCompleted) return;
      if (lastTime === null) {
        lastTime = now;
        return;
      }

      const dt = Math.max(0, now - lastTime);
      lastTime = now;

      // Current rate in ms per step (reads dynamic getter live if function is provided)
      const currentMsPerStep = Math.max(
        0.05,
        isDynamicRate ? (targetOrRate as () => number)() : fixedRateMsPerStep
      );

      // Accumulate steps precisely according to frame delta time
      const stepsToAdvance = dt / currentMsPerStep;
      stepAccumulator += stepsToAdvance;

      const targetIndex = Math.min(steps.length, Math.floor(stepAccumulator));
      while (currentIndex < targetIndex) {
        steps[currentIndex]();
        currentIndex++;
      }

      if (currentIndex >= steps.length) {
        complete();
      }
    };

    const frame = (now: number) => {
      if (isCompleted) return;
      stepToNow(now);

      if (!isCompleted) {
        rafId = requestAnimationFrame(frame);
      }
    };

    // Heartbeat fallback: keeps animation advancing in real time even if requestAnimationFrame
    // is throttled/paused by the browser when the tab/window is in the background or unfocused
    const scheduleFallback = () => {
      if (isCompleted) return;
      fallbackTimer = setTimeout(() => {
        if (!isCompleted) {
          stepToNow(performance.now());
          scheduleFallback();
        }
      }, 30);
    };

    const onVisibilityChange = () => {
      if (!isCompleted) {
        stepToNow(performance.now());
        if (!document.hidden && !isCompleted) {
          rafId = requestAnimationFrame(frame);
        }
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    rafId = requestAnimationFrame(frame);
    scheduleFallback();
  });
}