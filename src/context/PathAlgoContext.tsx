import { endTile_config, startTile_config } from '../utils/constants';
import { createGrid } from '../utils/helpers';
import type { AlgorithmType } from '../utils/types';
import type { MazeType } from '../utils/types';
import type { GridType } from '../utils/types';
import type { ReactNode } from "react";
import { createContext,useState } from "react";


export interface PathAlgoContextInterface {//context structure
    // Define the types for the context properties
    algorithm: AlgorithmType;
    setAlgorithm: (algorithm: AlgorithmType) => void; 
    maze: MazeType;
    setMaze: (maze: MazeType) => void; 
    grid: GridType;
    setGrid: (grid: GridType) => void;
    isGraphvisualized: boolean;
    setIsGraphVisualized: (isGraphVisualized: boolean) => void;
}


export const PathAlgoContext = createContext<PathAlgoContextInterface | undefined>(undefined);//initailized as undefined

export const PathAlgoProvider = ({ children }: { children: ReactNode }) => {
    
    const [algorithm, setAlgorithm] = useState<AlgorithmType>("BFS");
    const [maze, setMaze] = useState<MazeType>("NONE");
    const [grid, setGrid] = useState<GridType>(createGrid(startTile_config, endTile_config)); // Initialize with a grid containing only the start tile
    const [isGraphvisualized, setIsGraphVisualized] = useState<boolean>(false);

    return (
        <PathAlgoContext.Provider value={{
            algorithm,
            setAlgorithm,
            maze,
            setMaze,
            grid,
            setGrid,
            isGraphvisualized,
            setIsGraphVisualized
        }}>
            {children}
        </PathAlgoContext.Provider>
    );

}
