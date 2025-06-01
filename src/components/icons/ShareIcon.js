import React from 'react';
import Svg, { Path } from 'react-native-svg';

const ShareIcon = ({ size = 24, color = '#fff' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M13.5 9.5l7-7m0 0v5.25m0-5.25h-5.25M20.5 12.5v6a2 2 0 01-2 2h-13a2 2 0 01-2-2v-13a2 2 0 012-2h6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default ShareIcon;