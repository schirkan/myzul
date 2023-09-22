import { AzulGameState } from './models';
import { Ctx } from 'boardgame.io';

class tilesPerColor {
  red: number = 0;
  green: number = 0;
  blue: number = 0;
  yellow: number = 0;
  black: number = 0;
  white: number = 0;

  getId(): number {
    var result = this.white * 100000;
    result += this.red * 10000;
    result += this.green * 1000;
    result += this.blue * 100;
    result += this.yellow * 10;
    result += this.black;
    return result;
  }
}

export const getGameStateId = (state: AzulGameState, ctx: Ctx): string => {
  var factoryTiles: tilesPerColor[] = [];
  var tableTiles: tilesPerColor = new tilesPerColor();
  var patternTiles: { [key: string]: tilesPerColor[] } = {};
  var wallTiles: { [key: string]: tilesPerColor[] } = {};
  var floorTiles: { [key: string]: tilesPerColor } = {};

  for (let index = 0; index < state.factories; index++) {
    factoryTiles[index] = new tilesPerColor();
  }

  ctx.playOrder.forEach(playerId => {
    patternTiles[playerId] = [];
    wallTiles[playerId] = [];

    for (let row = 0; row < 5; row++) {
      patternTiles[playerId][row] = new tilesPerColor();
      wallTiles[playerId][row] = new tilesPerColor();
    }

    floorTiles[playerId] = new tilesPerColor();
  });

  state.tiles.forEach(x => {
    var target: tilesPerColor | undefined = undefined;

    switch (x.location.boardType) {
      case 'Factory':
        target = factoryTiles[+x.location.boardId!];
        break;
      case 'Wall':
        target = wallTiles[x.location.boardId!][x.location.y!];
        break;
      case 'PatternLine':
        target = patternTiles[x.location.boardId!][x.location.y!];
        break;
      case 'FloorLine':
        target = floorTiles[x.location.boardId!];
        break;
      case 'CenterOfTable':
        target = tableTiles;
        break;
    }

    if (target) {
      target[x.color]++;
    }
  });

  var id = '';
  id += factoryTiles.map(x => x.getId()).filter(x => x > 0).sort().join('|') + '|';
  id += tableTiles.getId();

  ctx.playOrder.forEach(playerId => {
    id += '[';
    id += patternTiles[playerId].map((x: tilesPerColor) => x.getId() || '').join('|') + '#';
    id += wallTiles[playerId].map((x: tilesPerColor) => x.getId() || '').join('|') + '#';
    id += floorTiles[playerId].getId() || '';
    id += ']';
  });

  return id;
}