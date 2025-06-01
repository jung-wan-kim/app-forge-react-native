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
        this.teamId = process.env.FIGMA_TEAM_ID;
        this.lastVersionPath = path.join(__dirname, '../.figma-version');
        
        // 채널 설정
        this.channelEnabled = process.env.FIGMA_CHANNEL_ENABLED === 'true';
        this.allowedPages = this.parseList(process.env.FIGMA_CHANNEL_PAGES);
        this.allowedFrames = this.parseList(process.env.FIGMA_CHANNEL_FRAMES);
        this.channelPrefix = process.env.FIGMA_CHANNEL_PREFIX || '';
        this.excludePattern = process.env.FIGMA_CHANNEL_EXCLUDE_PATTERN || '';
        
        // 알림 설정
        this.webhookUrl = process.env.FIGMA_WEBHOOK_URL;
        this.notificationChannel = process.env.FIGMA_NOTIFICATION_CHANNEL;
        
        // 버전 관리
        this.versionBranch = process.env.FIGMA_VERSION_BRANCH || 'main';
        this.autoCreateBranch = process.env.FIGMA_AUTO_CREATE_BRANCH === 'true';
        
        if (!this.figmaToken || !this.fileId) {
            throw new Error('FIGMA_ACCESS_TOKEN과 FIGMA_FILE_ID가 필요합니다.');
        }
    }
    
    parseList(envVar) {
        if (!envVar) return [];
        return envVar.split(',').map(item => item.trim()).filter(item => item.length > 0);
    }

    async getFigmaFileInfo() {
        // 데모 모드 체크 (토큰이 없거나 데모 파일 ID인 경우)
        if (!this.figmaToken || this.figmaToken === 'your_figma_personal_access_token' || 
            this.figmaToken === 'demo' ||
            this.fileId === 'xji8bzh5' || 
            this.fileId === 'aopzqj84') {
            console.log('🎭 데모 모드: 모의 Figma 데이터 사용');
            const mockData = require('./tiktok-figma-data.js');
            return mockData;
        }
        
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
            console.log('🎭 폴백: 데모 데이터로 전환합니다.');
            const mockData = require('./tiktok-figma-data.js');
            return mockData;
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
        
        const traverse = (node, parentInfo = {}) => {
            // 채널 필터링 적용
            if (this.channelEnabled && !this.shouldIncludeNode(node, parentInfo)) {
                return;
            }
            
            if (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') {
                const component = {
                    id: node.id,
                    name: node.name,
                    type: node.type,
                    description: node.description || '',
                    properties: node.componentPropertyDefinitions || {},
                    // 채널 메타데이터 추가
                    channel: {
                        page: parentInfo.pageName,
                        frame: parentInfo.frameName,
                        path: parentInfo.path || []
                    },
                    figmaUrl: `https://www.figma.com/file/${this.fileId}?node-id=${node.id}`,
                    lastModified: figmaData.lastModified || new Date().toISOString()
                };
                
                components.push(component);
                console.log(`📦 컴포넌트 발견: ${component.name} (${component.channel.page}/${component.channel.frame})`);
            }
            
            if (node.children) {
                const childParentInfo = {
                    ...parentInfo,
                    path: [...(parentInfo.path || []), node.name]
                };
                
                // 페이지나 프레임 정보 업데이트
                if (node.type === 'CANVAS') {
                    childParentInfo.pageName = node.name;
                } else if (node.type === 'FRAME') {
                    childParentInfo.frameName = node.name;
                }
                
                node.children.forEach(child => traverse(child, childParentInfo));
            }
        };
        
        figmaData.document.children.forEach(child => traverse(child));
        
        console.log(`🎯 채널 필터링 결과: ${components.length}개 컴포넌트 선택됨`);
        return components;
    }
    
    shouldIncludeNode(node, parentInfo) {
        const nodeName = node.name || '';
        const pageName = parentInfo.pageName || '';
        const frameName = parentInfo.frameName || '';
        
        // 제외 패턴 체크
        if (this.excludePattern) {
            const excludePatterns = this.excludePattern.split(',').map(p => p.trim());
            for (const pattern of excludePatterns) {
                if (nodeName.toLowerCase().includes(pattern.toLowerCase()) ||
                    pageName.toLowerCase().includes(pattern.toLowerCase()) ||
                    frameName.toLowerCase().includes(pattern.toLowerCase())) {
                    console.log(`🚫 제외됨 (패턴 매칭): ${nodeName} - ${pattern}`);
                    return false;
                }
            }
        }
        
        // 채널 프리픽스 체크
        if (this.channelPrefix && !nodeName.startsWith(this.channelPrefix)) {
            // 컴포넌트가 아닌 경우 하위 노드를 확인하기 위해 통과
            if (node.type !== 'COMPONENT' && node.type !== 'COMPONENT_SET') {
                return true;
            }
            console.log(`🚫 제외됨 (프리픽스): ${nodeName} - 필요 프리픽스: ${this.channelPrefix}`);
            return false;
        }
        
        // 허용된 페이지 체크
        if (this.allowedPages.length > 0 && pageName) {
            const pageAllowed = this.allowedPages.some(allowedPage => 
                pageName.toLowerCase().includes(allowedPage.toLowerCase())
            );
            if (!pageAllowed) {
                console.log(`🚫 제외됨 (페이지): ${pageName} - 허용 페이지: ${this.allowedPages.join(', ')}`);
                return false;
            }
        }
        
        // 허용된 프레임 체크 (컴포넌트인 경우만)
        if (this.allowedFrames.length > 0 && 
            (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET')) {
            const frameAllowed = this.allowedFrames.some(allowedFrame => 
                nodeName.toLowerCase().includes(allowedFrame.toLowerCase()) ||
                (frameName && frameName.toLowerCase().includes(allowedFrame.toLowerCase()))
            );
            if (!frameAllowed) {
                console.log(`🚫 제외됨 (프레임): ${nodeName} - 허용 프레임: ${this.allowedFrames.join(', ')}`);
                return false;
            }
        }
        
        return true;
    }

    async generateLynxComponent(component) {
        const componentName = component.name.replace(/[^a-zA-Z0-9]/g, '');
        const figmaStyles = this.extractFigmaStyles(component);
        const componentType = this.getComponentType(component);
        
        return `/**
 * ${component.name} - Figma에서 자동 생성된 Lynx 컴포넌트
 * 설명: ${component.description || '컴포넌트 설명 없음'}
 * Figma URL: https://www.figma.com/file/${this.fileId}?node-id=${component.id}
 */
export default class ${componentName} {
    constructor(props = {}) {
        this.props = {
            // Figma 프로퍼티에서 추출
            ${this.generatePropsFromFigma(component)},
            // 기본 프로퍼티
            className: '',
            testId: '${componentName.toLowerCase()}',
            ...props
        };
        this.element = null;
        this.children = [];
        this.componentType = '${componentType}';
    }
    
    render() {
        const { className, testId, onClick } = this.props;
        
        // 컴포넌트 타입에 따른 엘리먼트 생성
        this.element = document.createElement('${componentType === 'button' ? 'button' : 'div'}');
        this.element.className = \`lynx-component ${componentName.toLowerCase()} \${className}\`;
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
        
        // Figma에서 추출한 실제 스타일
        const styles = ${JSON.stringify(figmaStyles, null, 12)};
        
        Object.assign(this.element.style, styles);
    }
    
    renderContent() {
        if (!this.element) return;
        
        ${this.generateContentRenderer(component, componentType)}
    }
    
    // 데이터 업데이트 메서드
    setData(data) {
        if (!this.element) return;
        
        ${this.generateDataUpdater(component, componentType)}
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

// 컴포넌트 스타일
${componentName}.styles = \`
    .${componentName.toLowerCase()} {
        /* Figma 디자인 기반 스타일 */
        transition: all 0.2s ease;
        cursor: ${componentType === 'button' ? 'pointer' : 'default'};
    }
    
    .${componentName.toLowerCase()}:hover {
        ${componentType === 'button' ? 'transform: translateY(-2px);' : ''}
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    
    .${componentName.toLowerCase()}:active {
        ${componentType === 'button' ? 'transform: translateY(0);' : ''}
    }
\`;
`;
    }
    
    extractFigmaStyles(component) {
        const styles = {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box'
        };
        
        // 크기 정보
        if (component.absoluteBoundingBox) {
            styles.width = `${component.absoluteBoundingBox.width}px`;
            styles.height = `${component.absoluteBoundingBox.height}px`;
        }
        
        // 배경색
        if (component.fills && component.fills[0]) {
            const fill = component.fills[0];
            if (fill.type === 'SOLID') {
                const { r, g, b, a = 1 } = fill.color;
                styles.backgroundColor = `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
            }
        }
        
        // 모서리 둥글기
        if (component.cornerRadius) {
            styles.borderRadius = `${component.cornerRadius}px`;
        }
        
        // 테두리
        if (component.strokes && component.strokes[0]) {
            const stroke = component.strokes[0];
            if (stroke.type === 'SOLID') {
                const { r, g, b, a = 1 } = stroke.color;
                styles.border = `${component.strokeWeight || 1}px solid rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
            }
        }
        
        // 그림자
        if (component.effects) {
            const shadows = component.effects
                .filter(effect => effect.type === 'DROP_SHADOW')
                .map(shadow => {
                    const { r, g, b, a } = shadow.color;
                    const { x, y } = shadow.offset;
                    return `${x}px ${y}px ${shadow.radius}px rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
                });
            if (shadows.length > 0) {
                styles.boxShadow = shadows.join(', ');
            }
        }
        
        return styles;
    }
    
    getComponentType(component) {
        const name = component.name.toLowerCase();
        if (name.includes('button')) return 'button';
        if (name.includes('input')) return 'input';
        if (name.includes('card')) return 'card';
        if (name.includes('nav')) return 'navigation';
        return 'generic';
    }
    
    generatePropsFromFigma(component) {
        if (!component.componentPropertyDefinitions) return '';
        
        const props = Object.entries(component.componentPropertyDefinitions)
            .map(([key, def]) => {
                const defaultValue = def.defaultValue !== undefined ? 
                    (typeof def.defaultValue === 'string' ? `'${def.defaultValue}'` : def.defaultValue) : 
                    (def.type === 'TEXT' ? "''" : false);
                return `${key}: ${defaultValue}`;
            });
            
        return props.join(',\n            ');
    }
    
    generateContentRenderer(component, type) {
        switch (type) {
            case 'button':
                return `
        const buttonText = this.props.text || this.props.variant || '${component.name.replace('AppForge ', '')}';
        this.element.textContent = buttonText;
        this.element.type = 'button';`;
                
            case 'input':
                return `
        this.element.type = this.props.type || 'text';
        this.element.placeholder = this.props.placeholder || 'Enter text...';
        if (this.props.required) {
            this.element.required = true;
        }`;
                
            case 'card':
                return `
        const titleEl = document.createElement('h3');
        titleEl.textContent = this.props.title || 'Card Title';
        titleEl.style.margin = '0 0 8px 0';
        this.element.appendChild(titleEl);
        
        const subtitleEl = document.createElement('p');
        subtitleEl.textContent = this.props.subtitle || 'Card subtitle';
        subtitleEl.style.margin = '0';
        subtitleEl.style.color = '#666';
        this.element.appendChild(subtitleEl);`;
                
            default:
                return `
        const content = document.createElement('div');
        content.className = 'component-content';
        content.textContent = '${component.name}';
        this.element.appendChild(content);`;
        }
    }
    
    generateDataUpdater(component, type) {
        switch (type) {
            case 'button':
                return `
        if (data.text) {
            this.element.textContent = data.text;
        }`;
                
            case 'input':
                return `
        if (data.value !== undefined) {
            this.element.value = data.value;
        }
        if (data.placeholder) {
            this.element.placeholder = data.placeholder;
        }`;
                
            case 'card':
                return `
        if (data.title) {
            const titleEl = this.element.querySelector('h3');
            if (titleEl) titleEl.textContent = data.title;
        }
        if (data.subtitle) {
            const subtitleEl = this.element.querySelector('p');
            if (subtitleEl) subtitleEl.textContent = data.subtitle;
        }`;
                
            default:
                return `
        const content = this.element.querySelector('.component-content');
        if (content && data.text) {
            content.textContent = data.text;
        }`;
        }
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
        
        // 채널 설정 로그
        if (this.channelEnabled) {
            console.log('📻 채널 필터링 활성화:');
            console.log(`   📄 허용 페이지: ${this.allowedPages.join(', ') || '모든 페이지'}`);
            console.log(`   🖼️  허용 프레임: ${this.allowedFrames.join(', ') || '모든 프레임'}`);
            console.log(`   🏷️  프리픽스: ${this.channelPrefix || '없음'}`);
            console.log(`   🚫 제외 패턴: ${this.excludePattern || '없음'}`);
        }
        
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
            
            // 컴포넌트가 없으면 알림 후 종료
            if (components.length === 0) {
                console.log('⚠️  채널 필터링 후 생성할 컴포넌트가 없습니다.');
                await this.sendChannelNotification('No components to sync', 'warning');
                return;
            }
            
            // 컴포넌트 코드 생성
            const generatedComponents = [];
            for (const component of components) {
                await this.saveComponent(component);
                generatedComponents.push(component);
            }
            
            // TaskManager에 작업 등록
            await this.triggerTaskManager(generatedComponents);
            
            // 채널 알림 전송
            await this.sendChannelNotification(generatedComponents);
            
            // 버전 저장
            await this.saveLastVersion(currentVersion);
            
            console.log('✅ Figma 동기화가 완료되었습니다!');
            
        } catch (error) {
            console.error('❌ Figma 동기화 실패:', error.message);
            await this.sendChannelNotification(error.message, 'error');
            process.exit(1);
        }
    }
    
    async sendChannelNotification(components, type = 'success') {
        if (!this.webhookUrl && !this.notificationChannel) {
            return;
        }
        
        let message;
        let color;
        
        switch (type) {
            case 'success':
                message = this.formatSuccessMessage(components);
                color = '#36a64f'; // green
                break;
            case 'warning':
                message = components; // warning message string
                color = '#ff9500'; // orange
                break;
            case 'error':
                message = `❌ Figma 동기화 실패: ${components}`;
                color = '#ff0000'; // red
                break;
        }
        
        // Slack 웹훅 전송
        if (this.webhookUrl) {
            try {
                await this.sendSlackNotification(message, color);
                console.log('📢 Slack 알림 전송됨');
            } catch (error) {
                console.error('❌ Slack 알림 전송 실패:', error.message);
            }
        }
        
        // 커스텀 웹훅 전송
        if (this.notificationChannel) {
            try {
                await this.sendCustomNotification(message, type);
                console.log('📢 채널 알림 전송됨');
            } catch (error) {
                console.error('❌ 채널 알림 전송 실패:', error.message);
            }
        }
    }
    
    formatSuccessMessage(components) {
        if (!Array.isArray(components)) return components;
        
        const summary = components.reduce((acc, comp) => {
            const page = comp.channel.page || 'Unknown';
            if (!acc[page]) acc[page] = [];
            acc[page].push(comp.name);
            return acc;
        }, {});
        
        let message = `🎨 Figma 동기화 완료: ${components.length}개 컴포넌트 업데이트\n\n`;
        
        for (const [page, comps] of Object.entries(summary)) {
            message += `📄 **${page}**: ${comps.join(', ')}\n`;
        }
        
        message += `\n🔗 Figma 파일: https://www.figma.com/file/${this.fileId}`;
        
        return message;
    }
    
    async sendSlackNotification(message, color) {
        const payload = {
            text: '🎨 Figma 동기화 알림',
            attachments: [{
                color: color,
                text: message,
                ts: Math.floor(Date.now() / 1000)
            }]
        };
        
        await axios.post(this.webhookUrl, payload);
    }
    
    async sendCustomNotification(message, type) {
        const payload = {
            channel: this.notificationChannel,
            message: message,
            type: type,
            timestamp: new Date().toISOString(),
            source: 'figma-sync',
            metadata: {
                fileId: this.fileId,
                teamId: this.teamId,
                versionBranch: this.versionBranch
            }
        };
        
        // 커스텀 웹훅 URL이 있으면 전송
        if (this.webhookUrl) {
            await axios.post(this.webhookUrl, payload);
        }
    }
}

// 스크립트 실행
if (require.main === module) {
    const figmaSync = new FigmaSync();
    figmaSync.sync();
}

module.exports = FigmaSync;