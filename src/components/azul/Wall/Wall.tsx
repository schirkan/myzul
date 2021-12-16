import React from 'react';
import { WallSetup } from '../../../games/azul/azulConfig';
import { TilePlaceholder } from '../TilePlaceholder';
import styles from './style.module.scss';

type Props = {
  config: WallSetup
};

export const Wall: React.FC<Props> = (props) => {
  return <div className={styles.container}>
    {props.config.rows.map((row, x) => (
      <React.Fragment key={x} >
        {row.map((tile, y) => <TilePlaceholder key={x + '|' + y} {...tile} />)}
      </React.Fragment>
    ))}
  </div >;
};