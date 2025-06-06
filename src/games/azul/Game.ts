import type { Game } from 'boardgame.io';
import { defaultGameSetup } from './azulConfig';
import { AzulGameover, AzulGameState, GameSetup, TileColor, TilePlaceholderState } from './models';
import { calculateScore, canMoveToPatternLine, moveTile, selectSourceTile, selectTargetLocation } from './moves';
import { TurnOrder } from 'boardgame.io/core';

const groupBy = <T>(array: T[], predicate: (value: T, index: number, array: T[]) => string) =>
  array.reduce((acc, value, index, array) => {
    (acc[predicate(value, index, array)] ||= []).push(value);
    return acc;
  }, {} as { [key: string]: T[] });

export const AzulGame: Game<AzulGameState, {}, GameSetup> = {
  // The name of the game.
  name: 'MyZul',

  // The minimum and maximum number of players supported (This is only enforced when using the Lobby server component.)
  minPlayers: 2,
  maxPlayers: 4,

  // Function that returns the initial value of G.
  // setupData is an optional custom object that is passed through the Game Creation API.
  setup: ({ ctx, random }, setupData): AzulGameState => {
    if (!setupData) setupData = defaultGameSetup;

    const tilesPerColor = 20;

    const initialState: AzulGameState = {
      factories: ctx.numPlayers * 2 + 1,
      tiles: [],
      tileStorage: [],
      tileBag: [],
      tileBagByColor: {
        red: 0,
        green: 0,
        black: 0,
        blue: 0,
        yellow: 0,
        white: 0
      },
      config: setupData,
      score: {},
      initialized: false,
      turnStartTimestamp: 0,
      round: 0,
      startPlayerId: random.Shuffle(ctx.playOrder)[0] // random starting player
    };

    // init score
    ctx.playOrder.forEach(playerId => {
      initialState.score[playerId] = {
        points: 0,
        time: 0
      };
    });

    let id = 0;

    // create tiles
    for (let i = 0; i < tilesPerColor; i++) {
      initialState.tileBag.push({ color: 'red', selectable: false, location: { boardType: 'TileBag' }, selected: false, id: id++ })
      initialState.tileBag.push({ color: 'green', selectable: false, location: { boardType: 'TileBag' }, selected: false, id: id++ })
      initialState.tileBag.push({ color: 'black', selectable: false, location: { boardType: 'TileBag' }, selected: false, id: id++ })
      initialState.tileBag.push({ color: 'blue', selectable: false, location: { boardType: 'TileBag' }, selected: false, id: id++ })
      initialState.tileBag.push({ color: 'yellow', selectable: false, location: { boardType: 'TileBag' }, selected: false, id: id++ })
    }

    // create white tile
    initialState.tiles.push({ color: 'white', selectable: false, location: { boardType: 'CenterOfTable', x: 0 }, selected: false, id: id++ })

    // shuffle tiles
    initialState.tileBag = random.Shuffle(initialState.tileBag);

    // console.log('setup completed');

    return initialState;
  },

  ai: {
    enumerate: (G, ctx, playerID) => {
      let moves = [];
      var selectedTiles = G.tiles.filter(x => x.selected);

      if (selectedTiles.length) {
        // allready selected
        for (let row = 0; row < 5; row++) {
          if (canMoveToPatternLine(G, selectedTiles[0], playerID, row)) {
            moves.push({ move: 'selectTargetLocation', args: [{ location: { boardType: 'PatternLine', boardId: playerID, y: row } } as TilePlaceholderState] });
          }
        }
        moves.push({ move: 'selectTargetLocation', args: [{ location: { boardType: 'FloorLine', boardId: playerID } } as TilePlaceholderState] });
      } else {
        // nothing selected yet
        var selectableTiles = G.tiles.filter(x => x.selectable);

        // group by location
        var tilesByLocation = groupBy(selectableTiles, x => x.location.boardType + '|' + x.location.boardId);

        // add one per color
        Object.keys(tilesByLocation).forEach(location => {
          var colors: TileColor[] = [];
          tilesByLocation[location].forEach(t => {
            if (!colors.includes(t.color)) {
              moves.push({ move: 'selectSourceTile', args: [t] });
              colors.push(t.color);
            }
          });
        });
      }

      return moves;
    },
  },

  phases: {
    placeTiles: {
      start: true,
      onBegin: ({ G, ctx, random }) => {
        // console.log('placeTiles.onBegin');

        if (ctx.gameover) {
          // console.log('stop - gameover');
          return;
        }

        // place white tile on table
        let whiteTile = G.tileStorage.find(x => x.color === 'white');
        if (!whiteTile) whiteTile = G.tiles.find(x => x.color === 'white');
        if (!whiteTile) whiteTile = G.tileBag.find(x => x.color === 'white');
        moveTile(G, whiteTile!, 'CenterOfTable', undefined, 0);

        // refill bag
        if (G.tileBag.length < G.factories * G.config.tilesPerFactory) {
          G.tileStorage.forEach(x => moveTile(G, x, 'TileBag'));
          G.tileBag = random.Shuffle(G.tileBag);
        }

        // place tiles on factories
        for (let fi = 0; fi < G.factories; fi++) {
          for (let ti = 0; ti < G.config.tilesPerFactory; ti++) {
            if (G.tileBag.length) {
              moveTile(G, G.tileBag[0], 'Factory', fi, ti, 0);
            }
          }
        }

        // make tiles selectable
        G.tiles
          .filter(x => (x.location.boardType === 'Factory' || x.location.boardType === 'CenterOfTable') && x.color !== 'white')
          .forEach(x => x.selectable = true);

        // count tiles by color
        G.tileBagByColor = {
          red: 0,
          green: 0,
          black: 0,
          blue: 0,
          yellow: 0,
          white: 0
        };
        G.tileBag.forEach(x => G.tileBagByColor[x.color]++);

        G.initialized = true;
        G.round++;
      },
      onEnd: ({ G, ctx }) => {
        // console.log('placeTiles.onEnd');
        G.initialized = false;
        // get next starting player
        let whiteTile = G.tiles.find(x => x.color === 'white');
        if (!whiteTile) whiteTile = G.tileStorage.find(x => x.color === 'white');
        G.startPlayerId = whiteTile!.location.boardId;
      },
      endIf: ({ G, ctx }) => {
        // console.log('placeTiles.endIf');
        // don't end before started
        if (!G.initialized) return false;
        // end if no selectable tiles left
        return !G.tiles.some(x => x.selectable);
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
        onBegin: ({ G, ctx }) => {
          G.turnStartTimestamp = Date.now();
        },
        onEnd: ({ G, ctx }) => {
          // save playtime
          if (!ctx.currentPlayer || !G.score[ctx.currentPlayer]) return;
          G.score[ctx.currentPlayer].time += Math.floor((Date.now() - G.turnStartTimestamp) / 1000);
        },
        order: {
          first: ({ G, ctx }) => ctx.playOrder.findIndex(x => x === G.startPlayerId),
          next: TurnOrder.DEFAULT.next as any // TODO ceck typing
        },
        minMoves: 1,
        maxMoves: 1,
        onMove: ({ G, ctx }) => {
          // set selectable Tiles
          G.tiles.forEach(x =>
            x.selectable = (x.location.boardType === 'Factory' || x.location.boardType === 'CenterOfTable') && x.color !== 'white'
          );
        },
      },
    },

    calculateScore: {
      onBegin: ({ G, ctx }) => {
        // console.log('calculateScore.onBegin');
        calculateScore(G, ctx); // TODO: move to onEnd to calculate score after 'selectTargetLocation'?
      },
      onEnd: ({ G, ctx, events }) => {
        // console.log('calculateScore.onEnd');
        // get player with most points
        const getWinner = (): AzulGameover => {
          let highscore = 0;
          let winnerPlayerId = '0';
          for (const playerId of ctx.playOrder) {
            const s = G.score[playerId];
            if (s.points > highscore) {
              highscore = s.points;
              winnerPlayerId = playerId;
            }
          }
          return {
            winnerPlayerId,
            winnerPlayerScore: highscore
          }
        }

        // check end condition
        const wallTiles = G.tiles.filter(x => x.location.boardType === 'Wall');
        for (const playerId of ctx.playOrder) {
          const playerWallTiles = wallTiles.filter(x => x.location.boardId === playerId);
          for (let row = 0; row < 5; row++) {
            const count = playerWallTiles.filter(x => x.location.y === row).length;
            if (count >= 5) {
              const winner = getWinner();
              // console.log('WINNER', winner);
              ctx.gameover = winner;
              events?.endGame(winner);
              return;
            }
          }
        }
      },
      endIf: ({ G, ctx }) => {
        // console.log('calculateScore.endIf');

        // loop rows
        for (let row = 0; row < 5; row++) {
          const maxTilesInRow = row + 1;
          // loop players
          for (const playerId of ctx.playOrder) {
            // get tiles 
            const tiles = G.tiles.filter(x =>
              x.location.boardType === 'PatternLine' &&
              x.location.boardId === playerId &&
              x.location.y === row
            );

            if (tiles.length >= maxTilesInRow) {
              // console.log('calculateScore.endIf: false - full rows left');
              return false;
            }
          }
        }

        // console.log('calculateScore.endIf: true - no full rows left');
        return true;
      },
      turn: {
        activePlayers: { all: 'selectTargetLocation' },
        stages: {
          selectTargetLocation: {
            moves: {
              selectTargetLocation
            }
          }
        }
      },
      next: 'placeTiles',
    },
  },

  // Optional function to validate the setupData before
  // matches are created. If this returns a value,
  // an error will be reported to the user and match
  // creation is aborted.
  // validateSetupData: (setupData, numPlayers) => 'setupData is not valid!',

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
