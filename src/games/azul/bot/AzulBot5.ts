import { Ctx, PlayerID, State, Game, Reducer, AiEnumerate } from 'boardgame.io';
import { BotAction } from 'boardgame.io/dist/types/src/ai/bot';
import { Bot } from 'boardgame.io/ai';
import { CreateGameReducer } from 'boardgame.io/internal';
import { AzulGameState } from '../models';
import { calculateScore } from '../moves';
import { difficulty, getFloorPenalty, getFullRowBonus, getSameColorPenalty } from '.';
import { getGameStateId } from '../gameStateId';

export interface Node {
  /** Game state at this node. */
  state?: State<AzulGameState>;
  selectTileState?: State<AzulGameState>;
  /** Move used to get to this node. */
  selectTileAction?: BotAction;
  placeTileAction?: BotAction;

  /** Current objectives. */
  objectives: { [key: string]: number };
  objectivesSum: number;
  /** Children of the node. */
  children: Node[];

  depth: number;

  currentPlayerScore: number;
  opponentMaxScore: number;
  botScore: number;
  winnerScore: number;
  winnerScoreDelta: number;
  currentPlayerScoreDelta: number;
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
  private _difficulty: difficulty = 'hard';

  constructor({ enumerate, seed, game, playoutDepth, difficulty }: {
    enumerate: (G: AzulGameState, ctx: Ctx, playerID: PlayerID) => AiEnumerate;
    seed?: string | number;
    game: Game;
    playoutDepth?: number;
    difficulty?: difficulty;
  }) {
    super({ enumerate, seed });

    this._difficulty = difficulty || 'hard';
    this._reducer = CreateGameReducer({ game });

    this.addOpt({
      key: 'async',
      initial: true,
    });

    this.addOpt({
      key: 'playoutDepth',
      initial: typeof playoutDepth === 'number' ? playoutDepth : 3,
      range: { min: 1, max: 50 },
    });
  }

  private createNode({ state, selectTileState, selectTileAction, placeTileAction, depth }:
    { state?: State, selectTileState?: State, selectTileAction?: BotAction, placeTileAction?: BotAction, depth: number }): Node {

    if (state) {
      var id = getGameStateId(state.G, state.ctx);
      if (this._nodeCache.has(id)) {
        var node = this._nodeCache.get(id)!;
        return { ...node, state, selectTileState, selectTileAction, placeTileAction };
      }
    }

    return {
      state,
      selectTileState,
      placeTileAction,
      selectTileAction,
      objectives: {},
      objectivesSum: 0,
      children: [],
      depth,
      currentPlayerScore: 0,
      opponentMaxScore: 0,
      botScore: 0,
      winnerScore: 0,
      winnerScoreDelta: 0,
      currentPlayerScoreDelta: 0,
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
    var maxScoreDelta = 999;
    var winner: string | undefined = undefined;
    var draw = false;
    Object.keys(newGameScore).forEach(key => {
      const playerScore = newGameScore[key].points;
      if (playerScore === maxScore) {
        draw = true;
        winner = undefined;
      } else if (playerScore > maxScore) {
        maxScore = playerScore;
        winner = key;
        draw = false;
      } else {
        const delta = maxScore - playerScore;
        if (delta < maxScoreDelta) {
          maxScoreDelta = delta;
        }
      }

      if (key !== playerID && playerScore > node.opponentMaxScore) {
        node.opponentMaxScore = playerScore;
      }
    });

    if (ctx.gameover || this._currentRound !== G.round) { // Spielende / Rundenende
      ctx.gameover = { winner, draw, score: maxScore };
    }

    if (ctx.gameover || node.depth >= this._playoutDepth) { // end or depth reached
      node.winner = winner;
      node.draw = draw;
      node.winnerScore = maxScore;
      node.winnerScoreDelta = maxScoreDelta;
    }

    node.botScore = newGameScore[this._botPlayerID!].points
    node.currentPlayerScore = newGameScore[playerID].points;
    node.currentPlayerScoreDelta = newGameScore[playerID].points - node.opponentMaxScore;
    node.objectives = {
      'targetScore': newGameScore[playerID].points,
      'full-row-bonus': getFullRowBonus(G, playerID),
      'floor-penalty': getFloorPenalty(G, playerID),
      // 'open-pattern-penalty': getOpenPatternPenalty(G, playerID)
    };

    if (this._difficulty === 'hard') {
      node.objectives['same-color-penalty'] = getSameColorPenalty(G, playerID);
    }

    node.objectivesSum = Object.values(node.objectives).reduce((score, value) => score + value, 0);
  }

  playout(node: Node): void {
    if (!node.placeTileAction?.payload.playerID || !node.selectTileState) return;

    this.iterationCounter++;
    node.state = this._reducer(node.selectTileState, node.placeTileAction!) as State<AzulGameState>;
    this.setObjective(node);
  }

  private expandChildNodes(node: Node): void {
    // max depth reached
    if (node.depth >= this._playoutDepth) return;

    // end
    if (node.state?.ctx.gameover) return;

    // allready has child nodes
    if (node.children.length > 0) {
      node.children.forEach(child => this.expandChildNodes(child));
      return;
    }

    if (!node.state) return;

    // try get children from cache
    const cacheId = getGameStateId(node.state.G, node.state.ctx);
    if (this._nodeCache.has(cacheId)) {
      const cachedNode = this._nodeCache.get(cacheId)!;
      node.children.push(...cachedNode.children);
      node.draw = cachedNode.draw;
      node.winnerScore = cachedNode.winnerScore;
      node.winnerScoreDelta = cachedNode.winnerScoreDelta;
      node.winner = cachedNode.winner;
    } else {
      // next select tile moves
      const selectTileActions = this.enumerate(node.state.G, node.state.ctx, node.state.ctx.currentPlayer);

      // has unexplored nodes
      selectTileActions.forEach(selectTileAction => {
        // play select move
        const selectTileState = this._reducer(node.state!, selectTileAction);
        // create place tile node
        const placeTileActions = this.enumerate(selectTileState.G, selectTileState.ctx, selectTileState.ctx.currentPlayer);
        placeTileActions.forEach(placeTileAction => {
          const newNode = this.createNode({ selectTileState, selectTileAction, placeTileAction, depth: node.depth + 1 });
          node.children.push(newNode);
        });
      });

      node.children.forEach(child => this.playout(child));

      this.removeWeakestPlaceTileMoves(node);

      // store in cache
      //this._nodeCache.set(cacheId, node);
    }

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

  private getBestChildByWins(node: Node): { node: Node, wins: number, winnerScore: number } {
    if (node.children.length === 0) {
      return {
        node,
        wins: (node.winner === this._botPlayerID ? 1 : node.draw ? 0.5 : 0),
        winnerScore: (node.winner === this._botPlayerID ? node.winnerScore : 0)
      };
    }

    let wins = 0;
    let sumWinnerScore = 0;
    let maxValue = 0;
    let selectedChild: Node | null = null;
    for (const child of node.children) {
      const childValue = this.getBestChildByWins(child);
      wins += childValue.wins;
      sumWinnerScore += childValue.winnerScore;
      let currentValue = childValue.winnerScore / childValue.wins;
      if (isNaN(currentValue)) currentValue = 0;

      if (selectedChild == null || currentValue > maxValue ||
        ((currentValue === maxValue) && child.objectivesSum > selectedChild.objectivesSum)
      ) {
        selectedChild = child;
        maxValue = currentValue;
      }
    }
    return { node: selectedChild!, wins: wins, winnerScore: sumWinnerScore };
  }

  private getBestChildByScoreDiff(node: Node): { node: Node, value: number } {
    if (node.children.length === 0) {
      return { node, value: (node.currentPlayerScore - node.opponentMaxScore) };
    }

    let selectedChild: { node: Node, value: number } | null = null;
    for (const child of node.children) {
      const childValue = this.getBestChildByScoreDiff(child);
      if (selectedChild == null ||
        childValue.value > selectedChild.value ||
        (childValue.value === selectedChild.value &&
          childValue.node.objectivesSum > selectedChild.node.objectivesSum)
      ) {
        selectedChild = { node: child, value: childValue.value };
      }
    }
    return selectedChild!;
  }

  private getBestChildByWinRatio(node: Node): { node: Node, nodes: number, wins: number, winnerScore: number } {
    if (node.children.length === 0) {
      return {
        node,
        nodes: 1,
        wins: (node.winner === this._botPlayerID ? 1 : node.draw ? 0.5 : 0),
        winnerScore: (node.winner === this._botPlayerID ? node.winnerScoreDelta : 0)
      };
    }

    let nodes = 0;
    let wins = 0;
    // let sumWinnerScore = 0;
    let maxValue = 0;
    let selectedChild: Node | null = null;
    let selectedChildValue: { node: Node, nodes: number, wins: number, winnerScore: number } | null = null;
    for (const child of node.children) {
      const childValue = this.getBestChildByWinRatio(child);

      wins += childValue.wins;
      nodes += childValue.nodes;
      // sumWinnerScore += childValue.winnerScore;

      let childWinRation = childValue.wins / childValue.nodes;
      //let childValue = result.wins * result.winnerScore;
      //if (isNaN(childWinRation)) childWinRation = 0;

      if (selectedChild == null || childWinRation > maxValue ||
        ((childWinRation === maxValue) && child.objectivesSum > selectedChild.objectivesSum)
        //((childWinRation === maxValue) && childValue.winnerScore > selectedChildValue!.winnerScore)
      ) {
        selectedChildValue = childValue;
        selectedChild = child;
        maxValue = childWinRation;
      }
    }
    return { node: selectedChild!, nodes, wins, winnerScore: selectedChildValue!.winnerScore };
  }

  private getResult(node: Node) {
    switch (this._difficulty) {
      case 'easy':
        this._lastBestNode = this.getBestChildByScoreDiff(node).node;
        break;
      case 'medium':
        this._lastBestNode = this.getBestChildByWins(node).node;
        break;
      case 'hard':
        this._lastBestNode = this.getBestChildByWinRatio(node).node;
        break;
    }
    return { action: this._lastBestNode.selectTileAction!, metadata: node };
  };

  private _lastBestNode: Node | undefined;
  private _unexploredNodes: Node[] = [];

  play(state: State<any>, playerID: string): Promise<{ action: BotAction; metadata: Node; }> {
    this.iterationCounter = 0;
    this._botPlayerID = playerID;
    this._currentRound = state.G.round;


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
            resolve(this.getResult(root));
          }
        };
        asyncIteration();
      } else {
        while (this._unexploredNodes.length > 0) {
          iteration();
        }
        resolve(this.getResult(root));
      }
    });
  }
}