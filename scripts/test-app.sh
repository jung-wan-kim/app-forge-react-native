#!/bin/bash

echo "🚀 TikTok Clone 앱 테스트 시작..."

# 1. 의존성 설치 확인
if [ ! -d "node_modules" ]; then
    echo "📦 의존성 설치 중..."
    npm install
fi

# 2. Metro 번들러 시작 (백그라운드)
echo "🔄 Metro 번들러 시작..."
npx react-native start --reset-cache &
METRO_PID=$!

# 잠시 대기
sleep 5

# 3. 플랫폼 선택
echo ""
echo "테스트할 플랫폼을 선택하세요:"
echo "1) iOS 시뮬레이터"
echo "2) Android 에뮬레이터"
echo "3) 둘 다"
read -p "선택 (1/2/3): " choice

case $choice in
    1)
        echo "🍎 iOS 시뮬레이터에서 실행 중..."
        npx react-native run-ios
        ;;
    2)
        echo "🤖 Android 에뮬레이터에서 실행 중..."
        npx react-native run-android
        ;;
    3)
        echo "📱 iOS와 Android 모두 실행 중..."
        npx react-native run-ios &
        npx react-native run-android
        ;;
    *)
        echo "❌ 잘못된 선택입니다."
        kill $METRO_PID
        exit 1
        ;;
esac

echo ""
echo "✅ 앱이 실행되었습니다!"
echo "종료하려면 Ctrl+C를 누르세요."

# Metro 번들러 유지
wait $METRO_PID