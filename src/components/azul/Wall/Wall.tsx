import React from 'react';
import styles from './style.module.scss';

type Props = {};

export const Wall: React.FC<Props> = (props) => {
  return <div className={styles.container}>
    Hello World
  </div>;
};