import React from 'react';
import styles from './ScoreBoard.module.scss';
import { getPlayerIsConnected, getPlayerName, useGameContext } from 'common/GameContext';
import { AzulGameover, playerColor } from 'games/azul/models';
import { useSearchParams } from 'react-router-dom';

export const ScoreBoard: React.FC = React.memo(() => {
  const [searchParams] = useSearchParams();
  const gameContext = useGameContext();
  const seed = searchParams.get('seed');

  let activePlayerId = gameContext?.ctx.currentPlayer;
  let currentPlayerId = gameContext?.playerID;

  if (gameContext?.ctx.gameover) {
    activePlayerId = (gameContext.ctx.gameover as AzulGameover).winnerPlayerId;
    currentPlayerId = activePlayerId;
  }

  return <div className={styles.container}>
    <h1>Punkte</h1>
    {seed ? <h2>Seed #<span className={styles.seed}>{seed}</span></h2> : undefined}
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