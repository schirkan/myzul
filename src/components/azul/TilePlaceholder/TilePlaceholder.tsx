import React from 'react';
import styles from './style.module.scss';

type Props = {
  multiplier: number,
  color: 'red' | 'green' | 'blue' | 'yellow' | 'black' | 'none'
};

export const TilePlaceholder: React.FC<Props> = (props) => {
  return <div className={styles.container} data-color={props.color}>
    {props.multiplier > 1 ? props.multiplier + 'x' : ''}
  </div>;
};