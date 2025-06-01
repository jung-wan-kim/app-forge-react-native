/**
 * AppForge Card - Figma에서 자동 생성된 Lynx 컴포넌트
 * 설명: Card container for content
 * Figma URL: https://www.figma.com/file/xji8bzh5?node-id=1:4
 */
export default class AppForgeCard {
    constructor(props = {}) {
        this.props = {
            // Figma 프로퍼티에서 추출
            title: 'Card Title',
            subtitle: 'Card subtitle',
            elevated: true,
            // 기본 프로퍼티
            className: '',
            testId: 'appforgecard',
            ...props
        };
        this.element = null;
        this.children = [];
        this.componentType = 'card';
    }
    
    render() {
        const { className, testId, onClick } = this.props;
        
        // 컴포넌트 타입에 따른 엘리먼트 생성
        this.element = document.createElement('div');
        this.element.className = `lynx-component appforgecard ${className}`;
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
            alignItems: "flex-start",
            justifyContent: "flex-start",
            boxSizing: "border-box",
            width: "280px",
            height: "160px",
            backgroundColor: "rgba(255, 255, 255, 1)",
            borderRadius: "12px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
            padding: "20px",
            flexDirection: "column"
        };
        
        Object.assign(this.element.style, styles);
    }
    
    renderContent() {
        if (!this.element) return;
        
        
        const titleEl = document.createElement('h3');
        titleEl.textContent = this.props.title || 'Card Title';
        titleEl.style.margin = '0 0 8px 0';
        this.element.appendChild(titleEl);
        
        const subtitleEl = document.createElement('p');
        subtitleEl.textContent = this.props.subtitle || 'Card subtitle';
        subtitleEl.style.margin = '0';
        subtitleEl.style.color = '#666';
        this.element.appendChild(subtitleEl);
    }
    
    // 데이터 업데이트 메서드
    setData(data) {
        if (!this.element) return;
        
        
        if (data.title) {
            const titleEl = this.element.querySelector('h3');
            if (titleEl) titleEl.textContent = data.title;
        }
        if (data.subtitle) {
            const subtitleEl = this.element.querySelector('p');
            if (subtitleEl) subtitleEl.textContent = data.subtitle;
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
AppForgeCard.styles = `
    .appforgecard {
        /* Figma 디자인 기반 스타일 */
        transition: all 0.2s ease;
        cursor: default;
    }
    
    .appforgecard:hover {
        
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    
    .appforgecard:active {
        
    }
`;
