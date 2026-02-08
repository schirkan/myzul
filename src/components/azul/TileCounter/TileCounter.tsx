import React from 'react';
import styles from 'components/azul/TilePlaceholder/TilePlaceholder.module.scss';
import { TileColor } from 'games/azul/models';

export const TileCounter: React.FC<{ count: number, color: TileColor }> = React.memo((props) => {
  return <div
    className={styles.container}
    data-color={props.color || 'none'}
  >
    {props.count}
  </div>;
});