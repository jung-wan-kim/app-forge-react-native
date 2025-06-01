/**
 * AppForge Input - Figma에서 자동 생성된 Lynx 컴포넌트
 * 설명: Input field component for forms
 * Figma URL: https://www.figma.com/file/xji8bzh5?node-id=1:3
 */
export default class AppForgeInput {
    constructor(props = {}) {
        this.props = {
            // Figma 프로퍼티에서 추출
            placeholder: 'Enter text...',
            type: 'text',
            required: false,
            // 기본 프로퍼티
            className: '',
            testId: 'appforgeinput',
            ...props
        };
        this.element = null;
        this.children = [];
        this.componentType = 'input';
    }
    
    render() {
        const { className, testId, onClick } = this.props;
        
        // 컴포넌트 타입에 따른 엘리먼트 생성
        this.element = document.createElement('div');
        this.element.className = `lynx-component appforgeinput ${className}`;
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
          "display": "flex",
          "alignItems": "center",
          "justifyContent": "center",
          "boxSizing": "border-box"
};
        
        Object.assign(this.element.style, styles);
    }
    
    renderContent() {
        if (!this.element) return;
        
        
        this.element.type = this.props.type || 'text';
        this.element.placeholder = this.props.placeholder || 'Enter text...';
        if (this.props.required) {
            this.element.required = true;
        }
    }
    
    // 데이터 업데이트 메서드
    setData(data) {
        if (!this.element) return;
        
        
        if (data.value !== undefined) {
            this.element.value = data.value;
        }
        if (data.placeholder) {
            this.element.placeholder = data.placeholder;
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
AppForgeInput.styles = `
    .appforgeinput {
        /* Figma 디자인 기반 스타일 */
        transition: all 0.2s ease;
        cursor: default;
    }
    
    .appforgeinput:hover {
        
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    
    .appforgeinput:active {
        
    }
`;
