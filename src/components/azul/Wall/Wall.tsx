import React from 'react';
import { wallSetups } from '../../../games/azul/azulConfig';
import { TilePlaceholder } from '../TilePlaceholder';
import styles from './Wall.module.scss';

type Props = {
  config: string,
  playerId: string
};

export const Wall: React.FC<Props> = React.memo((props) => {
  const setup = wallSetups[props.config];

  return <div className={styles.container}>
    {setup.map((row, y) => (
      <React.Fragment key={y} >
        {row.map((tile, x) =>
          <TilePlaceholder key={x + '|' + y} {...tile}
            location={{ boardType: 'Wall', boardId: props.playerId, x, y }} />)}
      </React.Fragment>
    ))}
  </div >;
});