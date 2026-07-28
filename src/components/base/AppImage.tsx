import React from 'react';
import { Image, ImageProps } from 'react-native';

export interface AppImageProps extends ImageProps {}

export const AppImage: React.FC<AppImageProps> = (props) => {
  return <Image {...props} />;
};
