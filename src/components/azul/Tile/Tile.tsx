import React, { useContext, useEffect, useRef, useState } from 'react';
import { GetTileLocationId } from '../../../games/azul/azulConfig';
import { AzulTileState } from '../../../games/azul/Game';
import { TileContext } from '../TileLocationContext';
import styles from './style.module.scss';

export const Tile: React.FC<AzulTileState> = React.memo((props) => {
  const context = useContext(TileContext);
  const el = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const id = GetTileLocationId(props.location);
    const placeholder = context.placeholder[id];
    if (placeholder && el.current) {
      var rect = placeholder.getBoundingClientRect();
      const newPosition = {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX
      };
      console.log('Move tile ' + id + ' to ', newPosition, placeholder);
      setPosition(newPosition);
    }
  }, [props.location]);

  return <div
    className={styles.container}
    data-color={props.color}
    data-selectable={props.selectable}
    data-selected={props.selected}
    style={{ ...position }}
    onClick={() => props.selectable && context.onTileClick(props)}
    ref={el}></div>;
});