import styles from './App.module.scss';
import githubIcon from './assets/github.svg';
import { Client, Lobby } from 'boardgame.io/react';
import { Local } from 'boardgame.io/multiplayer';
import { GameBoard } from './components/azul/GameBoard';
import { AzulGame } from './games/azul/Game';
import { ThemeSelection } from './components/ThemeSelection';
import { serverUrl } from './api/config';
import { Highscore } from './components/Highscore';
import { GameMode, GameSelection } from './components/GameSelection';
import { useState } from 'react';
import { AzulBot } from './games/azul/AzulBot';
import { GameSetupSingleplayer, GameSetupSingleplayerData } from './components/GameSetup/GameSetupSingleplayer';
import { GameSetupLocalMultiplayer } from './components/GameSetup/GameSetupLocalMultiplayer';
import { Game } from 'boardgame.io';

const gameWithSetupData = (game: Game, setupData: any) => ({
  ...game,
  setup: (context: any) => setupData && game.setup && game.setup(context, setupData)
});

var LocalSingleplayer = () => {
  const [gameSetup, setGameSetup] = useState<GameSetupSingleplayerData>();

  if (!gameSetup) {
    return <GameSetupSingleplayer onStartClick={setGameSetup} />
  }

  var bots: any = {};
  if (gameSetup.player1 > 0) {
    bots[0] = AzulBot.Difficulty(gameSetup.player1);
  }
  if (gameSetup.player2 > 0) {
    bots[1] = AzulBot.Difficulty(gameSetup.player2);
  }
  if (gameSetup.player3 > 0) {
    bots[2] = AzulBot.Difficulty(gameSetup.player3);
  }
  if (gameSetup.player4 > 0) {
    bots[3] = AzulBot.Difficulty(gameSetup.player4);
  }

  var LocalSingleplayerClient = Client({
    game: gameWithSetupData(AzulGame, gameSetup.setupData),
    board: GameBoard,
    numPlayers: gameSetup.numPlayers,
    multiplayer: Local({ bots }),
  });

  return <LocalSingleplayerClient playerID='0' />
}

var LocalMultiplayer = () => {
  const [gameSetup, setGameSetup] = useState<any>();

  if (!gameSetup) {
    return <GameSetupLocalMultiplayer onStartClick={setGameSetup} />
  }

  var LocalMultiplayerClient = Client({
    game: gameWithSetupData(AzulGame, gameSetup.setupData),
    board: GameBoard,
    numPlayers: gameSetup.numPlayers,
  });
  return <LocalMultiplayerClient />;
}

var OnlineMultiplayer = () => {
  return <>
    <Lobby
      gameServer={serverUrl}
      lobbyServer={serverUrl}
      gameComponents={[{ game: AzulGame, board: GameBoard }]}
      debug={true}
    />
    <Highscore />
  </>
}

export const App = () => {
  const [gameMode, setGameMode] = useState<GameMode>();

  var NewGame = () => <></>;
  if (gameMode === 'local-singleplayer') {
    NewGame = LocalSingleplayer;
  } else if (gameMode === 'local-multiplayer') {
    NewGame = LocalMultiplayer;
  } else if (gameMode === 'online-multiplayer') {
    NewGame = OnlineMultiplayer;
  }
  return <div className={styles.container}>
    {gameMode ? <NewGame /> : <GameSelection onSelect={setGameMode} />}
    <ThemeSelection className={styles.themeSelection} />
    <a href="https://github.com/schirkan/myzul-server" target="_blank" rel="noreferrer" className={styles.githubIcon}>
      <img alt="github" title="View on GitHub" src={githubIcon} />
    </a>
  </div>
}
