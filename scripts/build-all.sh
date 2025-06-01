#!/bin/bash

echo "🚀 App Forge - 전체 플랫폼 빌드 시작"

# 색상 정의
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# 빌드 디렉토리 생성
mkdir -p builds/web
mkdir -p builds/ios
mkdir -p builds/android

# 웹 빌드
echo -e "\n${BLUE}🌐 웹 플랫폼 빌드 중...${NC}"
cp -r app/* builds/web/
cp -r src builds/web/
echo -e "${GREEN}✅ 웹 빌드 완료${NC}"

# iOS 빌드 준비
echo -e "\n${BLUE}📱 iOS 플랫폼 빌드 준비 중...${NC}"
if [[ "$OSTYPE" == "darwin"* ]]; then
    # iOS 프로젝트 디렉토리 생성
    mkdir -p platforms/ios/TikTokClone/www
    cp -r app/* platforms/ios/TikTokClone/www/
    cp -r src platforms/ios/TikTokClone/www/
    
    # Podfile 생성
    cat > platforms/ios/Podfile <<EOF
platform :ios, '13.0'

target 'TikTokClone' do
  use_frameworks!
  
  # 필요한 경우 추가 팟 설치
end
EOF
    
    echo -e "${GREEN}✅ iOS 빌드 준비 완료${NC}"
    echo "   Xcode에서 platforms/ios/TikTokClone.xcodeproj를 열어 빌드하세요"
else
    echo -e "${RED}⚠️  iOS 빌드는 macOS에서만 가능합니다${NC}"
fi

# Android 빌드 준비
echo -e "\n${BLUE}🤖 Android 플랫폼 빌드 준비 중...${NC}"
# assets 디렉토리 생성
mkdir -p platforms/android/app/src/main/assets/www
cp -r app/* platforms/android/app/src/main/assets/www/
cp -r src platforms/android/app/src/main/assets/www/

# build.gradle 생성
cat > platforms/android/app/build.gradle <<EOF
plugins {
    id 'com.android.application'
}

android {
    compileSdk 33
    
    defaultConfig {
        applicationId "com.appforge.tiktokclone"
        minSdk 21
        targetSdk 33
        versionCode 1
        versionName "1.0"
    }
    
    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.9.0'
}
EOF

echo -e "${GREEN}✅ Android 빌드 준비 완료${NC}"
echo "   Android Studio에서 platforms/android를 열어 빌드하세요"

echo -e "\n${GREEN}🎉 모든 플랫폼 빌드 준비 완료!${NC}"