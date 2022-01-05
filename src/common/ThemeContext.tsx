import React from 'react';

export const themes = ['light-wood', 'dark-wood', 'dark-neon'];

export type ThemeType = typeof themes[number];

export type ThemeContextType = [ThemeType, (newValue: ThemeType) => void];

export const ThemeContext = React.createContext<ThemeContextType>(undefined as any);

let defaultTheme = 'dark-wood'
let initialTheme = localStorage.getItem('theme') || defaultTheme;
if (initialTheme === null || !themes.includes(initialTheme)) {
  initialTheme = defaultTheme;
}

export const ThemeProvider = ({ children }: any) => {
  const [theme, setTheme] = React.useState<ThemeType>(initialTheme);

  const onChange = (value: ThemeType) => {
    localStorage.setItem('theme', value);
    setTheme(value);
  }

  return (
    <ThemeContext.Provider value={[theme, onChange]}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => React.useContext(ThemeContext);