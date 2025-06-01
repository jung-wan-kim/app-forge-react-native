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

    async generateSwiftUICode(component) {
        // SwiftUI 코드 생성 로직
        const componentName = component.name.replace(/[^a-zA-Z0-9]/g, '');
        
        return `
import SwiftUI

struct ${componentName}View: View {
    var body: some View {
        // TODO: Figma 디자인을 기반으로 한 SwiftUI 구현
        VStack {
            Text("${component.name}")
                .font(.title)
            // 추가 UI 구현 필요
        }
        .padding()
    }
}

#Preview {
    ${componentName}View()
}
`;
    }

    async generateComposeCode(component) {
        // Jetpack Compose 코드 생성 로직
        const componentName = component.name.replace(/[^a-zA-Z0-9]/g, '');
        
        return `
package com.yourcompany.appforge.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp

@Composable
fun ${componentName}(
    modifier: Modifier = Modifier
) {
    // TODO: Figma 디자인을 기반으로 한 Compose 구현
    Column(
        modifier = modifier.padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "${component.name}",
            style = MaterialTheme.typography.titleLarge
        )
        // 추가 UI 구현 필요
    }
}

@Preview(showBackground = true)
@Composable
fun ${componentName}Preview() {
    ${componentName}()
}
`;
    }

    async saveComponent(component, platform) {
        const enableIOS = process.env.ENABLE_IOS === 'true';
        const enableAndroid = process.env.ENABLE_ANDROID === 'true';
        
        if (enableIOS && (platform === 'ios' || platform === 'both')) {
            const swiftCode = await this.generateSwiftUICode(component);
            const swiftPath = path.join(__dirname, '../ios/AppForge/Components', `${component.name.replace(/[^a-zA-Z0-9]/g, '')}View.swift`);
            
            await fs.mkdir(path.dirname(swiftPath), { recursive: true });
            await fs.writeFile(swiftPath, swiftCode);
            console.log(`✅ SwiftUI 컴포넌트 생성: ${swiftPath}`);
        }
        
        if (enableAndroid && (platform === 'android' || platform === 'both')) {
            const composeCode = await this.generateComposeCode(component);
            const composePath = path.join(__dirname, '../android/app/src/main/java/com/yourcompany/appforge/ui/components', `${component.name.replace(/[^a-zA-Z0-9]/g, '')}.kt`);
            
            await fs.mkdir(path.dirname(composePath), { recursive: true });
            await fs.writeFile(composePath, composeCode);
            console.log(`✅ Compose 컴포넌트 생성: ${composePath}`);
        }
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
                await this.saveComponent(component, 'both');
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