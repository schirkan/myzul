import { BoardProps } from 'boardgame.io/react';
import React from 'react';
import { AzulGameState } from "../../games/azul/models";

export const GameContext = React.createContext<BoardProps<AzulGameState> | undefined>(undefined);
