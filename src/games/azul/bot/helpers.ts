import { AzulGameState } from '../models';
import { Ctx } from 'boardgame.io';
import { floorSetups } from '../azulConfig';

export type difficulty = 'easy' | 'medium' | 'hard';

export const groupBy = <T>(array: T[], predicate: (value: T, index: number, array: T[]) => string) =>
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