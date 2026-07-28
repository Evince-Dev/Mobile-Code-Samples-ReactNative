import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
}

export const TagIcon: React.FC<IconProps> = ({
  width = 20,
  height = 20,
  color = '#1C1917',
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
      <Path d="M12 2H2v10l11.29 11.29a1 1 0 0 0 1.41 0l7.58-7.58a1 1 0 0 0 0-1.41L12 2z" />
      <Circle cx="7" cy="7" r="1.5" fill={color} />
    </Svg>
  );
};
