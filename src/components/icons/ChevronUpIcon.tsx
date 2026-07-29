import React from 'react';
import Svg, { Polyline } from 'react-native-svg';

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
  style?: any;
}

export const ChevronUpIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = '#000000',
  style,
}) => (
  <Svg style={style} width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="18 15 12 9 6 15" />
  </Svg>
);
