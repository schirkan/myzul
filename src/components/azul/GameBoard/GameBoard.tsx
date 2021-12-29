import React, { useMemo } from 'react';
import type { BoardProps } from 'boardgame.io/react';
import { Factory } from '../Factory';
import { PlayerBoard } from '../PlayerBoard';
import { Tile } from '../Tile';
import { TileStorage } from '../TileStorage';
import { AzulGameState, GameSetup } from "../../../games/azul/models";
import { TileContext, TileContextType, createTileContext } from '../TileLocationContext';
import { TilePlaceholder } from '../TilePlaceholder';
import styles from './GameBoard.module.scss';
import { ScoreBoard } from './../ScoreBoard';
import { GameContext } from '../GameContext';

type Props = GameSetup & {
  numPlayers: number,
  factories: number,
  players: string[]
};

const Boards: React.FC<Props> = React.memo((props) => {
  return <>
    <header>
      <section className={styles.factories}>
        {[...Array(props.factories)].map((_, index) =>
          <Factory factoryId={index.toString()} key={index} />
        )}
      </section>
      <section className={styles.scoreBoard}>
        <ScoreBoard />
      </section>
      <section className={styles.centerOfTable}>
        {[...Array(props.factories * 3 + 1)].map((_, index) =>
          <TilePlaceholder key={index} location={{ boardType: 'CenterOfTable', x: index }} />
        )}
      </section>
      <section className={styles.tileStorage}>
        <TileStorage />
      </section>
    </header>
    <main>
      <section className={styles.playerBoard}>
        <PlayerBoard config={props} playerId={props.players[0]} />
      </section>
      <section className={styles.playerBoard}>
        <PlayerBoard config={props} playerId={props.players[1]} />
      </section>
      {props.numPlayers > 2 && (
        <section className={styles.playerBoard}>
          <PlayerBoard config={props} playerId={props.players[2]} />
        </section>
      )}
      {props.numPlayers > 3 && (
        <section className={styles.playerBoard}>
          <PlayerBoard config={props} playerId={props.players[3]} />
        </section>
      )}
    </main>
    <footer>
      <section>footer</section>
    </footer>
  </>
});

export const GameBoard: React.FC<BoardProps<AzulGameState>> = (props) => {
  const tileContext = useMemo<TileContextType>(() => {
    return createTileContext(props);
  }, []);

  tileContext.setBoardProps(props);

  return <div className={styles.container}>
    <GameContext.Provider value={props}>
      <TileContext.Provider value={tileContext}>
        <Boards
          players={props.ctx.playOrder}
          numPlayers={props.ctx.numPlayers}
          factories={props.G.factories}
          floorSetup={props.G.config.floorSetup}
          wallSetup={props.G.config.wallSetup} />
        {props.G.tiles.map((tile, index) => <Tile key={index} {...tile} />)}
      </TileContext.Provider>
      {/* {!props.G.initialized && <div className={styles.initialize}>
        <button onClick={props.moves.start}>Start</button>
      </div>} */}
      {props.ctx.gameover && <div className={styles.gameover}>
        <ScoreBoard />
        <button onClick={props.reset}>Neues Spiel</button>
      </div>}
    </GameContext.Provider>
  </div>;
};