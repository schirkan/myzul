import styles from './App.module.scss';
import githubIcon from './assets/github.svg';
import { Lobby } from 'boardgame.io/react';
import { GameBoard } from './components/azul/GameBoard';
import { AzulGame } from './games/azul/Game';
import { ThemeSelection } from './components/ThemeSelection';
import { EffectsBoardWrapper } from 'bgio-effects/react';
import { serverUrl } from './api/config';
import { Highscore } from './components/Highscore';

const board = EffectsBoardWrapper(GameBoard, {
  updateStateAfterEffects: true,
});

export const App = () => {
  return <div className={styles.container}>
    <Lobby
      gameServer={serverUrl}
      lobbyServer={serverUrl}
      gameComponents={[{ game: AzulGame, board: board }]}
    />
    <Highscore />
    <ThemeSelection className={styles.themeSelection} />
    <a href="https://github.com/schirkan/myzul-server" target="_blank" rel="noreferrer" className={styles.githubIcon}>
      <img alt="github" title="View on GitHub" src={githubIcon} />
    </a>
  </div>
}
