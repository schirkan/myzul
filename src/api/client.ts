import { serverUrl } from "./config";
import { HighscoreItem, UserScore } from "./models";

const url = serverUrl + '/api/highscore';

export const getHighscores = async (): Promise<HighscoreItem[]> => {
  const data = await fetch(url);
  return await data.json();
};

export const submitUserScore = async (data: UserScore): Promise<void> => {
  console.log('submitUserScore', data);
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
};
