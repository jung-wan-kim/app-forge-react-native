#!/bin/bash

echo "🌱 비디오 데이터베이스 시딩 시작..."

# 환경 변수 확인
if [ -z "$SUPABASE_SERVICE_KEY" ]; then
    echo "❌ SUPABASE_SERVICE_KEY 환경 변수가 설정되지 않았습니다."
    echo "다음 명령어로 설정해주세요:"
    echo "export SUPABASE_SERVICE_KEY='your-service-key-here'"
    exit 1
fi

# Node.js 스크립트 실행
node scripts/seed-videos.js

echo "✅ 시딩 완료!"