import React from 'react';
import Svg, { Polygon } from 'react-native-svg';

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
  style?: any;
}

export const FilterIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = '#000000',
  style,
}) => (
  <Svg style={style} width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </Svg>
);
