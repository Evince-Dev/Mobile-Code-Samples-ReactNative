import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
}

export const ArrowUpDownIcon: React.FC<IconProps> = ({
  width = 20,
  height = 20,
  color = '#16A34A',
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
      <Path d="m21 16-4 4-4-4M17 20V4M3 8l4-4 4 4M7 4v16" />
    </Svg>
  );
};
