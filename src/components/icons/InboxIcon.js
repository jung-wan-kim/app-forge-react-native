import React from 'react';
import Svg, { Path } from 'react-native-svg';

const InboxIcon = ({ size = 24, color = '#000', filled = false }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {filled ? (
        <Path
          d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"
          fill={color}
        />
      ) : (
        <Path
          d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"
          fill={color}
        />
      )}
    </Svg>
  );
};

export default InboxIcon;