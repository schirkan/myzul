import React, { useState } from 'react';
import styles from './GameSetupSingleplayer.module.scss';
import { GameSetup } from '../../../games/azul/models';
// import { floorSetups, wallSetups } from '../../../games/azul/azulConfig';
import { defaultGameSetup } from './../../../games/azul/azulConfig';

var botDifficulties = ['easy', 'medium', 'hard'];
export type BotDifficulty = 'easy' | 'medium' | 'hard';

export type GameSetupSingleplayerData = {
  numPlayers: number,
  setupData: GameSetup,
  bot1: BotDifficulty,
  bot2: BotDifficulty,
  bot3: BotDifficulty,
};

type Props = {
  onStartClick: (data: GameSetupSingleplayerData) => void
};

export const GameSetupSingleplayer: React.FC<Props> = React.memo((props) => {
  const [numPlayers, setNumPlayers] = useState(2);
  // const [wallSetup, setWallSetup] = useState('Default');
  // const [floorSetup, setFloorSetup] = useState('Default');
  const [bot1, setBot1] = useState<BotDifficulty>('easy');
  const [bot2, setBot2] = useState<BotDifficulty>('medium');
  const [bot3, setBot3] = useState<BotDifficulty>('hard');

  return <div className={styles.container}>
    <h1>Game Setup</h1>
    <div className={styles.grid}>
      <label>Number of player:</label>
      <input type='number' min='2' max='4' value={numPlayers}
        onChange={e => setNumPlayers(parseInt(e.currentTarget.value))} />
      {/* <label>Wall:</label>
      <select value={wallSetup} onChange={e => setWallSetup(e.target.value)}>
        {Object.keys(wallSetups).map(x => <option value={x} key={x}>{x}</option>)}
      </select>
      <label>Floor:</label>
      <select value={floorSetup} onChange={e => setFloorSetup(e.target.value)}>
        {Object.keys(floorSetups).map(x => <option value={x} key={x}>{x}</option>)}
      </select> */}
      <label>Bot 1:</label>
      <select value={bot1} onChange={e => setBot1(e.target.value as BotDifficulty)}>
        {botDifficulties.map(x => <option value={x} key={x}>{x}</option>)}
      </select>
      <label>Bot 2:</label>
      <select value={bot2} onChange={e => setBot2(e.target.value as BotDifficulty)}>
        {botDifficulties.map(x => <option value={x} key={x}>{x}</option>)}
      </select>
      <label>Bot 3:</label>
      <select value={bot3} onChange={e => setBot3(e.target.value as BotDifficulty)}>
        {botDifficulties.map(x => <option value={x} key={x}>{x}</option>)}
      </select>
    </div>
    <button onClick={() => props.onStartClick({
      numPlayers,
      setupData: defaultGameSetup, // { wallSetup, floorSetup, tilesPerFactory: 4 }
      bot1,
      bot2,
      bot3
    })}>Start</button>
  </div>;
});