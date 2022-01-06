import { BoardProps } from 'boardgame.io/react';
import React, { useContext } from 'react';
import { AzulGameState } from "../games/azul/models";

export type GameContextType = BoardProps<AzulGameState> | undefined;

export const GameContext = React.createContext<GameContextType>(undefined);

export const useGameContext = () => React.useContext(GameContext);

export const getPlayerName = (context: GameContextType, playerId: string) => {
  try {
    return context?.matchData![+playerId].name || 'Spieler ' + (+playerId + 1);
  } catch (error) {
    return 'Spieler ' + (+playerId + 1);
  }
}

export const getPlayerIsConnected = (context: GameContextType, playerId: string) => {
  let result = context?.matchData![+playerId].isConnected;
  return result === undefined ? true : result;
}

export const PlayerName = React.memo((props: { playerId: string }) => {
  const gameContext = useContext(GameContext);
  return <>{getPlayerName(gameContext, props.playerId)}</>;
})
