export interface HighscoreItem {
  username: string;
  games: number;
  won: number;
  points: number;
  duration: number;
}

export interface UserScore {
  username: string;
  won: boolean;
  points: number;
  duration: number;
}
