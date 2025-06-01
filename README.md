# App Forge - Lynx 기반 모바일 앱 개발 자동화 시스템

Figma 디자인 변경부터 프로덕션 배포까지의 전체 워크플로우를 완전 자동화하는 Lynx 크로스 플랫폼 앱 개발 시스템입니다.

## 🎯 프로젝트 개요

App Forge는 **Lynx 프레임워크**와 **MCP(Model Context Protocol)** 서버들을 활용하여 모바일 앱 개발의 전체 라이프사이클을 자동화합니다:

- **Figma 디자인 감지** → **Lynx 컴포넌트 생성** → **테스트 실행** → **빌드** → **배포**

## 🛠 주요 MCP 서버

- **TaskManager**: 전체 프로젝트 관리 및 워크플로우 오케스트레이션
- **Context7**: 코드베이스 분석 및 문서화
- **Puppeteer Browser**: 웹 기반 테스트 및 UI 검증
- **Sequential Thinking**: 복잡한 의사결정 프로세스 자동화
- **Terminal**: 빌드 및 배포 명령어 실행

## 🏗 시스템 아키텍처

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Figma Design  │ ─► │   App Forge      │ ─► │   Production    │
│   Changes       │    │   Automation     │    │   Deployment    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   TaskManager    │
                    │   Orchestrator   │
                    └──────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Lynx Web   │    │ Lynx Mobile  │    │  Testing     │
│   Platform   │    │ iOS/Android  │    │  Pipeline    │
└──────────────┘    └──────────────┘    └──────────────┘
```

## 📱 지원 플랫폼

- **Lynx Framework**: 웹 기반 크로스 플랫폼 모바일 앱 개발
  - iOS: Lynx → 네이티브 iOS 앱
  - Android: Lynx → 네이티브 Android 앱
  - Web: 직접 웹 앱 실행
- **백엔드**: Supabase (Database, Auth, Storage, Real-time)

## 🔧 환경 설정

프로젝트는 `.env` 파일을 통해 유연하게 구성됩니다:

```env
# 개발 플랫폼 설정
ENABLE_IOS=true
ENABLE_ANDROID=true

# Supabase 설정
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Figma 설정
FIGMA_ACCESS_TOKEN=your_figma_token
FIGMA_FILE_ID=your_figma_file_id

# 🎯 Figma 채널 설정 (선택적 동기화)
FIGMA_CHANNEL_ENABLED=true
FIGMA_CHANNEL_PAGES=Design System,Components,Mobile UI
FIGMA_CHANNEL_FRAMES=Button,Input,Card,Navigation
FIGMA_CHANNEL_PREFIX=AppForge
FIGMA_CHANNEL_EXCLUDE_PATTERN=Draft,WIP,Archive

# 📢 Figma 알림 설정
FIGMA_WEBHOOK_URL=https://hooks.slack.com/your/webhook
FIGMA_NOTIFICATION_CHANNEL=#design-updates

# 배포 설정
IOS_TEAM_ID=your_ios_team_id
ANDROID_KEYSTORE_PATH=path_to_keystore
```

## 🚀 자동화 워크플로우

### 1. 디자인 변경 감지
- Figma API를 통한 디자인 변경 모니터링
- **채널 기반 선택적 동기화** (특정 페이지/프레임만)
- 컴포넌트 변경사항 자동 분석
- Slack/웹훅 실시간 알림

### 2. 코드 생성
- Figma 디자인 → Lynx 컴포넌트 코드 자동 생성
- Lynx 웹 컴포넌트 → iOS/Android 네이티브 앱 변환

### 3. 테스트 자동화
- 단위 테스트 자동 생성 및 실행
- UI 테스트 시나리오 자동화
- 크로스 플랫폼 호환성 테스트

### 4. 빌드 & 배포
- 자동 빌드 파이프라인
- TestFlight (iOS) / Play Console (Android) 배포
- 롤백 시스템

## 📂 프로젝트 구조

```
app-forge/
├── README.md
├── .env.example
├── package.json
├── scripts/
│   ├── setup.sh
│   ├── figma-sync.js
│   ├── lynx-setup.sh
│   ├── build-lynx.sh
│   └── deploy.sh
├── src/
│   └── lynx/           # Lynx 프레임워크 소스
├── app/
│   ├── components/     # Lynx 컴포넌트
│   ├── pages/         # 앱 페이지
│   ├── assets/        # 리소스 파일
│   └── config/        # 앱 설정
├── platforms/
│   ├── ios/           # iOS 네이티브 빌드
│   ├── android/       # Android 네이티브 빌드
│   └── web/           # 웹 플랫폼 빌드
├── tests/
│   ├── unit/          # 단위 테스트
│   ├── integration/   # 통합 테스트
│   └── e2e/           # E2E 테스트
├── supabase/
│   ├── migrations/
│   ├── functions/
│   └── config.toml
└── automation/
    ├── workflows/
    ├── tasks/
    └── templates/
```

## 🎮 사용법

### 초기 설정
```bash
# 프로젝트 설정
npm install
cp .env.example .env
# .env 파일 편집 후

# 개발 환경 설정
./scripts/setup.sh
```

### 개발 모드 실행
```bash
# TaskManager 시작
npm run start:taskmanager

# Lynx 개발 서버 시작
npm run dev:lynx     # Lynx 웹 개발 서버

# 특정 플랫폼 빌드
npm run build:ios    # iOS 네이티브 앱 빌드
npm run build:android # Android 네이티브 앱 빌드
npm run build:web    # 웹 앱 빌드
npm run build:all    # 모든 플랫폼 빌드
```

### 자동화 파이프라인 실행
```bash
# Figma 변경사항 동기화
npm run sync:figma

# 전체 파이프라인 실행
npm run pipeline:full

# 테스트만 실행
npm run test:all
```

## 🎯 Figma 채널 설정

App Forge는 **채널 기반 선택적 동기화**를 지원하여 특정 Figma 페이지나 컴포넌트만 자동화할 수 있습니다.

### 📋 채널 설정 옵션

| 환경변수 | 설명 | 예시 |
|---------|------|------|
| `FIGMA_CHANNEL_ENABLED` | 채널 필터링 활성화 | `true` |
| `FIGMA_CHANNEL_PAGES` | 동기화할 페이지명 (쉼표 구분) | `Design System,Components` |
| `FIGMA_CHANNEL_FRAMES` | 동기화할 프레임명 (쉼표 구분) | `Button,Input,Card` |
| `FIGMA_CHANNEL_PREFIX` | 컴포넌트명 프리픽스 필터 | `AppForge` |
| `FIGMA_CHANNEL_EXCLUDE_PATTERN` | 제외할 패턴 (쉼표 구분) | `Draft,WIP,Archive` |

### 🔧 채널 설정 예시

#### 1. 디자인 시스템만 동기화
```env
FIGMA_CHANNEL_ENABLED=true
FIGMA_CHANNEL_PAGES=Design System
FIGMA_CHANNEL_FRAMES=
FIGMA_CHANNEL_PREFIX=DS
FIGMA_CHANNEL_EXCLUDE_PATTERN=Draft,Old
```

#### 2. 특정 컴포넌트만 동기화
```env
FIGMA_CHANNEL_ENABLED=true
FIGMA_CHANNEL_PAGES=
FIGMA_CHANNEL_FRAMES=Button,Input,Card,Modal
FIGMA_CHANNEL_PREFIX=
FIGMA_CHANNEL_EXCLUDE_PATTERN=Test,WIP
```

#### 3. 프로덕션 준비된 컴포넌트만
```env
FIGMA_CHANNEL_ENABLED=true
FIGMA_CHANNEL_PAGES=Production,Release
FIGMA_CHANNEL_FRAMES=
FIGMA_CHANNEL_PREFIX=Prod
FIGMA_CHANNEL_EXCLUDE_PATTERN=Draft,Beta,Archive
```

### 📢 알림 설정

#### Slack 웹훅 설정
```env
FIGMA_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
FIGMA_NOTIFICATION_CHANNEL=#design-updates
```

#### 알림 메시지 예시
```
🎨 Figma 동기화 완료: 3개 컴포넌트 업데이트

📄 Design System: Button, Input
📄 Components: Card

🔗 Figma 파일: https://www.figma.com/file/abc123
```

### 🔍 채널 필터링 작동 방식

1. **페이지 필터링**: `FIGMA_CHANNEL_PAGES`에 지정된 페이지의 컴포넌트만 처리
2. **프레임 필터링**: `FIGMA_CHANNEL_FRAMES`에 지정된 이름을 포함한 컴포넌트만 처리  
3. **프리픽스 필터링**: `FIGMA_CHANNEL_PREFIX`로 시작하는 컴포넌트만 처리
4. **제외 패턴**: `FIGMA_CHANNEL_EXCLUDE_PATTERN`에 포함된 단어가 있는 컴포넌트 제외

### 💡 채널 설정 팁

- **점진적 롤아웃**: 처음에는 작은 범위로 시작하여 점진적으로 확장
- **명명 규칙**: 일관된 페이지/컴포넌트 명명 규칙 사용
- **제외 패턴**: `Draft`, `WIP`, `Archive` 등으로 작업 중인 컴포넌트 제외
- **알림 설정**: 팀 채널에 알림 설정으로 투명성 확보

## 🧪 테스트 전략

- **단위 테스트**: 각 컴포넌트별 자동 테스트
- **통합 테스트**: Supabase 연동 테스트
- **UI 테스트**: Puppeteer 기반 자동화된 UI 검증
- **E2E 테스트**: 전체 사용자 플로우 테스트

## 🚀 배포 전략

- **스테이징**: 자동 빌드 후 내부 테스트
- **프로덕션**: 승인 후 자동 배포
- **롤백**: 문제 발생 시 이전 버전 자동 복구

## 📋 TaskManager 통합

전체 프로젝트는 MCP TaskManager를 통해 관리됩니다:

- 작업 단위별 자동 할당
- 진행상황 실시간 모니터링
- 의존성 관리 및 순서 제어
- 오류 발생 시 자동 복구

## 🤝 기여하기

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.