import type { GridType, SpeedType, TileType } from "../../../utils/types";
import { horizontalDivision } from "./horizontalDivision";
import { verticalDivision } from "./verticalDivision";

export default async function recursiveDivision({
    grid,
    startTile,
    endTile,
    row,
    col,
    height,
    width,
    setIsDisabled,
    speed
}: {
        grid: GridType;
        startTile: TileType;
        endTile: TileType;
        row: number;
        col: number;
        height: number;
        width: number;
        setIsDisabled: (disabled: boolean) => void;
        speed: SpeedType;
    }) {
    if (height <= 1 || width <= 1) return;
    
    if (height > width) {
        await horizontalDivision({//if h>w, divide horizontally
            grid,
            startTile,
            endTile,
            row,
            col,
            height,
            width,
            setIsDisabled,
            speed
        });
    } else {
        await verticalDivision({//if w>h, divide vertically
            grid,
            startTile,
            endTile,
            row,
            col,
            height,
            width,
            setIsDisabled,
            speed
        });
        
    }
}