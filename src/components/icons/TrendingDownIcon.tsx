import React from 'react';
import Svg, { Polyline } from 'react-native-svg';

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
}

export const TrendingDownIcon: React.FC<IconProps> = ({
  width = 20,
  height = 20,
  color = '#78716C',
  strokeWidth = 2,
}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
      <Polyline points="16 17 22 17 22 11" />
    </Svg>
  );
};
