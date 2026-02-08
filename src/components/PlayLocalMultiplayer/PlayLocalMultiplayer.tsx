import { useState } from "react";
import { Client } from "boardgame.io/react";
import { GameSetupLocalMultiplayer } from "components/GameSetupLocalMultiplayer";
import { GameBoard } from "components/azul/GameBoard";
import { AzulGame } from "games/azul/Game";

const getSeedFromLocation = () => {
	var hash = window.location.hash?.trim().substring(1) || '';
	return hash.length > 0 ? hash : undefined;
};

const gameWithSetupData = (game: any, setupData: any) => ({
	...game,
	setup: (context: any) => setupData && game.setup && game.setup(context, setupData),
	seed: getSeedFromLocation()
});

export const PlayLocalMultiplayer = () => {
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
