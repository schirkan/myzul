import React from 'react';
import { TilePlaceholder } from '../TilePlaceholder';
import styles from './style.module.scss';

type Props = {
  factoryId: string
};

export const Factory: React.FC<Props> = React.memo((props) => {
  return <div className={styles.container}>
    <TilePlaceholder location={{ boardType: 'Factory', boardId: props.factoryId, x: 0, y: 0 }} />
    <TilePlaceholder location={{ boardType: 'Factory', boardId: props.factoryId, x: 1, y: 0 }} />
    <TilePlaceholder location={{ boardType: 'Factory', boardId: props.factoryId, x: 0, y: 1 }} />
    <TilePlaceholder location={{ boardType: 'Factory', boardId: props.factoryId, x: 1, y: 1 }} />
  </div>;
});