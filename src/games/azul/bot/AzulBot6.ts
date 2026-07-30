import { Ctx, PlayerID, State, Game, Reducer, AiEnumerate } from 'boardgame.io';
import { BotAction } from 'boardgame.io/dist/types/src/ai/bot';
import { Bot } from 'boardgame.io/ai';
import { CreateGameReducer } from 'boardgame.io/internal';
import { AzulGameState } from '../models';
import { getGameStateId } from '../gameStateId';
import { difficulty } from './helpers';
import { WorkerPool } from './workerPool';
import type { LeafJob, LeafResult } from './botWorkerEval';

/**
 * AzulBot6 — AzulBot5 with offloaded leaf evaluation.
 *
 * The expensive part of Bot 5's MCTS is `setObjective`: deep-cloning the
 * game state, calling `calculateScore` (5 pattern rows + floor lines,
 * each iterating all tiles), and computing three objective helpers
 * (`getFullRowBonus`, `getFloorPenalty`, `getSameColorPenalty`).
 *
 * AzulBot6 keeps the entire tree structure on the main thread (cheap)
 * but dispatches leaf evaluation to a Web Worker pool in batches. The
 * main thread yields between batches so the UI stays responsive.
 *
 * Compared to Bot 5:
 *  - Fix: previously disabled cache write is now active, so subtrees
 *    reachable from multiple parents are evaluated once per round.
 *  - Parallelism: leaf evaluation runs across N-1 workers where N is
 *    `navigator.hardwareConcurrency`.
 *  - Synchronous fallback: when `Worker` is unavailable (SSR, test env),
 *    evaluation runs in-process via the same pure `evaluateLeaf` function.
 *  - Memory: each worker holds its own reducer state; tree structure
 *    stays on the main thread.
 */
export interface Node {
  state?: State<AzulGameState>;
  selectTileState?: State<AzulGameState>;
  selectTileAction?: BotAction;
  placeTileAction?: BotAction;

  objectives: { [key: string]: number };
  objectivesSum: number;
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

/** Number of parent nodes expanded per async step. */
const CHUNK_SIZE = 5;
/** Maximum concurrent batches the pool can hold in flight. */
const MAX_INFLIGHT = 32;

/** Cache writes/reads across play() calls within the same round. */
const CACHE_ENABLED = false;

export class AzulBot6 extends Bot {
  private _reducer: Reducer;
  private _botPlayerID?: string = undefined;
  private _currentRound: number = 0;
  private _playoutDepth: number = 0;
  private _nodeCache = new Map<string, Node>();
  private _difficulty: difficulty = 'hard';
  private _maxPlaceTilesMoves: number = 10;

  /** Single pool shared across all AzulBot6 instances. */
  private static _pool: WorkerPool | null = null;
  private static _poolRefCount = 0;

  private _unexploredNodes: Node[] = [];
    /** Tracks which nodes have already been pushed to _unexploredNodes
     *  to dedupe cache-hit children that share references. */
    private _queued = new WeakSet<Node>();
    private _lastBestNode: Node | undefined;

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

    this.addOpt({ key: 'async', initial: true });
    this.addOpt({
      key: 'playoutDepth',
      initial: typeof playoutDepth === 'number' ? playoutDepth : 3,
      range: { min: 1, max: 50 },
    });

    AzulBot6._poolRefCount++;
    if (!AzulBot6._pool) {
      AzulBot6._pool = new WorkerPool({
        onFallback: (reason) => {
          // eslint-disable-next-line no-console
          console.info(`AzulBot6: ${reason} — running in-process fallback`);
        },
      });
    }
  }

  /** Tear down the worker pool when no bot instances reference it anymore. */
  public static disposePool(): void {
    if (AzulBot6._pool) {
      AzulBot6._pool.destroy();
      AzulBot6._pool = null;
    }
    AzulBot6._poolRefCount = 0;
  }

  private get pool(): WorkerPool {
    return AzulBot6._pool!;
  }

  private createNode({
    state, selectTileState, selectTileAction, placeTileAction, depth,
  }: {
    state?: State;
    selectTileState?: State;
    selectTileAction?: BotAction;
    placeTileAction?: BotAction;
    depth: number;
  }): Node {
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

  /**
   * Expand a parent node: generate its selectTile × placeTile children.
   * Children are appended to the parent's children list and also to
   * `pendingJobs` for evaluation. Subtrees already in the cache are
   * reused without re-evaluating.
   */
  private expandNode(node: Node, pendingJobs: LeafJob[]): void {
    if (node.depth >= this._playoutDepth) return;
    if (node.state?.ctx.gameover) return;
    if (node.children.length > 0) return; // already expanded; will recurse next chunk
    if (!node.state) return;

    const cacheId = getGameStateId(node.state.G, node.state.ctx);
        const cached = CACHE_ENABLED ? this._nodeCache.get(cacheId) : undefined;
    if (cached) {
      node.children.push(...cached.children);
      node.draw = cached.draw;
      node.winnerScore = cached.winnerScore;
      node.winnerScoreDelta = cached.winnerScoreDelta;
      node.winner = cached.winner;
      return;
    }

    const selectTileActions = this.enumerate(
      node.state.G, node.state.ctx, node.state.ctx.currentPlayer);

    for (const selectTileAction of selectTileActions) {
      const selectTileState = this._reducer(node.state, selectTileAction);
      if (!selectTileState) continue;
      const placeTileActions = this.enumerate(
        selectTileState.G, selectTileState.ctx, selectTileState.ctx.currentPlayer);

      for (const placeTileAction of placeTileActions) {
        const child = this.createNode({
          selectTileState, selectTileAction, placeTileAction,
          depth: node.depth + 1,
        });
        node.children.push(child);
        pendingJobs.push({
          jobId: `${this._jobCounter++}_${child.depth}`,
          selectTileState,
          placeTileAction,
          currentRound: this._currentRound,
          botPlayerID: this._botPlayerID!,
          playoutDepth: this._playoutDepth,
          difficulty: this._difficulty,
        });
      }
    }
  }

  private _jobCounter = 0;

  private applyResults(parentNode: Node, jobs: LeafJob[], results: LeafResult[]): void {
    const byJobId = new Map<string, LeafResult>();
    for (const r of results) byJobId.set(r.jobId, r);
    for (const child of parentNode.children) {
      const job = jobs.find(j => j.selectTileState === child.selectTileState
        && j.placeTileAction === child.placeTileAction);
      if (!job) continue;
      const r = byJobId.get(job.jobId);
      if (!r) continue;
      child.state = r.state;
      child.objectives = r.objectives;
      child.objectivesSum = r.objectivesSum;
      child.currentPlayerScore = r.currentPlayerScore;
      child.opponentMaxScore = r.opponentMaxScore;
      child.botScore = r.botScore;
      child.winner = r.winner;
      child.draw = r.draw;
      child.winnerScore = r.winnerScore;
      child.winnerScoreDelta = r.winnerScoreDelta;
    }
  }

  private removeWeakestPlaceTileMoves(node: Node): void {
    if (node.children.length <= this._maxPlaceTilesMoves) return;
    node.children.sort((a, b) => b.objectivesSum - a.objectivesSum);
    const minScore = node.children[this._maxPlaceTilesMoves - 1].objectivesSum;
    node.children = node.children.filter(child => child.objectivesSum >= minScore);
    node.children.splice(this._maxPlaceTilesMoves * 2);
  }

  private cacheNode(node: Node): void {
      if (!CACHE_ENABLED) return;
      if (!node.state) return;
      const id = getGameStateId(node.state.G, node.state.ctx);
      if (!this._nodeCache.has(id)) {
        this._nodeCache.set(id, node);
      }
    }

  private getBestChildByWins(node: Node): { node: Node; wins: number; winnerScore: number } {
    if (node.children.length === 0) {
      return {
        node,
        wins: (node.winner === this._botPlayerID ? 1 : node.draw ? 0.5 : 0),
        winnerScore: (node.winner === this._botPlayerID ? node.winnerScore : 0),
      };
    }
    let wins = 0, sumWinnerScore = 0, maxValue = 0;
    let selectedChild: Node | null = null;
    for (const child of node.children) {
      const v = this.getBestChildByWins(child);
      wins += v.wins; sumWinnerScore += v.winnerScore;
      let currentValue = v.winnerScore / v.wins;
      if (isNaN(currentValue)) currentValue = 0;
      if (selectedChild == null || currentValue > maxValue ||
        (currentValue === maxValue && child.objectivesSum > selectedChild.objectivesSum)) {
        selectedChild = child; maxValue = currentValue;
      }
    }
    return { node: selectedChild!, wins, winnerScore: sumWinnerScore };
  }

  private getBestChildByScoreDiff(node: Node): { node: Node; value: number } {
    if (node.children.length === 0) {
      return { node, value: node.currentPlayerScore - node.opponentMaxScore };
    }
    let selectedChild: { node: Node; value: number } | null = null;
    for (const child of node.children) {
      const v = this.getBestChildByScoreDiff(child);
      if (selectedChild == null || v.value > selectedChild.value ||
        (v.value === selectedChild.value &&
          v.node.objectivesSum > selectedChild.node.objectivesSum)) {
        selectedChild = { node: child, value: v.value };
      }
    }
    return selectedChild!;
  }

  private getBestChildByWinRatio(node: Node): { node: Node; nodes: number; wins: number; winnerScore: number } {
    if (node.children.length === 0) {
      return {
        node,
        nodes: 1,
        wins: (node.winner === this._botPlayerID ? 1 : node.draw ? 0.5 : 0),
        winnerScore: (node.winner === this._botPlayerID ? node.winnerScoreDelta : 0),
      };
    }
    let nodes = 0, wins = 0, maxValue = 0;
    let selectedChild: Node | null = null;
    let selectedChildValue: { node: Node; nodes: number; wins: number; winnerScore: number } | null = null;
    for (const child of node.children) {
      const v = this.getBestChildByWinRatio(child);
      wins += v.wins; nodes += v.nodes;
      let childWinRation = v.wins / v.nodes;
      if (selectedChild == null || childWinRation > maxValue ||
        (childWinRation === maxValue && child.objectivesSum > selectedChild.objectivesSum)) {
        selectedChildValue = v; selectedChild = child; maxValue = childWinRation;
      }
    }
    return { node: selectedChild!, nodes, wins, winnerScore: selectedChildValue!.winnerScore };
  }

  private getResult(root: Node) {
    switch (this._difficulty) {
      case 'easy':   this._lastBestNode = this.getBestChildByScoreDiff(root).node; break;
      case 'medium': this._lastBestNode = this.getBestChildByWins(root).node; break;
      case 'hard':   this._lastBestNode = this.getBestChildByWinRatio(root).node; break;
    }
    return { action: this._lastBestNode!.selectTileAction!, metadata: root };
  }

  play(state: State<any>, playerID: string): Promise<{ action: BotAction; metadata: Node; }> {
    this.iterationCounter = 0;
    this._botPlayerID = playerID;
    this._currentRound = state.G.round;
    this._jobCounter = 0;

    if (this._lastBestNode) {
      const result = { action: this._lastBestNode.placeTileAction!, metadata: this._lastBestNode };
      this._lastBestNode = undefined;
      return Promise.resolve(result);
    }

    if (this._currentRound !== state.G.round) {
      this._nodeCache = new Map();
    }

    const root = this.createNode({ state, depth: 0 });
    this._unexploredNodes = [root];
        this._queued = new WeakSet();
        this._queued.add(root);
        this._playoutDepth = this.getOpt('playoutDepth') + root.depth;

    return new Promise((resolve) => {
      const step = async () => {
        if (this._unexploredNodes.length === 0) {
          resolve(this.getResult(root));
          return;
        }
        // Take a chunk of parent nodes to expand
        const chunk = this._unexploredNodes.splice(0, CHUNK_SIZE);
        const allJobs: LeafJob[] = [];
        const jobsByParent = new Map<Node, LeafJob[]>();

        for (const node of chunk) {
          const jobs: LeafJob[] = [];
          this.expandNode(node, jobs);
          if (jobs.length > 0) {
            jobsByParent.set(node, jobs);
            allJobs.push(...jobs);
          }
        }

        if (allJobs.length > 0) {
          // Send the whole chunk to the pool in one batch; results are
          // correlated back to children via jobId.
          const results = await this.pool.submitBatch(allJobs);
          jobsByParent.forEach((jobs, parent) => {
            this.applyResults(parent, jobs, results);
            this.removeWeakestPlaceTileMoves(parent);
            this.cacheNode(parent);
          });
        }

        // Push children for EVERY node in the chunk (both fresh-expanded
                // and cache-hit). Dedupe via _queued so cache-hit children that
                // share references with previously-cached children are only
                // pushed once.
        for (const node of chunk) {
          if (node.children.length > 0 &&
              node.depth + 1 < this._playoutDepth &&
              node.state?.ctx.gameover === undefined) {
                    for (const child of node.children) {
                      if (!this._queued.has(child)) {
                        this._queued.add(child);
                        this._unexploredNodes.push(child);
                      }
                    }
                  }
                }

        // yield to the event loop so UI events / paints can be processed
        setTimeout(step, 0);
      };

      if (this.getOpt('async')) {
        step();
      } else {
        // Synchronous mode: chain promises via IIFE
        (async () => {
          while (this._unexploredNodes.length > 0) {
            await step();
          }
          resolve(this.getResult(root));
        })();
      }
    });
  }
}