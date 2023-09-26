import { MCTSBot } from 'boardgame.io/ai';
import { AzulGameState } from '../models';
import { Ctx, PlayerID, State } from 'boardgame.io';
import { BotAction } from 'boardgame.io/dist/types/src/ai/bot';
import { Node } from 'boardgame.io/dist/types/src/ai/mcts-bot';
import { calculateScore } from '../moves';
import { Objectives, getFloorPenalty, getFullRowBonus, getOpenPatternPenalty } from '.';
import { getGameStateId } from '../gameStateId';

export class AzulBot4 extends MCTSBot {
  private _botPlayerID?: string = undefined;
  private _currentRound: number = 0;
  private _nodeCache = new Map<string, Node>();// : { [key: string]: Node } = {};

  _objectives(G: AzulGameState, ctx: Ctx, playerID?: string): Objectives {
    if (!this._botPlayerID || !G.score) return {};

    // no score for white tile

    var selectedTiles = G.tiles.filter(x => x.selected);
    if (selectedTiles.length && selectedTiles[0].color === 'white') return {
      'no-score': {
        checker: () => true,
        //weight: selectedTiles[0].color === 'white' ? -100 : 0
        weight: -100
      },
    };


    // calculate new score
    var gameCopy = JSON.parse(JSON.stringify(G));
    calculateScore(gameCopy, ctx)
    var newGameScore = gameCopy.score as AzulGameState['score'];

    // get real last player
    var lastPlayerIndex = ctx.playOrderPos > 0 ? ctx.playOrderPos - 1 : ctx.playOrder.length - 1;
    var lastPlayerId = ctx.playOrder[lastPlayerIndex];
    // var wasBotMove = this._botPlayerID === lastPlayerId;
    var targetPlayer = lastPlayerId // this._botPlayerID;  // lastPlayerId; // this._botPlayerID

    //var scoreSum = Object.keys(newGameScore).reduce((sum, key) => { return sum + newGameScore[key].points }, 0);
    var targetScore = newGameScore[targetPlayer].points;
    //var targetScore = scoreSum; // ownScore - ((scoreSum - ownScore) / (ctx.numPlayers - 1));

    if (ctx.gameover) {
      ctx.gameover = { score: ctx.gameover.winnerPlayerScore, winner: ctx.gameover.winnerPlayerId };
    } else if (this._currentRound !== G.round) {
      ctx.gameover = { score: targetScore };
    }

    return {
      'targetScore': {
        checker: () => true,
        weight: targetScore
      },
      'full-row-bonus': {
        checker: () => true,
        weight: getFullRowBonus(G, targetPlayer)
      },
      'floor-penalty': {
        checker: () => true,
        weight: getFloorPenalty(G, targetPlayer)
      },
      'open-pattern-penalty': {
        checker: () => true,
        weight: getOpenPatternPenalty(G, targetPlayer)
      }
    }
  }

  constructor(options: any) {
    var myObjectives = (G: AzulGameState, ctx: Ctx, playerId: string) => this._objectives(G, ctx, playerId);

    super({ playoutDepth: 50, objectives: myObjectives, ...options });

    var testId = 0;

    var oldCreateNode = (this as any).createNode; // monkey hack
    (this as any).createNode = ({ state, parentAction, parent, playerID, }:
      { state: State; parentAction?: BotAction; parent?: Node; playerID?: PlayerID; }): Node => {
      const { G, ctx } = state;
      var id = getGameStateId(G, ctx) + JSON.stringify(parentAction);// + playerID;
      //var id = '' + (testId++);
      if (!this._nodeCache.has(id)) {
        this._nodeCache.set(id, oldCreateNode.call(this, { state, parentAction, parent, playerID }));
      }
      var node = this._nodeCache.get(id)!;
      node.parent = parent;
      return node;
    }
  }

  play(state: State<AzulGameState>, playerID: string): Promise<{ action: BotAction; metadata: Node; }> {
    this._botPlayerID = playerID;

    // cache reset on new round
    if (this._currentRound !== state.G.round) {
      this._nodeCache = new Map(); //{};
    }

    this._currentRound = state.G.round;
    return super.play(state, playerID);
  }

  playout({ state }: Node) {
    if (state.ctx.gameover) {
      return state.ctx.gameover;
    }

    const { G, ctx } = state;
    let playerID = ctx.currentPlayer;
    if (ctx.activePlayers) {
      playerID = Object.keys(ctx.activePlayers)[0];
    }

    // Check if any objectives are met.
    const objectives = (this as any).objectives(G, ctx, playerID);
    const score = Object.keys(objectives).reduce((score, key) => {
      const objective = objectives[key];
      if (objective.checker(G, ctx)) {
        return score + objective.weight;
      }
      return score;
    }, 0);

    return { score };
  }

}
