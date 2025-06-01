import React from 'react';
import Svg, { Path, Circle, G } from 'react-native-svg';

const ProfileIcon = ({ size = 24, color = '#000', filled = false }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {filled ? (
        <G>
          {/* 외곽 원 */}
          <Circle cx="12" cy="12" r="11" fill={color} fillOpacity="0.1" />
          {/* 아바타 이미지 영역 */}
          <Circle cx="12" cy="12" r="9" fill={color} fillOpacity="0.2" />
          {/* 머리 */}
          <Circle cx="12" cy="10" r="3.5" fill={color} />
          {/* 몸통 */}
          <Path
            d="M12 15c-3.5 0-6.5 2-7 4.5a9 9 0 0 0 14 0c-.5-2.5-3.5-4.5-7-4.5z"
            fill={color}
          />
        </G>
      ) : (
        <G>
          {/* 외곽 테두리 */}
          <Circle 
            cx="12" 
            cy="12" 
            r="10" 
            stroke={color} 
            strokeWidth="1.5"
            strokeOpacity="0.3"
          />
          {/* 머리 */}
          <Circle 
            cx="12" 
            cy="10" 
            r="3" 
            stroke={color} 
            strokeWidth="1.5"
          />
          {/* 몸통 */}
          <Path
            d="M6 20a8.96 8.96 0 0 0 12 0 6 6 0 0 0-12 0z"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </G>
      )}
    </Svg>
  );
};

export default ProfileIcon;