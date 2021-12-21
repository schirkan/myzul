import React, { useMemo } from 'react';
import { getWallSetup, WallSetup } from '../../../games/azul/azulConfig';
import { TilePlaceholder } from '../TilePlaceholder';
import styles from './style.module.scss';

type Props = {
  config: string,
  playerId: string
};

export const Wall: React.FC<Props> = React.memo((props) => {
  const setup = useMemo(() => getWallSetup(props.config), [props.config]);

  return <div className={styles.container}>
    {setup.rows.map((row, x) => (
      <React.Fragment key={x} >
        {row.map((tile, y) =>
          <TilePlaceholder key={x + '|' + y} {...tile}
            location={{ boardType: 'Wall', boardId: props.playerId, x, y }} />)}
      </React.Fragment>
    ))}
  </div >;
});