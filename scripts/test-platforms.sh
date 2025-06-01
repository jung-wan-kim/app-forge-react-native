#!/bin/bash

echo "🧪 TikTok Clone 플랫폼별 테스트 가이드"

# 색상 정의
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "\n${BLUE}📱 iOS 테스트 방법:${NC}"
echo "1. Xcode 설치 확인"
echo "2. 다음 명령 실행:"
echo -e "${CYAN}   cd platforms/ios${NC}"
echo -e "${CYAN}   open TikTokClone.xcodeproj${NC}"
echo "3. Xcode에서 시뮬레이터 선택 후 실행 (Cmd+R)"
echo "4. 실제 기기 테스트: 개발자 인증서 필요"

echo -e "\n${BLUE}🤖 Android 테스트 방법:${NC}"
echo "1. Android Studio 설치 확인"
echo "2. 다음 명령 실행:"
echo -e "${CYAN}   cd platforms/android${NC}"
echo -e "${CYAN}   ./gradlew assembleDebug${NC}"
echo "3. 에뮬레이터 또는 실제 기기에서 테스트"
echo "4. APK 위치: app/build/outputs/apk/debug/"

echo -e "\n${BLUE}🌐 웹 테스트 방법:${NC}"
echo "1. 개발 서버 실행:"
echo -e "${CYAN}   npm run dev${NC}"
echo "2. 브라우저에서 http://localhost:3000 접속"
echo "3. 개발자 도구로 모바일 뷰 테스트 (F12)"

echo -e "\n${BLUE}📱 실제 모바일 웹 테스트:${NC}"
echo "1. 컴퓨터와 모바일이 같은 네트워크에 연결"
echo "2. 컴퓨터의 IP 주소 확인:"
if [[ "$OSTYPE" == "darwin"* ]]; then
    IP=$(ipconfig getifaddr en0 2>/dev/null || echo "IP 주소 확인 필요")
else
    IP=$(hostname -I | awk '{print $1}' 2>/dev/null || echo "IP 주소 확인 필요")
fi
echo -e "${CYAN}   http://$IP:3000${NC}"
echo "3. 모바일 브라우저에서 위 주소로 접속"

echo -e "\n${YELLOW}⚠️  주의사항:${NC}"
echo "- iOS: macOS와 Xcode 필요"
echo "- Android: Java 11+ 필요"
echo "- 실제 기기 테스트 시 개발자 모드 활성화 필요"

echo -e "\n${GREEN}✅ 테스트 체크리스트:${NC}"
echo "□ 비디오 재생/일시정지"
echo "□ 세로 스크롤 (스와이프)"
echo "□ 좋아요 버튼 동작"
echo "□ 댓글 열기/닫기"
echo "□ 프로필 페이지 이동"
echo "□ 비디오 업로드 UI"
echo "□ 네비게이션 바 동작"