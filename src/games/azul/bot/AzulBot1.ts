import { MCTSBot } from 'boardgame.io/ai';
import { AzulGameState } from '../models';
import { Ctx, State } from 'boardgame.io';
import { BotAction } from 'boardgame.io/dist/types/src/ai/bot';
import { Node } from 'boardgame.io/dist/types/src/ai/mcts-bot';
import { Objectives, getFloorPenalty, getFullRowBonus } from '.';

export class AzulBot1 extends MCTSBot {
  private _botPlayerID?: string = undefined;
  private _currentRound: number = 0;

  _objectives(G: AzulGameState, ctx: Ctx, playerID?: string): Objectives {
    if (!this._botPlayerID || !G.score || !G.score[this._botPlayerID]) return {};

    if (ctx.gameover) {
      ctx.gameover = { score: ctx.gameover.winnerPlayerScore, winner: ctx.gameover.winnerPlayerId };
    } else if (this._currentRound !== G.round) {
      ctx.gameover = { score: G.score[this._botPlayerID].points };
    }

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

    super({ playoutDepth: 50, objectives: myObjectives, ...options });
  }

  play(state: State<any>, playerID: string): Promise<{ action: BotAction; metadata: Node; }> {
    this._botPlayerID = playerID;
    this._currentRound = state.G.round;
    return super.play(state, playerID);
  }
}
