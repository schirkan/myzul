import { useState, useEffect } from "react";
import { Client } from "boardgame.io/react";
import { Local } from "boardgame.io/multiplayer";
import { GameSetupSingleplayerData } from "components/GameSetupSingleplayer";
import { GameBoard } from "components/azul/GameBoard";
import { AzulGame } from "games/azul/Game";
import { createBot } from "games/azul/bot";
import { Navigate, useSearchParams } from "react-router-dom";
import { decodeFromUrl } from "utils/urlEncoding";

const gameWithSetupData = (game: any, setupData: any, seed: string | undefined) => ({
	...game,
	setup: (context: any) => setupData && game.setup && game.setup(context, setupData),
	seed: seed
});

export const PlayLocalSingleplayer = () => {
	const [searchParams] = useSearchParams();
	const [gameSetup, setGameSetup] = useState<GameSetupSingleplayerData>();

	useEffect(() => {
		const setupParam = searchParams.get('setup');
		if (setupParam) {
			const decodedSetup = decodeFromUrl<GameSetupSingleplayerData>(setupParam);
			if (decodedSetup) {
				console.log(decodedSetup);
				setGameSetup(decodedSetup);
			}
		}
	}, [searchParams]);

	if (!gameSetup) {
		return null;
	}

	var bots: any = {};
	if (gameSetup.player1 !== '') bots[0] = createBot(gameSetup.player1);
	if (gameSetup.player2 !== '') bots[1] = createBot(gameSetup.player2);
	if (gameSetup.player3 !== '') bots[2] = createBot(gameSetup.player3);
	if (gameSetup.player4 !== '') bots[(gameSetup.player3 !== '' ? 3 : 2)] = createBot(gameSetup.player4);

	var LocalSingleplayerClient = Client({
		game: gameWithSetupData(AzulGame, gameSetup.setupData, gameSetup.seed),
		board: GameBoard,
		numPlayers: gameSetup.numPlayers,
		multiplayer: Local({ bots }),
		debug: { collapseOnLoad: true }
	});

	return <LocalSingleplayerClient playerID='0' />;
};
