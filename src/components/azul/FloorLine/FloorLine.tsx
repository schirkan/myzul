import React from 'react';
import { floorSetups } from '../../../games/azul/azulConfig';
import { TilePlaceholder } from '../TilePlaceholder';
import styles from './FloorLine.module.scss';

type Props = {
  config: string,
  playerId: string
};

export const FloorLine: React.FC<Props> = React.memo((props) => {
  const setup = floorSetups[props.config];

  return <div className={styles.container}>
    <span>{setup[0]}</span>
    <span>{setup[1]}</span>
    <span>{setup[2]}</span>
    <span>{setup[3]}</span>
    <span>{setup[4]}</span>
    <span>{setup[5]}</span>
    <span>{setup[6]}</span>
    <TilePlaceholder location={{ boardType: 'FloorLine', boardId: props.playerId, x: 0 }} />
    <TilePlaceholder location={{ boardType: 'FloorLine', boardId: props.playerId, x: 1 }} />
    <TilePlaceholder location={{ boardType: 'FloorLine', boardId: props.playerId, x: 2 }} />
    <TilePlaceholder location={{ boardType: 'FloorLine', boardId: props.playerId, x: 3 }} />
    <TilePlaceholder location={{ boardType: 'FloorLine', boardId: props.playerId, x: 4 }} />
    <TilePlaceholder location={{ boardType: 'FloorLine', boardId: props.playerId, x: 5 }} />
    <TilePlaceholder location={{ boardType: 'FloorLine', boardId: props.playerId, x: 6 }} />
  </div>;
});