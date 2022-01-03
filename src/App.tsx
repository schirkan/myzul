import styles from './App.module.scss';
import { Lobby } from 'boardgame.io/react';
import { GameBoard } from './components/azul/GameBoard';
import { AzulGame } from './games/azul/Game';
import githubIcon from './assets/GitHub-Mark-64px.png';

let server = window.location.hostname;
if (server === 'localhost') server += ':8000';

export const App = () => {
  return <div className={styles.container}>
    <Lobby
      gameServer={'http://' + server}
      lobbyServer={'http://' + server}
      gameComponents={[
        { game: AzulGame, board: GameBoard }
      ]}
    />
    <a href="https://github.com/schirkan/myzul-server" className={styles.githubIcon}>
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
    const Client = createAzulClient(config.numPlayers);
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