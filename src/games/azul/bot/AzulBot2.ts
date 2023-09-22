import { MCTSBot } from 'boardgame.io/ai';
import { AzulGameState } from '../models';
import { Ctx, State } from 'boardgame.io';
import { BotAction } from 'boardgame.io/dist/types/src/ai/bot';
import { Node } from 'boardgame.io/dist/types/src/ai/mcts-bot';
import { calculateScore } from '../moves';
import { Objectives } from '.';

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

    super({ playoutDepth: 50, objectives: myObjectives, ...options });
  }

  play(state: State<AzulGameState>, playerID: string): Promise<{ action: BotAction; metadata: Node; }> {
    this._botPlayerID = playerID;
    this._currentRound = state.G.round;
    return super.play(state, playerID);
  }
}