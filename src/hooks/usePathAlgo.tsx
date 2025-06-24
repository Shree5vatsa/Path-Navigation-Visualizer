import { useContext } from "react";
import { PathAlgoContext } from "../context/PathAlgoContext";

export const usePathAlgo = () => {
    const Context = useContext(PathAlgoContext);
    if (!Context) {
        throw new Error("usePathAlgo must be used within a PathAlgoProvider");
    }
    return Context;
}