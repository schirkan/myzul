import React, { useEffect } from 'react';
// import styles from './NotifyActivePlayer.module.scss';
import useSound from 'use-sound';
import plingSfx from '../../assets/Pling-KevanGC-1485374730.mp3';
import { useGameContext } from '../../common/GameContext';

export const NotifyActivePlayer: React.FC = React.memo(() => {
  const [play] = useSound(plingSfx);
  const gameContext = useGameContext();

  useEffect(() => {
    if (!document.hasFocus() && gameContext?.isActive) {
      play();
    }
  }, [play, gameContext?.isActive]);

  return null;
});