export type BoardType = 'Factory' | 'Wall' | 'PatternLine' | 'FloorLine' | 'TileBag' | 'TileStorage' | 'CenterOfTable'
export type TileColor = 'red' | 'green' | 'blue' | 'yellow' | 'black' | 'white'
export type TilePlaceholderColor = TileColor | 'none'

export type TilePlaceholderConfig = {
  color: TilePlaceholderColor,
  multiplier: number
}

export type TilePlaceholderState = Partial<TilePlaceholderConfig> & {
  location: TileLocation
};

export type WallSetup = Array<Array<TilePlaceholderConfig>>;

export type FloorSetup = number[];

export type GameSetup = {
  wallSetup: string,
  floorSetup: string,
  tilesPerFactory: number,
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
  initialized: boolean;
  config: GameSetup;
  factories: number;
  tiles: AzulTileState[];
  score: { [key: string]: AzulPlayerScore };
  calculationDelay: number;
  startPlayerId?: string;
  turnStartTimestamp: number;
}

export interface AzulPlayerScore {
  points: number;
  time: number;
}

export interface AzulGameover {
  winnerPlayerId: string;
  winnerPlayerScore: number;
}

export const playerColor: { [key: string]: string } = {
  '0': '#48f',
  '1': '#4b6',
  '2': 'red',
  '3': 'yellow'
}