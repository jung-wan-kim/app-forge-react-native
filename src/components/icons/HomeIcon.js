import React from 'react';
import Svg, { Path } from 'react-native-svg';

const HomeIcon = ({ size = 24, color = '#000', filled = false }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {filled ? (
        <Path
          d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z"
          fill={color}
        />
      ) : (
        <Path
          d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </Svg>
  );
};

export default HomeIcon;