import { MCTSBot } from 'boardgame.io/ai';
import { AzulGameState } from '../models';
import { Ctx, State } from 'boardgame.io';
import { BotAction } from 'boardgame.io/dist/types/src/ai/bot';
import { Node } from 'boardgame.io/dist/types/src/ai/mcts-bot';
import { calculateScore } from '../moves';
import { Objectives } from '.';

export class AzulBot3 extends MCTSBot {
  private _botPlayerID?: string = undefined;
  private _currentRound: number = 0;

  _objectives(G: AzulGameState, ctx: Ctx, playerID?: string): Objectives {
    if (!playerID || !this._botPlayerID || !G.score) return {};

    // no score for select tile
    /*
        var selectedTiles = G.tiles.filter(x => x.selected);
        if (selectedTiles.length > 0) return {
          'base-score': {
            checker: () => true,
            // weight: selectedTiles[0].color === 'white' ? 0.1 : 1
            weight: 1
          },
        };
    */

    // no score for opponent
    // if (this._botPlayerID === playerID) return {};


    // calculate new score
    var gameCopy = JSON.parse(JSON.stringify(G));
    calculateScore(gameCopy, ctx)
    var newGameScore = gameCopy.score as AzulGameState['score'];

    // get real last player
    // var lastPlayerIndex = ctx.playOrderPos > 0 ? ctx.playOrderPos - 1 : ctx.playOrder.length - 1;
    // var lastPlayerId = ctx.playOrder[lastPlayerIndex];
    // var wasBotMove = this._botPlayerID === lastPlayerId;

    // no score for opponent
    //if (this._botPlayerID !== lastPlayerId) return {};
    // if (!wasBotMove) return {
    //   'base-score': {
    //     checker: () => true,
    //     weight: 0.01
    //   }
    // };

    var scoreSum = Object.keys(newGameScore).reduce((sum, key) => { return sum + newGameScore[key].points }, 0);
    var ownScore = newGameScore[this._botPlayerID].points; // newGameScore[lastPlayerId].points
    var ownScoreWeight = ownScore - ((scoreSum - ownScore) / (ctx.numPlayers - 1));

    if (ctx.gameover) {
      ctx.gameover = { score: ctx.gameover.winnerPlayerScore, winner: ctx.gameover.winnerPlayerId };
    } else if (this._currentRound !== G.round) {
      // ctx.gameover = { score: newGameScore[lastPlayerId].points };
      ctx.gameover = { score: ownScoreWeight };
    }


    return {
      // 'base-score': {
      //   checker: () => true,
      //   weight: 100 //1 // 20 // 100 * ctx.numPlayers
      // },
      'own-score': {
        checker: () => true,
        weight: ownScoreWeight //ownScore
      },
      // 'floor-penalty': {
      //   checker: () => true,
      //   weight: getFloorPenalty(G, this._botPlayerID)
      // }
    }
  }

  constructor(options: any) {
    var myObjectives = (G: AzulGameState, ctx: Ctx, playerId: string) => this._objectives(G, ctx, playerId);

    super({ playoutDepth: 50, objectives: myObjectives, ...options });
  }

  async play(state: State<AzulGameState>, playerID: string): Promise<{ action: BotAction; metadata: Node; }> {
    this._botPlayerID = playerID;
    this._currentRound = state.G.round;

    return super.play(state, playerID);
  }


  playout({ state }: Node) {
    let playoutDepth = this.getOpt('playoutDepth');
    if (typeof this.playoutDepth === 'function') {
      playoutDepth = this.playoutDepth(state.G, state.ctx);
    }

    for (let i = 0; i < playoutDepth && state.ctx.gameover === undefined; i++) {
      const { G, ctx } = state;
      let playerID = ctx.currentPlayer;
      if (ctx.activePlayers) {
        playerID = Object.keys(ctx.activePlayers)[0];
      }
      const moves = this.enumerate(G, ctx, playerID);

      // Check if any objectives are met.
      const objectives = (this as any).objectives(G, ctx, playerID);
      const score = Object.keys(objectives).reduce((score, key) => {
        const objective = objectives[key];
        if (objective.checker(G, ctx)) {
          return score + objective.weight;
        }
        return score;
      }, 0);

      // If so, stop and return the score.
      if (score !== undefined && score !== null) {
        return { score };
      }

      if (!moves || moves.length === 0) {
        return undefined;
      }

      const id = this.random(moves.length);
      const childState = (this as any).reducer(state, moves[id]);
      state = childState;
    }

    return state.ctx.gameover;
  }
}
