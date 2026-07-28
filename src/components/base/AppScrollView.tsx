import React from 'react';
import { ScrollView, ScrollViewProps } from 'react-native';

export interface AppScrollViewProps extends ScrollViewProps {}

export const AppScrollView: React.FC<AppScrollViewProps> = ({ children, ...props }) => {
  return <ScrollView showsVerticalScrollIndicator={false} {...props}>{children}</ScrollView>;
};
