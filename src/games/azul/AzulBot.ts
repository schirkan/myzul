import { MCTSBot } from 'boardgame.io/ai';
import { AzulGameState } from './models';
import { Ctx, State } from 'boardgame.io';
import { floorSetups } from './azulConfig';
import { BotAction } from 'boardgame.io/dist/types/src/ai/bot';
import { Node } from 'boardgame.io/dist/types/src/ai/mcts-bot';
import { calculateScore } from './moves';

interface Objective {
  checker: (G: any, ctx: Ctx) => boolean;
  weight: number;
}
declare type Objectives = Record<string, Objective>;

var getFloorPenalty = (G: AzulGameState, playerID: string): number => {
  var floorTiles = G.tiles.filter(x =>
    x.location.boardType === 'FloorLine' &&
    x.location.boardId === playerID
  );

  var floorSetup = floorSetups[G.config.floorSetup];
  return floorSetup.slice(0, floorTiles.length).reduce((a, b) => a + b, 0);
}

var getFullRowBonus = (G: AzulGameState, playerID: string): number => {
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
  return fullRowBonus;
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
  private _botPlayerID?: string = undefined;

  _objectives(G: AzulGameState, ctx: Ctx, playerID?: string): Objectives {
    if (!this._botPlayerID || !G.score || !G.score[this._botPlayerID]) return {};

    // TODO: calculate new score
    return {
      'base-score': {
        checker: () => true,
        weight: 20
      },
      'own-score': {
        checker: () => true,
        weight: G.score[this._botPlayerID].points
      },
      'full-row-bonus': {
        checker: () => true,
        weight: getFullRowBonus(G, this._botPlayerID)
      },
      'floor-penalty': {
        checker: () => true,
        weight: getFloorPenalty(G, this._botPlayerID)
      }
    };
  }

  constructor(options: any) {
    var myObjectives = (G: AzulGameState, ctx: Ctx, playerId: string) => this._objectives(G, ctx, playerId);

    super({ playoutDepth, objectives: myObjectives, ...options });
  }

  play(state: State<any>, playerID: string): Promise<{ action: BotAction; metadata: Node; }> {
    this._botPlayerID = playerID;
    return super.play(state, playerID);
  }
}

export class AzulBot2 extends MCTSBot {
  private _botPlayerID?: string = undefined;
  private _currentRound: number = 0;

  _objectives(G: AzulGameState, ctx: Ctx, playerID?: string): Objectives {
    if (!playerID || !this._botPlayerID || !G.score || !G.score[this._botPlayerID]) return {};

    // no score for select tile
    /*
    var selectedTiles = G.tiles.filter(x => x.selected);
    if (selectedTiles.length > 0) return {
      'base-score': {
        checker: () => true,
        weight: selectedTiles[0].color === 'white' ? 0.1 : 100
      },
    };
*/


    // calculate new score
    var newGameScore = JSON.parse(JSON.stringify(G));
    calculateScore(newGameScore, ctx)

    // get real last player
    var lastPlayerIndex = ctx.playOrderPos > 0 ? ctx.playOrderPos - 1 : ctx.playOrder.length - 1;
    var lastPlayerId = ctx.playOrder[lastPlayerIndex];

    if (ctx.gameover) {
      ctx.gameover = { score: ctx.gameover.winnerPlayerScore, winner: ctx.gameover.winnerPlayerId };
    } else if (this._currentRound !== G.round) {
      ctx.gameover = { score: newGameScore.score[lastPlayerId].points };
    }

    return {
      'base-score': {
        checker: () => true,
        weight: 1 // 20 // 100 * ctx.numPlayers
      },
      'own-score': {
        checker: () => true,
        weight: newGameScore.score[lastPlayerId].points
      },
    }

    // no score for opponent
    // if (this._botPlayerID === playerID) { // when bot turn ends


    /*
    if (this._botPlayerID === playerID) return { // when bot turn ends 
      'base-score': {
        checker: () => true,
        weight: 20
      },
      'full-row-bonus': {
        checker: () => true,
        weight: getFullRowBonus(G, playerID)
      },
      'floor-penalty': {
        checker: () => true,
        weight: getFloorPenalty(G, playerID)
      }
    };
    */

    /*
    return {
      'base-score': {
        checker: () => true,
        weight: 1 // 20 // 100 * ctx.numPlayers
      },
      'own-score': {
        checker: () => true,
        weight: newGameScore.score[this._botPlayerID].points
      },
    };
    */
  }

  constructor(options: any) {
    var myObjectives = (G: AzulGameState, ctx: Ctx, playerId: string) => this._objectives(G, ctx, playerId);

    super({ playoutDepth, objectives: myObjectives, ...options });
  }

  play(state: State<AzulGameState>, playerID: string): Promise<{ action: BotAction; metadata: Node; }> {
    this._botPlayerID = playerID;
    this._currentRound = state.G.round;
    return super.play(state, playerID);
  }
}

export function createBot(difficulty: number) {
  if (difficulty === 0) throw new Error('Difficulty is null')
  if (difficulty > 0) {
    return function AzulBotWithDifficulty(options: any) {
      return new AzulBot({ iterations: difficulty, ...options });
    }
  } else {
    return function AzulBotWithDifficulty(options: any) {
      return new AzulBot2({ iterations: difficulty * -1, ...options });
    }
  }
}