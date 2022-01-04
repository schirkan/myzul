import React from 'react';
import { themes, ThemeType, useTheme } from '../../common/ThemeContext';
import styles from './ThemeSelection.module.scss';

type Props = {
  className?: string
};

export const ThemeSelection: React.FC<Props> = (props) => {
  const [theme, setTheme] = useTheme();

  return <select
    value={theme}
    className={styles.container + ' ' + props.className}
    onChange={e => setTheme(e.target.value as ThemeType)}>
    {themes.map(x => <option value={x} key={x}>{x}</option>)}
  </select>;
};