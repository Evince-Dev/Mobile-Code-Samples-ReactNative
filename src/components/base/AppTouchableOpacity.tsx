import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

export interface AppTouchableOpacityProps extends TouchableOpacityProps {}

export const AppTouchableOpacity: React.FC<AppTouchableOpacityProps> = ({
  activeOpacity = 0.7,
  children,
  ...props
}) => {
  return (
    <TouchableOpacity activeOpacity={activeOpacity} {...props}>
      {children}
    </TouchableOpacity>
  );
};
