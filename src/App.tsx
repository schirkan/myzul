import styles from 'App.module.scss';
import { Header } from 'components/Header';
import { ThemeSelection } from 'components/ThemeSelection';
import { GameModeSelection } from 'components/GameModeSelection';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PlayLocalSingleplayer } from 'components/PlayLocalSingleplayer/PlayLocalSingleplayer';
import { PlayLocalMultiplayer } from 'components/PlayLocalMultiplayer/PlayLocalMultiplayer';
import { OnlineMultiplayer } from 'components/OnlineMultiplayer/OnlineMultiplayer';
import { GameSetupSingleplayer } from 'components/GameSetupSingleplayer';
import { GameSetupLocalMultiplayer } from 'components/GameSetupLocalMultiplayer';
import { PageNotFound } from 'components/PageNotFound';

export const App = () => {
  return (
    <BrowserRouter>
      <div className={styles.container}>
        <Header />
        <MainRoutes />
        <ThemeSelection className={styles.themeSelection} />
      </div>
    </BrowserRouter>
  );
};

function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<GameModeSelection />} />
      <Route path="/local-singleplayer/setup" element={<GameSetupSingleplayer />} />
      <Route path="/local-singleplayer/play" element={<PlayLocalSingleplayer />} />
      <Route path="/local-multiplayer/setup" element={<GameSetupLocalMultiplayer />} />
      <Route path="/local-multiplayer/play" element={<PlayLocalMultiplayer />} />
      <Route path="/online-multiplayer" element={<OnlineMultiplayer />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}
