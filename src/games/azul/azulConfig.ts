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
const none1: TilePlaceholderConfig = { color: "none", multiplier: 1 }

export const wallSetups: WallSetup[] = [
  {
    name: 'Default',
    rows: [
      [blue1, yellow1, red1, black1, green1],
      [yellow1, red1, black1, green1, blue1],
      [red1, black1, green1, blue1, yellow1],
      [black1, green1, blue1, yellow1, red1],
      [green1, blue1, yellow1, red1, black1],
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
  }
];