import React from 'react';
import { StatusBar, StatusBarProps, Platform } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export interface AppStatusBarProps extends StatusBarProps {
  /** Optional custom background color override for Android */
  backgroundColor?: string;
}

/**
 * AppStatusBar
 *
 * Base component wrapper around React Native's StatusBar.
 * Automatically updates barStyle and background color according to active theme on Android.
 */
export const AppStatusBar: React.FC<AppStatusBarProps> = ({
  backgroundColor,
  barStyle,
  animated = true,
  ...props
}) => {
  const { colors, isDark } = useTheme();

  const currentBarStyle = barStyle || (isDark ? 'light-content' : 'dark-content');
  const currentBgColor = backgroundColor || colors.background;

  return (
    <StatusBar
      barStyle={currentBarStyle}
      backgroundColor={Platform.OS === 'android' ? currentBgColor : undefined}
      animated={animated}
      {...props}
    />
  );
};
