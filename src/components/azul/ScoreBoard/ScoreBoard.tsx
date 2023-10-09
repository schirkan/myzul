import React from 'react';
import styles from './ScoreBoard.module.scss';
import { getPlayerIsConnected, getPlayerName, useGameContext } from '../../../common/GameContext';
import { AzulGameover, playerColor } from '../../../games/azul/models';
import { getSeedFromLocation } from '../../utils';

export const ScoreBoard: React.FC = React.memo(() => {
  const gameContext = useGameContext();
  const seed = getSeedFromLocation();

  let activePlayerId = gameContext?.ctx.currentPlayer;
  let currentPlayerId = gameContext?.playerID;

  if (gameContext?.ctx.gameover) {
    activePlayerId = (gameContext.ctx.gameover as AzulGameover).winnerPlayerId;
    currentPlayerId = activePlayerId;
  }

  const askReload = React.useCallback(() => {
    if (window.confirm("Reload?")) {
      window.location.reload();
    }
  }, []);

  return <div className={styles.container}>
    <h1 onClick={askReload}>Punkte</h1>
    {seed ? <h2>Seed #{seed}</h2> : undefined}
    {gameContext?.ctx.playOrder.map(playerId =>
      <div key={playerId}>
        <span className={styles.playerName}
          data-active={activePlayerId === playerId}
          data-current={currentPlayerId === playerId}
          data-connected={getPlayerIsConnected(gameContext, playerId)}
          style={{ "--color": playerColor[playerId] } as any}>
          {getPlayerName(gameContext, playerId)}
        </span>
        <span>{gameContext?.G.score[playerId].points || 0}</span>
      </div>
    )}
  </div>;
});