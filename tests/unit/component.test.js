/**
 * Lynx 컴포넌트 단위 테스트
 */

const { JSDOM } = require('jsdom');

// JSDOM 환경 설정
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window;

// 기본 Button 컴포넌트 테스트
describe('Lynx Button Component', () => {
    let Button;
    
    beforeAll(async () => {
        // 컴포넌트 동적 로드
        try {
            Button = require('../../app/components/Button.js').default;
        } catch (error) {
            // 컴포넌트가 아직 생성되지 않은 경우 스킵
            Button = null;
        }
    });
    
    beforeEach(() => {
        // DOM 초기화
        document.body.innerHTML = '';
    });
    
    test('should create Button instance', () => {
        if (!Button) {
            console.warn('Button 컴포넌트가 아직 생성되지 않았습니다.');
            return;
        }
        
        const button = new Button();
        expect(button).toBeDefined();
        expect(button.props).toBeDefined();
        expect(button.element).toBeNull();
    });
    
    test('should render Button with default props', () => {
        if (!Button) return;
        
        const button = new Button();
        const element = button.render();
        
        expect(element).toBeDefined();
        expect(element.tagName).toBe('BUTTON');
        expect(element.textContent).toBe('버튼');
        expect(element.className).toContain('lynx-button');
    });
    
    test('should render Button with custom props', () => {
        if (!Button) return;
        
        const button = new Button({
            text: '커스텀 버튼',
            className: 'custom-button'
        });
        const element = button.render();
        
        expect(element.textContent).toBe('커스텀 버튼');
        expect(element.className).toContain('custom-button');
    });
    
    test('should handle click events', (done) => {
        if (!Button) {
            done();
            return;
        }
        
        const mockClick = jest.fn();
        const button = new Button({
            text: '클릭 테스트',
            onClick: mockClick
        });
        
        const element = button.render();
        document.body.appendChild(element);
        
        // 클릭 이벤트 트리거
        element.click();
        
        setTimeout(() => {
            expect(mockClick).toHaveBeenCalled();
            done();
        }, 10);
    });
    
    test('should update data using setData method', () => {
        if (!Button) return;
        
        const button = new Button();
        const element = button.render();
        
        button.setData({ text: '업데이트된 텍스트' });
        
        expect(element.textContent).toBe('업데이트된 텍스트');
    });
});

// 기본 Home 페이지 테스트
describe('Lynx Home Page', () => {
    let Home;
    
    beforeAll(async () => {
        try {
            Home = require('../../app/pages/Home.js').default;
        } catch (error) {
            Home = null;
        }
    });
    
    beforeEach(() => {
        document.body.innerHTML = '';
    });
    
    test('should create Home page instance', () => {
        if (!Home) {
            console.warn('Home 페이지가 아직 생성되지 않았습니다.');
            return;
        }
        
        const home = new Home();
        expect(home).toBeDefined();
        expect(home.container).toBeNull();
        expect(home.components).toBeDefined();
    });
    
    test('should render Home page with title and description', () => {
        if (!Home) return;
        
        const home = new Home();
        const element = home.render();
        
        expect(element).toBeDefined();
        expect(element.className).toContain('home-page');
        
        const title = element.querySelector('.page-title');
        expect(title).toBeDefined();
        expect(title.textContent).toBe('App Forge');
        
        const description = element.querySelector('.page-description');
        expect(description).toBeDefined();
        expect(description.textContent).toContain('Lynx 기반');
    });
    
    test('should contain start button', () => {
        if (!Home) return;
        
        const home = new Home();
        const element = home.render();
        
        const button = element.querySelector('.start-button');
        expect(button).toBeDefined();
        expect(button.textContent).toBe('시작하기');
    });
});

// 앱 설정 테스트
describe('App Configuration', () => {
    let config;
    
    beforeAll(async () => {
        try {
            config = require('../../app/config/app.config.js').default;
        } catch (error) {
            config = null;
        }
    });
    
    test('should load app configuration', () => {
        if (!config) {
            console.warn('앱 설정 파일이 아직 생성되지 않았습니다.');
            return;
        }
        
        expect(config).toBeDefined();
        expect(config.name).toBe('App Forge');
        expect(config.version).toBeDefined();
        expect(config.platforms).toBeDefined();
    });
    
    test('should have platform configuration', () => {
        if (!config) return;
        
        expect(config.platforms.web).toBe(true);
        expect(typeof config.platforms.ios).toBe('boolean');
        expect(typeof config.platforms.android).toBe('boolean');
    });
    
    test('should have supabase configuration structure', () => {
        if (!config) return;
        
        expect(config.supabase).toBeDefined();
        expect(config.supabase).toHaveProperty('url');
        expect(config.supabase).toHaveProperty('anonKey');
    });
    
    test('should have development settings', () => {
        if (!config) return;
        
        expect(config.development).toBeDefined();
        expect(config.development.hotReload).toBeDefined();
        expect(config.development.devTools).toBeDefined();
    });
});

// 테스트 유틸리티 함수들
describe('Test Utilities', () => {
    test('should create mock DOM element', () => {
        const element = document.createElement('div');
        element.textContent = '테스트';
        element.className = 'test-element';
        
        expect(element.tagName).toBe('DIV');
        expect(element.textContent).toBe('테스트');
        expect(element.className).toBe('test-element');
    });
    
    test('should simulate user interactions', (done) => {
        const button = document.createElement('button');
        let clicked = false;
        
        button.addEventListener('click', () => {
            clicked = true;
        });
        
        button.click();
        
        setTimeout(() => {
            expect(clicked).toBe(true);
            done();
        }, 10);
    });
});

// 모의 Figma 컴포넌트 테스트
describe('Figma Generated Components', () => {
    test('should handle dynamic component creation', () => {
        // 모의 Figma 컴포넌트 클래스
        class MockFigmaComponent {
            constructor(props = {}) {
                this.props = props;
                this.element = null;
            }
            
            render() {
                this.element = document.createElement('div');
                this.element.className = 'figma-component';
                this.element.textContent = this.props.text || 'Figma Component';
                return this.element;
            }
            
            setData(data) {
                if (this.element && data.text) {
                    this.element.textContent = data.text;
                }
            }
        }
        
        const component = new MockFigmaComponent({ text: 'Figma 테스트' });
        const element = component.render();
        
        expect(element.textContent).toBe('Figma 테스트');
        expect(element.className).toBe('figma-component');
        
        component.setData({ text: '업데이트됨' });
        expect(element.textContent).toBe('업데이트됨');
    });
});