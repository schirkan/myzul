import React from 'react';
import { TilePlaceholderConfig } from '../../../games/azul/azulConfig';
import styles from './style.module.scss';

type Props = Partial<TilePlaceholderConfig> & {
  id?: string
};

export const TilePlaceholder: React.FC<Props> = (props) => {
  if (props.id) {
    console.log(props.id);
  }

  return <div className={styles.container} data-color={props.color || 'none'}>
    {props.multiplier && props.multiplier > 1 ? props.multiplier + 'x' : ''}
  </div>;
};