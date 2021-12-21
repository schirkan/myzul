import { BoardProps } from 'boardgame.io/react';
import React from 'react';
import { TileLocation } from '../../games/azul/azulConfig';
import { AzulGameState, AzulTileState } from '../../games/azul/Game';

export type TileContextType = {
  setBoardProps: (newProps: BoardProps<AzulGameState>) => void,
  placeholder: {
    [index: string]: HTMLDivElement,
  },
  onTileClick: (tile: AzulTileState) => void,
  onPlaceholderClick: (location: TileLocation) => void
}

export const createTileContext = (initialProps?: BoardProps<AzulGameState>): TileContextType => {
  let props = initialProps;
  return {
    setBoardProps: (newProps: BoardProps<AzulGameState>) => {
      props = newProps;
    },
    placeholder: {},
    onTileClick: (tile) => {
      console.log('selectSourceTile', tile);
      props?.moves?.selectSourceTile(tile);
    },
    onPlaceholderClick: (location) => {
      console.log('selectTargetLocation', location);
      props?.moves?.selectTargetLocation(location);
    }
  };
}

export const defaultContext: TileContextType = createTileContext();

export const TileContext = React.createContext(defaultContext);
