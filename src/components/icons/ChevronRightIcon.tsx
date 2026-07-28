/**
 * Chevron Right Icon SVG Component
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface ChevronRightIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export const ChevronRightIcon: React.FC<ChevronRightIconProps> = ({
  width = 16,
  height = 16,
  color = '#222222',
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 18L15 12L9 6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
