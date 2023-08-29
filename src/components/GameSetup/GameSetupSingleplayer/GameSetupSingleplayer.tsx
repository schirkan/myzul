import React, { useState } from 'react';
import styles from './GameSetupSingleplayer.module.scss';
import { GameSetup } from '../../../games/azul/models';
import { floorSetups, wallSetups } from '../../../games/azul/azulConfig';

export type GameSetupSingleplayerData = {
  numPlayers: number,
  setupData: GameSetup,

};

type Props = {
  onStartClick: (data: GameSetupSingleplayerData) => void
};

export const GameSetupSingleplayer: React.FC<Props> = React.memo((props) => {
  const [numPlayers, setNumPlayers] = useState(2);
  const [wallSetup, setWallSetup] = useState('Default');
  const [floorSetup, setFloorSetup] = useState('Default');

  return <div className={styles.container}>
    <h1>Game Setup</h1>
    <div className={styles.grid}>
      <label>Number of player:</label>
      <input type='number' min='2' max='4' value={numPlayers}
        onChange={e => setNumPlayers(parseInt(e.currentTarget.value))} />
      <span>TODO: Bot settings</span>
      {/* <label>Wall:</label>
      <select value={wallSetup} onChange={e => setWallSetup(e.target.value)}>
        {Object.keys(wallSetups).map(x => <option value={x} key={x}>{x}</option>)}
      </select>
      <label>Floor:</label>
      <select value={floorSetup} onChange={e => setFloorSetup(e.target.value)}>
        {Object.keys(floorSetups).map(x => <option value={x} key={x}>{x}</option>)}
      </select> */}
    </div>
    <button onClick={() => props.onStartClick({
      numPlayers,
      setupData: { wallSetup, floorSetup, tilesPerFactory: 4 }
    })}>Start</button>
  </div>;
});