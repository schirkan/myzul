import React from 'react';
import styles from './LastGames.module.scss';
import { BiHistory } from 'react-icons/bi';

export const LastGames: React.FC = React.memo(() => {
  const iconSize = 30;

  return (
    <div className={styles.container}>
      <h2>
        <BiHistory size={iconSize} />
        Last Games
      </h2>
      <p className={styles.empty}>No games played yet</p>
    </div>
  );
});

export default LastGames;