export type TileColor = 'red' | 'green' | 'blue' | 'yellow' | 'black'
export type TilePlaceholderColor = TileColor | 'none'

export type TilePlaceholderConfig = {
  color: TilePlaceholderColor,
  multiplier: number
}

export type WallSetup = {
  name: string,
  rows: Array<Array<TilePlaceholderConfig>>
}

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

export const wallSetups: WallSetup[] = [
  {
    name: 'Default',
    rows: [
      [blue1, yellow1, red1, black1, green1],
      [green1, blue1, yellow1, red1, black1],
      [black1, green1, blue1, yellow1, red1],
      [red1, black1, green1, blue1, yellow1],
      [yellow1, red1, black1, green1, blue1],
    ]
  },
  {
    name: 'Empty',
    rows: [
      [none1, none1, none1, none1, none1],
      [none1, none1, none1, none1, none1],
      [none1, none1, none1, none1, none1],
      [none1, none1, none1, none1, none1],
      [none1, none1, none1, none1, none1],
    ]
  },
  {
    name: 'Special',
    rows: [
      [none1, red2, none1, none1, none1],
      [none1, none1, none1, black2, none1],
      [green2, none1, none1, none1, none1],
      [none1, none1, blue2, none1, none1],
      [none1, none1, none1, none1, yellow2],
    ]
  }
];

export type FloorLineSetup = {
  name: string,
  values: number[]
};

export const floorLineSetups: FloorLineSetup[] = [
  {
    name: 'Default',
    values: [-1, -1, -2, -2, -2, -3, -3]
  }
];

export type GameSetup = {
  numberOfPlayers: number,
  wallSetup: WallSetup,
  floorLineSetup: FloorLineSetup,
  tiles: {
    red: number,
    green: number,
    blue: number,
    yellow: number,
    black: number,
  }
};

export const defaultGameSetup: GameSetup = {
  numberOfPlayers: 2,
  wallSetup: wallSetups[0],
  floorLineSetup: floorLineSetups[0],
  tiles: {
    red: 20,
    green: 20,
    blue: 20,
    yellow: 20,
    black: 20,
  }
}
