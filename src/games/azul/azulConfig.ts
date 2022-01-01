import { FloorSetup, GameSetup, TileLocation, TilePlaceholderConfig, WallSetup } from './models';

const red1: TilePlaceholderConfig = { color: "red", multiplier: 1 }
const green1: TilePlaceholderConfig = { color: "green", multiplier: 1 }
const blue1: TilePlaceholderConfig = { color: "blue", multiplier: 1 }
const yellow1: TilePlaceholderConfig = { color: "yellow", multiplier: 1 }
const black1: TilePlaceholderConfig = { color: "black", multiplier: 1 }
const red2: TilePlaceholderConfig = { color: "red", multiplier: 2 }
const green2: TilePlaceholderConfig = { color: "green", multiplier: 2 }
const blue2: TilePlaceholderConfig = { color: "blue", multiplier: 2 }
const yellow2: TilePlaceholderConfig = { color: "yellow", multiplier: 2 }
const black2: TilePlaceholderConfig = { color: "black", multiplier: 2 }
const none1: TilePlaceholderConfig = { color: "none", multiplier: 1 }

export const wallSetups: { [name: string]: WallSetup } = {
  'Default': [
    [blue1, yellow1, red1, black1, green1],
    [green1, blue1, yellow1, red1, black1],
    [black1, green1, blue1, yellow1, red1],
    [red1, black1, green1, blue1, yellow1],
    [yellow1, red1, black1, green1, blue1],
  ],
  'Empty': [
    [none1, none1, none1, none1, none1],
    [none1, none1, none1, none1, none1],
    [none1, none1, none1, none1, none1],
    [none1, none1, none1, none1, none1],
    [none1, none1, none1, none1, none1],
  ],
  'Special': [
    [none1, red2, none1, none1, none1],
    [none1, none1, none1, black2, none1],
    [green2, none1, none1, none1, none1],
    [none1, none1, blue2, none1, none1],
    [none1, none1, none1, none1, yellow2],
  ]
};

export const floorSetups: { [name: string]: FloorSetup } = {
  'Default': [-1, -1, -2, -2, -2, -3, -3]
};

export const defaultGameSetup: GameSetup = {
  wallSetup: 'Default',
  floorSetup: 'Default',
  tilesPerFactory: 4,
};

export const GetTileLocationId = (location: TileLocation) => {
  return location.boardType + '|' + location.boardId + '|' + location.x + '|' + location.y
}
