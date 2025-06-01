# React Native iOS 프로젝트 설정 가이드

## 문제 상황
현재 프로젝트에 iOS 빌드를 위한 `.xcodeproj` 파일이 없습니다. React Native iOS 프로젝트를 올바르게 설정하는 방법을 안내합니다.

## 필요한 도구 설치

### 1. CocoaPods 설치
CocoaPods는 iOS 의존성 관리 도구로, React Native iOS 프로젝트에 필수입니다.

```bash
# Homebrew를 사용한 설치 (권장)
brew install cocoapods

# 또는 gem을 사용한 설치 (관리자 권한 필요)
sudo gem install cocoapods
```

### 2. Xcode Command Line Tools 설치
```bash
xcode-select --install
```

## iOS 프로젝트 생성 방법

### 방법 1: React Native CLI 사용 (권장)
```bash
# 현재 프로젝트에서 iOS 템플릿 재적용
cd /Users/jung-wankim/Project/app-forge
npx react-native-cli init TikTokClone --template react-native-template-typescript --skip-install
```

### 방법 2: 수동으로 iOS 프로젝트 생성

1. **iOS 프로젝트 구조 생성**
```bash
# iOS 디렉토리 구조 생성
mkdir -p ios/TikTokClone
mkdir -p ios/TikTokClone.xcodeproj
mkdir -p ios/TikTokClone/Images.xcassets
mkdir -p ios/TikTokClone/Images.xcassets/AppIcon.appiconset
```

2. **기본 iOS 파일 생성**
   - `AppDelegate.h`
   - `AppDelegate.mm`
   - `main.m`
   - `Info.plist`
   - `LaunchScreen.storyboard`

3. **Xcode 프로젝트 파일 생성**
   - `project.pbxproj`
   - `xcshareddata` 설정

### 방법 3: 기존 React Native 프로젝트에서 복사

다른 React Native 0.73.0 프로젝트에서 iOS 폴더를 복사하고 프로젝트 이름을 변경합니다.

## iOS 프로젝트 설정 스크립트

```bash
#!/bin/bash

# iOS 프로젝트 설정 스크립트
echo "🍎 iOS 프로젝트 설정 시작..."

# 1. CocoaPods 설치 확인
if ! command -v pod &> /dev/null; then
    echo "❌ CocoaPods가 설치되어 있지 않습니다."
    echo "다음 명령으로 설치해주세요: brew install cocoapods"
    exit 1
fi

# 2. iOS 디렉토리로 이동
cd ios

# 3. Pod 설치
echo "📦 Pod 의존성 설치 중..."
pod install

# 4. 빌드 테스트
echo "🔨 빌드 테스트 중..."
xcodebuild -workspace TikTokClone.xcworkspace -scheme TikTokClone -sdk iphonesimulator -configuration Debug

echo "✅ iOS 프로젝트 설정 완료!"
```

## 임시 해결 방법

CocoaPods 없이 iOS 프로젝트를 테스트하려면:

1. **React Native Expo 사용**
```bash
npx create-expo-app TikTokClone
cd TikTokClone
npx expo prebuild
```

2. **온라인 빌드 서비스 사용**
   - Expo EAS Build
   - Fastlane
   - Bitrise

## 권장 사항

1. **Homebrew 설치** (아직 설치되지 않은 경우)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. **Homebrew로 CocoaPods 설치**
```bash
brew install cocoapods
```

3. **iOS 프로젝트 재생성**
```bash
cd /Users/jung-wankim/Project/app-forge
rm -rf ios
npx react-native eject
```

## 다음 단계

1. CocoaPods 설치
2. iOS 프로젝트 파일 생성
3. Pod 의존성 설치
4. Xcode에서 프로젝트 열기
5. 빌드 및 실행

## 참고 사항

- React Native 0.73.0은 기본적으로 TypeScript를 지원합니다
- iOS 14.0 이상이 필요합니다
- Xcode 14.0 이상이 권장됩니다
- M1/M2 Mac에서는 Rosetta 모드가 필요할 수 있습니다