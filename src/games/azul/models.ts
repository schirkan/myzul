export type BoardType = 'Factory' | 'Wall' | 'PatternLine' | 'FloorLine' | 'TileBag' | 'TileStorage' | 'CenterOfTable'
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

export type FloorSetup = {
  name: string,
  values: number[]
};

export type GameSetup = {
  wallSetup: string,
  floorSetup: string,
};

export type TileLocation = {
  boardType: BoardType,
  boardId?: string,
  x?: number,
  y?: number
}

export interface AzulTileState {
  color: TileColor;
  location: TileLocation;
  selected: boolean;
  selectable: boolean;
}

// aka 'G', your game's state
export interface AzulGameState {
  config: GameSetup;
  factories: number;
  tiles: AzulTileState[];
}
