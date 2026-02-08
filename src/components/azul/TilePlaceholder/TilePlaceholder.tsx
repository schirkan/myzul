import { useContext, useEffect, useRef, memo, PropsWithChildren } from 'react';
import styles from './TilePlaceholder.module.scss';
import { TileContext } from 'components/azul/TileContext';
import { TilePlaceholderState } from 'games/azul/models';

export const TilePlaceholder: React.FC<PropsWithChildren<TilePlaceholderState>> = memo((props) => {
  const context = useContext(TileContext);
  const el = useRef<HTMLDivElement>(null);

  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    context.onPlaceholderClick(props);
  }

  useEffect(() => {
    if (el.current) {
      return context.registerPlaceholder(props, el.current);
    }
  }, [props, context]);

  return <div
    className={styles.container}
    data-color={props.color || 'none'}
    data-board-type={props.location.boardType}
    onClick={onClick}
    ref={el}>
    {props.multiplier && props.multiplier > 1 ? props.multiplier + 'x' : ''}
    {props.children}
  </div>;
});