import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  useColorScheme,
  StyleSheet,
} from 'react-native';
import { StorageService } from '../services/storageService';
import { ColorPalette, lightColors, darkColors } from '../theme/colors';
import { AppStatusBar } from '../components/base/AppStatusBar';

export type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = '@app_theme_mode';

// Color parsing & blending helper functions
function parseColor(color: string): [number, number, number, number] {
  if (!color) return [0, 0, 0, 1];
  if (color.startsWith('#')) {
    let hex = color.slice(1);
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('');
    }
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return [r, g, b, 1];
    }
    if (hex.length === 8) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      const a = parseInt(hex.slice(6, 8), 16) / 255;
      return [r, g, b, a];
    }
  }
  if (color.startsWith('rgba')) {
    const parts = color.match(/[\d.]+/g);
    if (parts && parts.length >= 4) {
      return [parseFloat(parts[0]), parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3])];
    }
  }
  if (color.startsWith('rgb')) {
    const parts = color.match(/[\d.]+/g);
    if (parts && parts.length >= 3) {
      return [parseFloat(parts[0]), parseFloat(parts[1]), parseFloat(parts[2]), 1];
    }
  }
  return [0, 0, 0, 1];
}

function toHex(n: number): string {
  const hex = Math.max(0, Math.min(255, Math.round(n))).toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}

function blendColors(fromColor: string, toColor: string, progress: number): string {
  const [r1, g1, b1, a1] = parseColor(fromColor);
  const [r2, g2, b2, a2] = parseColor(toColor);

  const r = r1 + (r2 - r1) * progress;
  const g = g1 + (g2 - g1) * progress;
  const b = b1 + (b2 - b1) * progress;
  const a = a1 + (a2 - a1) * progress;

  if (a >= 0.99) {
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(a * 255)}`;
}

function interpolatePalette(fromPalette: ColorPalette, toPalette: ColorPalette, progress: number): ColorPalette {
  const result: any = {};
  for (const key of Object.keys(fromPalette) as (keyof ColorPalette)[]) {
    result[key] = blendColors(fromPalette[key], toPalette[key], progress);
  }
  return result as ColorPalette;
}

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

  const [activeColors, setActiveColors] = useState<ColorPalette>(
    theme === 'dark' ? darkColors : lightColors
  );
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    const loadSavedTheme = () => {
      try {
        const savedTheme = StorageService.getItem(THEME_STORAGE_KEY);
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setThemeState(savedTheme);
          setActiveColors(savedTheme === 'dark' ? darkColors : lightColors);
        }
      } catch (error) {
        console.error('Failed to load saved theme from StorageService:', error);
      }
    };

    loadSavedTheme();
  }, []);

  const changeTheme = (mode: ThemeMode) => {
    if (isAnimating || mode === theme) return;

    setIsAnimating(true);
    const fromPalette = theme === 'dark' ? darkColors : lightColors;
    const toPalette = mode === 'dark' ? darkColors : lightColors;

    const startTime = Date.now();
    const duration = 500;

    // Frame-by-frame color interpolation loop
    const animateColors = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      const blended = interpolatePalette(fromPalette, toPalette, easedProgress);
      setActiveColors(blended);

      if (progress < 1) {
        requestAnimationFrame(animateColors);
      } else {
        setThemeState(mode);
        setActiveColors(toPalette);
        setIsAnimating(false);
        try {
          StorageService.setItem(THEME_STORAGE_KEY, mode);
        } catch (error) {
          console.error('Failed to save theme to StorageService:', error);
        }
      }
    };

    requestAnimationFrame(animateColors);
  };

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === 'light' ? 'dark' : 'light';
    changeTheme(nextTheme);
  };

  const setTheme = (mode: ThemeMode) => {
    changeTheme(mode);
  };

  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, isDark, colors: activeColors, toggleTheme, setTheme }}>
      <AppStatusBar />
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
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


