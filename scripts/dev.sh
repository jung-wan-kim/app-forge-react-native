#!/bin/bash

echo "🚀 TikTok Clone 개발 서버 시작"

# 색상 정의
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 포트 확인
PORT=${PORT:-3000}

# 이미 실행 중인 프로세스 확인
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${YELLOW}⚠️  포트 $PORT가 이미 사용 중입니다${NC}"
    read -p "기존 프로세스를 종료하고 계속하시겠습니까? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        kill $(lsof -Pi :$PORT -sTCP:LISTEN -t)
        sleep 2
    else
        exit 1
    fi
fi

# 개발 서버 시작
echo -e "${BLUE}🌐 웹 서버를 시작합니다...${NC}"
node server.js &
SERVER_PID=$!

# 서버가 시작될 때까지 대기
sleep 2

# 브라우저 열기
echo -e "${GREEN}✅ 서버가 실행 중입니다${NC}"
echo -e "   주소: http://localhost:$PORT"
echo -e "\n${BLUE}📱 모바일 테스트:${NC}"
echo -e "   1. 같은 네트워크에 연결된 모바일 기기에서"
echo -e "   2. http://$(ipconfig getifaddr en0 2>/dev/null || hostname -I | awk '{print $1}'):$PORT 접속"
echo -e "\n${YELLOW}종료하려면 Ctrl+C를 누르세요${NC}"

# 종료 시그널 처리
trap "kill $SERVER_PID 2>/dev/null; echo -e '\n${GREEN}✅ 서버가 종료되었습니다${NC}'; exit" INT

# 서버 프로세스 대기
wait $SERVER_PID