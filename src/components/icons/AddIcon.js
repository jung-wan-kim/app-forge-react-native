import React from 'react';
import Svg, { Rect, Path } from 'react-native-svg';

const AddIcon = ({ size = 24, color = '#000' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect 
        x="5" 
        y="5" 
        width="14" 
        height="14" 
        rx="3" 
        stroke={color} 
        strokeWidth="2"
      />
      <Path 
        d="M12 8v8M8 12h8" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default AddIcon;