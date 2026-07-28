import React from 'react';
import { Pressable, PressableProps } from 'react-native';

export interface AppPressableProps extends PressableProps {}

export const AppPressable: React.FC<AppPressableProps> = ({ children, ...props }) => {
  return <Pressable {...props}>{children}</Pressable>;
};
