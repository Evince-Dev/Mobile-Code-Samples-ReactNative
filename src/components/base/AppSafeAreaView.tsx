import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';

export interface AppSafeAreaViewProps extends SafeAreaViewProps {
  useThemeBackground?: boolean;
}

export const AppSafeAreaView: React.FC<AppSafeAreaViewProps> = ({
  style,
  useThemeBackground = true,
  children,
  ...props
}) => {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={[
        styles.container,
        useThemeBackground ? { backgroundColor: colors.background } : undefined,
        style,
      ]}
      {...props}
    >
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
