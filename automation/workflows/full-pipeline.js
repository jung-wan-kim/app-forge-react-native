#!/usr/bin/env node

/**
 * App Forge 전체 파이프라인 실행 스크립트
 * Figma 동기화부터 배포까지의 전체 워크플로우를 자동화합니다.
 */

require('dotenv').config();
const { spawn } = require('child_process');
const path = require('path');

class FullPipeline {
    constructor() {
        this.enableIOS = process.env.ENABLE_IOS === 'true';
        this.enableAndroid = process.env.ENABLE_ANDROID === 'true';
        this.environment = process.env.NODE_ENV || 'development';
        this.startTime = Date.now();
    }

    async run() {
        console.log('🚀 App Forge 전체 파이프라인을 시작합니다...');
        console.log(`📊 환경: ${this.environment}`);
        console.log(`🍎 iOS: ${this.enableIOS ? '활성화' : '비활성화'}`);
        console.log(`🤖 Android: ${this.enableAndroid ? '활성화' : '비활성화'}`);
        
        try {
            // 1. Figma 동기화
            await this.syncFigma();
            
            // 2. 의존성 설치
            await this.installDependencies();
            
            // 3. 코드 품질 검사
            await this.runCodeQuality();
            
            // 4. 테스트 실행
            await this.runTests();
            
            // 5. 빌드
            await this.buildApps();
            
            // 6. 배포 (production 환경에서만)
            if (this.environment === 'production') {
                await this.deployApps();
            }
            
            this.reportSuccess();
            
        } catch (error) {
            this.reportFailure(error);
            process.exit(1);
        }
    }

    async syncFigma() {
        console.log('\n📐 1. Figma 디자인 동기화...');
        return this.executeCommand('node', [path.join(__dirname, '../../scripts/figma-sync.js')]);
    }

    async installDependencies() {
        console.log('\n📦 2. 의존성 설치...');
        
        // Node.js 의존성
        await this.executeCommand('npm', ['install']);
        
        // iOS 의존성
        if (this.enableIOS) {
            console.log('🍎 iOS 의존성 설치...');
            await this.executeCommand('pod', ['install'], { cwd: path.join(process.cwd(), 'ios') });
        }
        
        // Android 의존성은 Gradle이 자동으로 처리
        if (this.enableAndroid) {
            console.log('🤖 Android Gradle 동기화...');
            await this.executeCommand('./gradlew', ['dependencies'], { cwd: path.join(process.cwd(), 'android') });
        }
    }

    async runCodeQuality() {
        console.log('\n🔍 3. 코드 품질 검사...');
        
        // ESLint
        await this.executeCommand('npx', ['eslint', '.', '--ext', '.js,.ts']);
        
        // Prettier
        await this.executeCommand('npx', ['prettier', '--check', '.']);
        
        // iOS SwiftLint (설치되어 있는 경우)
        if (this.enableIOS) {
            try {
                await this.executeCommand('swiftlint', ['lint'], { cwd: path.join(process.cwd(), 'ios') });
            } catch (error) {
                console.log('⚠️  SwiftLint가 설치되어 있지 않습니다. 건너뜁니다.');
            }
        }
        
        // Android Ktlint (설정되어 있는 경우)
        if (this.enableAndroid) {
            try {
                await this.executeCommand('./gradlew', ['ktlintCheck'], { cwd: path.join(process.cwd(), 'android') });
            } catch (error) {
                console.log('⚠️  Ktlint가 설정되어 있지 않습니다. 건너뜁니다.');
            }
        }
    }

    async runTests() {
        console.log('\n🧪 4. 테스트 실행...');
        
        const testPromises = [];
        
        // Node.js 테스트
        testPromises.push(this.executeCommand('npm', ['test']));
        
        // iOS 테스트
        if (this.enableIOS) {
            testPromises.push(this.executeCommand('npm', ['run', 'test:ios']));
        }
        
        // Android 테스트
        if (this.enableAndroid) {
            testPromises.push(this.executeCommand('npm', ['run', 'test:android']));
        }
        
        // E2E 테스트
        testPromises.push(this.executeCommand('npm', ['run', 'test:e2e']));
        
        await Promise.all(testPromises);
    }

    async buildApps() {
        console.log('\n🔨 5. 앱 빌드...');
        
        const buildPromises = [];
        
        // iOS 빌드
        if (this.enableIOS) {
            console.log('🍎 iOS 빌드 시작...');
            buildPromises.push(this.executeCommand('npm', ['run', 'build:ios']));
        }
        
        // Android 빌드
        if (this.enableAndroid) {
            console.log('🤖 Android 빌드 시작...');
            buildPromises.push(this.executeCommand('npm', ['run', 'build:android']));
        }
        
        await Promise.all(buildPromises);
    }

    async deployApps() {
        console.log('\n🚀 6. 앱 배포...');
        
        const deployPromises = [];
        
        // iOS 배포 (TestFlight)
        if (this.enableIOS) {
            console.log('🍎 iOS TestFlight 배포...');
            deployPromises.push(this.executeCommand('npm', ['run', 'deploy:ios']));
        }
        
        // Android 배포 (Play Console)
        if (this.enableAndroid) {
            console.log('🤖 Android Play Console 배포...');
            deployPromises.push(this.executeCommand('npm', ['run', 'deploy:android']));
        }
        
        await Promise.all(deployPromises);
    }

    async executeCommand(command, args = [], options = {}) {
        return new Promise((resolve, reject) => {
            console.log(`🔧 실행: ${command} ${args.join(' ')}`);
            
            const process = spawn(command, args, {
                stdio: 'inherit',
                ...options
            });
            
            process.on('close', (code) => {
                if (code === 0) {
                    resolve();
                } else {
                    reject(new Error(`${command} 명령어 실패 (코드: ${code})`));
                }
            });
            
            process.on('error', (error) => {
                reject(error);
            });
        });
    }

    reportSuccess() {
        const duration = ((Date.now() - this.startTime) / 1000 / 60).toFixed(2);
        
        console.log('\n✅ 전체 파이프라인이 성공적으로 완료되었습니다!');
        console.log(`⏱️  소요시간: ${duration}분`);
        
        if (this.environment === 'production') {
            console.log('🎉 앱이 성공적으로 배포되었습니다!');
        }
        
        // TaskManager에 성공 보고
        this.notifyTaskManager('success', `파이프라인 성공 완료 (${duration}분 소요)`);
    }

    reportFailure(error) {
        const duration = ((Date.now() - this.startTime) / 1000 / 60).toFixed(2);
        
        console.error('\n❌ 파이프라인 실행 중 오류가 발생했습니다:');
        console.error(error.message);
        console.log(`⏱️  실행시간: ${duration}분`);
        
        // TaskManager에 실패 보고
        this.notifyTaskManager('failure', `파이프라인 실패: ${error.message}`);
    }

    async notifyTaskManager(status, message) {
        // TaskManager MCP에 파이프라인 결과 알림
        console.log(`📋 TaskManager 알림: ${status} - ${message}`);
        
        // Slack/이메일 알림
        if (process.env.SLACK_WEBHOOK_URL) {
            const emoji = status === 'success' ? '✅' : '❌';
            console.log(`📢 Slack 알림 전송: ${emoji} ${message}`);
        }
    }
}

// 스크립트 실행
if (require.main === module) {
    const pipeline = new FullPipeline();
    pipeline.run();
}

module.exports = FullPipeline;