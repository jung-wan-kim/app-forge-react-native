# 🚀 TikTok Clone - 빌드 및 테스트 가이드

## 📋 목차
- [웹 개발 환경](#웹-개발-환경)
- [iOS 빌드 및 테스트](#ios-빌드-및-테스트)
- [Android 빌드 및 테스트](#android-빌드-및-테스트)
- [통합 빌드](#통합-빌드)
- [테스트 체크리스트](#테스트-체크리스트)

## 🌐 웹 개발 환경

### 빠른 시작
```bash
# 개발 서버 실행
npm run dev

# 또는 직접 실행
node server.js
```

### 모바일 웹 테스트
1. 컴퓨터와 모바일 기기를 같은 네트워크에 연결
2. 컴퓨터의 IP 주소 확인
3. 모바일 브라우저에서 `http://[IP주소]:3000` 접속

### 브라우저 개발자 도구
- Chrome/Edge: F12 → 모바일 뷰 토글
- Safari: 개발자 메뉴 활성화 → 반응형 디자인 모드

## 📱 iOS 빌드 및 테스트

### 요구사항
- macOS
- Xcode 14.0 이상
- iOS 13.0 이상 지원

### 빌드 단계
```bash
# 1. iOS 프로젝트 준비
npm run build:all

# 2. Xcode에서 프로젝트 열기
cd platforms/ios
open TikTokClone.xcodeproj

# 3. Xcode에서 빌드 및 실행
# - 시뮬레이터 선택: iPhone 14 Pro 권장
# - Cmd+R로 실행
```

### 실제 기기 테스트
1. Apple Developer 계정 필요
2. Xcode에서 팀 설정
3. 기기를 연결하고 신뢰 설정
4. 기기 선택 후 실행

## 🤖 Android 빌드 및 테스트

### 요구사항
- Android Studio
- Java 11 이상
- Android SDK 21 이상

### 빌드 단계
```bash
# 1. Android 프로젝트 준비
npm run build:all

# 2. Android Studio에서 프로젝트 열기
# File → Open → platforms/android 선택

# 3. Gradle 동기화 대기

# 4. 에뮬레이터 또는 실제 기기에서 실행
# - 에뮬레이터: AVD Manager에서 생성
# - 실제 기기: 개발자 모드 활성화 필요
```

### APK 생성
```bash
cd platforms/android
./gradlew assembleDebug
# APK 위치: app/build/outputs/apk/debug/
```

## 🔨 통합 빌드

### 모든 플랫폼 한 번에 준비
```bash
npm run build
# 또는
./scripts/build-all.sh
```

### 생성되는 파일 구조
```
builds/
├── web/          # 웹 배포용 파일
├── ios/          # iOS 빌드 아티팩트
└── android/      # Android APK 파일

platforms/
├── ios/          # Xcode 프로젝트
└── android/      # Android Studio 프로젝트
```

## ✅ 테스트 체크리스트

### 핵심 기능
- [ ] **비디오 재생**
  - [ ] 자동 재생
  - [ ] 음소거/음소거 해제
  - [ ] 재생/일시정지 토글
  
- [ ] **스크롤 및 네비게이션**
  - [ ] 세로 스크롤 (스와이프)
  - [ ] 휠 스크롤 (웹)
  - [ ] 부드러운 전환 애니메이션
  
- [ ] **상호작용**
  - [ ] 좋아요 버튼 토글
  - [ ] 팔로우 버튼
  - [ ] 댓글 패널 열기/닫기
  - [ ] 댓글 작성
  
- [ ] **페이지 이동**
  - [ ] 홈 → 프로필
  - [ ] 홈 → 업로드
  - [ ] 네비게이션 바 동작
  
- [ ] **업로드 기능**
  - [ ] 비디오 파일 선택
  - [ ] 미리보기
  - [ ] 설명 입력
  - [ ] 프라이버시 설정

### 플랫폼별 테스트
- [ ] **iOS**
  - [ ] Safe Area 적용
  - [ ] 제스처 인식
  - [ ] 상태바 스타일
  
- [ ] **Android**
  - [ ] 백 버튼 동작
  - [ ] 전체 화면 모드
  - [ ] 다양한 화면 크기
  
- [ ] **웹**
  - [ ] 반응형 디자인
  - [ ] 키보드 단축키
  - [ ] 브라우저 호환성

## 🐛 문제 해결

### 일반적인 문제
1. **CORS 오류**: 개발 서버 사용 권장
2. **비디오 재생 안 됨**: 음소거 상태로 자동 재생 확인
3. **스크롤 이상**: 터치 이벤트 처리 확인

### 플랫폼별 이슈
- **iOS**: Info.plist 권한 설정 확인
- **Android**: AndroidManifest.xml 권한 확인
- **웹**: HTTPS 환경에서 카메라/마이크 권한

## 📞 지원
문제가 발생하면 다음을 확인하세요:
1. 콘솔 로그
2. 네트워크 탭
3. 기기별 로그 (Xcode, Android Studio)

## 🎯 다음 단계
1. Supabase 백엔드 연동
2. 실제 비디오 업로드 구현
3. 사용자 인증 시스템
4. 푸시 알림 설정
5. 앱 스토어 배포 준비