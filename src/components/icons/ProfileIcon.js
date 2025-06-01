import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

const ProfileIcon = ({ size = 24, color = '#000', filled = false }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {filled ? (
        <>
          <Circle cx="12" cy="8" r="4" fill={color} />
          <Path
            d="M12 14c-4 0-7.33 2.67-8 6h16c-.67-3.33-4-6-8-6z"
            fill={color}
          />
        </>
      ) : (
        <>
          <Circle 
            cx="12" 
            cy="8" 
            r="3" 
            stroke={color} 
            strokeWidth="2"
          />
          <Path
            d="M5 20c0-3.87 3.13-7 7-7s7 3.13 7 7"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      )}
    </Svg>
  );
};

export default ProfileIcon;