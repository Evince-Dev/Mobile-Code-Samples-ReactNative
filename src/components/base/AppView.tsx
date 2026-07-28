import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export interface AppViewProps extends ViewProps {
  useCardColor?: boolean;
  useSecondaryColor?: boolean;
}

export const AppView: React.FC<AppViewProps> = ({
  style,
  useCardColor,
  useSecondaryColor,
  children,
  ...props
}) => {
  const { colors } = useTheme();

  const getBackgroundColor = () => {
    if (useCardColor) return colors.card;
    if (useSecondaryColor) return colors.secondary;
    return undefined;
  };

  return (
    <View
      style={[
        getBackgroundColor() ? { backgroundColor: getBackgroundColor() } : undefined,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};
