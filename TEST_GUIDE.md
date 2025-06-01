# TikTok Clone 테스트 가이드

## 🚀 빠른 시작

### 1. 의존성 설치
```bash
npm install
```

### 2. iOS에서 테스트 (Mac에서만 가능)
```bash
# iOS 의존성 설치
cd ios && pod install && cd ..

# iOS 시뮬레이터 실행
npm run ios
```

### 3. Android에서 테스트
```bash
# Android 에뮬레이터 먼저 실행 후
npm run android
```

### 4. 자동 테스트 스크립트 사용
```bash
./scripts/test-app.sh
```

## 📱 기능 테스트

### 1. 홈 화면
- 동영상 피드 스크롤
- 재생/일시정지 (화면 탭)
- 좋아요 버튼
- 댓글, 공유 버튼

### 2. 검색 화면
- 검색어 입력
- 최근 검색 기록
- 인기 해시태그

### 3. 업로드 화면
- 동영상 촬영
- 갤러리에서 선택
- 설명 및 해시태그 입력
- Supabase 업로드

### 4. 알림 화면
- 알림 목록 확인

### 5. 프로필 화면
- 사용자 정보
- 업로드한 동영상 그리드

## 🛠 문제 해결

### Metro 번들러 오류
```bash
npx react-native start --reset-cache
```

### iOS 빌드 오류
```bash
cd ios && pod deintegrate && pod install && cd ..
```

### Android 빌드 오류
```bash
cd android && ./gradlew clean && cd ..
```

## 📝 테스트 계정

Supabase에 테스트 계정을 만들거나 익명으로 사용 가능합니다.

## 🔧 개발자 도구

### React Native Debugger
- iOS: Cmd + D
- Android: Cmd + M (Mac) / Ctrl + M (Windows)

### 핫 리로딩
자동으로 활성화되어 있습니다. 코드 변경 시 앱이 자동으로 새로고침됩니다.