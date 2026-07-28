/**
 * Eye Closed Icon SVG Component
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface EyeClosedIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export const EyeClosedIcon: React.FC<EyeClosedIconProps> = ({
  width = 20,
  height = 20,
  color = '#666666',
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C5 20 1 12 1 12C2.24389 9.68192 3.96914 7.65663 6.06 6.06L17.94 17.94Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M1 1L23 23"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6.06 6.06C3.96914 7.65663 2.24389 9.68192 1 12C1 12 5 20 12 20C14.1491 19.9649 16.2306 19.243 17.94 17.94L6.06 6.06Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M23 12C23 12 19 4 12 4C11.3936 4.00002 10.7921 4.08124 10.21 4.24"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 9C13.6569 9 15 10.3431 15 12C15 12.3407 14.9398 12.6761 14.8243 12.9922"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
