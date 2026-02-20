import { useState, useEffect } from "react";
import { Client } from "boardgame.io/react";
import { Local } from "boardgame.io/multiplayer";
import { GameSetupSingleplayerData } from "components/GameSetupSingleplayer";
import { GameBoard } from "components/azul/GameBoard";
import { AzulGame } from "games/azul/Game";
import { createBot } from "games/azul/bot";
import { useSearchParams } from "react-router-dom";
import { decodeFromQueryParams } from "utils/urlEncoding";
import { defaultGameSetup } from "games/azul/azulConfig";
import { GameSetup } from "games/azul/models";

const gameWithSetupData = (game: any, setupData: any, seed: string | undefined) => ({
	...game,
	setup: (context: any) => setupData && game.setup && game.setup(context, setupData),
	seed
});

export const PlayLocalSingleplayer = () => {
	const [searchParams] = useSearchParams();
	const [gameSetup, setGameSetup] = useState<GameSetupSingleplayerData>();

	useEffect(() => {
		const decodedSetup = decodeFromQueryParams<GameSetupSingleplayerData>(searchParams);
		console.log(decodedSetup);
		setGameSetup(decodedSetup);
	}, [searchParams]);

	if (!gameSetup?.player1 && !gameSetup?.player2 && !gameSetup?.player3 && !gameSetup?.player4) {
		return null;
	}

	var bots: any = {};
	if (gameSetup.player1 && gameSetup.player1 !== 'human') bots[0] = createBot(gameSetup.player1);
	if (gameSetup.player2 && gameSetup.player2 !== 'human') bots[1] = createBot(gameSetup.player2);
	if (gameSetup.player3 && gameSetup.player3 !== 'human') bots[2] = createBot(gameSetup.player3);
	if (gameSetup.player4 && gameSetup.player4 !== 'human') bots[(gameSetup.player3 ? 3 : 2)] = createBot(gameSetup.player4);

	var numPlayers = 2 + (gameSetup.player3 ? 1 : 0) + (gameSetup.player4 ? 1 : 0);

	const setupData: GameSetup = {
		floorSetup: gameSetup.floorSetup ?? defaultGameSetup.floorSetup,
		tilesPerFactory: gameSetup.tilesPerFactory ?? defaultGameSetup.tilesPerFactory,
		wallSetup: gameSetup.wallSetup ?? defaultGameSetup.wallSetup,
	};

	var LocalSingleplayerClient = Client({
		game: gameWithSetupData(AzulGame, setupData, gameSetup.seed),
		board: GameBoard,
		numPlayers: numPlayers,
		multiplayer: Local({ bots }),
		debug: { collapseOnLoad: true }
	});

	return <LocalSingleplayerClient playerID='0' />;
};
