import { useState } from "react";
import { Client } from "boardgame.io/react";
import { Local } from "boardgame.io/multiplayer";
import { GameSetupSingleplayer, GameSetupSingleplayerData } from "components/GameSetup/GameSetupSingleplayer";
import { GameBoard } from "components/azul/GameBoard";
import { AzulGame } from "games/azul/Game";
import { createBot } from "games/azul/bot";

const getSeedFromLocation = () => {
	var hash = window.location.hash?.trim().substring(1) || '';
	return hash.length > 0 ? hash : undefined;
};

const gameWithSetupData = (game: any, setupData: any) => ({
	...game,
	setup: (context: any) => setupData && game.setup && game.setup(context, setupData),
	seed: getSeedFromLocation()
});

export const LocalSingleplayer = () => {
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
