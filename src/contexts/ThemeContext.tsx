import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { StorageService } from '../services/storageService';
import { ColorPalette, lightColors, darkColors } from '../theme/colors';

export type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = '@app_theme_mode';

interface ThemeContextType {
  theme: ThemeMode;
  isDark: boolean;
  colors: ColorPalette;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: ThemeMode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, initialTheme }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeMode>(
    initialTheme || (systemColorScheme === 'dark' ? 'dark' : 'light')
  );

  useEffect(() => {
    const loadSavedTheme = () => {
      try {
        const savedTheme = StorageService.getItem(THEME_STORAGE_KEY);
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setThemeState(savedTheme);
        }
      } catch (error) {
        console.error('Failed to load saved theme from StorageService:', error);
      }
    };

    loadSavedTheme();
  }, []);

  const changeTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    try {
      StorageService.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error('Failed to save theme to StorageService:', error);
    }
  };

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === 'light' ? 'dark' : 'light';
    changeTheme(nextTheme);
  };

  const setTheme = (mode: ThemeMode) => {
    changeTheme(mode);
  };

  const isDark = theme === 'dark';
  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, isDark, colors, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Fallback if rendered outside ThemeProvider
    return {
      theme: 'light',
      isDark: false,
      colors: lightColors,
      toggleTheme: () => {},
      setTheme: () => {},
    };
  }
  return context;
};
