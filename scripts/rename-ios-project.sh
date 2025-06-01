#!/bin/bash

# iOS 프로젝트 이름 변경 스크립트
set -e

echo "📝 iOS 프로젝트 이름을 TikTokClone으로 변경 중..."

cd /Users/jung-wankim/Project/app-forge/ios

# Podfile 수정
sed -i '' 's/HelloWorld/TikTokClone/g' Podfile

# Info.plist 수정
sed -i '' 's/Hello World/TikTok Clone/g' TikTokClone/Info.plist

# AppDelegate 파일 수정
if [ -f "TikTokClone/AppDelegate.h" ]; then
    sed -i '' 's/HelloWorld/TikTokClone/g' TikTokClone/AppDelegate.h
fi

if [ -f "TikTokClone/AppDelegate.m" ]; then
    sed -i '' 's/HelloWorld/TikTokClone/g' TikTokClone/AppDelegate.m
fi

if [ -f "TikTokClone/AppDelegate.mm" ]; then
    sed -i '' 's/HelloWorld/TikTokClone/g' TikTokClone/AppDelegate.mm
fi

# main.m 수정
if [ -f "TikTokClone/main.m" ]; then
    sed -i '' 's/HelloWorld/TikTokClone/g' TikTokClone/main.m
fi

# LaunchScreen.storyboard 수정
if [ -f "TikTokClone/LaunchScreen.storyboard" ]; then
    sed -i '' 's/Hello World/TikTok Clone/g' TikTokClone/LaunchScreen.storyboard
fi

# Test 파일들 수정
if [ -d "TikTokCloneTests" ]; then
    find TikTokCloneTests -name "*.m" -o -name "*.h" -o -name "*.swift" | while read file; do
        sed -i '' 's/HelloWorld/TikTokClone/g' "$file"
    done
fi

# xcodeproj 파일 수정 (pbxproj)
if [ -f "TikTokClone.xcodeproj/project.pbxproj" ]; then
    sed -i '' 's/HelloWorld/TikTokClone/g' TikTokClone.xcodeproj/project.pbxproj
    sed -i '' 's/Hello World/TikTok Clone/g' TikTokClone.xcodeproj/project.pbxproj
fi

# xcscheme 파일들 수정
if [ -d "TikTokClone.xcodeproj/xcshareddata/xcschemes" ]; then
    find TikTokClone.xcodeproj/xcshareddata/xcschemes -name "*.xcscheme" | while read file; do
        sed -i '' 's/HelloWorld/TikTokClone/g' "$file"
    done
fi

echo "✅ iOS 프로젝트 이름 변경 완료!"