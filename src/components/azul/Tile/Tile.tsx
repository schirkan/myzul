import React, { useContext, useEffect, useRef, useState } from 'react';
import { GetTileLocationId } from '../../../games/azul/azulConfig';
import { AzulTileState } from "../../../games/azul/models";
import { TileContext } from '../TileLocationContext';
import styles from './Tile.module.scss';
import { useWindowWidth } from '@react-hook/window-size/throttled'

export const Tile: React.FC<AzulTileState> = React.memo((props) => {
  const context = useContext(TileContext);
  const el = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ transform: '' });
  const width = useWindowWidth();

  useEffect(() => {
    const id = GetTileLocationId(props.location);
    const placeholder = context.placeholderElements[id];
    if (placeholder && el.current) {
      var rect = placeholder.getBoundingClientRect();
      const y = rect.top + window.scrollY;
      const x = rect.left + window.scrollX;
      setPosition({ transform: 'translateX(' + x + 'px) translateY(' + y + 'px)' });
    }
  }, [props.location, width]);

  return <div
    className={styles.container}
    style={{ ...position }}
    data-color={props.color}
    data-selectable={props.selectable}
    data-selected={props.selected}
    data-location={JSON.stringify(props.location)}
    onClick={() => props.selectable && context.onTileClick(props)}
    ref={el}>
  </div>;
});