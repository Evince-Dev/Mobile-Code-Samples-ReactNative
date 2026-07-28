import React from 'react';
import Svg, { Line } from 'react-native-svg';

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
  style?: any;
}

export const PlusIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = '#000000',
  style,
}) => (
  <Svg style={style} width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Line x1="12" y1="5" x2="12" y2="19" />
    <Line x1="5" y1="12" x2="19" y2="12" />
  </Svg>
);
