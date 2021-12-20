import React from 'react';
import { TilePlaceholder } from '../TilePlaceholder';
import styles from './style.module.scss';

type Props = {
  player: number
};

export const PatternLines: React.FC<Props> = (props) => {
  return <div className={styles.container}>
    <div>
      <p></p>
      <p></p>
      <p></p>
      <p></p>
      <TilePlaceholder location={{ boardType: 'PatternLine', boardId: props.player, x: 1, y: 1 }} />
    </div>
    <div>
      <p></p>
      <p></p>
      <p></p>
      <TilePlaceholder location={{ boardType: 'PatternLine', boardId: props.player, x: 2, y: 2 }} />
      <TilePlaceholder location={{ boardType: 'PatternLine', boardId: props.player, x: 1, y: 2 }} />
    </div>
    <div>
      <p></p>
      <p></p>
      <TilePlaceholder location={{ boardType: 'PatternLine', boardId: props.player, x: 3, y: 3 }} />
      <TilePlaceholder location={{ boardType: 'PatternLine', boardId: props.player, x: 2, y: 3 }} />
      <TilePlaceholder location={{ boardType: 'PatternLine', boardId: props.player, x: 1, y: 3 }} />
    </div>
    <div>
      <p></p>
      <TilePlaceholder location={{ boardType: 'PatternLine', boardId: props.player, x: 4, y: 4 }} />
      <TilePlaceholder location={{ boardType: 'PatternLine', boardId: props.player, x: 3, y: 4 }} />
      <TilePlaceholder location={{ boardType: 'PatternLine', boardId: props.player, x: 2, y: 4 }} />
      <TilePlaceholder location={{ boardType: 'PatternLine', boardId: props.player, x: 1, y: 4 }} />
    </div>
    <div>
      <TilePlaceholder location={{ boardType: 'PatternLine', boardId: props.player, x: 5, y: 5 }} />
      <TilePlaceholder location={{ boardType: 'PatternLine', boardId: props.player, x: 4, y: 5 }} />
      <TilePlaceholder location={{ boardType: 'PatternLine', boardId: props.player, x: 3, y: 5 }} />
      <TilePlaceholder location={{ boardType: 'PatternLine', boardId: props.player, x: 2, y: 5 }} />
      <TilePlaceholder location={{ boardType: 'PatternLine', boardId: props.player, x: 1, y: 5 }} />
    </div>
  </div>;
};