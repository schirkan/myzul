import React from 'react';
import styles from './TileStorage.module.scss';
import { useGameContext } from '../../../common/GameContext';
import { TileCounter } from '../TileCounter/TileCounter';

type Props = {};

export const TileStorage: React.FC<Props> = React.memo((props) => {
  const gameContext = useGameContext();
  const selectableTiles = gameContext?.G.tiles.filter(x => x.selectable) || [];
  const black = selectableTiles.filter(x => x.color === 'black').length;
  const blue = selectableTiles.filter(x => x.color === 'blue').length;
  const green = selectableTiles.filter(x => x.color === 'green').length;
  const yellow = selectableTiles.filter(x => x.color === 'yellow').length;
  const red = selectableTiles.filter(x => x.color === 'red').length;

  return <div className={styles.container}>
    {/* <p>Beutel</p><TilePlaceholder location={{ boardType: 'TileBag' }} />    
    <p>Ablage</p><TilePlaceholder location={{ boardType: 'TileStorage' }} /> */}
    <TileCounter count={black} color='black' />
    <TileCounter count={blue} color='blue' />
    <TileCounter count={green} color='green' />
    <TileCounter count={yellow} color='yellow' />
    <TileCounter count={red} color='red' />
  </div>;
});