import React, { useState, useCallback, ChangeEventHandler, useEffect } from 'react';
import styles from './GameSetupSingleplayer.module.scss';
import { GameSetup } from 'games/azul/models';
// import { floorSetups, wallSetups } from 'games/azul/azulConfig';
import { FaDice, FaPlay, FaArrowLeft, FaClock } from 'react-icons/fa';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { decodeFromQueryParams, encodeToQueryParams } from 'utils/urlEncoding';

var bots = [
  '1-easy', '1-medium', '1-hard',
  '2-easy', '2-medium', '2-hard',
  '3-easy', '3-medium', '3-hard',
  '4-easy', '4-medium', '4-hard',
  '5-easy', '5-medium', '5-hard'
];
var botOptions = bots.map(x => ({ value: x, text: x }));
botOptions = [
  { value: '5-easy', text: 'easy' },
  { value: '5-medium', text: 'medium' },
  { value: '5-hard', text: 'hard' }
];

var player1Options = [{ value: '', text: 'human' }, ...botOptions]; // empty value for human player
var player2Options = [...botOptions]; // player 2 is always a bot, so no empty option
var player3Options = [{ value: '', text: '---' }, ...botOptions]; // player 3 can be empty
var player4Options = [{ value: '', text: '---' }, ...botOptions]; // player 4 can be empty

export type GameSetupSingleplayerData = {
  setupData?: GameSetup,
  player1?: string,
  player2?: string,
  player3?: string,
  player4?: string,
  seed?: string,
};

export const GameSetupSingleplayer: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // const [wallSetup, setWallSetup] = useState('Default');
  // const [floorSetup, setFloorSetup] = useState('Default');
  const [player1, setPlayer1] = useState<string>('');
  const [player2, setPlayer2] = useState<string>('5-hard');
  const [player3, setPlayer3] = useState<string>('');
  const [player4, setPlayer4] = useState<string>('');
  const [seed, setSeed] = useState<string>('');

  useEffect(() => {
    const decodedSetup = decodeFromQueryParams<GameSetupSingleplayerData>(searchParams);
    console.log(decodedSetup);
    if (decodedSetup.player1) setPlayer1(decodedSetup.player1);
    if (decodedSetup.player2) setPlayer2(decodedSetup.player2);
    if (decodedSetup.player3) setPlayer3(decodedSetup.player3);
    if (decodedSetup.player4) setPlayer4(decodedSetup.player4);
    if (decodedSetup.seed) setSeed(decodedSetup.seed);
    else randomizeSeed();
  }, [searchParams]);

  const updateSeed: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    const newSeed = e.target.value.trim();
    setSeed(newSeed);
  }, [setSeed]);

  const randomizeSeed = useCallback(() => {
    const newSeed = Math.random().toString(36).slice(2, 10);
    setSeed(newSeed);
  }, [setSeed]);

  const timestampSeed = useCallback(() => {
    const newSeed = (Math.floor(Date.now() / 1000)).toString(36);
    setSeed(newSeed);
  }, [setSeed]);

  const handleStartClick = useCallback(() => {
    const setupData: GameSetupSingleplayerData = {
      // setupData: defaultGameSetup, // { wallSetup, floorSetup, tilesPerFactory: 4 }
      player1,
      player2,
      player3,
      player4,
      seed,
    };
    console.log(setupData);
    const encoded = encodeToQueryParams(setupData);
    console.log(encoded);
    navigate(`/local-singleplayer/play?${encoded}`);
  }, [navigate, player1, player2, player3, player4, seed]);

  return <div className={styles.container}>
    <h1>Game Setup</h1>
    <div className={styles.grid}>
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
      <div>Seed:
        <button type="button" className={styles.random} onClick={randomizeSeed} title="Generate random seed"><FaDice /></button>
        {/* <button type="button" className={styles.random} onClick={timestampSeed} title="Uhrzeit als Seed"><FaClock /></button> */}
      </div>
      <input type='text' className={styles.seed} placeholder='random' value={seed} onChange={updateSeed} />
    </div>
    <button onClick={() => navigate('/')}><FaArrowLeft />&nbsp;Menu</button>
    <button onClick={handleStartClick}><FaPlay />&nbsp;Start</button>
  </div>;
});
