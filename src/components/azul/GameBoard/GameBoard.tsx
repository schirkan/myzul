import React from 'react';
import type { BoardProps } from 'boardgame.io/react';
import { Factory } from '../Factory';
import { PlayerBoard } from '../PlayerBoard';
import { Tile } from '../Tile';
import { TileStorage } from '../TileStorage';
import styles from './style.module.scss';
import { AzulGameState } from './../../../games/azul/Game';
import { TileLocationContext, defaultLocation } from '../TileLocationContext';

export const GameBoard: React.FC<BoardProps<AzulGameState>> = (props) => {
  return <div className={styles.container}>
    <TileLocationContext.Provider value={defaultLocation}>
      <header>header</header>
      <section className={styles.factories}>
        {[...Array(props.G.factories)].map((_, index) =>
          <Factory factoryId={index} key={index} />
        )}
      </section>
      <section>
        <PlayerBoard config={props.G.config} player={1} />
      </section>
      <section>
        <PlayerBoard config={props.G.config} player={2} />
      </section>
      {props.ctx.numPlayers > 2 && (
        <section>
          <PlayerBoard config={props.G.config} player={3} />
        </section>
      )}
      {props.ctx.numPlayers > 3 && (
        <section>
          <PlayerBoard config={props.G.config} player={4} />
        </section>
      )}
      <section>
        <TileStorage />
      </section>
      <footer>footer</footer>
      {props.G.tiles.map((tile, index) =>
        <Tile key={index} color={tile.color} selectable={tile.selectable} location={tile.location} />
      )}
    </TileLocationContext.Provider>
  </div>;
};