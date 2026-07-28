import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
}

export const CloseIcon: React.FC<IconProps> = ({
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
      <Path d="M18 6L6 18M6 6l12 12" />
    </Svg>
  );
};
