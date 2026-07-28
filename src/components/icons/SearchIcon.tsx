import React from 'react';
import Svg, { Circle, Line } from 'react-native-svg';

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
  style?: any;
}

export const SearchIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = '#000000',
  style,
}) => (
  <Svg style={style} width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="11" cy="11" r="8" />
    <Line x1="21" y1="21" x2="16.65" y2="16.65" />
  </Svg>
);
