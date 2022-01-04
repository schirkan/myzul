import React, { useEffect, useRef, useState } from 'react';
import { GetTileLocationId } from '../../../games/azul/azulConfig';
import { AzulTileState } from "../../../games/azul/models";
import { useTileContext } from '../TileContext';
import styles from './Tile.module.scss';
import { useWindowWidth } from '@react-hook/window-size/throttled'
import { useGameContext } from '../../../common/GameContext';

export const Tile: React.FC<AzulTileState> = React.memo((props) => {
  const tileContext = useTileContext();
  const gameContext = useGameContext();
  const el = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ transform: '' });
  const width = useWindowWidth();

  useEffect(() => {
    const id = GetTileLocationId(props.location);
    const placeholder = tileContext.placeholderElements[id];
    if (placeholder && el.current) {
      var rect = placeholder.getBoundingClientRect();
      const y = rect.top + window.scrollY;
      const x = rect.left + window.scrollX;
      setPosition({ transform: 'translateX(' + x + 'px) translateY(' + y + 'px)' });
    }
  }, [props.location, width, tileContext.placeholderElements]);

  return <div
    className={styles.container}
    style={{ ...position }}
    data-color={props.color}
    data-selectable={props.selectable && gameContext?.isActive}
    data-selected={props.selected}
    onClick={() => props.selectable && tileContext.onTileClick(props)}
    ref={el}>
  </div>;
});