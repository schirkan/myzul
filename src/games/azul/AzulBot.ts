import { MCTSBot } from 'boardgame.io/ai';
import { AzulGameState } from './models';
import { Ctx, State } from 'boardgame.io';
import { floorSetups } from './azulConfig';
import { BotAction } from 'boardgame.io/dist/types/src/ai/bot';
import { Node } from 'boardgame.io/dist/types/src/ai/mcts-bot';

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
  var floorPenalty = floorSetup.slice(0, floorTiles.length).reduce((a, b) => a + b, 0);

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

  // TODO: calculate new score
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
    'floor-penalty': {
      checker: () => true,
      weight: floorPenalty
    }
  };

}

var playoutDepth = (G: AzulGameState, ctx: Ctx, playerID?: string): number => {
  return 50;
  /*
  var tilesLeft = G.tiles.filter(x => x.location.boardType === 'Factory').length;
  return tilesLeft * 2;
  */
  // return Math.ceil(tilesLeft / ctx.numPlayers);
}

export class AzulBot extends MCTSBot {
  private _playerID?: string = undefined;

  constructor(options: any) {
    var myObjectives = (G: AzulGameState, ctx: Ctx, playerId: string) => objectives(G, ctx, this._playerID);

    super({ iterations: 500, playoutDepth, objectives: myObjectives, ...options });
  }

  play(state: State<any>, playerID: string): Promise<{ action: BotAction; metadata: Node; }> {
    this._playerID = playerID;
    return super.play(state, playerID);
  }

  static Difficulty(iterations: number) {
    function AzulBotWithDifficulty(options: any) {
      return new AzulBot({ iterations, ...options });
    }

    return AzulBotWithDifficulty;
    // return (options: any) => AzulBot({ iterations, ...options });
  }
}
