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
      <Route index element={<GameModeSelection />} />
      <Route path="local-singleplayer">
        <Route path="setup" element={<GameSetupSingleplayer />} />
        <Route path="play" element={<PlayLocalSingleplayer />} />
      </Route>
      <Route path="local-multiplayer">
        <Route path="setup" element={<GameSetupLocalMultiplayer />} />
        <Route path="play" element={<PlayLocalMultiplayer />} />
      </Route>
      <Route path="online-multiplayer" element={<OnlineMultiplayer />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}
