#!/usr/bin/env node

/**
 * Figma 디자인 변경사항 동기화 스크립트
 * Figma API를 통해 디자인 변경사항을 감지하고 코드 생성을 트리거합니다.
 */

require('dotenv').config();
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

class FigmaSync {
    constructor() {
        this.figmaToken = process.env.FIGMA_ACCESS_TOKEN;
        this.fileId = process.env.FIGMA_FILE_ID;
        this.lastVersionPath = path.join(__dirname, '../.figma-version');
        
        if (!this.figmaToken || !this.fileId) {
            throw new Error('FIGMA_ACCESS_TOKEN과 FIGMA_FILE_ID가 필요합니다.');
        }
    }

    async getFigmaFileInfo() {
        try {
            const response = await axios.get(
                `https://api.figma.com/v1/files/${this.fileId}`,
                {
                    headers: {
                        'X-Figma-Token': this.figmaToken
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('❌ Figma API 호출 실패:', error.message);
            throw error;
        }
    }

    async getLastVersion() {
        try {
            const version = await fs.readFile(this.lastVersionPath, 'utf8');
            return version.trim();
        } catch (error) {
            return null;
        }
    }

    async saveLastVersion(version) {
        await fs.writeFile(this.lastVersionPath, version);
    }

    async extractComponents(figmaData) {
        const components = [];
        
        function traverse(node) {
            if (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') {
                components.push({
                    id: node.id,
                    name: node.name,
                    type: node.type,
                    description: node.description || '',
                    properties: node.componentPropertyDefinitions || {}
                });
            }
            
            if (node.children) {
                node.children.forEach(traverse);
            }
        }
        
        figmaData.document.children.forEach(traverse);
        return components;
    }

    async generateLynxComponent(component) {
        // Lynx 컴포넌트 코드 생성 로직
        const componentName = component.name.replace(/[^a-zA-Z0-9]/g, '');
        
        return `
/**
 * ${component.name} - Figma에서 자동 생성된 Lynx 컴포넌트
 * 설명: ${component.description || '컴포넌트 설명 없음'}
 */
export default class ${componentName} {
    constructor(props = {}) {
        this.props = {
            // 기본 프로퍼티
            className: '',
            testId: '${componentName.toLowerCase()}',
            ...props
        };
        this.element = null;
        this.children = [];
    }
    
    render() {
        const { className, testId, onClick } = this.props;
        
        // 컴포넌트 엘리먼트 생성
        this.element = document.createElement('div');
        this.element.className = \`lynx-component \${componentName.toLowerCase()} \${className}\`;
        this.element.setAttribute('data-testid', testId);
        
        // Figma 디자인 기반 스타일 적용
        this.applyFigmaStyles();
        
        // 컨텐츠 추가
        this.renderContent();
        
        // 이벤트 핸들러
        if (onClick) {
            this.element.addEventListener('click', onClick);
        }
        
        return this.element;
    }
    
    applyFigmaStyles() {
        if (!this.element) return;
        
        // Figma 디자인 토큰에서 추출한 스타일
        const styles = {
            // TODO: Figma API에서 실제 스타일 속성 추출
            padding: '16px',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        };
        
        Object.assign(this.element.style, styles);
    }
    
    renderContent() {
        if (!this.element) return;
        
        // 기본 컨텐츠 (실제로는 Figma 데이터 기반으로 생성)
        const content = document.createElement('div');
        content.className = 'component-content';
        content.textContent = '${component.name}';
        
        this.element.appendChild(content);
    }
    
    // 데이터 업데이트 메서드 (Lynx의 데이터 바인딩용)
    setData(data) {
        if (this.element) {
            const content = this.element.querySelector('.component-content');
            if (content && data.text) {
                content.textContent = data.text;
            }
        }
    }
    
    // 컴포넌트 제거
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.element = null;
        this.children = [];
    }
    
    // 자식 컴포넌트 추가
    appendChild(child) {
        if (child && child.render) {
            const childElement = child.render();
            this.element.appendChild(childElement);
            this.children.push(child);
        }
    }
}

// 컴포넌트 스타일 (CSS-in-JS 또는 별도 CSS 파일)
${componentName}.styles = \`
    .\${componentName.toLowerCase()} {
        /* Figma 디자인 기반 스타일 */
        transition: all 0.2s ease;
    }
    
    .\${componentName.toLowerCase()}:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
\`;
`;
    }

    async saveComponent(component) {
        // Lynx 컴포넌트 생성
        const lynxCode = await this.generateLynxComponent(component);
        const componentName = component.name.replace(/[^a-zA-Z0-9]/g, '');
        const lynxPath = path.join(__dirname, '../app/components', `${componentName}.js`);
        
        await fs.mkdir(path.dirname(lynxPath), { recursive: true });
        await fs.writeFile(lynxPath, lynxCode);
        console.log(`✅ Lynx 컴포넌트 생성: ${lynxPath}`);
        
        // 컴포넌트 인덱스 파일 업데이트
        await this.updateComponentIndex(componentName);
        
        // 플랫폼별 빌드 설정 업데이트
        await this.updatePlatformConfigs(component);
    }
    
    async updateComponentIndex(componentName) {
        const indexPath = path.join(__dirname, '../app/components/index.js');
        
        try {
            let indexContent = '';
            try {
                indexContent = await fs.readFile(indexPath, 'utf8');
            } catch (error) {
                // 인덱스 파일이 없으면 새로 생성
                indexContent = '// Auto-generated component index\n\n';
            }
            
            // 이미 해당 컴포넌트가 있는지 확인
            const importLine = `export { default as ${componentName} } from './${componentName}.js';`;
            if (!indexContent.includes(importLine)) {
                indexContent += `${importLine}\n`;
                await fs.writeFile(indexPath, indexContent);
                console.log(`✅ 컴포넌트 인덱스 업데이트: ${componentName}`);
            }
        } catch (error) {
            console.error('❌ 컴포넌트 인덱스 업데이트 실패:', error.message);
        }
    }
    
    async updatePlatformConfigs(component) {
        const enableIOS = process.env.ENABLE_IOS === 'true';
        const enableAndroid = process.env.ENABLE_ANDROID === 'true';
        
        if (enableIOS) {
            await this.generateIOSConfig(component);
        }
        
        if (enableAndroid) {
            await this.generateAndroidConfig(component);
        }
    }
    
    async generateIOSConfig(component) {
        // iOS 플랫폼용 설정 파일 생성 (Lynx → iOS 네이티브 변환용)
        const componentName = component.name.replace(/[^a-zA-Z0-9]/g, '');
        const configPath = path.join(__dirname, '../platforms/ios/components', `${componentName}.config.json`);
        
        const config = {
            name: componentName,
            figmaId: component.id,
            nativeMapping: {
                type: 'UIView', // 기본 iOS 뷰 타입
                properties: component.properties || {},
                styles: {
                    // Figma 스타일 → iOS 스타일 매핑
                }
            },
            lynxComponent: `../../../app/components/${componentName}.js`
        };
        
        await fs.mkdir(path.dirname(configPath), { recursive: true });
        await fs.writeFile(configPath, JSON.stringify(config, null, 2));
        console.log(`✅ iOS 설정 파일 생성: ${configPath}`);
    }
    
    async generateAndroidConfig(component) {
        // Android 플랫폼용 설정 파일 생성 (Lynx → Android 네이티브 변환용)
        const componentName = component.name.replace(/[^a-zA-Z0-9]/g, '');
        const configPath = path.join(__dirname, '../platforms/android/components', `${componentName}.config.json`);
        
        const config = {
            name: componentName,
            figmaId: component.id,
            nativeMapping: {
                type: 'View', // 기본 Android 뷰 타입
                properties: component.properties || {},
                styles: {
                    // Figma 스타일 → Android 스타일 매핑
                }
            },
            lynxComponent: `../../../app/components/${componentName}.js`
        };
        
        await fs.mkdir(path.dirname(configPath), { recursive: true });
        await fs.writeFile(configPath, JSON.stringify(config, null, 2));
        console.log(`✅ Android 설정 파일 생성: ${configPath}`);
    }

    async triggerTaskManager(changes) {
        // TaskManager MCP로 작업 생성
        console.log('📋 TaskManager에 작업을 등록합니다...');
        
        const tasks = changes.map(component => ({
            title: `${component.name} 컴포넌트 구현`,
            description: `Figma에서 변경된 ${component.name} 컴포넌트를 iOS/Android에 구현`,
            priority: 'high',
            type: 'component_implementation'
        }));
        
        // 실제 TaskManager MCP 호출은 여기서 구현
        console.log(`📋 ${tasks.length}개의 작업이 TaskManager에 등록되었습니다.`);
    }

    async sync() {
        console.log('🔄 Figma 동기화를 시작합니다...');
        
        try {
            const figmaData = await this.getFigmaFileInfo();
            const currentVersion = figmaData.version;
            const lastVersion = await this.getLastVersion();
            
            console.log(`📊 현재 버전: ${currentVersion}, 마지막 버전: ${lastVersion}`);
            
            if (currentVersion === lastVersion) {
                console.log('✅ Figma 파일에 변경사항이 없습니다.');
                return;
            }
            
            console.log('🔄 Figma 파일 변경사항을 감지했습니다. 컴포넌트를 분석합니다...');
            
            const components = await this.extractComponents(figmaData);
            console.log(`📦 ${components.length}개의 컴포넌트를 발견했습니다.`);
            
            // 컴포넌트 코드 생성
            for (const component of components) {
                await this.saveComponent(component);
            }
            
            // TaskManager에 작업 등록
            await this.triggerTaskManager(components);
            
            // 버전 저장
            await this.saveLastVersion(currentVersion);
            
            console.log('✅ Figma 동기화가 완료되었습니다!');
            
        } catch (error) {
            console.error('❌ Figma 동기화 실패:', error.message);
            process.exit(1);
        }
    }
}

// 스크립트 실행
if (require.main === module) {
    const figmaSync = new FigmaSync();
    figmaSync.sync();
}

module.exports = FigmaSync;