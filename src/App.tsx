import styles from './App.module.scss';
import githubIcon from './assets/github.svg';
import { Logo } from './components/Logo';
import { ThemeSelection } from './components/ThemeSelection';
import { GameMode, GameSelection } from './components/GameSelection';
import { useState } from 'react';
import { LocalSingleplayer, LocalMultiplayer, OnlineMultiplayer } from './components/utils';

export const App = () => {
  const [gameMode, setGameMode] = useState<GameMode>();

  var NewGame = () => <></>;
  if (gameMode === 'local-singleplayer') {
    NewGame = LocalSingleplayer;
  } else if (gameMode === 'local-multiplayer') {
    NewGame = LocalMultiplayer;
  } else if (gameMode === 'online-multiplayer') {
    NewGame = OnlineMultiplayer;
  }
  return <div className={styles.container}>
    <Logo/>
    {gameMode ? <NewGame /> : <GameSelection onSelect={setGameMode} />}
    <ThemeSelection className={styles.themeSelection} />
    <a href="https://github.com/schirkan/myzul-server" target="_blank" rel="noreferrer" className={styles.githubIcon}>
      <img alt="github" title="View on GitHub" src={githubIcon} />
    </a>
  </div>
}
