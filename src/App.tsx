import { useState } from 'react';
import { createAzulClient } from './games/azul';
import { GameSetup } from './components/GameSetup';
import './App.scss'

export const App = () => {
  const [config, setConfig] = useState<{
    game: string,
    numPlayers: number,
    setupData: any
  }>();

  const onStartClick = (game: string, numPlayers: number, setupData: any) => {
    setConfig({ game, numPlayers, setupData });
  }

  if (config?.game === 'AZUL') {
    const Client = createAzulClient(config.numPlayers);
    return <div>
      <Client playerID='0' />
      <Client playerID='1' />
    </div>
  }
  return <GameSetup onStartClick={onStartClick} />
}
