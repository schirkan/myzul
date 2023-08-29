import React from 'react';
import styles from './GameSelection.module.scss';
import { BiBot, BiUser, BiGlobe, BiLaptop } from "react-icons/bi";


export type GameMode = 'local-singleplayer' | 'local-multiplayer' | 'online-multiplayer';

type Props = {
  onSelect: (mode: GameMode) => void
};

export const GameSelection: React.FC<Props> = React.memo((props) => {
  const iconSize = 30;
  return <div className={styles.container}>
    <h1>Game Mode</h1>
    <button onClick={() => props.onSelect('local-singleplayer')}>
      <BiUser size={iconSize} />
      <BiLaptop size={iconSize} />
      <BiBot size={iconSize} />
      <br />
      <span>Singleplayer</span>
    </button>
    <button onClick={() => props.onSelect('local-multiplayer')}>
      <BiUser size={iconSize} />
      <BiLaptop size={iconSize} />
      <BiUser size={iconSize} />
      <br />
      <span>Local Multiplayer</span>
    </button>
    <button onClick={() => props.onSelect('online-multiplayer')}>
      <BiUser size={iconSize} />
      <BiGlobe size={iconSize} />
      <BiUser size={iconSize} />
      <br />
      <span>Online Multiplayer</span>
    </button>
  </div>;
});