import React, { useEffect, useState } from 'react';
import { getHighscores } from 'api/client';
import { HighscoreItem } from 'api/models';
import styles from './Highscore.module.scss';

type Props = {};

const formatDuration = (sec_num: number) => {
  var hours: string | number = Math.floor(sec_num / 3600);
  var minutes: string | number = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds: string | number = sec_num - (hours * 3600) - (minutes * 60);

  if (hours < 10) { hours = "0" + hours; }
  if (minutes < 10) { minutes = "0" + minutes; }
  if (seconds < 10) { seconds = "0" + seconds; }
  return hours + ':' + minutes + ':' + seconds;
};

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
          <th>Games</th>
          <th>Won</th>
          <th>Ratio</th>
          <th>&Oslash; Points</th>
          <th>&Oslash; Duration</th>
        </tr>
      </thead>
      <tbody>
        {data.map(data =>
          <tr key={data.username}>
            <td>{data.username}</td>
            <td>{data.games}</td>
            <td>{data.won}</td>
            <td>{data.won > 0 ? (data.games / data.won).toFixed(1) : '-'}</td>
            <td>{(data.points / data.games).toFixed(1)}</td>
            <td>{formatDuration(Math.round(data.duration / data.games))}</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
});