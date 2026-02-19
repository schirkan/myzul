import React, { useEffect, useMemo } from 'react';
import type { BoardProps } from 'boardgame.io/react';
import { Factory } from '../Factory';
import { PlayerBoard } from '../PlayerBoard';
import { Tile } from '../Tile';
import { TileStorage } from '../TileStorage';
import { AzulGameover, AzulGameState, GameSetup } from "../../../games/azul/models";
import { TileContext, TileContextType, createTileContext } from '../TileContext';
import styles from './GameBoard.module.scss';
import { ScoreBoard } from './../ScoreBoard';
import { GameContext, useGameContext } from '../../../common/GameContext';
import { LobbyClient } from 'boardgame.io/client';
import { CenterOfTable } from '../CenterOfTable';
import { NotifyActivePlayer } from '../../NotifyActivePlayer';
import { serverUrl } from '../../../api/config';
import { SubmitUserScore } from '../../SubmitUserScore';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaRedo } from 'react-icons/fa';
import confetti from 'canvas-confetti';

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
      <span className={styles.factories}>
        {[...Array(props.factories)].map((_, index) =>
          <Factory factoryId={index.toString()} tilesPerFactory={props.tilesPerFactory} key={index} />
        )}
      </span>
      <section className={styles.scoreBoard}>
        <ScoreBoard />
      </section>
      <section className={styles.centerOfTable}>
        <CenterOfTable factories={props.factories} />
      </section>
      <section className={styles.tileStorage}>
        <TileStorage />
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

const GameOver: React.FC<BoardProps<AzulGameState>> = React.memo((props) => {
  const navigate = useNavigate();

  useEffect(() => {
    var winnerPlayerId = (props.ctx?.gameover as AzulGameover)?.winnerPlayerId;
    if (winnerPlayerId === props.playerID) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: {
          y: 0.6
        }
      });
    }
  }, []);

  if (!props.ctx.gameover) return null;

  const exitLobby = async () => {
    try {
      if (props.credentials) {
        const lobbyClient = new LobbyClient({ server: serverUrl });
        await lobbyClient.leaveMatch('MyZul', props.matchID, {
          playerID: props.playerID!,
          credentials: props.credentials!,
        });
      }
    } catch (e) {
      // ignore
    }
  };

  const playAgain = async () => {
    await exitLobby();
    navigate(0); // Seite neu laden, Spiel mit gleichen Einstellungen neu starten
  };

  const backToMenu = async () => {
    await exitLobby();
    navigate('/');
  }
  return <div className={styles.gameover}>
    <section>
      <ScoreBoard />
      <button onClick={playAgain}><FaRedo />&nbsp;Nochmal spielen</button>
      <button onClick={backToMenu}><FaArrowLeft />&nbsp;Zum Hauptmenü</button>
    </section>
  </div>
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
        {props.G.tiles.map((tile, index) => <Tile key={tile.id} {...tile} />)}
      </TileContext.Provider>
      <NotifyActivePlayer />
      <GameOver {...props} />
      <SubmitUserScore />
    </GameContext.Provider>
  </div>;
});