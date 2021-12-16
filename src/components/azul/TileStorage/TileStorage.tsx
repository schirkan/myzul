import React from 'react';
import { TilePlaceholder } from '../TilePlaceholder';
import styles from './style.module.scss';

type Props = {};

export const TileStorage: React.FC<Props> = (props) => {
  return <div className={styles.container}>
    <TilePlaceholder id='storage-new' />
    <TilePlaceholder id='storage-used' />
  </div>;
};