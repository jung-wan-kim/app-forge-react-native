import React from 'react';
import Svg, { Rect, Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const UploadButton = ({ size = 45, focused = false }) => {
  return (
    <Svg width={size} height={30} viewBox="0 0 45 30" fill="none">
      <Defs>
        <LinearGradient id="leftGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#00f2ea" />
          <Stop offset="100%" stopColor="#00d4d1" />
        </LinearGradient>
        <LinearGradient id="rightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#ff0050" />
          <Stop offset="100%" stopColor="#ff0033" />
        </LinearGradient>
      </Defs>
      
      {/* 왼쪽 사이드 Rectangle */}
      <Rect 
        x="-4" 
        y="0" 
        width="20" 
        height="30" 
        rx="8" 
        fill="url(#leftGradient)"
      />
      
      {/* 오른쪽 사이드 Rectangle */}
      <Rect 
        x="29" 
        y="0" 
        width="20" 
        height="30" 
        rx="8" 
        fill="url(#rightGradient)"
      />
      
      {/* 중앙 배경 Rectangle */}
      <Rect 
        x="0" 
        y="0" 
        width="45" 
        height="30" 
        rx="8" 
        fill={focused ? "#fff" : "rgba(255, 255, 255, 0.9)"}
      />
      
      {/* 플러스 아이콘 */}
      <Path 
        d="M22.5 10v10M17.5 15h10" 
        stroke={focused ? "#000" : "#000"} 
        strokeWidth="2.5" 
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default UploadButton;