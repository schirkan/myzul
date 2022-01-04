import React from 'react';
import styles from './ScoreBoard.module.scss';
import { getPlayerIsConnected, getPlayerName, useGameContext } from '../../../common/GameContext';
import { playerColor } from '../../../games/azul/models';

export const ScoreBoard: React.FC = React.memo(() => {
  const gameContext = useGameContext();

  let activePlayerId = gameContext?.ctx.currentPlayer;
  let currentPlayerId = gameContext?.playerID;

  if (gameContext?.ctx.gameover) {
    activePlayerId = gameContext?.ctx.gameover.winnerPlayerId;
    currentPlayerId = gameContext?.ctx.gameover.winnerPlayerId;
  }

  return <div className={styles.container}>
    <h1>Punkte</h1>
    {gameContext?.ctx.playOrder.map(playerId =>
      <div key={playerId}>
        <span className={styles.playerName}
          data-active={activePlayerId === playerId}
          data-current={currentPlayerId === playerId}
          data-connected={getPlayerIsConnected(gameContext, playerId)}
          style={{ "--color": playerColor[playerId] } as any}>
          {getPlayerName(gameContext, playerId)}
        </span>
        <span>{gameContext?.G.score[playerId] || 0}</span>
      </div>
    )}
  </div>;
});