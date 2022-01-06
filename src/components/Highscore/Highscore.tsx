import React, { useEffect, useState } from 'react';
import { getHighscores } from '../../api/client';
import { HighscoreItem } from '../../api/models';
import styles from './Highscore.module.scss';

type Props = {};

export const Highscore: React.FC<Props> = React.memo((props) => {
  const [data, setData] = useState<HighscoreItem[]>([]);

  useEffect(() => {
    getHighscores().then(setData);
  }, [])

  return <div className={styles.container}>
    <h1>Highscore</h1>
    <table>
      <thead>
        <tr>
          <th>Username</th>
          <th>Points</th>
          <th>Games</th>
          <th>Won</th>
          <th>Duration</th>
        </tr>
      </thead>
      <tbody>
        {data.map(data =>
          <tr key={data.username}>
            <td>{data.username}</td>
            <td>{data.points}</td>
            <td>{data.games}</td>
            <td>{data.won}</td>
            <td>{data.duration}</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
});