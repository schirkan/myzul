import React from 'react';
import { TilePlaceholder } from 'components/azul/TilePlaceholder';
import styles from './Factory.module.scss';

type Props = {
  factoryId: string,
  tilesPerFactory: number
};

export const Factory: React.FC<Props> = React.memo((props) => {
  return <div className={styles.container}>
    {[...Array(props.tilesPerFactory)].map((_, index) =>
      <TilePlaceholder key={index} location={{ boardType: 'Factory', boardId: props.factoryId, x: index, y: 0 }} />
    )}
  </div>;
});