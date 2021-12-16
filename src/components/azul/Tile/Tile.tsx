import React from 'react';
import { TileColor } from '../../../games/azul/azulConfig';
import styles from './style.module.scss';

type Props = {
  color: TileColor,
  selectable: boolean
};

export const Tile: React.FC<Props> = (props) => {
  return <div
    className={styles.container}
    data-color={props.color}
    data-selectable={props.selectable}
  ></div>;
};