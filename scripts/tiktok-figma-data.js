/**
 * TikTok Clone UI Components from Figma Channel aopzqj84
 * 실제 TikTok 스타일의 모바일 UI 컴포넌트
 */

const tiktokFigmaData = {
    name: "TikTok Clone UI - Channel aopzqj84",
    version: "2.0.0",
    lastModified: new Date().toISOString(),
    document: {
        id: "0:0",
        name: "Document",
        type: "DOCUMENT",
        children: [
            {
                id: "1:0",
                name: "Mobile UI",
                type: "CANVAS",
                children: [
                    {
                        id: "1:1",
                        name: "Video Feed",
                        type: "FRAME",
                        children: [
                            {
                                id: "1:2",
                                name: "VideoPlayer",
                                type: "COMPONENT",
                                description: "Full screen video player with overlay controls",
                                componentPropertyDefinitions: {
                                    showControls: {
                                        type: "BOOLEAN",
                                        defaultValue: true
                                    }
                                },
                                absoluteBoundingBox: {
                                    x: 0,
                                    y: 0,
                                    width: 375,
                                    height: 812
                                },
                                fills: [
                                    {
                                        type: "SOLID",
                                        color: { r: 0, g: 0, b: 0, a: 1 }
                                    }
                                ]
                            },
                            {
                                id: "1:3",
                                name: "ActionButton",
                                type: "COMPONENT",
                                description: "Circular action button for like, comment, share",
                                componentPropertyDefinitions: {
                                    icon: {
                                        type: "VARIANT",
                                        defaultValue: "heart",
                                        variantOptions: ["heart", "comment", "share", "music"]
                                    },
                                    isActive: {
                                        type: "BOOLEAN",
                                        defaultValue: false
                                    }
                                },
                                absoluteBoundingBox: {
                                    x: 315,
                                    y: 400,
                                    width: 48,
                                    height: 48
                                },
                                fills: [
                                    {
                                        type: "SOLID",
                                        color: { r: 1, g: 1, b: 1, a: 0.1 }
                                    }
                                ],
                                cornerRadius: 24
                            },
                            {
                                id: "1:4",
                                name: "UserInfo",
                                type: "COMPONENT",
                                description: "User info overlay on video",
                                componentPropertyDefinitions: {
                                    username: {
                                        type: "TEXT",
                                        defaultValue: "@username"
                                    },
                                    description: {
                                        type: "TEXT",
                                        defaultValue: "Video description #hashtag"
                                    }
                                },
                                absoluteBoundingBox: {
                                    x: 12,
                                    y: 680,
                                    width: 280,
                                    height: 80
                                },
                                fills: [
                                    {
                                        type: "SOLID",
                                        color: { r: 0, g: 0, b: 0, a: 0 }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: "2:1",
                        name: "Navigation",
                        type: "FRAME",
                        children: [
                            {
                                id: "2:2",
                                name: "BottomTabBar",
                                type: "COMPONENT",
                                description: "Bottom navigation tab bar",
                                componentPropertyDefinitions: {
                                    activeTab: {
                                        type: "VARIANT",
                                        defaultValue: "home",
                                        variantOptions: ["home", "search", "upload", "inbox", "profile"]
                                    }
                                },
                                absoluteBoundingBox: {
                                    x: 0,
                                    y: 732,
                                    width: 375,
                                    height: 80
                                },
                                fills: [
                                    {
                                        type: "SOLID",
                                        color: { r: 0, g: 0, b: 0, a: 1 }
                                    }
                                ],
                                effects: [
                                    {
                                        type: "DROP_SHADOW",
                                        color: { r: 0, g: 0, b: 0, a: 0.2 },
                                        offset: { x: 0, y: -1 },
                                        radius: 0
                                    }
                                ]
                            },
                            {
                                id: "2:3",
                                name: "TabIcon",
                                type: "COMPONENT",
                                description: "Individual tab icon",
                                componentPropertyDefinitions: {
                                    icon: {
                                        type: "VARIANT",
                                        defaultValue: "home",
                                        variantOptions: ["home", "search", "add", "inbox", "profile"]
                                    },
                                    isActive: {
                                        type: "BOOLEAN",
                                        defaultValue: false
                                    }
                                },
                                absoluteBoundingBox: {
                                    x: 37.5,
                                    y: 746,
                                    width: 30,
                                    height: 30
                                },
                                fills: [
                                    {
                                        type: "SOLID",
                                        color: { r: 1, g: 1, b: 1, a: 1 }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: "3:1",
                        name: "Upload",
                        type: "FRAME",
                        children: [
                            {
                                id: "3:2",
                                name: "UploadButton",
                                type: "COMPONENT",
                                description: "Central upload button with gradient",
                                componentPropertyDefinitions: {},
                                absoluteBoundingBox: {
                                    x: 157.5,
                                    y: 744,
                                    width: 60,
                                    height: 34
                                },
                                fills: [
                                    {
                                        type: "GRADIENT_LINEAR",
                                        gradientHandlePositions: [
                                            { x: 0, y: 0 },
                                            { x: 1, y: 0 }
                                        ],
                                        gradientStops: [
                                            { color: { r: 1, g: 0.1, b: 0.5, a: 1 }, position: 0 },
                                            { color: { r: 0.1, g: 0.5, b: 1, a: 1 }, position: 1 }
                                        ]
                                    }
                                ],
                                cornerRadius: 8
                            }
                        ]
                    },
                    {
                        id: "4:1",
                        name: "Profile",
                        type: "FRAME",
                        children: [
                            {
                                id: "4:2",
                                name: "ProfileHeader",
                                type: "COMPONENT",
                                description: "Profile page header with stats",
                                componentPropertyDefinitions: {
                                    username: {
                                        type: "TEXT",
                                        defaultValue: "@username"
                                    },
                                    followers: {
                                        type: "TEXT",
                                        defaultValue: "0"
                                    },
                                    following: {
                                        type: "TEXT",
                                        defaultValue: "0"
                                    },
                                    likes: {
                                        type: "TEXT",
                                        defaultValue: "0"
                                    }
                                },
                                absoluteBoundingBox: {
                                    x: 0,
                                    y: 0,
                                    width: 375,
                                    height: 200
                                },
                                fills: [
                                    {
                                        type: "SOLID",
                                        color: { r: 0.05, g: 0.05, b: 0.05, a: 1 }
                                    }
                                ]
                            },
                            {
                                id: "4:3",
                                name: "ProfileAvatar",
                                type: "COMPONENT",
                                description: "Circular profile avatar",
                                componentPropertyDefinitions: {
                                    size: {
                                        type: "VARIANT",
                                        defaultValue: "large",
                                        variantOptions: ["small", "medium", "large"]
                                    }
                                },
                                absoluteBoundingBox: {
                                    x: 147.5,
                                    y: 40,
                                    width: 80,
                                    height: 80
                                },
                                fills: [
                                    {
                                        type: "SOLID",
                                        color: { r: 0.3, g: 0.3, b: 0.3, a: 1 }
                                    }
                                ],
                                cornerRadius: 40
                            }
                        ]
                    },
                    {
                        id: "5:1",
                        name: "Search",
                        type: "FRAME",
                        children: [
                            {
                                id: "5:2",
                                name: "SearchBar",
                                type: "COMPONENT",
                                description: "Search input with icon",
                                componentPropertyDefinitions: {
                                    placeholder: {
                                        type: "TEXT",
                                        defaultValue: "Search"
                                    }
                                },
                                absoluteBoundingBox: {
                                    x: 12,
                                    y: 50,
                                    width: 351,
                                    height: 36
                                },
                                fills: [
                                    {
                                        type: "SOLID",
                                        color: { r: 0.1, g: 0.1, b: 0.1, a: 1 }
                                    }
                                ],
                                cornerRadius: 18
                            }
                        ]
                    }
                ]
            }
        ]
    }
};

module.exports = tiktokFigmaData;