import { AzulGameState } from '../models';
import { Ctx } from 'boardgame.io';
import { floorSetups } from '../azulConfig';
import { AzulBot1 } from "./AzulBot1";
import { AzulBot2 } from './AzulBot2';
import { AzulBot3 } from './AzulBot3';
import { AzulBot4 } from './AzulBot4';
import { AzulBot5 } from './AzulBot5';

export type difficulty = 'easy' | 'medium' | 'hard';

const groupBy = <T>(array: T[], predicate: (value: T, index: number, array: T[]) => string) =>
  array.reduce((acc, value, index, array) => {
    (acc[predicate(value, index, array)] ||= []).push(value);
    return acc;
  }, {} as { [key: string]: T[] });

export interface Objective {
  checker: (G: any, ctx: Ctx) => boolean;
  weight: number;
}
export declare type Objectives = Record<string, Objective>;

export const getFloorPenalty = (G: AzulGameState, playerID: string): number => {
  var floorTiles = G.tiles.filter(x =>
    x.location.boardType === 'FloorLine' &&
    x.location.boardId === playerID
  );

  var floorSetup = floorSetups[G.config.floorSetup];
  return floorSetup.slice(0, floorTiles.length).reduce((a, b) => a + b, 0);
}

export const getOpenPatternPenalty = (G: AzulGameState, playerID: string): number => {
  var patternTiles = G.tiles.filter(x =>
    x.location.boardType === 'PatternLine' &&
    x.location.boardId === playerID
  );
  var tilesByRow = groupBy(patternTiles, x => '' + x.location.y);
  var penalty = 0;
  Object.keys(tilesByRow).forEach(key => {
    var tileCount = tilesByRow[key].length;
    var tilesPerRow = 1 + (+key);
    if (tileCount < tilesPerRow) penalty--;
  });

  return penalty;
}

export const getSameColorPenalty = (G: AzulGameState, playerID: string): number => {
  var patternTiles = G.tiles.filter(x =>
    x.location.boardType === 'PatternLine' &&
    x.location.boardId === playerID
  );
  var tilesByRow = groupBy(patternTiles, x => '' + x.location.y);
  var openColors = {
    red: 0,
    green: 0,
    yellow: 0,
    blue: 0,
    black: 0,
    white: 0,
  };
  var penalty = 0;

  Object.keys(tilesByRow).forEach(key => {
    const rowColor = tilesByRow[key][0].color;
    const tileCount = tilesByRow[key].length;
    const tilesPerRow = 1 + (+key);
    if (tileCount < tilesPerRow) {
      if (openColors[rowColor] > 0) {
        penalty--;
      }
      openColors[rowColor]++;
    }
  });

  return penalty;
}

export const getFullRowBonus = (G: AzulGameState, playerID: string): number => {
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

export function createBot(botId: string) { // '1-easy'
  var bot = botId[0];
  var difficulty = botId.substring(2);
  var iterations = 100;
  switch (difficulty) {
    case 'easy':
      iterations = 100;
      break;
    case 'medium':
      iterations = 500;
      break;
    case 'hard':
      iterations = 1000;
      break;
  }

  switch (bot) {
    case '1':
      return function AzulBotWithDifficulty(options: any) {
        return new AzulBot1({ iterations, ...options });
      }
    case '2':
      return function AzulBotWithDifficulty(options: any) {
        return new AzulBot2({ iterations, ...options });
      }
    case '3':
      return function AzulBotWithDifficulty(options: any) {
        return new AzulBot3({ iterations, ...options });
      }
    case '4':
      return function AzulBotWithDifficulty(options: any) {
        return new AzulBot4({ iterations, ...options });
      }
    case '5':
      return function AzulBotWithDifficulty(options: any) {
        return new AzulBot5({ difficulty, ...options });
      }
  }
}