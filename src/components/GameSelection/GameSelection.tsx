import React from 'react';
import styles from './GameSelection.module.scss';
import { BiBot, BiUser, BiGlobe, BiLaptop } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';

export const GameSelection: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const iconSize = 30;

  return (
    <div className={styles.container}>
      <h1>Game Mode</h1>
      <button onClick={() => navigate('/local-singleplayer')}>
        <BiUser size={iconSize} />
        <BiLaptop size={iconSize} />
        <BiBot size={iconSize} />
        <br />
        <span>Singleplayer</span>
      </button>

      <button onClick={() => navigate('/local-multiplayer')}>
        <BiUser size={iconSize} />
        <BiLaptop size={iconSize} />
        <BiUser size={iconSize} />
        <br />
        <span>Local Multiplayer</span>
      </button>

      <button onClick={() => navigate('/online-multiplayer')}>
        <BiUser size={iconSize} />
        <BiGlobe size={iconSize} />
        <BiUser size={iconSize} />
        <br />
        <span>Online Multiplayer</span>
      </button>
    </div>
  );
});