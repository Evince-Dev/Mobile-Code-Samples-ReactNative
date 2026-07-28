import React from 'react';
import { ActivityIndicator, ActivityIndicatorProps } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export interface AppActivityIndicatorProps extends ActivityIndicatorProps {}

export const AppActivityIndicator: React.FC<AppActivityIndicatorProps> = ({
  color,
  size = 'small',
  ...props
}) => {
  const { colors } = useTheme();

  return (
    <ActivityIndicator
      size={size}
      color={color || colors.primary}
      {...props}
    />
  );
};
