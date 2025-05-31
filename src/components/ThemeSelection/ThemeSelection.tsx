import React from 'react';
import { backgroundThemes, BackgroundThemesType, BoardThemesType, factoryThemes, FactoryThemesType, tileThemes, TileThemesType, useTheme } from '../../common/ThemeContext';
import styles from './ThemeSelection.module.scss';
import { boardThemes } from './../../common/ThemeContext';

type Props = {
  className?: string
};

export const ThemeSelection: React.FC<Props> = (props) => {
  const [theme, setTheme] = useTheme();

  return <div className={styles.container + ' ' + props.className}>
    <input type="checkbox" id="theme-selection-shower" className={styles['theme-selection-shower']} />
    <div className={styles.panel}>
      <section>
        <div>
          <label>Background:</label>
          <select
            value={theme.background}
            onChange={e => setTheme({ ...theme, background: e.target.value as BackgroundThemesType })}>
            {backgroundThemes.map(x => <option value={x} key={x}>{x}</option>)}
          </select>
        </div>
        <div>
          <label>Factories:</label>
          <select
            value={theme.factory}
            onChange={e => setTheme({ ...theme, factory: e.target.value as FactoryThemesType })}>
            {factoryThemes.map(x => <option value={x} key={x}>{x}</option>)}
          </select>
        </div>
        <div>
          <label>Boards:</label>
          <select
            value={theme.board}
            onChange={e => setTheme({ ...theme, board: e.target.value as BoardThemesType })}>
            {boardThemes.map(x => <option value={x} key={x}>{x}</option>)}
          </select>
        </div>
        <div>
          <label>Tiles:</label>
          <select
            value={theme.tile}
            onChange={e => setTheme({ ...theme, tile: e.target.value as TileThemesType })}>
            {tileThemes.map(x => <option value={x} key={x}>{x}</option>)}
          </select>
        </div>
      </section>
      <label htmlFor="theme-selection-shower">Theme</label>
    </div>
  </div>;
};