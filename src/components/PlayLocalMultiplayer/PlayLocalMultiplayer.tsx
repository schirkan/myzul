import { useEffect, useState } from "react";
import { Client } from "boardgame.io/react";
import { GameSetupLocalMultiplayer, GameSetupLocalMultiplayerData } from "components/GameSetupLocalMultiplayer";
import { GameBoard } from "components/azul/GameBoard";
import { AzulGame } from "games/azul/Game";
import { useSearchParams } from "react-router-dom";
import { decodeFromQueryParams } from "utils/urlEncoding";
import { defaultGameSetup } from "games/azul/azulConfig";
import { GameSetup } from "games/azul/models";


const gameWithSetupData = (game: any, setupData: any, seed: string | undefined) => ({
	...game,
	setup: (context: any) => setupData && game.setup && game.setup(context, setupData),
	seed
});

export const PlayLocalMultiplayer = () => {
	const [searchParams] = useSearchParams();
	const [gameSetup, setGameSetup] = useState<GameSetupLocalMultiplayerData>();

	useEffect(() => {
		const decodedSetup = decodeFromQueryParams<GameSetupLocalMultiplayerData>(searchParams);
		console.log(decodedSetup);
		setGameSetup(decodedSetup);
	}, [searchParams]);

	if (!gameSetup?.numPlayers) {
		return null;
	}

	const setupData: GameSetup = {
		floorSetup: gameSetup.floorSetup ?? defaultGameSetup.floorSetup,
		tilesPerFactory: gameSetup.tilesPerFactory ?? defaultGameSetup.tilesPerFactory,
		wallSetup: gameSetup.wallSetup ?? defaultGameSetup.wallSetup,
	};

	var LocalMultiplayerClient = Client({
		game: gameWithSetupData(AzulGame, setupData, gameSetup.seed),
		board: GameBoard,
		numPlayers: gameSetup.numPlayers,
	});
	return <LocalMultiplayerClient />;
};
