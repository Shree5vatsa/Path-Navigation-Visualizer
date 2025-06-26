import { isEqual } from "./helpers";
import type { TileType } from "./types";


export function isPresentinQueue(tile:TileType,queue:TileType[]):boolean {
   for(let i = 0; i < queue.length; i++) {
       if (isEqual(tile, queue[i])) return true;
   }
   return false; // Tile is not present in the queue
}