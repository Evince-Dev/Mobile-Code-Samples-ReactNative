import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const MoonIcon: React.FC<SvgProps> = ({
  width = 20,
  height = 20,
  color = 'currentColor',
  strokeWidth = 2,
  ...props
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </Svg>
);
