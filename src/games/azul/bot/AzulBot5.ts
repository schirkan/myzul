import { Ctx, PlayerID, State, Game, Reducer, AiEnumerate } from 'boardgame.io';
import { BotAction } from 'boardgame.io/dist/types/src/ai/bot';
import { Bot } from 'boardgame.io/ai';
import { CreateGameReducer } from 'boardgame.io/internal';
import { AzulGameState } from '../models';
import { calculateScore } from '../moves';
import { getFloorPenalty, getFullRowBonus, getOpenPatternPenalty } from '.';
//import { getGameStateId } from '../gameStateId';

export interface Node {
  /** Game state at this node. */
  state?: State<AzulGameState>;
  selectTileState?: State<AzulGameState>;
  /** Parent of the node. */
  parent?: Node;
  /** Move used to get to this node. */
  selectTileAction?: BotAction;
  placeTileAction?: BotAction;

  /** Current objectives. */
  objectives: { [key: string]: number };
  objectivesSum: number;
  /** Children of the node. */
  children: Node[];

  /** Number of wins for this node. */
  wins: number;

  depth: number;

  currentPlayerScore: number;
  opponentMaxScore: number;
  botScore: number;
  winnerScore: number;
  draw?: boolean;
  winner?: PlayerID;
}

/**
 * The number of iterations to run before yielding to
 * the JS event loop (in async mode).
 */
const CHUNK_SIZE = 25;

export class AzulBot5 extends Bot {
  private _reducer: Reducer;
  private _botPlayerID?: string = undefined;
  private _currentRound: number = 0;
  private _playoutDepth: number = 0;
  private _nodeCache = new Map<string, Node>();

  constructor({ enumerate, seed, game, playoutDepth, }: {
    enumerate: (G: AzulGameState, ctx: Ctx, playerID: PlayerID) => AiEnumerate;
    seed?: string | number;
    game: Game;
    playoutDepth?: number;
  }) {
    super({ enumerate, seed });

    this._reducer = CreateGameReducer({ game });

    this.addOpt({
      key: 'async',
      initial: true,
    });

    this.addOpt({
      key: 'playoutDepth',
      initial: typeof playoutDepth === 'number' ? playoutDepth : 3,
      range: { min: 1, max: 100 },
    });
  }

  private createNode({ state, selectTileState, selectTileAction, placeTileAction, parent, depth }:
    { state?: State, selectTileState?: State, selectTileAction?: BotAction, placeTileAction?: BotAction, parent?: Node, depth: number }): Node {
    /* // TODO: caching
        if (state) {
          var id = getGameStateId(state.G, state.ctx);
          if (this._nodeCache.has(id)) {
            var node = this._nodeCache.get(id)!;
            node.parent = parent;
            node.selectTileAction = selectTileAction;
            node.placeTileAction = placeTileAction;
            return node;
          }
        }
    */
    return {
      state,
      selectTileState,
      parent,
      placeTileAction: placeTileAction,
      selectTileAction: selectTileAction,
      objectives: {},
      objectivesSum: 0,
      children: [],
      wins: 0,
      depth,
      currentPlayerScore: 0,
      opponentMaxScore: 0,
      botScore: 0,
      winnerScore: 0
    };
  }

  setObjective(node: Node) {
    if (!node?.state || !node.placeTileAction) return;

    const { G, ctx } = node.state;
    const playerID = node.placeTileAction.payload.playerID;

    if (!this._botPlayerID || !G.score) return {};

    // no score for white tile    
    if (G.tiles.some(x => x.selected && x.color === 'white')) return { 'no-score': -100 };

    // calculate new score
    var gameCopy = JSON.parse(JSON.stringify(G)) as AzulGameState;
    calculateScore(gameCopy, ctx)
    var newGameScore = gameCopy.score;

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

      if (key !== this._botPlayerID && newGameScore[key].points > node.opponentMaxScore) {
        node.opponentMaxScore = newGameScore[key].points;
      }
    });

    if (ctx.gameover || this._currentRound !== G.round) { // Spielende / Rundenende
      ctx.gameover = { winner, draw, score: maxScore };
    }

    if (ctx.gameover || node.depth >= this._playoutDepth) { // end or depth reached
      node.winner = winner;
      node.draw = draw;
      node.winnerScore = maxScore;
    }

    node.botScore = newGameScore[this._botPlayerID!].points
    node.currentPlayerScore = newGameScore[playerID].points;
    node.objectives = {
      'targetScore': newGameScore[playerID].points,
      'full-row-bonus': getFullRowBonus(G, playerID),
      'floor-penalty': getFloorPenalty(G, playerID),
      // 'open-pattern-penalty': getOpenPatternPenalty(G, playerID)
    };
    node.objectivesSum = Object.values(node.objectives).reduce((score, value) => score + value, 0);
  }

  playout(node: Node): void {
    if (!node.placeTileAction?.payload.playerID || !node.selectTileState) return;

    this.iterationCounter++;
    node.state = this._reducer(node.selectTileState, node.placeTileAction!) as State<AzulGameState>;
    this.setObjective(node);
  }

  private backpropagate(
    node: Node,
    result: { botScore?: number; winnerScore?: number; draw?: boolean; winner?: PlayerID } = {}
  ): void {
    if (result.botScore !== undefined) {
      node.botScore += result.botScore;
    }

    if (result.draw === true) {
      node.wins += 0.5;
    }

    if (node.selectTileAction && result.winner === node.selectTileAction.payload.playerID) {
      node.wins++;

      if (result.winnerScore !== undefined) {
        node.winnerScore += result.winnerScore;
      }
    }

    if (node.parent) {
      this.backpropagate(node.parent, result);
    }
  }

  private expandChildNodes(node: Node): void {
    // max depth reached
    if (node.depth >= this._playoutDepth) return;

    // end
    if (node.state?.ctx.gameover) return;

    // allready has child nodes
    if (node.children.length > 0) {
      node.children.forEach(this.expandChildNodes);
      return;
    }

    if (!node.state) return;

    // next select tile moves
    const selectTileActions = this.enumerate(node.state.G, node.state.ctx, node.state.ctx.currentPlayer);

    // has unexplored nodes
    selectTileActions.forEach(selectTileAction => {
      // play select move
      const selectTileState = this._reducer(node.state!, selectTileAction);
      // create place tile node
      const placeTileActions = this.enumerate(selectTileState.G, selectTileState.ctx, selectTileState.ctx.currentPlayer);
      placeTileActions.forEach(placeTileAction => {
        const newNode = this.createNode({ parent: node, selectTileState, selectTileAction, placeTileAction, depth: node.depth + 1 });
        node.children.push(newNode);
      });
    });

    node.children.forEach(child => this.playout(child));

    this.removeWeakestPlaceTileMoves(node);

    // backpropagate score
    node.children.forEach(child => this.backpropagate(child, child));

    // explore deeper
    if (node.depth + 1 < this._playoutDepth) {
      this._unexploredNodes.push(...node.children);
    }
  }

  private _maxPlaceTilesMoves: number = 10

  private removeWeakestPlaceTileMoves(node: Node): void {
    if (node.children.length <= this._maxPlaceTilesMoves) return;
    node.children.sort((a, b) => b.objectivesSum - a.objectivesSum);
    const minScore = node.children[this._maxPlaceTilesMoves - 1].objectivesSum;
    const optimizedChildren: Node[] = [];
    node.children.forEach(child => {
      if (child.objectivesSum >= minScore) optimizedChildren.push(child);
    });

    node.children = optimizedChildren;
    node.children.splice(this._maxPlaceTilesMoves * 2);
  }

  // TODO minimax
  private getBestChildMaxScoreDiff(node: Node): { node: Node, value: number } {
    if (node.children.length === 0) {
      //return { node, value: node.objectivesSum };
      return { node, value: node.currentPlayerScore - node.opponentMaxScore };
    }

    let selectedChild: { node: Node, value: number } | null = null;
    for (const child of node.children) {
      const childValue = this.getBestChildMaxScoreDiff(child);
      if (selectedChild == null || childValue.value > selectedChild.value) {
        selectedChild = { node: child, value: childValue.value };
      }
    }
    return selectedChild!;
  }

  private getBestChild(node: Node): Node {
    //return this.getBestChildMaxScoreDiff(node).node;

    let selectedChild: Node | null = null;

    for (const child of node.children) {
      // if (selectedChild == null || child.score / child.visits > selectedChild.score / selectedChild.visits) { // TODO:
      // if (selectedChild == null || child.botScore / child.wins > selectedChild.botScore / selectedChild.wins) { // TODO:
      if (selectedChild == null || child.winnerScore * child.wins > selectedChild.winnerScore * selectedChild.wins) { // TODO:
        // if (selectedChild == null || child.wins > selectedChild.wins) { // TODO:
        selectedChild = child;
      }
    }
    return selectedChild!;

  }

  private _lastBestNode: Node | undefined;
  private _unexploredNodes: Node[] = [];

  play(state: State<any>, playerID: string): Promise<{ action: BotAction; metadata: Node; }> {
    this.iterationCounter = 0;

    const getResult = (node: Node) => {
      this._lastBestNode = this.getBestChild(node);
      return { action: this._lastBestNode.selectTileAction!, metadata: node };
    };

    if (this._lastBestNode) {
      const result = { action: this._lastBestNode.placeTileAction!, metadata: this._lastBestNode };
      this._lastBestNode = undefined;
      return Promise.resolve(result);
    }

    // cache reset on new round
    if (this._currentRound !== state.G.round) {
      this._nodeCache = new Map();
    }

    const root = this.createNode({ state, depth: 0 });
    this._unexploredNodes.push(root);

    this._botPlayerID = playerID;
    this._currentRound = state.G.round;
    this._playoutDepth = this.getOpt('playoutDepth') + root.depth;

    const iteration = () => {
      for (let i = 0; i < CHUNK_SIZE && this._unexploredNodes.length > 0; i++) {
        const nextNode = this._unexploredNodes.splice(0, 1)[0];
        this.expandChildNodes(nextNode);
      }
    };

    return new Promise((resolve) => {
      if (this.getOpt('async')) {
        const asyncIteration = () => {
          if (this._unexploredNodes.length > 0) {
            iteration();
            setImmediate(asyncIteration);
          } else {
            resolve(getResult(root));
          }
        };
        asyncIteration();
      } else {
        while (this._unexploredNodes.length > 0) {
          iteration();
        }
        resolve(getResult(root));
      }
    });
  }
}