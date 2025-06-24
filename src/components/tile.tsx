import { twMerge } from "tailwind-merge";
import { endTileStyle, maxRows, pathTileStyle, startTileStyle, tileStyle, traversedTileStyle, wallTileStyle } from "../utils/constants";


interface MouseFunc{
    (row:number, col:number): void;
}

export function Tile({
    row,
    col,
    isStart,
    isEnd,
    isWall,
    isPath,
    isTraversed,
    handleMouseDown,
    handleMouseUp,          
    handleMouseEnter
}: {
    row: number;
    col: number;
    isStart: boolean;
    isEnd: boolean;
    isWall: boolean;
    isPath: boolean;
    isTraversed: boolean;
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
    const borderStyle = row === maxRows - 1 ? 'border-b' : col === 0 ? 'border-l' : ''
    
    const edgeSyle = row === maxRows - 1 && col === 0 ? 'border-l' : ''

    return (
      <div
        className={twMerge(tileTypeStyle, borderStyle, edgeSyle)}
        id={`${row}-${col}`}
        onMouseDown={() => handleMouseDown(row, col)}
        onMouseUp={() => handleMouseUp(row, col)}
        onMouseEnter={() => handleMouseEnter(row, col)}
      />
    );
}
    
