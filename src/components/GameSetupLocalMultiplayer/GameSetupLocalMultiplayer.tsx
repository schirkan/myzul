import React, { ChangeEventHandler, useCallback, useEffect, useState } from 'react';
import styles from './GameSetupLocalMultiplayer.module.scss';
import { GameSetup } from 'games/azul/models';
import { floorSetups, wallSetups } from 'games/azul/azulConfig';
import { FaArrowLeft, FaPlay, FaDice } from 'react-icons/fa';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { decodeFromQueryParams, encodeToQueryParams } from 'utils/urlEncoding';

export type GameSetupLocalMultiplayerData = Partial<GameSetup> & {
  numPlayers?: number,
  seed?: string,
};

export const GameSetupLocalMultiplayer: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [numPlayers, setNumPlayers] = useState(2);
  const [wallSetup, setWallSetup] = useState('Default');
  const [floorSetup, setFloorSetup] = useState('Default');
  const [seed, setSeed] = useState<string>('');

  useEffect(() => {
    const decodedSetup = decodeFromQueryParams<GameSetupLocalMultiplayerData>(searchParams);
    console.log(decodedSetup);
    if (decodedSetup.wallSetup) setWallSetup(decodedSetup.wallSetup);
    if (decodedSetup.floorSetup) setFloorSetup(decodedSetup.floorSetup);
    if (decodedSetup.seed) setSeed(decodedSetup.seed);
    else randomizeSeed();
  }, [searchParams]);

  const updateSeed: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    const newSeed = e.target.value.trim();
    setSeed(newSeed);
  }, []);

  const randomizeSeed = useCallback(() => {
    const newSeed = Math.random().toString(36).slice(2, 10);
    setSeed(newSeed);
  }, []);

  const handleStartClick = useCallback(() => {
    const setupData: GameSetupLocalMultiplayerData = {
      numPlayers,
      wallSetup,
      floorSetup,
      // tilesPerFactory: 4,
      seed,
    };
    console.log(setupData);
    const encoded = encodeToQueryParams(setupData);
    console.log(encoded);
    navigate(`/local-multiplayer/play?${encoded}`);
  }, [navigate, numPlayers, wallSetup, floorSetup, seed]);

  return <div className={styles.container}>
    <h1>Game Setup</h1>
    <div className={styles.grid}>
      <label>Player:</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input type='range' min='2' max='4' step='1' value={numPlayers}
          onChange={e => setNumPlayers(parseInt(e.currentTarget.value))} />
        <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 'bold' }}>{numPlayers}</span>
      </div>
      <label>Wall:</label>
      <select value={wallSetup} onChange={e => setWallSetup(e.target.value)}>
        {Object.keys(wallSetups).map(x => <option value={x} key={x}>{x}</option>)}
      </select>
      <label>Floor:</label>
      <select value={floorSetup} onChange={e => setFloorSetup(e.target.value)}>
        {Object.keys(floorSetups).map(x => <option value={x} key={x}>{x}</option>)}
      </select>
      <div>Seed:
        <button type="button" className={styles.random} onClick={randomizeSeed} title="Generate random seed"><FaDice /></button>
      </div>
      <input type='text' className={styles.seed} placeholder='random' value={seed} onChange={updateSeed} />
    </div>
    <button onClick={() => navigate('/')}><FaArrowLeft />&nbsp;Menu</button>
    <button onClick={handleStartClick}><FaPlay />&nbsp;Start</button>
  </div>;
});