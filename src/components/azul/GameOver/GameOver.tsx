import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight, FaRedo } from 'react-icons/fa';
import confetti from 'canvas-confetti';
import { AzulGameover } from 'games/azul/models';
import { ScoreBoard } from '../ScoreBoard';
import { saveLastGame } from '../../LastGames';
import styles from './GameOver.module.scss';
import { useGameContext } from 'common/GameContext';

export const GameOver: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const savedRef = useRef(false);
  const gameContext = useGameContext();
  if (!gameContext) return null;

  useEffect(() => {
    var winnerPlayerId = (gameContext.ctx.gameover as AzulGameover)?.winnerPlayerId;
    if (winnerPlayerId === gameContext.playerID) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: {
          y: 0.6
        }
      });
    }

    // Save game stats when game is over
    if (gameContext.ctx.gameover && !savedRef.current) {
      savedRef.current = true;
      const seed = searchParams.get('seed') || '';
      const gameover = gameContext.ctx.gameover as AzulGameover;
      const playerId = gameContext.playerID;

      // Get player's score
      const playerScore = gameContext.G.score[playerId || '0'];
      const points = playerScore?.points || 0;
      const won = gameover.winnerPlayerId === playerId;

      if (seed) {
        saveLastGame({
          seed,
          won,
          points,
          timestamp: Date.now()
        });
      }
    }
  }, [gameContext.ctx.gameover, searchParams, gameContext.G.score, gameContext.playerID]);

  if (!gameContext.ctx.gameover) return null;

  const exitLobby = async () => {
    try {
      if (gameContext.credentials) {
        const { LobbyClient } = await import('boardgame.io/client');
        const { serverUrl } = await import('../../../api/config');
        const lobbyClient = new LobbyClient({ server: serverUrl });
        await lobbyClient.leaveMatch('MyZul', gameContext.matchID, {
          playerID: gameContext.playerID!,
          credentials: gameContext.credentials!,
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

  const playNewGame = async () => {
    await exitLobby();
    navigate('/local-singleplayer/setup');
  }

  const backToMenu = async () => {
    await exitLobby();
    navigate('/');
  }

  return <div className={styles.gameover}>
    <section>
      <ScoreBoard />
      <button onClick={playNewGame}><FaArrowRight />&nbsp;Neues Spiel</button>
      <button onClick={playAgain}><FaRedo />&nbsp;Nochmal spielen</button>
      <button onClick={backToMenu}><FaArrowLeft />&nbsp;Zum Hauptmenü</button>
    </section>
  </div>
});
