import React from 'react';
import Svg, { Circle, Path, SvgProps } from 'react-native-svg';

export const SunIcon: React.FC<SvgProps> = ({
  width = 20,
  height = 20,
  color = 'currentColor',
  strokeWidth = 2,
  ...props
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Circle cx="12" cy="12" r="4" />
    <Path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </Svg>
);
