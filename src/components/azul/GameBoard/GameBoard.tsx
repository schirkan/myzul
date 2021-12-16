import React from 'react';
import { PlayerBoard } from '../PlayerBoard';
import styles from './style.module.scss';

type Props = {};

export const GameBoard: React.FC<Props> = (props) => {
  return <div className={styles.container}>
    <header>header</header>
    <main>
      <PlayerBoard />
    </main>
    <footer>footer</footer>
  </div>;
};