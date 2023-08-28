import { MCTSBot } from 'boardgame.io/ai';
import { AzulGameState } from './models';
import { Ctx } from 'boardgame.io';
import { floorSetups } from './azulConfig';

interface Objective {
  checker: (G: any, ctx: Ctx) => boolean;
  weight: number;
}
declare type Objectives = Record<string, Objective>;

var objectives = (G: AzulGameState, ctx: Ctx, playerID?: string): Objectives => {
  if (!playerID || !G.score || !G.score[playerID]) {
    return {};
  }

  var floorTiles = G.tiles.filter(x =>
    x.location.boardType === 'FloorLine' &&
    x.location.boardId === playerID
  );

  var floorSetup = floorSetups[G.config.floorSetup];

  var fullRowBonus = 0;
  // loop rows
  for (let row = 0; row < 5; row++) {
    const maxTilesInRow = row + 1;
    // get tiles 
    const tiles = G.tiles.filter(x =>
      x.location.boardType === 'PatternLine' &&
      x.location.boardId === playerID &&
      x.location.y === row
    );

    if (tiles.length >= maxTilesInRow) {
      fullRowBonus += maxTilesInRow;
    }
  }

  return {
    'base-score': {
      checker: () => true,
      weight: 20
    },
    'own-score': {
      checker: () => true,
      weight: G.score[playerID].points
    },
    'full-row-bonus': {
      checker: () => true,
      weight: fullRowBonus
    },
    // 'opponent-score': {
    //   checker: () => true,
    //   weight: G.score[0].points * -0.5
    // },
    'floor-penalty': {
      checker: () => true,
      weight: floorSetup.slice(0, floorTiles.length).reduce((a, b) => a + b, 0)
    }
  };
}

var playoutDepth = (G: AzulGameState, ctx: Ctx, playerID?: string): number => {
  var tilesLeft = G.tiles.filter(x => x.location.boardType === 'Factory').length;
  return tilesLeft;
  // return Math.ceil(tilesLeft / ctx.numPlayers);
}

export class AzulBot extends MCTSBot {
  constructor(options: any) {
    // super({ ...options, iterations: 100, playoutDepth: 50, objectives });
    super({ ...options, iterations: 500, playoutDepth, objectives });
  }
}