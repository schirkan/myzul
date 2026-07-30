/**
 * Pure leaf-evaluation function shared between the Web Worker
 * (botWorker.ts) and the in-process fallback (workerPool.ts).
 *
 * Keeping this in its own module — without the self.addEventListener
 * side effect — lets the pool dynamically import it when Web Workers
 * are not available.
 */
import { CreateGameReducer } from 'boardgame.io/internal';
import { State } from 'boardgame.io';
import { AzulGame } from '../Game';
import { calculateScore } from '../moves';
import { AzulGameState } from '../models';
import {
  getFloorPenalty,
  getFullRowBonus,
  getSameColorPenalty,
} from './helpers';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface LeafJob {
  jobId: string;
  selectTileState: State<AzulGameState>;
  placeTileAction: any;
  currentRound: number;
  botPlayerID: string;
  playoutDepth: number;
  difficulty: Difficulty;
}

export interface LeafResult {
  jobId: string;
  state: State<AzulGameState>;
  objectives: { [key: string]: number };
  objectivesSum: number;
  currentPlayerScore: number;
  opponentMaxScore: number;
  botScore: number;
  winner?: string;
  draw?: boolean;
  winnerScore: number;
  winnerScoreDelta: number;
}

const reducer = CreateGameReducer({ game: AzulGame });

export function evaluateLeaf(job: LeafJob): LeafResult {
  const state = reducer(job.selectTileState, job.placeTileAction) as State<AzulGameState>;
  const { G, ctx } = state;
  const playerID = job.placeTileAction.payload.playerID;

  const result: LeafResult = {
    jobId: job.jobId,
    state,
    objectives: {},
    objectivesSum: 0,
    currentPlayerScore: 0,
    opponentMaxScore: 0,
    botScore: 0,
    winner: undefined,
    draw: false,
    winnerScore: 0,
    winnerScoreDelta: 999,
  };

  if (!job.botPlayerID || !G.score) return result;

  // white-tile penalty
  if (G.tiles.some(x => x.selected && x.color === 'white')) {
    result.objectives = { 'no-score': -100 };
    result.objectivesSum = -100;
    return result;
  }

  // deep-clone + calculate score for both players
  const gameCopy = JSON.parse(JSON.stringify(G)) as AzulGameState;
  calculateScore(gameCopy, ctx);
  const newGameScore = gameCopy.score;

  let maxScore = 0;
  let maxScoreDelta = 999;
  let winner: string | undefined;
  let draw = false;
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
      if (delta < maxScoreDelta) maxScoreDelta = delta;
    }
    if (key !== playerID && playerScore > result.opponentMaxScore) {
      result.opponentMaxScore = playerScore;
    }
  });

  if (ctx.gameover || job.currentRound !== G.round) {
    (ctx as any).gameover = { winner, draw, score: maxScore };
  }

  result.botScore = newGameScore[job.botPlayerID].points;
  result.currentPlayerScore = newGameScore[playerID].points;
  result.winner = winner;
  result.draw = draw;
  result.winnerScore = maxScore;
  result.winnerScoreDelta = maxScoreDelta;

  result.objectives = {
    'targetScore': newGameScore[playerID].points,
    'full-row-bonus': getFullRowBonus(G, playerID),
    'floor-penalty': getFloorPenalty(G, playerID),
  };
  if (job.difficulty === 'hard') {
    result.objectives['same-color-penalty'] = getSameColorPenalty(G, playerID);
  }
  result.objectivesSum = Object.values(result.objectives)
    .reduce((score, value) => score + value, 0);

  return result;
}