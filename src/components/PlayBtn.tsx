import type { MouseEventHandler } from "react";
import { BsFillPlayFill } from "react-icons/bs";
import { GrPowerReset } from "react-icons/gr";

export function PlayBtn({
    isDisabled,
    isPathNavigated,
    handlerRunVisualizer,
}: {
        isDisabled: boolean;
        isPathNavigated: boolean;
        handlerRunVisualizer:MouseEventHandler<HTMLButtonElement>;
    }) {
    return (
        <button
            disabled={isDisabled}
            onClick={handlerRunVisualizer}
            className="disabled:pointer-events-none disabled:opacity-50 transition ease-in rounded-full p-2.5 shadow-md bg-green-500 hover:bg-green-600 border-none active:ring-green-300 focus:outline-none focus:ring-2 focus:ring-green-300/50"
            >
            {isPathNavigated? <GrPowerReset className="w-5 h-5"/>:<BsFillPlayFill className= "w-5 h-5"/>}
            </button>
    )
}