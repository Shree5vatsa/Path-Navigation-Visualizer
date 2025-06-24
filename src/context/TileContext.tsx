import { createContext, useState, type ReactNode } from "react";
import type { TileType } from "../utils/types";
import { endTile_config, startTile_config } from "../utils/constants";


interface TileContextInterface{
    startTile: TileType;
    setStartTile: (startTile: TileType) => void;
    endTile: TileType;
    setEndTile: (endTile: TileType) => void;
}

export const TileContext = createContext<TileContextInterface | undefined>(undefined);

export const TileProvider = ({ children }: { children: ReactNode }) => {
    const [startTile, setStartTile] = useState<TileType>(startTile_config);
    const [endTile, setEndTile] = useState<TileType>(endTile_config);

    return (
        <TileContext.Provider value={{ startTile, setStartTile, endTile, setEndTile }}>
            {children}
        </TileContext.Provider>
    )

}
