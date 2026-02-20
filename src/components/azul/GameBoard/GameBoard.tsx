import React, { useMemo } from 'react';
import type { BoardProps } from 'boardgame.io/react';
import { Factory } from '../Factory';
import { PlayerBoard } from '../PlayerBoard';
import { Tile } from '../Tile';
import { TileStorage } from '../TileStorage';
import { AzulGameState, GameSetup } from "../../../games/azul/models";
import { TileContext, TileContextType, createTileContext } from '../TileContext';
import styles from './GameBoard.module.scss';
import { ScoreBoard } from './../ScoreBoard';
import { GameContext, useGameContext } from '../../../common/GameContext';
import { CenterOfTable } from '../CenterOfTable';
import { NotifyActivePlayer } from '../../NotifyActivePlayer';
import { SubmitUserScore } from '../../SubmitUserScore';
import { GameOver } from '../GameOver';

const Boards: React.FC = React.memo(() => {
  console.log('render boards');
  const gameContext = useGameContext();
  if (!gameContext) return null;

  return <>
    <header>
      <span className={styles.factories}>
        {[...Array(gameContext.G.factories)].map((_, index) =>
          <Factory factoryId={index.toString()} tilesPerFactory={gameContext.G.config.tilesPerFactory} key={index} />
        )}
      </span>
      <section className={styles.scoreBoard}>
        <ScoreBoard />
      </section>
      <section className={styles.centerOfTable}>
        <CenterOfTable factories={gameContext.G.factories} />
      </section>
      <section className={styles.tileStorage}>
        <TileStorage />
      </section>
    </header>
    <main>
      {gameContext.ctx.playOrder.map(playerId =>
        <section key={playerId} className={styles.playerBoard} data-active={playerId === gameContext.ctx.currentPlayer}>
          <PlayerBoard config={gameContext.G.config} playerId={playerId} />
        </section>
      )}
    </main>
  </>
});

export const GameBoard: React.FC<BoardProps<AzulGameState>> = React.memo((props) => {
  const tileContext = useMemo<TileContextType>(() => {
    return createTileContext();
  }, []);

  tileContext.setBoardProps(props);

  return <div className={styles.container}>
    <GameContext.Provider value={props}>
      <TileContext.Provider value={tileContext}>
        <Boards />
        {props.G.tiles.map((tile, index) => <Tile key={tile.id} {...tile} />)}
      </TileContext.Provider>
      <NotifyActivePlayer />
      <GameOver />
      <SubmitUserScore />
    </GameContext.Provider>
  </div>;
});
