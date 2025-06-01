import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

const DiscoverIcon = ({ size = 24, color = '#000' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2" />
      <Path 
        d="M21 21l-4.35-4.35" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
      />
    </Svg>
  );
};

export default DiscoverIcon;