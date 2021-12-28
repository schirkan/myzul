import React from 'react';
import { TilePlaceholder } from '../TilePlaceholder';
import styles from './TileStorage.module.scss';

type Props = {};

export const TileStorage: React.FC<Props> = React.memo((props) => {
  return <div className={styles.container}>
    <p>Beutel</p><TilePlaceholder location={{ boardType: 'TileBag' }} />
    <p>Ablage</p><TilePlaceholder location={{ boardType: 'TileStorage' }} />
  </div>;
});