import React from 'react';
import { TilePlaceholder } from '../TilePlaceholder';
import styles from './CenterOfTable.module.scss';

type Props = {
  factories: number,
};

export const CenterOfTable: React.FC<Props> = React.memo((props) => {
  return <div className={styles.container}>
    {[...Array(props.factories * 3 + 1)].map((_, index) =>
      <TilePlaceholder key={index} location={{ boardType: 'CenterOfTable', x: index }} />
    )}
  </div>;
});