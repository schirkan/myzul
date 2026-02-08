import React, { useEffect, useState } from 'react';
import { useGameContext } from 'common/GameContext';
import styles from './Timer.module.scss';

type Props = {
  playerId: string
};

const formatDuration = (sec_num: number) => {
  var minutes: string | number = Math.floor(sec_num / 60);
  var seconds: string | number = sec_num - (minutes * 60);

  if (minutes < 10) { minutes = "0" + minutes; }
  if (seconds < 10) { seconds = "0" + seconds; }
  return minutes + ':' + seconds;
};

export const Timer: React.FC<Props> = React.memo((props) => {
  const gameContext = useGameContext();
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (props.playerId === gameContext?.ctx.currentPlayer) {
      console.log('reset timer');
      setSeconds(0);
      const timestamp = gameContext.G.turnStartTimestamp;
      let myInterval = setInterval(() => {
        setSeconds(Math.floor((Date.now() - timestamp) / 1000));
      }, 1000)
      return () => {
        clearInterval(myInterval);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameContext?.ctx.turn]);

  if (props.playerId !== gameContext?.ctx.currentPlayer) return null;
  if (gameContext?.ctx.gameover) return null;

  return <div className={styles.container}>
    {formatDuration(seconds)}
  </div>;
});