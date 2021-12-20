// Game.ts
import type { Ctx, Game, Move } from "boardgame.io";
import { defaultGameSetup, GameSetup, TileColor, TileLocation } from "./azulConfig";

interface AzulTileState {
  color: TileColor,
  location: TileLocation,
  selectable: boolean
}

// aka 'G', your game's state
export interface AzulGameState {
  config: GameSetup
  factories: number,
  tiles: AzulTileState[],
}

const move: Move<AzulGameState> = (G, ctx) => { };

export const AzulGame: Game<AzulGameState, Ctx, GameSetup> = {
  // The name of the game.
  name: 'MyZul',

  // Function that returns the initial value of G.
  // setupData is an optional custom object that is
  // passed through the Game Creation API.

  setup: (ctx, setupData): AzulGameState => {
    if (!setupData) setupData = defaultGameSetup;

    const tiles = {
      red: 20,
      green: 20,
      blue: 20,
      yellow: 20,
      black: 20,
    };

    const initialState: AzulGameState = {
      factories: ctx.numPlayers * 2 + 1,
      tiles: [],
      config: setupData,
    };

    for (let i = 0; i < tiles.red; i++) {
      initialState.tiles.push({ color: 'red', selectable: false, location: { boardType: 'TileBag' } })
    }

    for (let i = 0; i < tiles.green; i++) {
      initialState.tiles.push({ color: 'green', selectable: false, location: { boardType: 'TileBag' } })
    }

    for (let i = 0; i < tiles.black; i++) {
      initialState.tiles.push({ color: 'black', selectable: false, location: { boardType: 'TileBag' } })
    }

    for (let i = 0; i < tiles.blue; i++) {
      initialState.tiles.push({ color: 'blue', selectable: false, location: { boardType: 'TileBag' } })
    }

    for (let i = 0; i < tiles.yellow; i++) {
      initialState.tiles.push({ color: 'yellow', selectable: false, location: { boardType: 'TileBag' } })
    }

    // shuffle tiles
    initialState.tiles = initialState.tiles.sort(() => Math.random() - 0.5)

    // place tiles on factories
    for (let i = 0; i < initialState.factories; i++) {
      initialState.tiles[i * 4 + 0].location = { boardType: 'Factory', boardId: i, x: 0, y: 0 }
      initialState.tiles[i * 4 + 1].location = { boardType: 'Factory', boardId: i, x: 0, y: 1 }
      initialState.tiles[i * 4 + 2].location = { boardType: 'Factory', boardId: i, x: 1, y: 0 }
      initialState.tiles[i * 4 + 3].location = { boardType: 'Factory', boardId: i, x: 1, y: 1 }
    }

    return initialState;
  },

  // Optional function to validate the setupData before
  // matches are created. If this returns a value,
  // an error will be reported to the user and match
  // creation is aborted.
  // validateSetupData: (setupData, numPlayers) => 'setupData is not valid!',

  // The minimum and maximum number of players supported
  // (This is only enforced when using the Lobby server component.)
  minPlayers: 2,
  maxPlayers: 4,

  moves: {
    // short-form move.
    A: (G, ctx, ...args) => { },

    // long-form move.
    B: {
      // The move function.
      move: (G, ctx, ...args) => { },
      // Prevents undoing the move.
      undoable: false,
      // Prevents the move arguments from showing up in the log.
      redact: true,
      // Prevents the move from running on the client.
      client: false,
      // Prevents the move counting towards a player’s number of moves.
      noLimit: true,
      // Processes the move even if it was dispatched from an out-of-date client.
      // This can be risky; check the validity of the state update in your move.
      ignoreStaleStateID: true,
    },
  },

  // Everything below is OPTIONAL.
  /*
    // Function that allows you to tailor the game state to a specific player.
    playerView: (G, ctx, playerID) => G,
  
    // The seed used by the pseudo-random number generator.
    seed: 'random-string',
  
    turn: {
      // The turn order.
      order: TurnOrder.DEFAULT,
  
      // Called at the beginning of a turn.
      onBegin: (G, ctx) => G,
  
      // Called at the end of a turn.
      onEnd: (G, ctx) => G,
  
      // Ends the turn if this returns true.
      endIf: (G, ctx) => true,
  
      // Called at the end of each move.
      onMove: (G, ctx) => G,
  
      // Prevents ending the turn before a minimum number of moves.
      minMoves: 1,
  
      // Ends the turn automatically after a number of moves.
      maxMoves: 1,
  
      // Calls setActivePlayers with this as argument at the
      // beginning of the turn.
      activePlayers: { ... },
  
      stages: {
        A: {
          // Players in this stage are restricted to moves defined here.
          moves: { ... },
  
          // Players in this stage will be moved to the stage specified
          // here when the endStage event is called.
          next: 'B'
        },
  
        ...
      },
    },
  
    phases: {
      A: {
        // Called at the beginning of a phase.
        onBegin: (G, ctx) => G,
  
        // Called at the end of a phase.
        onEnd: (G, ctx) => G,
  
        // Ends the phase if this returns true.
        endIf: (G, ctx) => true,
  
        // Overrides `moves` for the duration of this phase.
        moves: { ... },
  
        // Overrides `turn` for the duration of this phase.
        turn: { ... },
  
        // Make this phase the first phase of the game.
        start: true,
  
        // Set the phase to enter when this phase ends.
        // Can also be a function: (G, ctx) => 'nextPhaseName'
        next: 'nextPhaseName',
      },
  
      ...
    },
    
    // Ends the game if this returns anything.
    // The return value is available in `ctx.gameover`.
    endIf: (G, ctx) => obj,
  
    // Called at the end of the game.
    // `ctx.gameover` is available at this point.
    onEnd: (G, ctx) => G,
  
    // Disable undo feature for all the moves in the game
    disableUndo: true,
  
    // Transfer delta state with JSON Patch in multiplayer
    deltaState: true,
    
    */
};