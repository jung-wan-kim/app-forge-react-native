#!/bin/bash

# Lynx 프레임워크 설정 스크립트

echo "🦋 Lynx 프레임워크 설정을 시작합니다..."

# 현재 디렉토리 확인
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

# 환경 변수 로드
if [ -f .env ]; then
    source .env
fi

# Lynx 소스 클론
if [ ! -d "src/lynx" ]; then
    echo "📥 Lynx 프레임워크를 다운로드합니다..."
    mkdir -p src
    git clone https://github.com/lynx-family/lynx.git src/lynx
else
    echo "✅ Lynx 프레임워크가 이미 설치되어 있습니다."
fi

# Lynx 환경 설정
echo "🔧 Lynx 개발 환경을 설정합니다..."
cd src/lynx

# Python 환경 설정
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3가 설치되어 있지 않습니다. Python 3.9 이상을 설치하세요."
    exit 1
fi

# Python 가상환경 생성
if [ ! -d "venv" ]; then
    echo "🐍 Python 가상환경을 생성합니다..."
    python3 -m venv venv
fi

# 가상환경 활성화
source venv/bin/activate

# PyYAML 설치
echo "📦 Python 의존성을 설치합니다..."
pip3 install pyyaml

# Lynx 환경 설정
echo "🔧 Lynx 빌드 환경을 설정합니다..."
source tools/envsetup.sh

# 의존성 동기화
echo "🔄 Lynx 의존성을 동기화합니다..."
tools/hab sync .

# Android 설정 (Android 빌드가 활성화된 경우)
if [ "$ENABLE_ANDROID" = "true" ]; then
    echo "🤖 Android 개발 환경을 설정합니다..."
    
    # ANDROID_HOME 체크
    if [ -z "$ANDROID_HOME" ]; then
        echo "⚠️  ANDROID_HOME 환경변수를 설정하세요."
        echo "예: export ANDROID_HOME=/path/to/android-sdk"
    else
        export ANDROID_SDK_ROOT="$ANDROID_HOME"
        export PATH=${PATH}:${ANDROID_HOME}/platform-tools
        echo "✅ Android SDK 경로가 설정되었습니다: $ANDROID_HOME"
    fi
    
    # JDK 설정 체크
    if [ -z "$JAVA_HOME" ]; then
        echo "⚠️  JAVA_HOME 환경변수를 설정하세요."
        if [[ "$OSTYPE" == "darwin"* ]]; then
            echo "macOS 예시: export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-11.jdk/Contents/Home"
        fi
    else
        export PATH=$JAVA_HOME/bin:$PATH
        echo "✅ JDK 경로가 설정되었습니다: $JAVA_HOME"
    fi
fi

# iOS 설정 (iOS 빌드가 활성화된 경우)
if [ "$ENABLE_IOS" = "true" ]; then
    echo "🍎 iOS 개발 환경을 설정합니다..."
    
    # Xcode Command Line Tools 체크
    if ! xcode-select -p &> /dev/null; then
        echo "⚠️  Xcode Command Line Tools가 설치되어 있지 않습니다."
        echo "다음 명령어로 설치하세요: xcode-select --install"
    else
        echo "✅ Xcode Command Line Tools가 설치되어 있습니다."
    fi
fi

# Appium 테스트 환경 설정 (테스트가 활성화된 경우)
if [ "$AUTO_RUN_TESTS" = "true" ]; then
    echo "🧪 Appium 테스트 환경을 설정합니다..."
    
    # Node.js 체크
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js가 설치되어 있지 않습니다."
        exit 1
    fi
    
    # Appium 설치
    if ! command -v appium &> /dev/null; then
        echo "📱 Appium을 설치합니다..."
        npm install -g appium@2.11.2
        npm install -g appium-doctor
    fi
    
    # Appium 드라이버 설치
    echo "📱 Appium 드라이버를 설치합니다..."
    if [ "$ENABLE_IOS" = "true" ]; then
        appium driver install xcuitest
    fi
    if [ "$ENABLE_ANDROID" = "true" ]; then
        appium driver install uiautomator2
        appium driver install espresso
    fi
    
    # Appium 환경 체크
    echo "🔍 Appium 환경을 체크합니다..."
    appium-doctor
fi

# 프로젝트 루트로 돌아가기
cd "$PROJECT_ROOT"

# Lynx 앱 디렉토리 초기화
echo "📁 Lynx 앱 구조를 초기화합니다..."

# 기본 컴포넌트 생성
if [ ! -f "app/components/Button.js" ]; then
    cat > app/components/Button.js << 'EOF'
/**
 * Lynx Button 컴포넌트
 */
export default class Button {
    constructor(props = {}) {
        this.props = props;
        this.element = null;
    }
    
    render() {
        const { text = '버튼', onClick, className = '' } = this.props;
        
        this.element = document.createElement('button');
        this.element.textContent = text;
        this.element.className = `lynx-button ${className}`;
        
        if (onClick) {
            this.element.addEventListener('click', onClick);
        }
        
        return this.element;
    }
    
    setData(data) {
        if (this.element && data.text) {
            this.element.textContent = data.text;
        }
    }
}
EOF
    echo "✅ 기본 Button 컴포넌트가 생성되었습니다."
fi

# 기본 페이지 생성
if [ ! -f "app/pages/Home.js" ]; then
    cat > app/pages/Home.js << 'EOF'
import Button from '../components/Button.js';

/**
 * Lynx Home 페이지
 */
export default class Home {
    constructor() {
        this.container = null;
        this.components = {};
    }
    
    render() {
        this.container = document.createElement('div');
        this.container.className = 'lynx-page home-page';
        
        // 제목
        const title = document.createElement('h1');
        title.textContent = 'App Forge';
        title.className = 'page-title';
        this.container.appendChild(title);
        
        // 설명
        const description = document.createElement('p');
        description.textContent = 'Lynx 기반 모바일 앱 개발 자동화 시스템';
        description.className = 'page-description';
        this.container.appendChild(description);
        
        // 버튼
        this.components.button = new Button({
            text: '시작하기',
            onClick: () => {
                console.log('시작하기 버튼 클릭됨');
            },
            className: 'start-button'
        });
        
        this.container.appendChild(this.components.button.render());
        
        return this.container;
    }
}
EOF
    echo "✅ 기본 Home 페이지가 생성되었습니다."
fi

# 기본 앱 설정 파일 생성
if [ ! -f "app/config/app.config.js" ]; then
    cat > app/config/app.config.js << 'EOF'
/**
 * App Forge Lynx 앱 설정
 */
export default {
    name: 'App Forge',
    version: '1.0.0',
    description: 'Lynx 기반 모바일 앱 개발 자동화 시스템',
    
    // 지원 플랫폼
    platforms: {
        web: true,
        ios: process.env.ENABLE_IOS === 'true',
        android: process.env.ENABLE_ANDROID === 'true'
    },
    
    // Supabase 설정
    supabase: {
        url: process.env.SUPABASE_URL,
        anonKey: process.env.SUPABASE_ANON_KEY
    },
    
    // 개발 설정
    development: {
        hotReload: true,
        devTools: true,
        mock: true
    },
    
    // 테스트 설정
    testing: {
        autoRun: process.env.AUTO_RUN_TESTS === 'true',
        e2eUrl: process.env.E2E_TEST_URL || 'http://localhost:3000'
    }
};
EOF
    echo "✅ 앱 설정 파일이 생성되었습니다."
fi

# 메인 앱 파일 생성
if [ ! -f "app/main.js" ]; then
    cat > app/main.js << 'EOF'
import Home from './pages/Home.js';
import config from './config/app.config.js';

/**
 * App Forge 메인 애플리케이션
 */
class AppForgeApp {
    constructor() {
        this.currentPage = null;
        this.config = config;
        this.container = null;
    }
    
    async init() {
        console.log(`${this.config.name} v${this.config.version} 시작`);
        
        // 앱 컨테이너 생성
        this.container = document.getElementById('app') || document.body;
        
        // 홈 페이지 로드
        await this.navigateTo('home');
        
        console.log('앱 초기화 완료');
    }
    
    async navigateTo(page) {
        // 이전 페이지 제거
        if (this.currentPage && this.currentPage.container) {
            this.container.removeChild(this.currentPage.container);
        }
        
        // 새 페이지 로드
        switch (page) {
            case 'home':
                this.currentPage = new Home();
                break;
            default:
                console.error(`알 수 없는 페이지: ${page}`);
                return;
        }
        
        // 페이지 렌더링
        const pageElement = this.currentPage.render();
        this.container.appendChild(pageElement);
    }
}

// 앱 시작
const app = new AppForgeApp();

// DOM 로드 완료 후 앱 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}

export default app;
EOF
    echo "✅ 메인 앱 파일이 생성되었습니다."
fi

# HTML 엔트리 포인트 생성
if [ ! -f "app/index.html" ]; then
    cat > app/index.html << 'EOF'
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>App Forge - Lynx 기반 모바일 앱</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        #app {
            background: white;
            border-radius: 16px;
            padding: 2rem;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 400px;
            width: 90%;
        }
        
        .page-title {
            color: #333;
            margin-bottom: 1rem;
            font-size: 2rem;
            font-weight: 600;
        }
        
        .page-description {
            color: #666;
            margin-bottom: 2rem;
            line-height: 1.6;
        }
        
        .lynx-button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .lynx-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }
        
        .lynx-button:active {
            transform: translateY(0);
        }
    </style>
</head>
<body>
    <div id="app">
        <div style="color: #999;">앱 로딩 중...</div>
    </div>
    
    <script type="module" src="main.js"></script>
</body>
</html>
EOF
    echo "✅ HTML 엔트리 포인트가 생성되었습니다."
fi

# .gitignore 업데이트
if [ -f ".gitignore" ]; then
    echo "" >> .gitignore
    echo "# Lynx specific" >> .gitignore
    echo "src/lynx/venv/" >> .gitignore
    echo "src/lynx/out/" >> .gitignore
    echo "src/lynx/build/" >> .gitignore
    echo "platforms/*/build/" >> .gitignore
    echo "platforms/*/out/" >> .gitignore
else
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*

# Environment
.env
.env.local

# Lynx specific
src/lynx/venv/
src/lynx/out/
src/lynx/build/
platforms/*/build/
platforms/*/out/

# Build outputs
dist/
build/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log
EOF
fi

echo "✅ Lynx 프레임워크 설정이 완료되었습니다!"
echo ""
echo "📋 다음 단계:"
echo "1. .env 파일에서 플랫폼 설정 (ENABLE_IOS, ENABLE_ANDROID)"
echo "2. npm run dev:lynx 로 개발 서버 시작"
echo "3. npm run build:all 로 모든 플랫폼 빌드"
echo ""
echo "🚀 Lynx 앱 개발을 시작하세요!"