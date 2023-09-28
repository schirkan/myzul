import { Ctx, PlayerID, State, Game, Reducer, AiEnumerate } from 'boardgame.io';
import { BotAction } from 'boardgame.io/dist/types/src/ai/bot';
import { Bot } from 'boardgame.io/ai';
import { CreateGameReducer } from 'boardgame.io/internal';
import { AzulGameState } from '../models';
import { calculateScore } from '../moves';
import { getFloorPenalty, getFullRowBonus, getOpenPatternPenalty } from '.';
import { getGameStateId } from '../gameStateId';
//import { getGameStateId } from '../gameStateId';

export interface Node {
  /** Game state at this node. */
  state?: State<AzulGameState>;
  /** Parent of the node. */
  parent?: Node;
  /** Move used to get to this node. */
  parentAction?: BotAction;
  /** Unexplored actions. */
  actions: BotAction[];
  /** Current objectives. */
  objectives: { [key: string]: number };
  /** Children of the node. */
  children: Node[];
  /** Number of simulations that pass through this node. */
  visits: number;
  /** Number of wins for this node. */
  wins: number;

  depth: number;

  score: number;
  draw?: boolean;
  winner?: PlayerID;
}

/**
 * The number of iterations to run before yielding to
 * the JS event loop (in async mode).
 */
const CHUNK_SIZE = 25;

export class AzulBot5 extends Bot {
  private _botPlayerID?: string = undefined;
  private _currentRound: number = 0;
  private reducer: Reducer;
  private _playoutDepth: number = 0;
  private _iterations: number = 0;
  private _nodeCache = new Map<string, Node>();

  constructor({ enumerate, seed, game, iterations, playoutDepth, }: {
    enumerate: (G: AzulGameState, ctx: Ctx, playerID: PlayerID) => AiEnumerate;
    seed?: string | number;
    game: Game;
    iterations?: number;
    playoutDepth?: number;
  }) {
    super({ enumerate, seed });

    this.reducer = CreateGameReducer({ game });

    this.addOpt({
      key: 'async',
      initial: true,
    });

    this.addOpt({
      key: 'iterations',
      initial: typeof iterations === 'number' ? iterations : 100,
      range: { min: 1, max: 2000 },
    });

    this.addOpt({
      key: 'playoutDepth',
      initial: typeof playoutDepth === 'number' ? playoutDepth : 5,
      range: { min: 1, max: 100 },
    });
  }

  private createNode({ state, parentAction, parent, depth }:
    { state?: State, parentAction?: BotAction, parent?: Node, depth: number }): Node {

    if (state) {
      var id = getGameStateId(state.G, state.ctx);
      if (this._nodeCache.has(id)) {
        var node = this._nodeCache.get(id)!;
        node.parent = parent;
        return node;
      }
    }

    return {
      state,
      parent,
      parentAction,
      actions: [],
      objectives: {},
      children: [],
      visits: 0,
      wins: 0,
      depth,
      score: 0
    };
  }

  objectives(G: AzulGameState, ctx: Ctx, playerID: string): { [key: string]: number } {
    if (!this._botPlayerID || !G.score) return {};

    // no score for white tile    
    if (G.tiles.some(x => x.selected && x.color === 'white')) return { 'no-score': -100 };

    // calculate new score
    var gameCopy = JSON.parse(JSON.stringify(G)) as AzulGameState;
    calculateScore(gameCopy, ctx)
    var newGameScore = gameCopy.score;

    //var scoreSum = Object.keys(newGameScore).reduce((sum, key) => { return sum + newGameScore[key].points }, 0);
    var targetScore = newGameScore[playerID].points;
    //var targetScore = scoreSum; // ownScore - ((scoreSum - ownScore) / (ctx.numPlayers - 1));

    if (ctx.gameover) { // Spielende
      ctx.gameover = { score: ctx.gameover.winnerPlayerScore, winner: ctx.gameover.winnerPlayerId };
    } else if (this._currentRound !== G.round) { // Rundenende
      var maxScore = 0;
      var winner: string | undefined = undefined;
      var draw = false;
      Object.keys(newGameScore).forEach(key => {
        if (newGameScore[key].points === maxScore) {
          draw = true;
          winner = undefined;
        } else if (newGameScore[key].points > maxScore) {
          maxScore = newGameScore[key].points;
          winner = key;
          draw = false;
        }
      });

      ctx.gameover = { winner, draw, score: maxScore };
    }

    return {
      'targetScore': targetScore,
      'full-row-bonus': getFullRowBonus(G, playerID),
      'floor-penalty': getFloorPenalty(G, playerID),
      'open-pattern-penalty': getOpenPatternPenalty(G, playerID)
    }
  }

  private select(node: Node): Node {
    // This node has unvisited children.
    if (node.actions.length > 0) {
      return node;
    }

    // This is a terminal node. // TODO: gameover
    if (node.children.length === 0) {
      return node;
    }

    let selectedChild = null;
    let best = 0;

    for (const child of node.children) {
      const childVisits = child.visits + Number.EPSILON;
      const uct =
        child.wins / childVisits + // TODO:
        //child.score / childVisits + // TODO:
        //child.objectives['targetScore'] / childVisits + // TODO:
        Math.sqrt((2 * Math.log(node.visits)) / childVisits);
      if (selectedChild == null || uct > best) {
        best = uct;
        selectedChild = child;
      }
    }

    return this.select(selectedChild!);
  }

  private expand(node: Node) {
    const actions = node.actions;

    if (actions.length === 0 || (node.state && node.state.ctx.gameover !== undefined)) {
      return node;
    }

    const id = this.random(actions.length);
    const action = actions[id];
    node.actions.splice(id, 1);
    const childNode = this.createNode({ parent: node, parentAction: action, depth: node.depth + 1 });
    node.children.push(childNode);
    return childNode;
  }

  playout(node: Node): { score?: number, winner?: string, draw?: boolean } {
    if (!node.parentAction?.payload.playerID || !node.parent?.state) return {};
    let playerID = node.parentAction.payload.playerID;
    node.state = this.reducer(node.parent.state, node.parentAction) as State<AzulGameState>;
    const { G, ctx } = node.state;
    node.objectives = this.objectives(G, ctx, playerID);

    this._nodeCache.set(getGameStateId(G, ctx) + JSON.stringify(node.parentAction), node);

    if (node.depth < this._playoutDepth && !ctx.gameover) {
      // next moves
      node.actions = this.enumerate(G, ctx, ctx.currentPlayer);
      // go deeper
      var child = this.expand(node);
      return this.playout(child);
    } else {
      if (ctx.gameover) {
        node.winner = ctx.gameover.winner;
        node.draw = ctx.gameover.draw;
        node.score = ctx.gameover.score;
      } else {
        var newGameScore = G.score;
        node.score = 0;
        node.winner = undefined;
        node.draw = false;
        Object.keys(newGameScore).forEach(key => {
          if (newGameScore[key].points === node.score) {
            node.draw = true;
            node.winner = undefined;
          } else if (newGameScore[key].points > node.score!) {
            node.score = newGameScore[key].points;
            node.winner = key;
            node.draw = false;
          }
        });
      }

      return { winner: node.winner, draw: node.draw, score: node.score }
    }
  }

  private backpropagate(
    node: Node,
    result: { score?: number; draw?: boolean; winner?: PlayerID } = {}
  ) {
    node.visits++;

    if (result.score !== undefined) {
      node.score += result.score;
    }

    if (result.draw === true) {
      node.wins += 0.5;
    }

    if (node.parentAction && result.winner === node.parentAction.payload.playerID) {
      node.wins++;
    }

    if (node.parent) {
      this.backpropagate(node.parent, result);
    }
  }

  private getBestChild(node: Node): Node {
    let selectedChild: Node | null = null;
    for (const child of node.children) {
      if (selectedChild == null || child.visits > selectedChild.visits) { // TODO:
        selectedChild = child;
      }
    }
    return selectedChild!;
  }

  play(state: State<any>, playerID: string): Promise<{ action: BotAction; metadata: Node; }> {
    this._botPlayerID = playerID;
    this._currentRound = state.G.round;

    this._iterations = this.getOpt('iterations');
    this._playoutDepth = this.getOpt('playoutDepth');

    // cache reset on new round
    if (this._currentRound !== state.G.round) {
      this._nodeCache = new Map(); //{};
    }

    const root = this.createNode({ state, depth: 0 });
    root.actions = this.enumerate(state.G, state.ctx, state.ctx.currentPlayer);

    const getResult = () => {
      const bestChild = this.getBestChild(root);
      return { action: bestChild.parentAction!, metadata: root };
    };

    const iteration = () => {
      for (
        let i = 0;
        i < CHUNK_SIZE && this.iterationCounter < this._iterations;
        i++
      ) {
        const leaf = this.select(root);
        const child = this.expand(leaf);
        const result = this.playout(child);
        this.backpropagate(child, result);
        this.iterationCounter++;
      }
    };

    return new Promise((resolve) => {
      this.iterationCounter = 0;

      if (this.getOpt('async')) {
        const asyncIteration = () => {
          if (this.iterationCounter < this._iterations) {
            iteration();
            setImmediate(asyncIteration);
          } else {
            resolve(getResult());
          }
        };
        asyncIteration();
      } else {
        while (this.iterationCounter < this._iterations) {
          iteration();
        }
        resolve(getResult());
      }
    });
  }
}