import React from 'react';

export const themes = ['light-wood', 'dark-wood', 'dark-neon'] as const;

export type ThemeType = typeof themes[number];

export type ThemeContextType = [ThemeType, (newValue: ThemeType) => void];

export const ThemeContext = React.createContext<ThemeContextType>(undefined as any);

export const ThemeProvider = ({ children }: any) => {
  const [theme, setTheme] = React.useState<ThemeType>('dark-wood');

  // TODO: save in cookie

  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => React.useContext(ThemeContext);