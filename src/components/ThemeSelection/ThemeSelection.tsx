import React from 'react';
import { backgroundThemes, BackgroundThemesType, BoardThemesType, factoryThemes, FactoryThemesType, tileThemes, TileThemesType, useTheme } from 'common/ThemeContext';
import styles from './ThemeSelection.module.scss';
import { boardThemes } from 'common/ThemeContext';
import { IoClose } from "react-icons/io5";

type Props = {
  className?: string
};

type RadioGroupProps<T extends string> = {
  name: string;
  label: string;
  options: T[] | readonly T[];
  value: T;
  onChange: (value: T) => void;
};

function ThemeRadioGroup<T extends string>({ name, label, options, value, onChange }: RadioGroupProps<T>) {
  return (
    <div>
      <span>{label}:</span>
      {options.map(x =>
        <label key={x} style={{ marginRight: 8 }}>
          <input
            type="radio"
            name={name}
            value={x}
            checked={value === x}
            onChange={() => onChange(x)}
          />
          {x}
        </label>
      )}
    </div>
  );
}

export const ThemeSelection: React.FC<Props> = (props) => {
  const [theme, setTheme] = useTheme();

  return <div className={styles.container + ' ' + props.className}>
    <input type="checkbox" id="theme-selection-shower" className={styles['theme-selection-shower']} />
    <div className={styles.panel}>
      <section>
        <ThemeRadioGroup
          name="background-theme"
          label="Background"
          options={backgroundThemes}
          value={theme.background}
          onChange={x => setTheme({ ...theme, background: x as BackgroundThemesType })}
        />
        <ThemeRadioGroup
          name="factory-theme"
          label="Factories"
          options={factoryThemes}
          value={theme.factory}
          onChange={x => setTheme({ ...theme, factory: x as FactoryThemesType })}
        />
        <ThemeRadioGroup
          name="board-theme"
          label="Boards"
          options={boardThemes}
          value={theme.board}
          onChange={x => setTheme({ ...theme, board: x as BoardThemesType })}
        />
        <ThemeRadioGroup
          name="tile-theme"
          label="Tiles"
          options={tileThemes}
          value={theme.tile}
          onChange={x => setTheme({ ...theme, tile: x as TileThemesType })}
        />
      </section>
      <label htmlFor="theme-selection-shower"><IoClose /> Close</label>
    </div>
  </div>;
};