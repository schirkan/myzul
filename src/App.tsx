import styles from './App.module.scss';
import { Lobby } from 'boardgame.io/react';
import { GameBoard } from './components/azul/GameBoard';
import { AzulGame } from './games/azul/Game';
import githubIcon from './assets/GitHub-Mark-64px.png';
import { getServerUrl } from './games/azul';
import { ThemeSelection } from './components/ThemeSelection';
import { useTheme } from './common/ThemeContext';

export const App = () => {
  const [theme] = useTheme();
  return <div className={styles.container} data-theme={theme}>
    <Lobby
      gameServer={getServerUrl()}
      lobbyServer={getServerUrl()}
      gameComponents={[
        { game: AzulGame, board: GameBoard }
      ]}
    />
    <ThemeSelection className={styles.themeSelection} />
    <a href="https://github.com/schirkan/myzul-server" target="_blank" className={styles.githubIcon}>
      <img alt="github" title="View on GitHub" src={githubIcon} />
    </a>
  </div>
}
/*
export const App = () => {
  const [config, setConfig] = useState<{
    game: string,
    numPlayers: number,
    setupData: any
  }>();

  const onStartClick = (game: string, numPlayers: number, setupData: any) => {
    setConfig({ game, numPlayers, setupData });
  }

  let content = undefined;

  if (config?.game === 'AZUL') {
    const Client = createAzulLocalClient(config.numPlayers);
    content = <>
      <Client playerID='0' />
      <hr />
      <Client playerID='1' />
    </>
  } else {
    content = <GameSetup onStartClick={onStartClick} />
  }

  return <div className={styles.container}>
    {content}
  </div>;
}
*/