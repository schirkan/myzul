import { Game } from "boardgame.io";
import { Local } from "boardgame.io/multiplayer";
import { Client, Lobby } from "boardgame.io/react";
import { useState } from "react";
import { serverUrl } from "../api/config";
import { GameSetupLocalMultiplayer } from "./GameSetup/GameSetupLocalMultiplayer";
import { GameSetupSingleplayer, GameSetupSingleplayerData } from "./GameSetup/GameSetupSingleplayer";
import { Highscore } from "./Highscore";
import { GameBoard } from "./azul/GameBoard";
import { AzulGame } from "../games/azul/Game";
import { createBot } from "../games/azul/bot";

export const getSeedFromLocation = () => {
  var hash = window.location.hash?.trim().substring(1) || '';
  return hash.length > 0 ? hash : undefined;
};

export const updateSeedToLocation = (seed: string) => {
  window.location.hash = seed;
};

const gameWithSetupData = (game: Game, setupData: any) => ({
  ...game,
  setup: (context: any) => setupData && game.setup && game.setup(context, setupData),
  seed: getSeedFromLocation()
});
export var LocalSingleplayer = () => {
  const [gameSetup, setGameSetup] = useState<GameSetupSingleplayerData>();

  if (!gameSetup) {
    return <GameSetupSingleplayer onStartClick={setGameSetup} />;
  }

  var bots: any = {};
  if (gameSetup.player1 !== '') bots[0] = createBot(gameSetup.player1);
  if (gameSetup.player2 !== '') bots[1] = createBot(gameSetup.player2);
  if (gameSetup.player3 !== '') bots[2] = createBot(gameSetup.player3);
  if (gameSetup.player4 !== '') bots[(gameSetup.player3 !== '' ? 3 : 2)] = createBot(gameSetup.player4);

  var LocalSingleplayerClient = Client({
    game: gameWithSetupData(AzulGame, gameSetup.setupData),
    board: GameBoard,
    numPlayers: gameSetup.numPlayers,
    multiplayer: Local({ bots }),
    debug: { collapseOnLoad: true }
  });

  return <LocalSingleplayerClient playerID='0' />;
};
export var LocalMultiplayer = () => {
  const [gameSetup, setGameSetup] = useState<any>();

  if (!gameSetup) {
    return <GameSetupLocalMultiplayer onStartClick={setGameSetup} />;
  }

  var LocalMultiplayerClient = Client({
    game: gameWithSetupData(AzulGame, gameSetup.setupData),
    board: GameBoard,
    numPlayers: gameSetup.numPlayers,
  });
  return <LocalMultiplayerClient />;
};
export var OnlineMultiplayer = () => {
  return <>
    <Lobby
      gameServer={serverUrl}
      lobbyServer={serverUrl}
      gameComponents={[{ game: AzulGame, board: GameBoard }]}
      debug={{ collapseOnLoad: true }} />
    <Highscore />
  </>;
};
