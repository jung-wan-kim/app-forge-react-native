#!/bin/bash

# App Forge 프로젝트 초기 설정 스크립트

echo "🚀 App Forge 초기 설정을 시작합니다..."

# 환경 변수 파일 체크
if [ ! -f .env ]; then
    echo "📝 .env 파일을 생성합니다..."
    cp .env.example .env
    echo "⚠️  .env 파일을 편집하여 실제 값들을 설정하세요."
fi

# Node.js 의존성 설치
echo "📦 Node.js 의존성을 설치합니다..."
npm install

# iOS 설정 체크 및 설정
if [ "$ENABLE_IOS" = "true" ] || [ -z "$ENABLE_IOS" ]; then
    echo "🍎 iOS 개발 환경을 설정합니다..."
    
    # Xcode Command Line Tools 체크
    if ! xcode-select -p &> /dev/null; then
        echo "⚠️  Xcode Command Line Tools가 설치되어 있지 않습니다."
        echo "다음 명령어로 설치하세요: xcode-select --install"
    fi
    
    # CocoaPods 설치 체크
    if ! command -v pod &> /dev/null; then
        echo "📱 CocoaPods를 설치합니다..."
        sudo gem install cocoapods
    fi
    
    # iOS 프로젝트 설정
    if [ ! -f ios/Podfile ]; then
        echo "📱 iOS 프로젝트를 초기화합니다..."
        cd ios
        pod init
        cd ..
    fi
fi

# Android 설정 체크 및 설정
if [ "$ENABLE_ANDROID" = "true" ] || [ -z "$ENABLE_ANDROID" ]; then
    echo "🤖 Android 개발 환경을 설정합니다..."
    
    # Android SDK 체크
    if [ -z "$ANDROID_HOME" ]; then
        echo "⚠️  ANDROID_HOME 환경변수가 설정되어 있지 않습니다."
        echo "Android Studio를 설치하고 SDK 경로를 설정하세요."
    fi
    
    # Gradle wrapper 실행 권한 설정
    if [ -f android/gradlew ]; then
        chmod +x android/gradlew
    fi
fi

# Fastlane 설정
echo "🚀 Fastlane을 설정합니다..."
if ! command -v fastlane &> /dev/null; then
    echo "📱 Fastlane을 설치합니다..."
    sudo gem install fastlane
fi

# Supabase CLI 설정
echo "🗄️ Supabase CLI를 설정합니다..."
if ! command -v supabase &> /dev/null; then
    echo "📊 Supabase CLI를 설치합니다..."
    npm install -g supabase
fi

# Supabase 프로젝트 초기화
if [ ! -f supabase/config.toml ]; then
    echo "🗄️ Supabase 프로젝트를 초기화합니다..."
    supabase init
fi

# 권한 설정
echo "🔧 스크립트 실행 권한을 설정합니다..."
chmod +x scripts/*.sh

# MCP 서버 상태 체크
echo "🔌 MCP 서버 연결을 체크합니다..."
claude mcp status

echo "✅ App Forge 초기 설정이 완료되었습니다!"
echo ""
echo "📋 다음 단계:"
echo "1. .env 파일을 편집하여 실제 값들을 설정"
echo "2. Figma Access Token 설정"
echo "3. Supabase 프로젝트 URL 및 키 설정"
echo "4. iOS/Android 배포 인증서 설정"
echo ""
echo "🚀 개발을 시작하려면:"
echo "npm run dev:both    # iOS + Android 동시 개발"
echo "npm run dev:ios     # iOS만 개발"
echo "npm run dev:android # Android만 개발"