import React, { useContext } from 'react';
import styles from './ScoreBoard.module.scss';
import { GameContext } from './../GameContext';
import { playerColor } from '../../../games/azul/models';

export const ScoreBoard: React.FC = React.memo(() => {
  const gameContext = useContext(GameContext);

  // console.log(gameContext!.matchData![0]);

  let activePlayerId = gameContext?.ctx.currentPlayer;
  let currentPlayerId = gameContext?.playerID

  if (gameContext?.ctx.gameover) {
    activePlayerId = gameContext?.ctx.gameover.winnerPlayerId;
    currentPlayerId = gameContext?.ctx.gameover.winnerPlayerId
  }

  return <div className={styles.container}>
    <h1>Punkte</h1>
    {gameContext?.ctx.playOrder.map(playerId =>
      <div key={playerId}>
        <span className={styles.playerName}
          data-active={activePlayerId === playerId}
          data-current={currentPlayerId === playerId}
          style={{ "--color": playerColor[playerId] } as any}>
          Spieler {+playerId + 1}
        </span>
        <span>{gameContext?.G.score[playerId] || 0}</span>
      </div>
    )}
  </div>;
});