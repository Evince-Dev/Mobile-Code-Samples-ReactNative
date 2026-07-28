import React from 'react';
import Svg, { Rect, Path, SvgProps } from 'react-native-svg';

export const CreditCardIcon: React.FC<SvgProps> = ({
  width = 20,
  height = 20,
  color = 'currentColor',
  strokeWidth = 2,
  ...props
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Rect width="20" height="14" x="2" y="5" rx="2" />
    <Path d="M2 10h20" />
  </Svg>
);
