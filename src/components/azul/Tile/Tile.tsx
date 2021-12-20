import React, { useContext, useEffect, useRef, useState } from 'react';
import { GetTileLocationId, TileColor, TileLocation } from '../../../games/azul/azulConfig';
import { TileLocationContext } from '../TileLocationContext';
import styles from './style.module.scss';

type Props = {
  color: TileColor,
  selectable: boolean,
  location: TileLocation
};

export const Tile: React.FC<Props> = (props) => {
  const context = useContext(TileLocationContext);
  const el = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const id = GetTileLocationId(props.location);
    const placeholder = context.placeholder[id];
    if (placeholder && el.current) {
      var rect = placeholder.getBoundingClientRect();
      const newPosition = { top: rect.top, left: rect.left };
      console.log('Move tile ' + id + ' to ', newPosition, placeholder);
      setPosition(newPosition);
    }
  }, [props.location]);

  return <div
    className={styles.container}
    data-color={props.color}
    data-selectable={props.selectable}
    style={{ ...position }}
    ref={el}></div>;
};