import React, { useContext } from 'react';
import styles from './ScoreBoard.module.scss';
import { GameContext } from './../GameContext';
import { playerColor } from '../../../games/azul/models';

export const ScoreBoard: React.FC = React.memo(() => {
  const gameContext = useContext(GameContext);

  return <div className={styles.container}>
    <h1>Punkte</h1>
    {gameContext?.ctx.playOrder.map(playerId =>
      <div key={playerId}>
        <span className={styles.playerName}
          data-active={gameContext.ctx.currentPlayer === playerId}
          style={{ "--color": playerColor[playerId] } as any}>
          Spieler {+playerId + 1}
        </span>
        <span>{gameContext?.G.score[playerId] || 0}</span>
      </div>
    )}
  </div>;
});