import React, { useMemo } from 'react';
import { getFloorSetup } from '../../../games/azul/azulConfig';
import { TilePlaceholder } from '../TilePlaceholder';
import styles from './style.module.scss';

type Props = {
  config: string,
  playerId: string
};

export const FloorLine: React.FC<Props> = React.memo((props) => {
  const setup = useMemo(() => getFloorSetup(props.config), [props.config]);

  return <div className={styles.container}>
    <span>{setup.values[0]}</span>
    <span>{setup.values[1]}</span>
    <span>{setup.values[2]}</span>
    <span>{setup.values[3]}</span>
    <span>{setup.values[4]}</span>
    <span>{setup.values[5]}</span>
    <span>{setup.values[6]}</span>
    <TilePlaceholder location={{ boardType: 'FloorLine', boardId: props.playerId, x: 0 }} />
    <TilePlaceholder location={{ boardType: 'FloorLine', boardId: props.playerId, x: 1 }} />
    <TilePlaceholder location={{ boardType: 'FloorLine', boardId: props.playerId, x: 2 }} />
    <TilePlaceholder location={{ boardType: 'FloorLine', boardId: props.playerId, x: 3 }} />
    <TilePlaceholder location={{ boardType: 'FloorLine', boardId: props.playerId, x: 4 }} />
    <TilePlaceholder location={{ boardType: 'FloorLine', boardId: props.playerId, x: 5 }} />
    <TilePlaceholder location={{ boardType: 'FloorLine', boardId: props.playerId, x: 6 }} />
  </div>;
});