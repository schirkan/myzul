import type { Ctx, Game, Move } from "boardgame.io";
import { BoardType, defaultGameSetup, GameSetup, GetTileLocationId, TileColor, TileLocation } from "./azulConfig";

export interface AzulTileState {
  color: TileColor,
  location: TileLocation,
  selected: boolean,
  selectable: boolean
}

// aka 'G', your game's state
export interface AzulGameState {
  config: GameSetup
  factories: number,
  tiles: AzulTileState[]
}

const INVALID_MOVE = "INVALID_MOVE";

const selectSourceTile: Move<AzulGameState> = (G, ctx, tile: AzulTileState) => {
  if (!tile.selectable) return INVALID_MOVE;

  // reset selection
  G.tiles.forEach(x => x.selected = false);

  // select all tiles of same color on same board
  const newSelection = G.tiles.filter(x =>
    x.location.boardType === tile.location.boardType &&
    x.location.boardId === tile.location.boardId &&
    x.color === tile.color
  );
  newSelection.forEach(x => x.selected = true);

  console.log('Selected Tiles: ', newSelection.length, tile.location.boardType, tile.location.boardId);

  // Placeholder selectable machen?

};

const moveTile = (tile: AzulTileState, boardType: BoardType, boardId?: string, x?: number, y?: number) => {
  console.log('move to FloorLine from', GetTileLocationId(tile.location));
  tile.location = { boardType, boardId, x, y };
};

const canMoveToPatternLine = (G: AzulGameState, tiles: AzulTileState[], boardId: string, y: number): boolean => {
  const maxTilesOnLine = y + 1;
  // get tiles on PatternLine
  const patternLineTiles = G.tiles.filter(x =>
    x.location.boardType === 'PatternLine' &&
    x.location.boardId === boardId &&
    x.location.y === y
  );

  // empty?
  if (patternLineTiles.length === 0) return true;

  // full?
  if (patternLineTiles.length >= maxTilesOnLine) return false;

  // wrong color?
  return patternLineTiles[0].color === tiles[0].color;
};

const moveToPatternLine = (G: AzulGameState, tiles: AzulTileState[], boardId: string, y: number): void => {
  // get tiles on PatternLine
  const patternLineTiles = G.tiles.filter(x =>
    x.location.boardType === 'PatternLine' &&
    x.location.boardId === boardId &&
    x.location.y === y
  );
  const maxTilesOnLine = y + 1;

  // move tiles to floor
  let counter = patternLineTiles.length;
  tiles.forEach(x => {
    if (counter < maxTilesOnLine) {
      moveTile(x, 'PatternLine', boardId, counter++, y);
    } else {
      moveToFloorLine(G, [x], boardId);
    }
  });
};

// move tiles to floor
const moveToFloorLine = (G: AzulGameState, tiles: AzulTileState[], boardId: string): void => {
  // get tiles on floor line
  const floorLineTiles = G.tiles.filter(x =>
    x.location.boardType === 'FloorLine' &&
    x.location.boardId === boardId
  );

  let counter = floorLineTiles.length;
  tiles.forEach(x => {
    if (counter <= 6) {
      moveTile(x, 'FloorLine', boardId, counter++);
    } else {
      moveTile(x, 'TileStorage');
    }
  });
};

//-------------------

const selectTargetLocation: Move<AzulGameState> = (G, ctx, target: TileLocation) => {
  // move all selected tiles to new board
  var selectedTiles = G.tiles.filter(x => x.selected);

  if (!selectedTiles.length) return INVALID_MOVE;
  if (target.boardId !== ctx.currentPlayer) return INVALID_MOVE;

  // get source factory
  const sourceBoardType = selectedTiles[0].location.boardType
  const sourceBoardId = selectedTiles[0].location.boardId;

  if (target.boardType === 'FloorLine') {
    moveToFloorLine(G, selectedTiles, target.boardId);
  } else if (target.boardType === 'PatternLine') {
    if (!canMoveToPatternLine(G, selectedTiles, target.boardId, target.y!)) return INVALID_MOVE;
    moveToPatternLine(G, selectedTiles, target.boardId, target.y!);
  } else {
    return INVALID_MOVE;
  }

  // move remaining tiles from factory to CenterOfTable
  if (sourceBoardType === 'Factory') {
    var factoryTiles = G.tiles.filter(x =>
      x.location.boardType === 'Factory' &&
      x.location.boardId === sourceBoardId
    );
    var centerTiles = G.tiles.filter(x => x.location.boardType === 'CenterOfTable');
    let counter = centerTiles.length;
    factoryTiles.forEach(x => moveTile(x, 'CenterOfTable', undefined, counter++));
  }

  // rearrange + sort center Tiles
  var centerTiles = G.tiles.filter(x => x.location.boardType === 'CenterOfTable').sort((a, b) => ('' + a.color).localeCompare(b.color));
  let counter = 0;
  centerTiles.forEach(x => moveTile(x, 'CenterOfTable', undefined, counter++));

  // reset selection
  G.tiles.forEach(x => x.selected = false);
};

export const AzulGame: Game<AzulGameState, Ctx, GameSetup> = {
  // The name of the game.
  name: 'MyZul',

  // Function that returns the initial value of G.
  // setupData is an optional custom object that is
  // passed through the Game Creation API.

  setup: (ctx, setupData): AzulGameState => {
    if (!setupData) setupData = defaultGameSetup;

    const tilesPerColor = 20;

    const initialState: AzulGameState = {
      factories: ctx.numPlayers * 2 + 1,
      tiles: [],
      config: setupData,
    };

    for (let i = 0; i < tilesPerColor; i++) {
      initialState.tiles.push({ color: 'red', selectable: false, location: { boardType: 'TileBag' }, selected: false })
      initialState.tiles.push({ color: 'green', selectable: false, location: { boardType: 'TileBag' }, selected: false })
      initialState.tiles.push({ color: 'black', selectable: false, location: { boardType: 'TileBag' }, selected: false })
      initialState.tiles.push({ color: 'blue', selectable: false, location: { boardType: 'TileBag' }, selected: false })
      initialState.tiles.push({ color: 'yellow', selectable: false, location: { boardType: 'TileBag' }, selected: false })
    }

    // shuffle tiles
    initialState.tiles = initialState.tiles.sort(() => Math.random() - 0.5)

    // place tiles on factories
    for (let i = 0; i < initialState.factories; i++) {
      initialState.tiles[i * 4 + 0].location = { boardType: 'Factory', boardId: i.toString(), x: 0, y: 0 }
      initialState.tiles[i * 4 + 1].location = { boardType: 'Factory', boardId: i.toString(), x: 0, y: 1 }
      initialState.tiles[i * 4 + 2].location = { boardType: 'Factory', boardId: i.toString(), x: 1, y: 0 }
      initialState.tiles[i * 4 + 3].location = { boardType: 'Factory', boardId: i.toString(), x: 1, y: 1 }
    }

    initialState.tiles
      .filter(x => x.location.boardType === 'Factory')
      .forEach(x => x.selectable = true);

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

  /*
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
  */

  moves: { selectSourceTile, selectTargetLocation },

  turn: {
    // The turn order.
    //order: {} //TurnOrder.DEFAULT,

    // Called at the beginning of a turn.
    onBegin: (G, ctx) => G,

    // Called at the end of a turn.
    onEnd: (G, ctx) => G,

    // Ends the turn if this returns true.
    //endIf: (G, ctx) => true,

    // Called at the end of each move.
    onMove: (G, ctx) => {
      // set selectable Tiles
      G.tiles.forEach(x => x.selectable = false);
      G.tiles.filter(x => x.location.boardType === 'Factory' || x.location.boardType === 'CenterOfTable')
        .forEach(x => x.selectable = true);

      return G;
    },

    // Prevents ending the turn before a minimum number of moves.
    //minMoves: 1,

    // Ends the turn automatically after a number of moves.
    //maxMoves: 1,

    // Calls setActivePlayers with this as argument at the
    // beginning of the turn.
    //activePlayers: { ... },

    stages: {
      A: {
        // Players in this stage are restricted to moves defined here.
        moves: { selectSourceTile },

        // Players in this stage will be moved to the stage specified
        // here when the endStage event is called.
        next: 'B'
      },
      B: {
        moves: { selectSourceTile, selectTargetLocation },
      },
    },
  },

  // Everything below is OPTIONAL.
  /*
    // Function that allows you to tailor the game state to a specific player.
    playerView: (G, ctx, playerID) => G,
  
    // The seed used by the pseudo-random number generator.
    seed: 'random-string',
  
  
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