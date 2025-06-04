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
    <TilePlaceholder location={{ boardType: 'FloorLine', boardId: props.playerId, x: 0 }}>{setup[0]}</TilePlaceholder>
    <TilePlaceholder location={{ boardType: 'FloorLine', boardId: props.playerId, x: 1 }}>{setup[1]}</TilePlaceholder>
    <TilePlaceholder location={{ boardType: 'FloorLine', boardId: props.playerId, x: 2 }}>{setup[2]}</TilePlaceholder>
    <TilePlaceholder location={{ boardType: 'FloorLine', boardId: props.playerId, x: 3 }}>{setup[3]}</TilePlaceholder>
    <TilePlaceholder location={{ boardType: 'FloorLine', boardId: props.playerId, x: 4 }}>{setup[4]}</TilePlaceholder>
    <TilePlaceholder location={{ boardType: 'FloorLine', boardId: props.playerId, x: 5 }}>{setup[5]}</TilePlaceholder>
    <TilePlaceholder location={{ boardType: 'FloorLine', boardId: props.playerId, x: 6 }}>{setup[6]}</TilePlaceholder>
  </div>;
});