import React from 'react';
import { TilePlaceholder } from 'components/azul/TilePlaceholder';
import styles from './PatternLines.module.scss';

type Props = {
  playerId: string
};

export const PatternLines: React.FC<Props> = React.memo((props) => {
  return <div className={styles.container}>
    <div>
      <p></p>
      <p></p>
      <p></p>
      <p></p>
      <TilePlaceholder location={{ boardType: 'PatternLine', boardId: props.playerId, x: 0, y: 0 }} />
    </div>
    <div>
      <p></p>
      <p></p>
      <p></p>
      <TilePlaceholder location={{ boardType: 'PatternLine', boardId: props.playerId, x: 1, y: 1 }} />
      <TilePlaceholder location={{ boardType: 'PatternLine', boardId: props.playerId, x: 0, y: 1 }} />
    </div>
    <div>
      <p></p>
      <p></p>
      <TilePlaceholder location={{ boardType: 'PatternLine', boardId: props.playerId, x: 2, y: 2 }} />
      <TilePlaceholder location={{ boardType: 'PatternLine', boardId: props.playerId, x: 1, y: 2 }} />
      <TilePlaceholder location={{ boardType: 'PatternLine', boardId: props.playerId, x: 0, y: 2 }} />
    </div>
    <div>
      <p></p>
      <TilePlaceholder location={{ boardType: 'PatternLine', boardId: props.playerId, x: 3, y: 3 }} />
      <TilePlaceholder location={{ boardType: 'PatternLine', boardId: props.playerId, x: 2, y: 3 }} />
      <TilePlaceholder location={{ boardType: 'PatternLine', boardId: props.playerId, x: 1, y: 3 }} />
      <TilePlaceholder location={{ boardType: 'PatternLine', boardId: props.playerId, x: 0, y: 3 }} />
    </div>
    <div>
      <TilePlaceholder location={{ boardType: 'PatternLine', boardId: props.playerId, x: 4, y: 4 }} />
      <TilePlaceholder location={{ boardType: 'PatternLine', boardId: props.playerId, x: 3, y: 4 }} />
      <TilePlaceholder location={{ boardType: 'PatternLine', boardId: props.playerId, x: 2, y: 4 }} />
      <TilePlaceholder location={{ boardType: 'PatternLine', boardId: props.playerId, x: 1, y: 4 }} />
      <TilePlaceholder location={{ boardType: 'PatternLine', boardId: props.playerId, x: 0, y: 4 }} />
    </div>
  </div>;
});