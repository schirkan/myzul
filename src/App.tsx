import styles from './App.module.scss';
import { Lobby } from 'boardgame.io/react';
import { GameBoard } from './components/azul/GameBoard';
import { AzulGame } from './games/azul/Game';
import githubIcon from './assets/GitHub-Mark-64px.png';
import { serverUrl } from './games/azul';
import { ThemeSelection } from './components/ThemeSelection';
import { useTheme } from './common/ThemeContext';
import { EffectsBoardWrapper } from 'bgio-effects/react';

export const App = () => {
  const [theme] = useTheme();
  return <div className={styles.container} data-theme={theme}>
    <Lobby
      gameServer={serverUrl}
      lobbyServer={serverUrl}
      gameComponents={[
        { game: AzulGame, board: EffectsBoardWrapper(GameBoard) }
      ]}
    />
    <ThemeSelection className={styles.themeSelection} />
    <a href="https://github.com/schirkan/myzul-server" target="_blank" rel="noreferrer" className={styles.githubIcon}>
      <img alt="github" title="View on GitHub" src={githubIcon} />
    </a>
  </div>
}
