import React, { useState } from 'react';
import styles from './GameSetupSingleplayer.module.scss';
import { GameSetup } from '../../../games/azul/models';
// import { floorSetups, wallSetups } from '../../../games/azul/azulConfig';
import { defaultGameSetup } from './../../../games/azul/azulConfig';

var bots = [
  '1-easy', '1-medium', '1-hard',
  '2-easy', '2-medium', '2-hard',
  '3-easy', '3-medium', '3-hard',
  '4-easy', '4-medium', '4-hard',
  '5-easy', '5-medium', '5-hard'
];
var botOptions = bots.map(x => ({ value: x, text: x }));

var player1Options = [{ value: '', text: 'human' }, ...botOptions];
var player2Options = [...botOptions];
var player3Options = [{ value: '', text: '---' }, ...botOptions];
var player4Options = [{ value: '', text: '---' }, ...botOptions];

export type GameSetupSingleplayerData = {
  numPlayers: number,
  setupData: GameSetup,
  player1: string,
  player2: string,
  player3: string,
  player4: string,
};

type Props = {
  onStartClick: (data: GameSetupSingleplayerData) => void
};

export const GameSetupSingleplayer: React.FC<Props> = React.memo((props) => {
  // const [numPlayers, setNumPlayers] = useState(2);
  // const [wallSetup, setWallSetup] = useState('Default');
  // const [floorSetup, setFloorSetup] = useState('Default');
  const [player1, setPlayer1] = useState<string>('');
  const [player2, setPlayer2] = useState<string>('1-easy');
  const [player3, setPlayer3] = useState<string>('');
  const [player4, setPlayer4] = useState<string>('');

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
      <select value={player1} onChange={e => setPlayer1(e.target.value)}>
        {player1Options.map(x => <option value={x.value} key={x.value}>{x.text}</option>)}
      </select>
      <label>Player 2:</label>
      <select value={player2} onChange={e => setPlayer2(e.target.value)}>
        {player2Options.map(x => <option value={x.value} key={x.value}>{x.text}</option>)}
      </select>
      <label>Player 3:</label>
      <select value={player3} onChange={e => setPlayer3(e.target.value)}>
        {player3Options.map(x => <option value={x.value} key={x.value}>{x.text}</option>)}
      </select>
      <label>Player 4:</label>
      <select value={player4} onChange={e => setPlayer4(e.target.value)}>
        {player4Options.map(x => <option value={x.value} key={x.value}>{x.text}</option>)}
      </select>
    </div>
    <button onClick={() => props.onStartClick({
      numPlayers: 2 + (player3 !== '' ? 1 : 0) + (player4 !== '' ? 1 : 0),
      setupData: defaultGameSetup, // { wallSetup, floorSetup, tilesPerFactory: 4 }
      player1,
      player2,
      player3,
      player4,
    })}>Start</button>
  </div>;
});