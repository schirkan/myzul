import styles from './App.module.scss';
import { Lobby } from 'boardgame.io/react';
import { GameBoard } from './components/azul/GameBoard';
import { AzulGame } from './games/azul/Game';

export const App = () => {
  return <div className={styles.container}>
    <Lobby
      gameServer={`http://${window.location.hostname}:8000`}
      lobbyServer={`http://${window.location.hostname}:8000`}
      gameComponents={[
        { game: AzulGame, board: GameBoard }
      ]}
    />
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