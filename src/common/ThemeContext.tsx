import React from 'react';

export const backgroundThemes = ['light-wood', 'dark-wood', 'dark-neon'] as const;
export const factoryThemes = ['original', 'transparent'] as const;
export const boardThemes = ['original', 'transparent', 'marble'] as const;
export const tileThemes = ['light-pattern', 'dark-pattern', 'neon'] as const;

export type BackgroundThemesType = typeof backgroundThemes[number];
export type FactoryThemesType = typeof factoryThemes[number];
export type BoardThemesType = typeof boardThemes[number];
export type TileThemesType = typeof tileThemes[number];

export type ThemeType = {
  background: BackgroundThemesType,
  factory: FactoryThemesType,
  board: BoardThemesType,
  tile: TileThemesType,
};

export type ThemeContextType = [ThemeType, (newValue: ThemeType) => void];

export const ThemeContext = React.createContext<ThemeContextType>(undefined as any);

let defaultTheme: ThemeType = {
  background: 'dark-neon',
  board: 'transparent',
  factory: 'transparent',
  tile: 'light-pattern'
};

let initialTheme = defaultTheme;
let userTheme: ThemeType | undefined | null;
const temp = localStorage.getItem('theme');
if (typeof temp === 'string') {
  try {
    userTheme = JSON.parse(temp);
  } catch (error) {
    // ignore
  }
}

if (userTheme) {
  if (backgroundThemes.includes(userTheme.background)) {
    initialTheme.background = userTheme.background;
  }
  if (factoryThemes.includes(userTheme.factory)) {
    initialTheme.factory = userTheme.factory;
  }
  if (boardThemes.includes(userTheme.board)) {
    initialTheme.board = userTheme.board;
  }
  if (tileThemes.includes(userTheme.tile)) {
    initialTheme.tile = userTheme.tile;
  }
}

export const ThemeProvider = ({ children }: any) => {
  const [theme, setTheme] = React.useState<ThemeType>(initialTheme);

  const onChange = (value: ThemeType) => {
    localStorage.setItem('theme', JSON.stringify(value));
    setTheme(value);
  }

  return (
    <ThemeContext.Provider value={[theme, onChange]}>
      <div
        data-theme-background={theme.background}
        data-theme-factory={theme.factory}
        data-theme-board={theme.board}
        data-theme-tile={theme.tile}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => React.useContext(ThemeContext);