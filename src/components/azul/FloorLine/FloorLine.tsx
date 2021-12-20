import React from 'react';
import { FloorSetup } from '../../../games/azul/azulConfig';
import { TilePlaceholder } from '../TilePlaceholder';
import styles from './style.module.scss';

type Props = {
  config: FloorSetup,
  player: number
};

export const FloorLine: React.FC<Props> = (props) => {
  const values = props?.config?.values || [0, 0, 0, 0, 0, 0, 0];

  return <div className={styles.container}>
    <span>{values[0]}</span>
    <span>{values[1]}</span>
    <span>{values[2]}</span>
    <span>{values[3]}</span>
    <span>{values[4]}</span>
    <span>{values[5]}</span>
    <span>{values[6]}</span>
    <TilePlaceholder location={{ boardType: 'FloorLine', boardId: props.player, x: 0, y: 0 }} />
    <TilePlaceholder location={{ boardType: 'FloorLine', boardId: props.player, x: 1, y: 0 }} />
    <TilePlaceholder location={{ boardType: 'FloorLine', boardId: props.player, x: 2, y: 0 }} />
    <TilePlaceholder location={{ boardType: 'FloorLine', boardId: props.player, x: 3, y: 0 }} />
    <TilePlaceholder location={{ boardType: 'FloorLine', boardId: props.player, x: 4, y: 0 }} />
    <TilePlaceholder location={{ boardType: 'FloorLine', boardId: props.player, x: 5, y: 0 }} />
    <TilePlaceholder location={{ boardType: 'FloorLine', boardId: props.player, x: 6, y: 0 }} />
  </div>;
};