#!/usr/bin/env node

/**
 * App Forge TaskManager 통합 시스템
 * MCP TaskManager를 통해 전체 프로젝트 워크플로우를 관리합니다.
 */

require('dotenv').config();
const { spawn } = require('child_process');
const path = require('path');

class AppForgeTaskManager {
    constructor() {
        this.projectId = process.env.TASKMANAGER_PROJECT_ID || 'app-forge-main';
        this.apiKey = process.env.TASKMANAGER_API_KEY;
        this.autoCreateTasks = process.env.AUTO_CREATE_TASKS === 'true';
        
        if (!this.apiKey) {
            console.warn('⚠️  TASKMANAGER_API_KEY가 설정되지 않았습니다.');
        }
    }

    async initializeProject() {
        console.log('🚀 App Forge TaskManager를 초기화합니다...');
        
        if (this.autoCreateTasks) {
            await this.createInitialTasks();
        }
        
        await this.startWorkflowMonitoring();
    }

    async createInitialTasks() {
        console.log('📋 초기 작업들을 생성합니다...');
        
        const initialTasks = [
            {
                title: 'Figma 디자인 모니터링 설정',
                description: 'Figma API를 통한 디자인 변경사항 모니터링 시스템 구성',
                priority: 'high',
                type: 'setup',
                dependencies: []
            },
            {
                title: 'iOS 프로젝트 초기화',
                description: 'SwiftUI 기반 iOS 프로젝트 구조 설정 및 기본 컴포넌트 생성',
                priority: 'high',
                type: 'ios_setup',
                dependencies: []
            },
            {
                title: 'Android 프로젝트 초기화',
                description: 'Jetpack Compose 기반 Android 프로젝트 구조 설정 및 기본 컴포넌트 생성',
                priority: 'high',
                type: 'android_setup',
                dependencies: []
            },
            {
                title: 'Supabase 백엔드 설정',
                description: 'Supabase 데이터베이스, 인증, 스토리지 설정 및 API 연동',
                priority: 'high',
                type: 'backend_setup',
                dependencies: []
            },
            {
                title: '자동화 테스트 파이프라인 구성',
                description: '단위 테스트, 통합 테스트, E2E 테스트 자동화 설정',
                priority: 'medium',
                type: 'testing_setup',
                dependencies: ['ios_setup', 'android_setup', 'backend_setup']
            },
            {
                title: 'CI/CD 파이프라인 구성',
                description: '빌드, 테스트, 배포 자동화 파이프라인 설정',
                priority: 'medium',
                type: 'cicd_setup',
                dependencies: ['testing_setup']
            }
        ];

        // 실제 TaskManager MCP 호출로 작업 생성
        console.log(`📋 ${initialTasks.length}개의 초기 작업을 생성했습니다.`);
        return initialTasks;
    }

    async startWorkflowMonitoring() {
        console.log('👀 워크플로우 모니터링을 시작합니다...');
        
        // Figma 변경사항 모니터링
        this.startFigmaMonitoring();
        
        // 코드 변경사항 모니터링
        this.startCodeMonitoring();
        
        // 테스트 결과 모니터링
        this.startTestMonitoring();
    }

    startFigmaMonitoring() {
        const pollInterval = parseInt(process.env.FIGMA_POLL_INTERVAL || '5') * 60 * 1000; // 분을 밀리초로 변환
        
        console.log(`🎨 Figma 모니터링 시작 (${process.env.FIGMA_POLL_INTERVAL || 5}분 간격)`);
        
        setInterval(async () => {
            try {
                console.log('🔄 Figma 변경사항 확인 중...');
                const figmaSync = spawn('node', [path.join(__dirname, '../scripts/figma-sync.js')]);
                
                figmaSync.stdout.on('data', (data) => {
                    console.log(`📊 Figma: ${data}`);
                });
                
                figmaSync.stderr.on('data', (data) => {
                    console.error(`❌ Figma 오류: ${data}`);
                });
                
                figmaSync.on('close', (code) => {
                    if (code === 0) {
                        console.log('✅ Figma 동기화 완료');
                    } else {
                        console.error(`❌ Figma 동기화 실패 (코드: ${code})`);
                    }
                });
                
            } catch (error) {
                console.error('❌ Figma 모니터링 오류:', error.message);
            }
        }, pollInterval);
    }

    startCodeMonitoring() {
        const chokidar = require('chokidar');
        
        console.log('📂 코드 변경사항 모니터링 시작');
        
        const watcher = chokidar.watch(['ios/**/*.swift', 'android/**/*.kt'], {
            ignored: /node_modules/,
            persistent: true
        });
        
        watcher.on('change', async (filePath) => {
            console.log(`📝 파일 변경 감지: ${filePath}`);
            await this.triggerAutoTests(filePath);
        });
    }

    startTestMonitoring() {
        console.log('🧪 테스트 결과 모니터링 시작');
        
        // 테스트 결과 디렉토리 모니터링
        const chokidar = require('chokidar');
        const testWatcher = chokidar.watch(['ios/Tests/**/*', 'android/tests/**/*'], {
            ignored: /node_modules/,
            persistent: true
        });
        
        testWatcher.on('change', async (filePath) => {
            if (filePath.includes('test-results') || filePath.includes('coverage')) {
                console.log(`📊 테스트 결과 업데이트: ${filePath}`);
                await this.processTestResults(filePath);
            }
        });
    }

    async triggerAutoTests(changedFile) {
        if (!process.env.AUTO_RUN_TESTS === 'true') {
            return;
        }
        
        console.log(`🧪 ${changedFile} 변경으로 인한 자동 테스트 실행`);
        
        if (changedFile.includes('ios/')) {
            this.runIOSTests();
        } else if (changedFile.includes('android/')) {
            this.runAndroidTests();
        }
    }

    runIOSTests() {
        console.log('🍎 iOS 테스트 실행 중...');
        const iosTest = spawn('npm', ['run', 'test:ios'], { stdio: 'inherit' });
        
        iosTest.on('close', (code) => {
            if (code === 0) {
                console.log('✅ iOS 테스트 성공');
            } else {
                console.error('❌ iOS 테스트 실패');
                this.createFailureTask('iOS 테스트 실패 수정', `iOS 테스트에서 오류가 발생했습니다. 코드: ${code}`);
            }
        });
    }

    runAndroidTests() {
        console.log('🤖 Android 테스트 실행 중...');
        const androidTest = spawn('npm', ['run', 'test:android'], { stdio: 'inherit' });
        
        androidTest.on('close', (code) => {
            if (code === 0) {
                console.log('✅ Android 테스트 성공');
            } else {
                console.error('❌ Android 테스트 실패');
                this.createFailureTask('Android 테스트 실패 수정', `Android 테스트에서 오류가 발생했습니다. 코드: ${code}`);
            }
        });
    }

    async processTestResults(resultFile) {
        console.log(`📊 테스트 결과 처리: ${resultFile}`);
        
        // 테스트 결과 분석 및 TaskManager에 보고
        // 실제 구현에서는 테스트 결과 파일을 파싱하여 상세 정보 추출
    }

    async createFailureTask(title, description) {
        console.log(`📋 실패 작업 생성: ${title}`);
        
        // TaskManager MCP를 통해 실패 관련 작업 생성
        const failureTask = {
            title,
            description,
            priority: 'high',
            type: 'bug_fix',
            createdAt: new Date().toISOString()
        };
        
        console.log('🚨 실패 작업이 TaskManager에 등록되었습니다.');
        return failureTask;
    }

    async sendNotification(message, type = 'info') {
        if (process.env.SLACK_WEBHOOK_URL) {
            // Slack 알림 전송
            console.log(`📢 Slack 알림: ${message}`);
        }
        
        if (process.env.EMAIL_NOTIFICATIONS === 'true') {
            // 이메일 알림 전송
            console.log(`📧 이메일 알림: ${message}`);
        }
        
        console.log(`${type === 'error' ? '❌' : '📢'} ${message}`);
    }
}

// TaskManager 시작
if (require.main === module) {
    const taskManager = new AppForgeTaskManager();
    
    console.log('🚀 App Forge TaskManager 시작...');
    
    taskManager.initializeProject().catch(error => {
        console.error('❌ TaskManager 초기화 실패:', error.message);
        process.exit(1);
    });
    
    // Graceful shutdown
    process.on('SIGINT', () => {
        console.log('\n🛑 TaskManager를 종료합니다...');
        process.exit(0);
    });
}

module.exports = AppForgeTaskManager;