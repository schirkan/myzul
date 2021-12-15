// Game.ts
import type { Game, Move } from "boardgame.io";

export interface AzulGameState {
  // aka 'G', your game's state
}

const move: Move<AzulGameState> = (G, ctx) => {};

export const AzulGame: Game<AzulGameState> = {
  // ...
};