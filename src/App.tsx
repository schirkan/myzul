import styles from './App.module.scss';
import githubIcon from './assets/github.svg';
import { Logo } from './components/Logo';
import { ThemeSelection } from './components/ThemeSelection';
import { GameSelection } from './components/GameSelection';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { LocalSingleplayer } from './components/LocalSingleplayer/LocalSingleplayer';
import { LocalMultiplayer } from './components/LocalMultiplayer/LocalMultiplayer';
import { OnlineMultiplayer } from './components/OnlineMultiplayer/OnlineMultiplayer';

export const App = () => {
  return (
    <BrowserRouter>
      <div className={styles.container}>
        <a href="https://github.com/schirkan/myzul-server" target="_blank" rel="noreferrer" className={styles.githubIcon}>
          <img alt="github" title="View on GitHub" src={githubIcon} />
        </a>
        <Logo />
        <MainRoutes />
        <ThemeSelection className={styles.themeSelection} />
      </div>
    </BrowserRouter>
  );
};

function MainRoutes() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<GameSelection />} />
      <Route path="/local-singleplayer" element={<LocalSingleplayer />} />
      <Route path="/local-multiplayer" element={<LocalMultiplayer />} />
      <Route path="/online-multiplayer" element={<OnlineMultiplayer />} />
    </Routes>
  );
}
