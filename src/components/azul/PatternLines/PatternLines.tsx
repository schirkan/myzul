import React, { useContext } from 'react';
import { TilePlaceholder } from '../TilePlaceholder';
import { TileContext } from '../TileLocationContext';
import styles from './PatternLines.module.scss';

type Props = {
  playerId: string
};

export const PatternLines: React.FC<Props> = React.memo((props) => {
  const context = useContext(TileContext);

  const onLineClick = (y: number) => {
    context.onPlaceholderClick({ boardType: 'PatternLine', boardId: props.playerId, y });
  }

  return <div className={styles.container}>
    <div onClick={() => onLineClick(0)}>
      <p></p>
      <p></p>
      <p></p>
      <p></p>
      <TilePlaceholder location={{ boardType: 'PatternLine', boardId: props.playerId, x: 0, y: 0 }} />
    </div>
    <div onClick={() => onLineClick(1)}>
      <p></p>
      <p></p>
      <p></p>
      <TilePlaceholder location={{ boardType: 'PatternLine', boardId: props.playerId, x: 1, y: 1 }} />
      <TilePlaceholder location={{ boardType: 'PatternLine', boardId: props.playerId, x: 0, y: 1 }} />
    </div>
    <div onClick={() => onLineClick(2)}>
      <p></p>
      <p></p>
      <TilePlaceholder location={{ boardType: 'PatternLine', boardId: props.playerId, x: 2, y: 2 }} />
      <TilePlaceholder location={{ boardType: 'PatternLine', boardId: props.playerId, x: 1, y: 2 }} />
      <TilePlaceholder location={{ boardType: 'PatternLine', boardId: props.playerId, x: 0, y: 2 }} />
    </div>
    <div onClick={() => onLineClick(3)}>
      <p></p>
      <TilePlaceholder location={{ boardType: 'PatternLine', boardId: props.playerId, x: 3, y: 3 }} />
      <TilePlaceholder location={{ boardType: 'PatternLine', boardId: props.playerId, x: 2, y: 3 }} />
      <TilePlaceholder location={{ boardType: 'PatternLine', boardId: props.playerId, x: 1, y: 3 }} />
      <TilePlaceholder location={{ boardType: 'PatternLine', boardId: props.playerId, x: 0, y: 3 }} />
    </div>
    <div onClick={() => onLineClick(4)}>
      <TilePlaceholder location={{ boardType: 'PatternLine', boardId: props.playerId, x: 4, y: 4 }} />
      <TilePlaceholder location={{ boardType: 'PatternLine', boardId: props.playerId, x: 3, y: 4 }} />
      <TilePlaceholder location={{ boardType: 'PatternLine', boardId: props.playerId, x: 2, y: 4 }} />
      <TilePlaceholder location={{ boardType: 'PatternLine', boardId: props.playerId, x: 1, y: 4 }} />
      <TilePlaceholder location={{ boardType: 'PatternLine', boardId: props.playerId, x: 0, y: 4 }} />
    </div>
  </div>;
});