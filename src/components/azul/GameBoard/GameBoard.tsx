import React from 'react';
import { GameSetup, TileColor } from '../../../games/azul/azulConfig';
import { Factory } from '../Factory';
import { PlayerBoard } from '../PlayerBoard';
import { Tile } from '../Tile';
import { TileStorage } from '../TileStorage';
import styles from './style.module.scss';

type Props = { config: GameSetup };

const game = {
  tiles: [
    { id: 1, selectable: false, color: 'red' },
    { id: 2, selectable: false, color: 'green' },
    { id: 3, selectable: false, color: 'blue' },
    { id: 4, selectable: false, color: 'yellow' },
    { id: 5, selectable: false, color: 'black' },
  ]
}


export const GameBoard: React.FC<Props> = (props) => {
  return <div className={styles.container}>
    <header>header</header>
    <section className={styles.factories}>
      {[...Array(props.config.numberOfPlayers * 2 + 1)].map((x, i) =>
        <Factory />
      )}
    </section>
    <section>
      <PlayerBoard config={props.config} player={1} />
    </section>
    <section>
      <PlayerBoard config={props.config} player={2} />
    </section>
    {props.config.numberOfPlayers > 2 && (
      <section>
        <PlayerBoard config={props.config} player={3} />
      </section>
    )}
    {props.config.numberOfPlayers > 3 && (
      <section>
        <PlayerBoard config={props.config} player={4} />
      </section>
    )}
    <section>
      <TileStorage />
    </section>
    <footer>footer</footer>
    {game.tiles.map(tile => <Tile color={tile.color as TileColor} selectable={tile.selectable} />)}
  </div>;
};