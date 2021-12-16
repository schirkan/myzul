import React from 'react';
import { GameSetup } from '../../../games/azul/azulConfig';
import { FloorLine } from '../FloorLine';
import { PatternLines } from '../PatternLines';
import { Wall } from '../Wall';
import styles from './style.module.scss';

type Props = { config: GameSetup, player: number };

export const PlayerBoard: React.FC<Props> = (props) => {
  return <div className={styles.container}>
    <div className={styles.top}>
      Player #{props.player}
    </div>
    <div className={styles.left}>
      <PatternLines player={props.player} />
    </div>
    <div className={styles.right}>
      <Wall config={props.config.wallSetup} />
    </div>
    <div className={styles.bottom}>
      <FloorLine config={props.config.floorLineSetup} />
    </div>
  </div>;
};