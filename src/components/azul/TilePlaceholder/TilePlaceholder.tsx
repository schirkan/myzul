import React, { useContext, useEffect, useRef } from 'react';
import { TileLocation, TilePlaceholderConfig } from '../../../games/azul/azulConfig';
import styles from './style.module.scss';
import { GetTileLocationId } from './../../../games/azul/azulConfig';
import { TileContext } from '../TileLocationContext';

type Props = Partial<TilePlaceholderConfig> & {
  location: TileLocation
};

export const TilePlaceholder: React.FC<Props> = React.memo((props) => {
  const context = useContext(TileContext);
  const el = useRef<HTMLDivElement>(null);

  let id = '';
  if (props.location) {
    id = GetTileLocationId(props.location);
    // console.log(id);
  }

  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    context.onPlaceholderClick(props.location);
  }

  useEffect(() => {
    if (id && el.current) {
      context.placeholder[id] = el.current;
    }
    return () => {
      delete (context.placeholder[id]);
    }
  }, [id]);

  return <div
    className={styles.container}
    data-color={props.color || 'none'}
    data-id={id}
    onClick={onClick}
    ref={el}>
    {props.multiplier && props.multiplier > 1 ? props.multiplier + 'x' : ''}
  </div>;
});