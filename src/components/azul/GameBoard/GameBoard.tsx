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
import { LobbyClient } from 'boardgame.io/client';
import { CenterOfTable } from '../CenterOfTable';
import { NotifyActivePlayer } from '../../NotifyActivePlayer';
import { serverUrl } from '../../../api/config';
import { SubmitUserScore } from '../../SubmitUserScore';
// import { getGameStateId } from '../../../games/azul/gameStateId';

type Props = GameSetup & {
  numPlayers: number,
  factories: number,
  tilesPerFactory: number,
  players: string[]
};

const Boards: React.FC<Props> = React.memo((props) => {
  console.log('render boards');
  const gameContext = useGameContext();
  return <>
    <header>
      <section className={styles.factories}>
        {[...Array(props.factories)].map((_, index) =>
          <Factory factoryId={index.toString()} tilesPerFactory={props.tilesPerFactory} key={index} />
        )}
      </section>
      <section className={styles.scoreBoard}>
        <ScoreBoard />
      </section>
      <section className={styles.centerOfTable}>
        <CenterOfTable factories={props.factories} />
      </section>
      <section className={styles.tileStorage}>
        <TileStorage />
        {/* <button onClick={() => console.log(getGameStateId(gameContext?.G!, gameContext?.ctx!))}>GetId</button> */}
      </section>
    </header>
    <main>
      {props.players.map(playerId =>
        <section key={playerId}
          className={styles.playerBoard}
          data-active={playerId === gameContext?.ctx.currentPlayer}
        >
          <PlayerBoard config={props} playerId={playerId} />
        </section>
      )}
    </main>
  </>
});

const PlayAgainButton: React.FC<BoardProps<AzulGameState>> = React.memo((props) => {
  const onClick = async () => {
    try {
      if (props.credentials) {
        const lobbyClient = new LobbyClient({ server: serverUrl });
        await lobbyClient.leaveMatch('MyZul', props.matchID, {
          playerID: props.playerID!,
          credentials: props.credentials!,
        });
      }
    } finally {
      window.location.reload();
    }
  }
  return <button onClick={onClick}>Zurück zum Hauptmenü</button>
});

export const GameBoard: React.FC<BoardProps<AzulGameState>> = React.memo((props) => {
  const tileContext = useMemo<TileContextType>(() => {
    return createTileContext();
  }, []);

  tileContext.setBoardProps(props);

  return <div className={styles.container}>
    <GameContext.Provider value={props}>
      <TileContext.Provider value={tileContext}>
        <Boards
          players={props.ctx.playOrder}
          numPlayers={props.ctx.numPlayers}
          factories={props.G.factories}
          tilesPerFactory={props.G.config.tilesPerFactory}
          floorSetup={props.G.config.floorSetup}
          wallSetup={props.G.config.wallSetup} />
        {props.G.tiles.map((tile, index) => <Tile key={index} {...tile} />)}
      </TileContext.Provider>
      <NotifyActivePlayer />
      {props.ctx.gameover && <div className={styles.gameover}>
        <section>
          <ScoreBoard />
          <PlayAgainButton {...props} />
        </section>
      </div>}
      <SubmitUserScore />
    </GameContext.Provider>
  </div>;
});