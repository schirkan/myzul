import React, { useEffect, useMemo } from 'react';
import styles from './SubmitUserScore.module.scss';
import { useGameContext } from './../../common/GameContext';
import { submitUserScore } from '../../api/client';
import { AzulGameover } from '../../games/azul/models';

export const SubmitUserScore: React.FC = React.memo(() => {
  const gameContext = useGameContext();
  // const [loading, setLoading] = useState<boolean | undefined>(undefined);
  const pid = gameContext?.playerID || "";

  const requestData = useMemo(() => {
    const username = gameContext?.matchData![+pid].name;
    if (!username) return;

    return {
      matchId: gameContext.matchID,
      username,
      points: gameContext.G.score[pid].points,
      duration: gameContext.G.score[pid].time,
      won: (gameContext.ctx.gameover as AzulGameover)?.winnerPlayerId === pid
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameContext?.G.score[pid].points, gameContext?.G.score[pid].time]);

  useEffect(() => {
    if (requestData) {
      // setLoading(true);
      submitUserScore(requestData);
      // .then(() => setLoading(false));
    }
  }, [requestData]);

  return <div className={styles.container}>
    {/* {loading ? '...' : loading === undefined ? '' : '.'} */}
  </div>;
});