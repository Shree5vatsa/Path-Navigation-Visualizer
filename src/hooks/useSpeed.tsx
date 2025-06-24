import { useContext } from "react";
import { SpeedContext } from "../context/SpeedContext";

export const useSpeed = () => {
    const Context = useContext(SpeedContext);
    if (!Context) {
        throw new Error("useSpeed must be used within a SpeedProvider");
    }
    return Context;
}