/**
 * Eye Open Icon SVG Component
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface EyeOpenIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export const EyeOpenIcon: React.FC<EyeOpenIconProps> = ({
  width = 20,
  height = 20,
  color = '#666666',
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
