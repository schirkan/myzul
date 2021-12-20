import React from 'react';
import { TilePlaceholder } from '../TilePlaceholder';
import styles from './style.module.scss';

type Props = {};

export const TileStorage: React.FC<Props> = (props) => {
  return <div className={styles.container}>
    <TilePlaceholder location={{ boardType: 'TileBag' }} />
    <TilePlaceholder location={{ boardType: 'TileStorage' }} />
  </div>;
};