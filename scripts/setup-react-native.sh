#!/bin/bash

echo "React Native 개발 환경 설정 시작..."

# 1. Node modules 설치
echo "📦 Node modules 설치 중..."
npm install

# 2. iOS 의존성 설치 (macOS에서만)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 iOS 의존성 설치 중..."
    cd ios && pod install && cd ..
fi

# 3. React Native 환경 설정
echo "⚙️  React Native 환경 확인..."
npx react-native doctor

echo "✅ 설정 완료!"
echo ""
echo "앱을 실행하려면:"
echo "  iOS: npm run ios"
echo "  Android: npm run android"
echo "  Metro 번들러: npm start"