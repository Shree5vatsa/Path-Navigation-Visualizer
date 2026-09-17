import { createContext, useRef, useState, type ReactNode, type MutableRefObject } from "react";
import type { SpeedType } from "../utils/types";

export interface SpeedContextInterface {
  speed: SpeedType;
  setSpeed: (speed: SpeedType) => void;
  speedRef: MutableRefObject<SpeedType>;
}

export const SpeedContext = createContext<SpeedContextInterface | undefined>(undefined);

export const SpeedProvider = ({ children }: { children: ReactNode }) => {
  const [speed, setSpeedState] = useState<SpeedType>(0.5);
  const speedRef = useRef<SpeedType>(0.5);

  const setSpeed = (newSpeed: SpeedType) => {
    speedRef.current = newSpeed;
    setSpeedState(newSpeed);
  };

  return (
    <SpeedContext.Provider value={{ speed, setSpeed, speedRef }}>
      {children}
    </SpeedContext.Provider>
  );
};
