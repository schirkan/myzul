import { Lobby } from "boardgame.io/react";
import { AzulGame } from "games/azul/Game";
import { GameBoard } from "components/azul/GameBoard";
import { serverUrl } from "api/config";
import { Highscore } from "components/Highscore";

export const OnlineMultiplayer = () => {
	return (
		<>
			<Lobby
				gameServer={serverUrl}
				lobbyServer={serverUrl}
				gameComponents={[{ game: AzulGame, board: GameBoard }]}
				debug={{ collapseOnLoad: true }}
			/>
			<Highscore />
		</>
	);
};
