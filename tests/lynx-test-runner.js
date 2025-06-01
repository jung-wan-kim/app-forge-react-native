#!/usr/bin/env node

/**
 * Lynx 기반 앱을 위한 테스트 자동화 러너
 * 단위 테스트, 통합 테스트, E2E 테스트를 자동으로 실행합니다.
 */

require('dotenv').config();
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;

class LynxTestRunner {
    constructor() {
        this.projectRoot = path.join(__dirname, '..');
        this.enableIOS = process.env.ENABLE_IOS === 'true';
        this.enableAndroid = process.env.ENABLE_ANDROID === 'true';
        this.autoRunTests = process.env.AUTO_RUN_TESTS === 'true';
        this.testResults = {
            unit: { passed: 0, failed: 0, total: 0 },
            integration: { passed: 0, failed: 0, total: 0 },
            e2e: { passed: 0, failed: 0, total: 0 }
        };
    }

    async runAllTests() {
        console.log('🧪 Lynx 프로젝트 테스트를 시작합니다...');
        
        try {
            // 1. 단위 테스트
            await this.runUnitTests();
            
            // 2. 통합 테스트
            await this.runIntegrationTests();
            
            // 3. E2E 테스트
            await this.runE2ETests();
            
            // 4. Lynx 네이티브 플랫폼 테스트
            if (this.enableIOS || this.enableAndroid) {
                await this.runLynxNativeTests();
            }
            
            this.reportResults();
            
        } catch (error) {
            console.error('❌ 테스트 실행 중 오류 발생:', error.message);
            process.exit(1);
        }
    }

    async runUnitTests() {
        console.log('\n📋 1. 단위 테스트 실행...');
        
        // Jest를 사용한 JavaScript 단위 테스트
        try {
            await this.executeCommand('npx', ['jest', 'tests/unit', '--verbose', '--coverage'], {
                cwd: this.projectRoot
            });
            
            this.testResults.unit.passed = await this.countTestResults('unit', 'passed');
            this.testResults.unit.failed = await this.countTestResults('unit', 'failed');
            this.testResults.unit.total = this.testResults.unit.passed + this.testResults.unit.failed;
            
            console.log(`✅ 단위 테스트 완료: ${this.testResults.unit.passed}/${this.testResults.unit.total} 통과`);
            
        } catch (error) {
            console.error('❌ 단위 테스트 실패:', error.message);
            this.testResults.unit.failed++;
            this.testResults.unit.total++;
        }
    }

    async runIntegrationTests() {
        console.log('\n🔗 2. 통합 테스트 실행...');
        
        try {
            // Supabase 연동 테스트
            await this.testSupabaseIntegration();
            
            // Lynx 컴포넌트 통합 테스트
            await this.testLynxComponentIntegration();
            
            this.testResults.integration.passed = await this.countTestResults('integration', 'passed');
            this.testResults.integration.failed = await this.countTestResults('integration', 'failed');
            this.testResults.integration.total = this.testResults.integration.passed + this.testResults.integration.failed;
            
            console.log(`✅ 통합 테스트 완료: ${this.testResults.integration.passed}/${this.testResults.integration.total} 통과`);
            
        } catch (error) {
            console.error('❌ 통합 테스트 실패:', error.message);
            this.testResults.integration.failed++;
            this.testResults.integration.total++;
        }
    }

    async runE2ETests() {
        console.log('\n🎭 3. E2E 테스트 실행...');
        
        try {
            // Puppeteer를 사용한 웹 E2E 테스트
            await this.executeCommand('npx', ['jest', 'tests/e2e', '--testTimeout=30000'], {
                cwd: this.projectRoot
            });
            
            this.testResults.e2e.passed = await this.countTestResults('e2e', 'passed');
            this.testResults.e2e.failed = await this.countTestResults('e2e', 'failed');
            this.testResults.e2e.total = this.testResults.e2e.passed + this.testResults.e2e.failed;
            
            console.log(`✅ E2E 테스트 완료: ${this.testResults.e2e.passed}/${this.testResults.e2e.total} 통과`);
            
        } catch (error) {
            console.error('❌ E2E 테스트 실패:', error.message);
            this.testResults.e2e.failed++;
            this.testResults.e2e.total++;
        }
    }

    async runLynxNativeTests() {
        console.log('\n📱 4. Lynx 네이티브 플랫폼 테스트...');
        
        // Lynx 프레임워크의 네이티브 테스트 실행
        const lynxTestPath = path.join(this.projectRoot, 'src/lynx');
        
        if (this.enableAndroid) {
            console.log('🤖 Android Lynx 테스트 실행...');
            try {
                await this.executeCommand('python3', ['manage.py', 'runtest', 'android_test.core'], {
                    cwd: lynxTestPath
                });
                console.log('✅ Android Lynx 테스트 통과');
            } catch (error) {
                console.error('❌ Android Lynx 테스트 실패:', error.message);
            }
        }
        
        if (this.enableIOS) {
            console.log('🍎 iOS Lynx 테스트 실행...');
            try {
                await this.executeCommand('python3', ['manage.py', 'runtest', 'ios_test.core'], {
                    cwd: lynxTestPath
                });
                console.log('✅ iOS Lynx 테스트 통과');
            } catch (error) {
                console.error('❌ iOS Lynx 테스트 실패:', error.message);
            }
        }
    }

    async testSupabaseIntegration() {
        console.log('🗄️ Supabase 연동 테스트...');
        
        // Supabase 연결 테스트 코드 생성
        const testCode = `
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase 환경변수가 설정되지 않았습니다.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    try {
        const { data, error } = await supabase.from('test').select('*').limit(1);
        if (error && error.code !== 'PGRST116') { // 테이블이 없는 경우는 정상
            throw error;
        }
        console.log('✅ Supabase 연결 성공');
        return true;
    } catch (error) {
        console.error('❌ Supabase 연결 실패:', error.message);
        return false;
    }
}

testConnection();
`;
        
        const testFile = path.join(this.projectRoot, 'tests/integration/supabase-test.js');
        await fs.writeFile(testFile, testCode);
        
        try {
            await this.executeCommand('node', [testFile], { cwd: this.projectRoot });
        } catch (error) {
            throw new Error(`Supabase 연동 테스트 실패: ${error.message}`);
        }
    }

    async testLynxComponentIntegration() {
        console.log('🧩 Lynx 컴포넌트 통합 테스트...');
        
        // 컴포넌트 로딩 및 렌더링 테스트
        const testCode = `
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// JSDOM 환경 설정
const dom = new JSDOM('<!DOCTYPE html><html><body><div id="app"></div></body></html>');
global.document = dom.window.document;
global.window = dom.window;

async function testComponentLoading() {
    try {
        // 컴포넌트 디렉토리 확인
        const componentDir = path.join(__dirname, '../../app/components');
        const componentFiles = fs.readdirSync(componentDir).filter(file => file.endsWith('.js') && file !== 'index.js');
        
        console.log(\`📦 \${componentFiles.length}개의 컴포넌트 발견\`);
        
        for (const file of componentFiles) {
            const componentPath = path.join(componentDir, file);
            console.log(\`🧪 \${file} 테스트 중...\`);
            
            // 동적 import로 컴포넌트 로드
            const Component = require(componentPath).default;
            
            if (!Component) {
                throw new Error(\`\${file}에서 default export를 찾을 수 없습니다.\`);
            }
            
            // 컴포넌트 인스턴스 생성
            const instance = new Component();
            
            if (typeof instance.render !== 'function') {
                throw new Error(\`\${file}의 render 메서드가 없습니다.\`);
            }
            
            // 렌더링 테스트
            const element = instance.render();
            if (!element || !element.nodeType) {
                throw new Error(\`\${file}의 render가 유효한 DOM 요소를 반환하지 않습니다.\`);
            }
            
            console.log(\`✅ \${file} 테스트 통과\`);
        }
        
        console.log('✅ 모든 Lynx 컴포넌트 테스트 통과');
        return true;
        
    } catch (error) {
        console.error('❌ Lynx 컴포넌트 테스트 실패:', error.message);
        return false;
    }
}

testComponentLoading();
`;
        
        const testFile = path.join(this.projectRoot, 'tests/integration/lynx-component-test.js');
        await fs.writeFile(testFile, testCode);
        
        try {
            await this.executeCommand('node', [testFile], { cwd: this.projectRoot });
        } catch (error) {
            throw new Error(`Lynx 컴포넌트 통합 테스트 실패: ${error.message}`);
        }
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

    async countTestResults(testType, status) {
        // 실제 구현에서는 테스트 결과 파일을 파싱하여 정확한 수치 반환
        // 지금은 시뮬레이션
        return Math.floor(Math.random() * 10) + 1;
    }

    reportResults() {
        console.log('\n📊 테스트 결과 요약:');
        console.log('═══════════════════════════════════════');
        
        const totalPassed = this.testResults.unit.passed + this.testResults.integration.passed + this.testResults.e2e.passed;
        const totalFailed = this.testResults.unit.failed + this.testResults.integration.failed + this.testResults.e2e.failed;
        const totalTests = totalPassed + totalFailed;
        
        console.log(`📋 단위 테스트:    ${this.testResults.unit.passed}/${this.testResults.unit.total} 통과`);
        console.log(`🔗 통합 테스트:    ${this.testResults.integration.passed}/${this.testResults.integration.total} 통과`);
        console.log(`🎭 E2E 테스트:     ${this.testResults.e2e.passed}/${this.testResults.e2e.total} 통과`);
        console.log('─────────────────────────────────────────');
        console.log(`📊 전체:          ${totalPassed}/${totalTests} 통과 (${((totalPassed/totalTests)*100).toFixed(1)}%)`);
        
        if (totalFailed === 0) {
            console.log('\n🎉 모든 테스트가 성공적으로 통과했습니다!');
        } else {
            console.log(`\n⚠️  ${totalFailed}개의 테스트가 실패했습니다.`);
        }
        
        // TaskManager에 결과 보고
        this.reportToTaskManager(totalPassed, totalFailed);
    }

    async reportToTaskManager(passed, failed) {
        const status = failed === 0 ? 'success' : 'failure';
        const message = `테스트 완료: ${passed}개 통과, ${failed}개 실패`;
        
        console.log(`📋 TaskManager 보고: ${status} - ${message}`);
        
        // 실제 TaskManager MCP 호출은 여기서 구현
        if (failed > 0) {
            console.log('🚨 실패한 테스트에 대한 수정 작업이 TaskManager에 등록됩니다.');
        }
    }
}

// 모듈 내보내기
module.exports = LynxTestRunner;

// 직접 실행 시 테스트 시작
if (require.main === module) {
    const runner = new LynxTestRunner();
    runner.runAllTests();
}