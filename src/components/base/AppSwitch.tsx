import React from 'react';
import { Switch, SwitchProps } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export interface AppSwitchProps extends SwitchProps {}

export const AppSwitch: React.FC<AppSwitchProps> = ({
  trackColor,
  thumbColor,
  value,
  ...props
}) => {
  const { colors } = useTheme();

  return (
    <Switch
      value={value}
      trackColor={
        trackColor || {
          false: colors.switchBackground,
          true: colors.switchActive,
        }
      }
      thumbColor={thumbColor || '#FFFFFF'}
      {...props}
    />
  );
};
