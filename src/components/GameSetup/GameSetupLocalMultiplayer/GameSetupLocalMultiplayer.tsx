import React, { ChangeEventHandler, useCallback, useState } from 'react';
import styles from './GameSetupLocalMultiplayer.module.scss';
import { GameSetup } from '../../../games/azul/models';
import { floorSetups, wallSetups } from '../../../games/azul/azulConfig';
import { getSeedFromLocation, updateSeedToLocation } from '../../utils';

export type GameSetupLocalMultiplayerData = { numPlayers: number, setupData: GameSetup };

type Props = {
  onStartClick: (data: GameSetupLocalMultiplayerData) => void
};

export const GameSetupLocalMultiplayer: React.FC<Props> = React.memo((props) => {
  const [numPlayers, setNumPlayers] = useState(2);
  const [wallSetup, setWallSetup] = useState('Default');
  const [floorSetup, setFloorSetup] = useState('Default');
  const [seed, setSeed] = useState<string | undefined>(getSeedFromLocation());
  const updateSeed: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    const newSeed = e.target.value.trim();
    setSeed(newSeed);
    updateSeedToLocation(newSeed);
  }, []);

  return <div className={styles.container}>
    <h1>Game Setup</h1>
    <div className={styles.grid}>
      <label>Number of player:</label>
      <input type='number' min='2' max='4' value={numPlayers}
        onChange={e => setNumPlayers(parseInt(e.currentTarget.value))} />
      <label>Wall:</label>
      <select value={wallSetup} onChange={e => setWallSetup(e.target.value)}>
        {Object.keys(wallSetups).map(x => <option value={x} key={x}>{x}</option>)}
      </select>
      <label>Floor:</label>
      <select value={floorSetup} onChange={e => setFloorSetup(e.target.value)}>
        {Object.keys(floorSetups).map(x => <option value={x} key={x}>{x}</option>)}
      </select>
      <label>Seed:</label>
      <input placeholder='random' value={seed} onChange={updateSeed} />
    </div>
    <button onClick={() => window.location.reload() }>Menu</button>
    <button onClick={() => props.onStartClick({ numPlayers, setupData: { wallSetup, floorSetup, tilesPerFactory: 4 } })}>Start</button>
  </div>;
});