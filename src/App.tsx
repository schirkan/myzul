import styles from './App.module.scss';
import githubIcon from './assets/github.svg';
import { Client, Lobby } from 'boardgame.io/react';
import { Local } from 'boardgame.io/multiplayer';
import { GameBoard } from './components/azul/GameBoard';
import { AzulGame } from './games/azul/Game';
import { ThemeSelection } from './components/ThemeSelection';
// import { EffectsBoardWrapper } from 'bgio-effects/react';
import { serverUrl } from './api/config';
import { Highscore } from './components/Highscore';
import { GameMode, GameSelection } from './components/GameSelection';
import { useState } from 'react';
import { GameSetup, GameSetupData } from './components/GameSetup';
import { AzulBot } from './games/azul/AzulBot';

// const board = EffectsBoardWrapper(GameBoard, {
//   updateStateAfterEffects: true,
// });

export const App = () => {
  const [gameMode, setGameMode] = useState<GameMode>();
  const [gameSetup, setGameSetup] = useState<GameSetupData>();

  var gameClient = null;
  if (gameMode === 'online-multiplayer') {
    gameClient = <>
      <Lobby
        gameServer={serverUrl}
        lobbyServer={serverUrl}
        gameComponents={[{ game: AzulGame, board: GameBoard }]}
        debug={true}
      />
      <Highscore />
    </>
  } else if (gameSetup) {
    if (gameMode === 'local-ai') {
      var bots: any = {};
      for (var i = 1; i < gameSetup.numPlayers; i++) {
        bots[i] = AzulBot;
      }
      var BotClient = Client({
        game: AzulGame,
        board: GameBoard,
        numPlayers: gameSetup.numPlayers,
        multiplayer: Local({ bots }),
      });
      gameClient = <BotClient playerID='0' />;
    } else if (gameMode === 'local-multiplayer') {
      var LocalMultiplayerClient = Client({
        game: AzulGame,
        board: GameBoard,
        numPlayers: gameSetup.numPlayers,
      });
      gameClient = <LocalMultiplayerClient />;
    }
  }

  return <div className={styles.container}>
    {gameMode ? null : <GameSelection onSelect={setGameMode} />}
    {(gameMode === 'local-ai' || gameMode === 'local-multiplayer') && !gameSetup ? <GameSetup onStartClick={setGameSetup} /> : null}
    {gameClient}
    <ThemeSelection className={styles.themeSelection} />
    <a href="https://github.com/schirkan/myzul-server" target="_blank" rel="noreferrer" className={styles.githubIcon}>
      <img alt="github" title="View on GitHub" src={githubIcon} />
    </a>
  </div>
}
