import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface CheckIconProps {
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
}

export const CheckIcon: React.FC<CheckIconProps> = ({
  width = 24,
  height = 24,
  color = 'currentColor',
  strokeWidth = 2,
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 6L9 17L4 12"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
