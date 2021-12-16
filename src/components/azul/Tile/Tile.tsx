import React from 'react';
import styles from './style.module.scss';

type Props = {
  color: 'red' | 'green' | 'blue' | 'yellow' | 'black'
};

export const Tile: React.FC<Props> = (props) => {
  return <div className={styles.container} data-color={props.color}></div>;
};