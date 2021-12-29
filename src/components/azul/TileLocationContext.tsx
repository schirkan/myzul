import { BoardProps } from 'boardgame.io/react';
import React from 'react';
import { AzulGameState, AzulTileState } from "../../games/azul/models";
import { TilePlaceholderProps } from './TilePlaceholder';

export type TileContextType = {
  setBoardProps: (newProps: BoardProps<AzulGameState>) => void,
  placeholder: {
    [index: string]: HTMLDivElement,
  },
  onTileClick: (tile: AzulTileState) => void,
  onPlaceholderClick: (placeholder: TilePlaceholderProps) => void
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
    onPlaceholderClick: (placeholder) => {
      console.log('selectTargetLocation', placeholder);
      props?.moves?.selectTargetLocation(placeholder);
    }
  };
}

export const defaultContext: TileContextType = createTileContext();

export const TileContext = React.createContext(defaultContext);
