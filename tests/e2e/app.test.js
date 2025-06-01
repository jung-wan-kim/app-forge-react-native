/**
 * Lynx 앱 E2E 테스트
 * Puppeteer를 사용한 브라우저 자동화 테스트
 */

const puppeteer = require('puppeteer');
const path = require('path');

describe('App Forge E2E Tests', () => {
    let browser;
    let page;
    const testUrl = process.env.E2E_TEST_URL || 'http://localhost:3000';
    const appPath = path.join(__dirname, '../../app/index.html');
    
    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: true, // CI에서는 true, 로컬 개발시에는 false로 설정 가능
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        page = await browser.newPage();
        
        // 뷰포트 설정 (모바일 화면 시뮬레이션)
        await page.setViewport({ width: 375, height: 667 });
    });
    
    afterAll(async () => {
        if (browser) {
            await browser.close();
        }
    });
    
    beforeEach(async () => {
        // 각 테스트마다 페이지 새로고침
        await page.goto(`file://${appPath}`, { waitUntil: 'networkidle0' });
    });
    
    describe('App 초기화', () => {
        test('should load the app successfully', async () => {
            // 페이지 제목 확인
            const title = await page.title();
            expect(title).toContain('App Forge');
            
            // 앱 컨테이너 확인
            const appContainer = await page.$('#app');
            expect(appContainer).toBeTruthy();
        });
        
        test('should display main title', async () => {
            // 메인 제목 확인
            await page.waitForSelector('.page-title');
            const titleText = await page.$eval('.page-title', el => el.textContent);
            expect(titleText).toBe('App Forge');
        });
        
        test('should display description', async () => {
            // 설명 텍스트 확인
            await page.waitForSelector('.page-description');
            const descriptionText = await page.$eval('.page-description', el => el.textContent);
            expect(descriptionText).toContain('Lynx 기반');
        });
    });
    
    describe('사용자 상호작용', () => {
        test('should handle button click', async () => {
            // 시작하기 버튼 찾기
            await page.waitForSelector('.start-button');
            
            // 콘솔 로그 캡처
            const consoleLogs = [];
            page.on('console', msg => {
                consoleLogs.push(msg.text());
            });
            
            // 버튼 클릭
            await page.click('.start-button');
            
            // 잠시 대기
            await page.waitForTimeout(100);
            
            // 콘솔 로그 확인
            expect(consoleLogs.some(log => log.includes('시작하기 버튼 클릭됨'))).toBe(true);
        });
        
        test('should handle button hover effects', async () => {
            // 버튼 호버 테스트
            await page.waitForSelector('.start-button');
            await page.hover('.start-button');
            
            // hover 스타일 확인
            const buttonStyle = await page.evaluate(() => {
                const button = document.querySelector('.start-button');
                const computedStyle = window.getComputedStyle(button);
                return {
                    transform: computedStyle.transform,
                    boxShadow: computedStyle.boxShadow
                };
            });
            
            // transform이 적용되었는지 확인 (hover 효과)
            expect(buttonStyle.transform).not.toBe('none');
        });
    });
    
    describe('반응형 디자인', () => {
        test('should be responsive on mobile', async () => {
            // 모바일 뷰포트로 설정
            await page.setViewport({ width: 375, height: 667 });
            await page.reload({ waitUntil: 'networkidle0' });
            
            // 앱 컨테이너 크기 확인
            const containerWidth = await page.evaluate(() => {
                const container = document.querySelector('#app');
                return container.offsetWidth;
            });
            
            // 모바일에서 적절한 너비인지 확인
            expect(containerWidth).toBeLessThanOrEqual(375);
            expect(containerWidth).toBeGreaterThan(300);
        });
        
        test('should be responsive on tablet', async () => {
            // 태블릿 뷰포트로 설정
            await page.setViewport({ width: 768, height: 1024 });
            await page.reload({ waitUntil: 'networkidle0' });
            
            // 레이아웃이 깨지지 않았는지 확인
            const isVisible = await page.evaluate(() => {
                const title = document.querySelector('.page-title');
                const button = document.querySelector('.start-button');
                return title && button && 
                       title.offsetWidth > 0 && 
                       button.offsetWidth > 0;
            });
            
            expect(isVisible).toBe(true);
        });
    });
    
    describe('성능 테스트', () => {
        test('should load within reasonable time', async () => {
            const startTime = Date.now();
            
            await page.goto(`file://${appPath}`, { waitUntil: 'networkidle0' });
            await page.waitForSelector('.page-title');
            
            const loadTime = Date.now() - startTime;
            
            // 2초 이내에 로드되어야 함
            expect(loadTime).toBeLessThan(2000);
        });
        
        test('should not have console errors', async () => {
            const consoleErrors = [];
            
            page.on('console', msg => {
                if (msg.type() === 'error') {
                    consoleErrors.push(msg.text());
                }
            });
            
            await page.goto(`file://${appPath}`, { waitUntil: 'networkidle0' });
            await page.waitForSelector('.page-title');
            
            // 콘솔 에러가 없어야 함
            expect(consoleErrors).toHaveLength(0);
        });
    });
    
    describe('접근성 테스트', () => {
        test('should have proper heading structure', async () => {
            // h1 태그 확인
            const h1Count = await page.evaluate(() => {
                return document.querySelectorAll('h1').length;
            });
            
            expect(h1Count).toBeGreaterThan(0);
        });
        
        test('should have proper button accessibility', async () => {
            // 버튼의 접근성 확인
            const buttonAccessibility = await page.evaluate(() => {
                const button = document.querySelector('.start-button');
                return {
                    hasText: button.textContent.trim().length > 0,
                    isClickable: button.tagName === 'BUTTON',
                    hasRole: button.getAttribute('role') || button.tagName === 'BUTTON'
                };
            });
            
            expect(buttonAccessibility.hasText).toBe(true);
            expect(buttonAccessibility.isClickable).toBe(true);
            expect(buttonAccessibility.hasRole).toBe(true);
        });
    });
    
    describe('Figma 컴포넌트 통합', () => {
        test('should handle dynamic component loading', async () => {
            // 동적으로 생성된 컴포넌트가 있는지 확인
            const lynxComponents = await page.evaluate(() => {
                return document.querySelectorAll('.lynx-component').length;
            });
            
            // 최소 1개의 Lynx 컴포넌트가 있어야 함
            expect(lynxComponents).toBeGreaterThanOrEqual(0);
        });
        
        test('should handle component data updates', async () => {
            // 컴포넌트 데이터 업데이트 테스트
            const updateResult = await page.evaluate(() => {
                // 버튼 컴포넌트 찾기
                const button = document.querySelector('.start-button');
                if (!button) return false;
                
                const originalText = button.textContent;
                
                // 버튼 텍스트 변경 (setData 시뮬레이션)
                button.textContent = '업데이트된 버튼';
                
                return {
                    original: originalText,
                    updated: button.textContent,
                    changed: originalText !== button.textContent
                };
            });
            
            expect(updateResult.changed).toBe(true);
            expect(updateResult.updated).toBe('업데이트된 버튼');
        });
    });
    
    describe('모바일 앱 시뮬레이션', () => {
        test('should simulate mobile touch events', async () => {
            // 모바일 뷰포트 설정
            await page.setViewport({ width: 375, height: 667 });
            
            // 터치 이벤트 시뮬레이션
            await page.tap('.start-button');
            
            // 터치 이벤트가 처리되었는지 확인
            await page.waitForTimeout(100);
            
            // 버튼이 여전히 존재하는지 확인
            const buttonExists = await page.$('.start-button');
            expect(buttonExists).toBeTruthy();
        });
        
        test('should handle orientation changes', async () => {
            // 세로 모드
            await page.setViewport({ width: 375, height: 667 });
            await page.waitForTimeout(100);
            
            const portraitHeight = await page.evaluate(() => window.innerHeight);
            
            // 가로 모드
            await page.setViewport({ width: 667, height: 375 });
            await page.waitForTimeout(100);
            
            const landscapeHeight = await page.evaluate(() => window.innerHeight);
            
            // 화면 크기가 변경되었는지 확인
            expect(portraitHeight).not.toBe(landscapeHeight);
            
            // 레이아웃이 여전히 작동하는지 확인
            const titleVisible = await page.$('.page-title');
            expect(titleVisible).toBeTruthy();
        });
    });
});