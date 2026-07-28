import React from 'react';
import { ImageBackground, ImageBackgroundProps } from 'react-native';

export interface AppImageBackgroundProps extends ImageBackgroundProps {}

export const AppImageBackground: React.FC<AppImageBackgroundProps> = ({ children, ...props }) => {
  return <ImageBackground {...props}>{children}</ImageBackground>;
};
