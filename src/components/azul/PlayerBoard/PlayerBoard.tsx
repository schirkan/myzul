import React from 'react';
import { GameSetup } from 'games/azul/models';
import { FloorLine } from 'components/azul/FloorLine';
import { PlayerName } from 'common/GameContext';
import { PatternLines } from 'components/azul/PatternLines';
import { Wall } from 'components/azul/Wall';
import { Timer } from 'components/azul/Timer';
import styles from './PlayerBoard.module.scss';

type Props = {
  config: GameSetup,
  playerId: string
};

export const PlayerBoard: React.FC<Props> = React.memo((props) => {
  return <div className={styles.container}>
    <div className={styles.caption}>
      <PlayerName playerId={props.playerId} />
    </div>
    <div className={styles.left}>
      <PatternLines playerId={props.playerId} />
    </div>
    <div className={styles.right}>
      <Wall playerId={props.playerId} config={props.config.wallSetup} />
    </div>
    <div className={styles.bottom}>
      <FloorLine playerId={props.playerId} config={props.config.floorSetup} />
      <Timer playerId={props.playerId} />
    </div>
  </div>;
});