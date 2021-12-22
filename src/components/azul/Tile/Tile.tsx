import React, { useContext, useEffect, useRef, useState } from 'react';
import { GetTileLocationId } from '../../../games/azul/azulConfig';
import { AzulTileState } from '../../../games/azul/Game';
import { TileContext } from '../TileLocationContext';
import styles from './style.module.scss';

export const Tile: React.FC<AzulTileState> = React.memo((props) => {
  const context = useContext(TileContext);
  const el = useRef<HTMLDivElement>(null);
  // const [position, setPosition] = useState({ translate: '' });
  const [position, setPosition] = useState({ transform: '' });

  useEffect(() => {
    const id = GetTileLocationId(props.location);
    const placeholder = context.placeholder[id];
    if (placeholder && el.current) {
      var rect = placeholder.getBoundingClientRect();
      const y = rect.top + window.scrollY;
      const x = rect.left + window.scrollX;
      // console.log('Move tile ' + id + ' to ', x, y);
      setPosition({ transform: 'translateX(' + x + 'px) translateY(' + y + 'px)' });
    }
  }, [props.location]);

  return <div
    className={styles.container}
    style={{ ...position }}
    ref={el}>
    <div
      className={styles.tile}
      data-color={props.color}
      data-selectable={props.selectable}
      data-selected={props.selected}
      data-location={JSON.stringify(props.location)}
      onClick={() => props.selectable && context.onTileClick(props)}>
    </div>
  </div>;
});