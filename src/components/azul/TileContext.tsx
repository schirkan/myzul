import { BoardProps } from 'boardgame.io/react';
import React from 'react';
import { GetTileLocationId } from '../../games/azul/azulConfig';
import { AzulGameState, AzulTileState, TilePlaceholderState } from "../../games/azul/models";

export type TileContextType = {
  setBoardProps: (newProps: BoardProps<AzulGameState>) => void,
  placeholderElements: {
    [index: string]: HTMLElement,
  },
  placeholderProps: {
    [index: string]: TilePlaceholderState,
  },
  onTileClick: (tile: AzulTileState) => void,
  onPlaceholderClick: (placeholder: TilePlaceholderState) => void
  registerPlaceholder: (placeholder: TilePlaceholderState, element: HTMLElement) => () => void
}

export const createTileContext = (): TileContextType => {
  let props: BoardProps<AzulGameState> | undefined = undefined;
  let placeholderElements: {
    [index: string]: HTMLElement,
  } = {};
  let placeholderProps: {
    [index: string]: TilePlaceholderState,
  } = {};

  return {
    setBoardProps: (newProps: BoardProps<AzulGameState>) => {
      props = newProps;
    },
    placeholderElements,
    placeholderProps,
    onTileClick: (tile) => {
      console.log('selectSourceTile', tile);
      props?.moves?.selectSourceTile(tile);
    },
    onPlaceholderClick: (placeholder) => {
      console.log('selectTargetLocation', placeholder);
      props?.moves?.selectTargetLocation(placeholder);
    },
    registerPlaceholder: (placeholder: TilePlaceholderState, element: HTMLElement) => {
      console.log('registerPlaceholder');
      const id = GetTileLocationId(placeholder.location);
      placeholderProps[id] = placeholder;
      placeholderElements[id] = element;
      return () => {
        delete (placeholderElements[id]);
        delete (placeholderProps[id]);
      }
    }
  };
}

export const defaultContext: TileContextType = createTileContext();

export const TileContext = React.createContext(defaultContext);

export const useTileContext = () => React.useContext(TileContext);