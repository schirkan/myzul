import React, { useState, useEffect } from 'react';
import styles from './LastGames.module.scss';
import { BiHistory, BiCheck, BiX } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

export type LastGame = {
  seed: string;
  won: boolean;
  points: number;
  timestamp: number;
};

const STORAGE_KEY = 'lastGames';
const MAX_GAMES = 10;

export const getLastGames = (): LastGame[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveLastGame = (game: LastGame): void => {
  try {
    const games = getLastGames();
    games.unshift(game);
    const trimmed = games.slice(0, MAX_GAMES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // ignore storage errors
  }
};

export const LastGames: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const [games, setGames] = useState<LastGame[]>([]);
  const iconSize = 30;

  useEffect(() => {
    setGames(getLastGames());
  }, []);

  const handleReplay = (seed: string) => {
    navigate(`/local-singleplayer/setup?seed=${seed}`);
  };

  if (games.length === 0) {
    return (
      <div className={styles.container}>
        <h2>
          <BiHistory size={iconSize} />
          Last Games
        </h2>
        <p className={styles.empty}>No games played yet</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2>
        <BiHistory size={iconSize} />
        Last Games
      </h2>
      <ul className={styles.list}>
        {games.map((game, index) => (
          <li key={`${game.seed}-${index}`} className={styles.item}>
            <div className={styles.info}>
              <span className={game.won ? styles.win : styles.lose}>
                {game.won ? <BiCheck /> : <BiX />}
              </span>
              <span className={styles.points}>{game.points} pts</span>
              <span className={styles.seed}>#{game.seed}</span>
            </div>
            <button
              className={styles.replayButton}
              onClick={() => handleReplay(game.seed)}
              title="Play again with same seed"
            >
              ↻
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
});

export default LastGames;
