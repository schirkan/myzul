import React from 'react';
import { GameSetup } from '../../../games/azul/azulConfig';
import { FloorLine } from '../FloorLine';
import { PatternLines } from '../PatternLines';
import { Wall } from '../Wall';
import styles from './style.module.scss';

type Props = {
  config: GameSetup,
  playerId: string
};

export const PlayerBoard: React.FC<Props> = React.memo((props) => {
  return <div className={styles.container}>
    <div className={styles.top}>
      Player #{props.playerId}
    </div>
    <div className={styles.left}>
      <PatternLines playerId={props.playerId} />
    </div>
    <div className={styles.right}>
      <Wall playerId={props.playerId} config={props.config.wallSetup} />
    </div>
    <div className={styles.bottom}>
      <FloorLine playerId={props.playerId} config={props.config.floorSetup} />
    </div>
  </div>;
});