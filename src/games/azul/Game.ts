import type { Ctx, Game } from "boardgame.io";
import { defaultGameSetup } from "./azulConfig";
import { AzulGameState, GameSetup } from "./models";
import { calculateScore, moveTile, selectSourceTile, selectTargetLocation } from "./moves";
import { ActivePlayers, TurnOrder } from 'boardgame.io/core';

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
      score: {},
      initialized: false,
      calculationDelay: 500,
    };

    // init score
    ctx.playOrder.forEach(playerId => {
      initialState.score[playerId] = 0;
    });

    // create tiles
    for (let i = 0; i < tilesPerColor; i++) {
      initialState.tiles.push({ color: 'red', selectable: false, location: { boardType: 'TileBag' }, selected: false })
      initialState.tiles.push({ color: 'green', selectable: false, location: { boardType: 'TileBag' }, selected: false })
      initialState.tiles.push({ color: 'black', selectable: false, location: { boardType: 'TileBag' }, selected: false })
      initialState.tiles.push({ color: 'blue', selectable: false, location: { boardType: 'TileBag' }, selected: false })
      initialState.tiles.push({ color: 'yellow', selectable: false, location: { boardType: 'TileBag' }, selected: false })
    }

    // create white tile
    initialState.tiles.push({ color: 'white', selectable: false, location: { boardType: 'TileBag', x: 0 }, selected: false })

    // shuffle tiles
    initialState.tiles = initialState.tiles.sort(() => Math.random() - 0.5)

    console.log('setup completed');

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


  // Called at the end of the game.
  // `ctx.gameover` is available at this point.
  // onEnd: (G, ctx) => G,

  phases: {
    // setup: {
    //   moves: {
    //     start: {
    //       move: (G, ctx) => {

    //         G.initialized = true;

    //         ctx.events?.endPhase();
    //       }
    //     },
    //   },
    //   turn: {
    //     activePlayers: { all: Stage.NULL },
    //     order: TurnOrder.RESET,
    //     onBegin: (G) => {
    //       G.initialized = false;
    //     }
    //   },
    //   start: true,
    //   next: 'placeTiles',
    // },

    placeTiles: {
      start: true,
      onBegin: (G, ctx) => {
        console.log('placeTiles.onBegin');

        if (ctx.gameover) {
          console.log('stop - gameover');
          return;
        }

        let availableTiles = G.tiles.filter(x =>
          x.location.boardType === "TileBag" &&
          x.color !== "white");

        // refill bag
        if (availableTiles.length < G.factories * G.config.tilesPerFactory) {
          const storageTiles = G.tiles.filter(x =>
            x.location.boardType === "TileStorage");
          storageTiles.forEach(x => moveTile(x, "TileBag"));
          availableTiles = G.tiles.filter(x =>
            x.location.boardType === "TileBag" &&
            x.color !== "white");
        }

        // place tiles on factories
        for (let fi = 0; fi < G.factories; fi++) {
          for (let ti = 0; ti < G.config.tilesPerFactory; ti++) {
            moveTile(availableTiles[fi * G.config.tilesPerFactory + ti], 'Factory', fi, ti, 0);
          }
        }

        // place white tile on table
        const whiteTile = G.tiles.find(x => x.color === "white");
        moveTile(whiteTile!, "CenterOfTable", undefined, 0);

        // make tiles selectable
        G.tiles
          .filter(x =>
            x.location.boardType === 'Factory' ||
            x.location.boardType === 'CenterOfTable')
          .forEach(x => x.selectable = true);

        G.initialized = true;
      },
      onEnd: (G, ctx) => {
        console.log('placeTiles.onEnd');
        G.initialized = false;
        // get next starting player
        G.nextStartPlayerId = G.tiles.find(x => x.color === "white")?.location.boardId;
      },
      endIf: (G, ctx) => {
        console.log('placeTiles.endIf');
        // don't end before started
        if (!G.initialized) return false;
        // end if no tiles left
        const factoryTiles = G.tiles.filter(x =>
          x.location.boardType === "Factory" ||
          x.location.boardType === "CenterOfTable");
        return factoryTiles.length === 0;
      },
      next: 'calculateScore',
      moves: {
        selectSourceTile: {
          noLimit: true,
          move: selectSourceTile
        },
        selectTargetLocation: {
          move: selectTargetLocation
        }
      },
      turn: {
        order: {
          first: (G, ctx) => {
            // set starting player
            const startPlayerPos = ctx.playOrder.findIndex(x => x === G.nextStartPlayerId);
            return Math.max(startPlayerPos, 0);
          },
          next: TurnOrder.DEFAULT.next
        }, //TurnOrder.RESET,
        minMoves: 1,
        maxMoves: 1,
        onMove: (G, ctx) => {
          // set selectable Tiles
          G.tiles.forEach(x => x.selectable = false);
          G.tiles
            .filter(x =>
              x.location.boardType === 'Factory' ||
              x.location.boardType === 'CenterOfTable')
            .forEach(x => x.selectable = true);
        },
      },
    },

    calculateScore: {
      onBegin: (G, ctx) => {
        console.log('calculateScore.onBegin');
        calculateScore(G, ctx);
      },
      onEnd: (G, ctx) => {
        console.log('calculateScore.onEnd');
        // get player with most points
        const getWinner = () => {
          let highscore = 0;
          for (const playerId of ctx.playOrder) {
            const s = G.score[playerId];
            if (s > highscore) {
              return {
                winnerPlayerId: playerId,
                winnerPlayerScore: s
              }
            }
          }
        }

        // check end condition
        const wallTiles = G.tiles.filter(x => x.location.boardType === "Wall");
        for (const playerId of ctx.playOrder) {
          const playerWallTiles = wallTiles.filter(x => x.location.boardId === playerId);
          for (let row = 0; row < 5; row++) {
            const count = playerWallTiles.filter(x => x.location.y === row).length;
            if (count >= 5) {
              const winner = getWinner();
              console.log('WINNER', winner);
              ctx.events?.endGame(winner);
              return;
            }
          }
        }


        // TEST
        ctx.events?.endGame(getWinner());
      },
      endIf: (G, ctx) => {
        console.log('calculateScore.endIf');

        // loop rows
        for (let row = 0; row < 5; row++) {
          const maxTilesInRow = row + 1;
          // loop players
          for (const playerId of ctx.playOrder) {
            // get tiles 
            const tiles = G.tiles.filter(x =>
              x.location.boardType === "PatternLine" &&
              x.location.boardId === playerId &&
              x.location.y === row
            );

            if (tiles.length >= maxTilesInRow) {
              return false;
            }
          }
        }
        // no full rows left
        return true;
      },
      turn: {
        // order: TurnOrder.ONCE,
        activePlayers: ActivePlayers.ALL
      },
      next: 'placeTiles',
      moves: {
        selectTargetLocation: {
          move: selectTargetLocation
        }
      }
    },
  },


  // Everything below is OPTIONAL.
  /*
    // Function that allows you to tailor the game state to a specific player.
    playerView: (G, ctx, playerID) => G,
  
    // The seed used by the pseudo-random number generator.
    seed: 'random-string',
  
    // Disable undo feature for all the moves in the game
    disableUndo: true,
  
    // Transfer delta state with JSON Patch in multiplayer
    deltaState: true,
    
    */
};
