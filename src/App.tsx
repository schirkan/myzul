import { useState } from 'react';
import { createAzulClient } from './games/azul';
import { GameSetup } from './components/GameSetup';
import styles from './App.module.scss';

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
      <Client playerID='1' />
    </>
  } else {
    content = <GameSetup onStartClick={onStartClick} />
  }

  return <div className={styles.container}>
    {content}
  </div>;
}
