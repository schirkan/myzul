import React, { useMemo } from 'react';
import type { BoardProps } from 'boardgame.io/react';
import { Factory } from '../Factory';
import { PlayerBoard } from '../PlayerBoard';
import { Tile } from '../Tile';
import { TileStorage } from '../TileStorage';
import styles from './style.module.scss';
import { AzulGameState } from './../../../games/azul/Game';
import { TileContext, TileContextType, createTileContext } from '../TileLocationContext';
import { GameSetup } from '../../../games/azul/azulConfig';
import { TilePlaceholder } from '../TilePlaceholder';

type Props = GameSetup & {
  numPlayers: number,
  factories: number,
  players: string[]
};

const Boards: React.FC<Props> = React.memo((props) => {
  return <>
    <header>header</header>
    <section className={styles.factories}>
      {[...Array(props.factories)].map((_, index) =>
        <Factory factoryId={index.toString()} key={index} />
      )}
    </section>
    <section className={styles.centerOfTable}>
      {[...Array(props.factories * 4)].map((_, index) =>
        <TilePlaceholder key={index} location={{ boardType: 'CenterOfTable', x: index }} />
      )}
    </section>
    <section>
      <PlayerBoard config={props} playerId={props.players[0]} />
    </section>
    <section>
      <PlayerBoard config={props} playerId={props.players[1]} />
    </section>
    {props.numPlayers > 2 && (
      <section>
        <PlayerBoard config={props} playerId={props.players[2]} />
      </section>
    )}
    {props.numPlayers > 3 && (
      <section>
        <PlayerBoard config={props} playerId={props.players[3]} />
      </section>
    )}
    <section>
      <TileStorage />
    </section>
    <footer>footer</footer>
  </>
});

export const GameBoard: React.FC<BoardProps<AzulGameState>> = (props) => {
  const tileContext = useMemo<TileContextType>(() => {
    return createTileContext(props);
  }, []);

  tileContext.setBoardProps(props);

  return <div className={styles.container}>
    <TileContext.Provider value={tileContext}>
      <Boards
        players={props.ctx.playOrder}
        numPlayers={props.ctx.numPlayers}
        factories={props.G.factories}
        floorSetup={props.G.config.floorSetup}
        wallSetup={props.G.config.wallSetup} />
      {props.G.tiles.map((tile, index) => <Tile key={index} {...tile} />)}
    </TileContext.Provider>
  </div>;
};