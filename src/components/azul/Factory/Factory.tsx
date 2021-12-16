import React from 'react';
import { TilePlaceholder } from '../TilePlaceholder';
import styles from './style.module.scss';

type Props = {};

export const Factory: React.FC<Props> = (props) => {
  return <div className={styles.container}>
    <TilePlaceholder />
    <TilePlaceholder />
    <TilePlaceholder />
    <TilePlaceholder />
  </div>;
};