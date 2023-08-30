import React, { useState } from 'react';
import styles from './GameSetupSingleplayer.module.scss';
import { GameSetup } from '../../../games/azul/models';
// import { floorSetups, wallSetups } from '../../../games/azul/azulConfig';
import { defaultGameSetup } from './../../../games/azul/azulConfig';

var player1Options = [
  { value: 0, text: 'human' },
  { value: 100, text: 'easy' },
  { value: 500, text: 'medium' },
  { value: 1000, text: 'hard' },
];

var player2Options = [
  { value: 100, text: 'easy' },
  { value: 500, text: 'medium' },
  { value: 1000, text: 'hard' },
];

var player3and4Options = [
  { value: 0, text: '---' },
  { value: 100, text: 'easy' },
  { value: 500, text: 'medium' },
  { value: 1000, text: 'hard' },
];

export type GameSetupSingleplayerData = {
  numPlayers: number,
  setupData: GameSetup,
  player1: number,
  player2: number,
  player3: number,
  player4: number,
};

type Props = {
  onStartClick: (data: GameSetupSingleplayerData) => void
};

export const GameSetupSingleplayer: React.FC<Props> = React.memo((props) => {
  // const [numPlayers, setNumPlayers] = useState(2);
  // const [wallSetup, setWallSetup] = useState('Default');
  // const [floorSetup, setFloorSetup] = useState('Default');
  const [player1, setPlayer1] = useState<number>(0);
  const [player2, setPlayer2] = useState<number>(100);
  const [player3, setPlayer3] = useState<number>(0);
  const [player4, setPlayer4] = useState<number>(0);

  return <div className={styles.container}>
    <h1>Game Setup</h1>
    <div className={styles.grid}>
      {/* <label>Number of player:</label>
      <input type='number' min='2' max='4' value={numPlayers}
        onChange={e => setNumPlayers(parseInt(e.currentTarget.value))} /> */}
      {/* <label>Wall:</label>
      <select value={wallSetup} onChange={e => setWallSetup(e.target.value)}>
        {Object.keys(wallSetups).map(x => <option value={x} key={x}>{x}</option>)}
      </select>
      <label>Floor:</label>
      <select value={floorSetup} onChange={e => setFloorSetup(e.target.value)}>
        {Object.keys(floorSetups).map(x => <option value={x} key={x}>{x}</option>)}
      </select> */}
      <label>Player 1:</label>
      <select value={player1} onChange={e => setPlayer1(parseInt(e.target.value))}>
        {player1Options.map(x => <option value={x.value} key={x.value}>{x.text}</option>)}
      </select>
      <label>Player 2:</label>
      <select value={player2} onChange={e => setPlayer2(parseInt(e.target.value))}>
        {player2Options.map(x => <option value={x.value} key={x.value}>{x.text}</option>)}
      </select>
      <label>Player 3:</label>
      <select value={player3} onChange={e => setPlayer3(parseInt(e.target.value))}>
        {player3and4Options.map(x => <option value={x.value} key={x.value}>{x.text}</option>)}
      </select>
      <label>Player 4:</label>
      <select value={player4} onChange={e => setPlayer4(parseInt(e.target.value))}>
        {player3and4Options.map(x => <option value={x.value} key={x.value}>{x.text}</option>)}
      </select>
    </div>
    <button onClick={() => props.onStartClick({
      numPlayers: 2 + (player3 > 0 ? 1 : 0) + (player4 > 0 ? 1 : 0),
      setupData: defaultGameSetup, // { wallSetup, floorSetup, tilesPerFactory: 4 }
      player1,
      player2,
      player3,
      player4,
    })}>Start</button>
  </div>;
});