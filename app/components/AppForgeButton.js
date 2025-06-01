/**
 * AppForge Button - Figma에서 자동 생성된 Lynx 컴포넌트
 * 설명: Primary button component for App Forge
 * Figma URL: https://www.figma.com/file/xji8bzh5?node-id=1:2
 */
export default class AppForgeButton {
    constructor(props = {}) {
        this.props = {
            // Figma 프로퍼티에서 추출
            text: 'Button',
            variant: 'primary',
            disabled: false,
            // 기본 프로퍼티
            className: '',
            testId: 'appforgebutton',
            ...props
        };
        this.element = null;
        this.children = [];
        this.componentType = 'button';
    }
    
    render() {
        const { className, testId, onClick } = this.props;
        
        // 컴포넌트 타입에 따른 엘리먼트 생성
        this.element = document.createElement('button');
        this.element.className = `lynx-component appforgebutton ${className}`;
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
        const styles = {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxSizing: "border-box",
            width: "120px",
            height: "40px",
            backgroundColor: "rgba(51, 102, 230, 1)",
            borderRadius: "8px",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            color: "white",
            border: "none",
            fontWeight: "500",
            fontSize: "14px",
            cursor: "pointer"
        };
        
        Object.assign(this.element.style, styles);
    }
    
    renderContent() {
        if (!this.element) return;
        
        
        const buttonText = this.props.text || this.props.variant || 'Button';
        this.element.textContent = buttonText;
        this.element.type = 'button';
    }
    
    // 데이터 업데이트 메서드
    setData(data) {
        if (!this.element) return;
        
        
        if (data.text) {
            this.element.textContent = data.text;
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

// 컴포넌트 스타일
AppForgeButton.styles = `
    .appforgebutton {
        /* Figma 디자인 기반 스타일 */
        transition: all 0.2s ease;
        cursor: pointer;
    }
    
    .appforgebutton:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    
    .appforgebutton:active {
        transform: translateY(0);
    }
`;
