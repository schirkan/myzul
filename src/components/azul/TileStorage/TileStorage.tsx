import React from 'react';
import styles from './TileStorage.module.scss';
import { useGameContext } from '../../../common/GameContext';
import { TileCounter } from '../TileCounter/TileCounter';

type Props = {};

export const TileStorage: React.FC<Props> = React.memo((props) => {
  const gameContext = useGameContext();
  const selectableTiles = gameContext?.G.tileBag || [];
  const tilesPerColor = { white: 0, black: 0, blue: 0, green: 0, yellow: 0, red: 0 };
  selectableTiles.forEach(x => tilesPerColor[x.color]++);

  return <div className={styles.container}>
    {/* <p>Beutel</p><TilePlaceholder location={{ boardType: 'TileBag' }} />    
    <p>Ablage</p><TilePlaceholder location={{ boardType: 'TileStorage' }} /> */}
    <TileCounter count={tilesPerColor.black} color='black' />
    <TileCounter count={tilesPerColor.blue} color='blue' />
    <TileCounter count={tilesPerColor.green} color='green' />
    <TileCounter count={tilesPerColor.yellow} color='yellow' />
    <TileCounter count={tilesPerColor.red} color='red' />
  </div>;
});