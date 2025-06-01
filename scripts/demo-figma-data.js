/**
 * Figma 파일 xji8bzh5의 모의 데이터
 * 실제 API 토큰 없이도 테스트할 수 있도록 구성
 */

const mockFigmaData = {
    name: "App Forge Demo Components",
    version: "1.0.0",
    lastModified: new Date().toISOString(),
    document: {
        id: "0:0",
        name: "Document",
        type: "DOCUMENT",
        children: [
            {
                id: "1:0",
                name: "Design System",
                type: "CANVAS",
                children: [
                    {
                        id: "1:1",
                        name: "Components",
                        type: "FRAME",
                        children: [
                            {
                                id: "1:2",
                                name: "AppForge Button",
                                type: "COMPONENT",
                                description: "Primary button component for App Forge",
                                componentPropertyDefinitions: {
                                    text: {
                                        type: "TEXT",
                                        defaultValue: "Button"
                                    },
                                    variant: {
                                        type: "VARIANT",
                                        defaultValue: "primary",
                                        variantOptions: ["primary", "secondary", "outline"]
                                    },
                                    disabled: {
                                        type: "BOOLEAN",
                                        defaultValue: false
                                    }
                                },
                                absoluteBoundingBox: {
                                    x: 100,
                                    y: 100,
                                    width: 120,
                                    height: 40
                                },
                                fills: [
                                    {
                                        type: "SOLID",
                                        color: { r: 0.2, g: 0.4, b: 0.9, a: 1 }
                                    }
                                ],
                                cornerRadius: 8,
                                effects: [
                                    {
                                        type: "DROP_SHADOW",
                                        color: { r: 0, g: 0, b: 0, a: 0.1 },
                                        offset: { x: 0, y: 2 },
                                        radius: 4
                                    }
                                ]
                            },
                            {
                                id: "1:3",
                                name: "AppForge Input",
                                type: "COMPONENT",
                                description: "Input field component for forms",
                                componentPropertyDefinitions: {
                                    placeholder: {
                                        type: "TEXT",
                                        defaultValue: "Enter text..."
                                    },
                                    type: {
                                        type: "VARIANT",
                                        defaultValue: "text",
                                        variantOptions: ["text", "email", "password", "number"]
                                    },
                                    required: {
                                        type: "BOOLEAN",
                                        defaultValue: false
                                    }
                                },
                                absoluteBoundingBox: {
                                    x: 100,
                                    y: 160,
                                    width: 200,
                                    height: 40
                                },
                                fills: [
                                    {
                                        type: "SOLID",
                                        color: { r: 1, g: 1, b: 1, a: 1 }
                                    }
                                ],
                                strokes: [
                                    {
                                        type: "SOLID",
                                        color: { r: 0.8, g: 0.8, b: 0.8, a: 1 }
                                    }
                                ],
                                strokeWeight: 1,
                                cornerRadius: 4
                            },
                            {
                                id: "1:4",
                                name: "AppForge Card",
                                type: "COMPONENT",
                                description: "Card container for content",
                                componentPropertyDefinitions: {
                                    title: {
                                        type: "TEXT",
                                        defaultValue: "Card Title"
                                    },
                                    subtitle: {
                                        type: "TEXT",
                                        defaultValue: "Card subtitle"
                                    },
                                    elevated: {
                                        type: "BOOLEAN",
                                        defaultValue: true
                                    }
                                },
                                absoluteBoundingBox: {
                                    x: 100,
                                    y: 220,
                                    width: 280,
                                    height: 160
                                },
                                fills: [
                                    {
                                        type: "SOLID",
                                        color: { r: 1, g: 1, b: 1, a: 1 }
                                    }
                                ],
                                cornerRadius: 12,
                                effects: [
                                    {
                                        type: "DROP_SHADOW",
                                        color: { r: 0, g: 0, b: 0, a: 0.08 },
                                        offset: { x: 0, y: 4 },
                                        radius: 12
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                id: "2:0",
                name: "Mobile UI",
                type: "CANVAS",
                children: [
                    {
                        id: "2:1",
                        name: "Navigation",
                        type: "FRAME",
                        children: [
                            {
                                id: "2:2",
                                name: "AppForge NavBar",
                                type: "COMPONENT",
                                description: "Navigation bar for mobile",
                                componentPropertyDefinitions: {
                                    title: {
                                        type: "TEXT",
                                        defaultValue: "App Forge"
                                    },
                                    showBackButton: {
                                        type: "BOOLEAN", 
                                        defaultValue: false
                                    }
                                },
                                absoluteBoundingBox: {
                                    x: 0,
                                    y: 0,
                                    width: 375,
                                    height: 60
                                },
                                fills: [
                                    {
                                        type: "SOLID",
                                        color: { r: 0.95, g: 0.95, b: 0.97, a: 1 }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                id: "3:0",
                name: "Draft Components",
                type: "CANVAS",
                children: [
                    {
                        id: "3:1",
                        name: "WIP Button",
                        type: "COMPONENT",
                        description: "Work in progress button - should be excluded",
                        componentPropertyDefinitions: {}
                    }
                ]
            }
        ]
    }
};

module.exports = mockFigmaData;