import { useContext } from "react";
import { TileContext } from "../context/TileContext";

export const useTile = () => {
    const Context = useContext(TileContext);
    if (!Context) {
        throw new Error("useTile must be used within a TileProvider");
    }
    return Context;
}