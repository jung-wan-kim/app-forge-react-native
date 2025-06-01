// Lynx Framework Mock for Testing
window.lynx = {
  components: {},
  
  registerComponent(name, ComponentClass) {
    this.components[name] = ComponentClass;
    customElements.define(name, class extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.component = new ComponentClass();
        this.component.shadowRoot = this.shadowRoot;
        this.updateComponent();
      }
      
      connectedCallback() {
        if (this.component.connectedCallback) {
          this.component.connectedCallback();
        }
        this.updateComponent();
      }
      
      updateComponent() {
        if (this.component.render) {
          const rendered = this.component.render();
          if (rendered && rendered.element) {
            this.shadowRoot.innerHTML = '';
            this.shadowRoot.appendChild(rendered.element);
          }
        }
      }
    });
  },
  
  mount(container, element) {
    if (element && element.element) {
      container.appendChild(element.element);
    }
  },
  
  element(tag, props = {}, children = []) {
    const element = document.createElement(tag);
    
    Object.entries(props).forEach(([key, value]) => {
      if (key === 'style' && typeof value === 'object') {
        Object.assign(element.style, value);
      } else if (key.startsWith('on')) {
        element.addEventListener(key.slice(2), value);
      } else {
        element.setAttribute(key, value);
      }
    });
    
    if (Array.isArray(children)) {
      children.forEach(child => {
        if (child && child.element) {
          element.appendChild(child.element);
        } else if (typeof child === 'string') {
          element.appendChild(document.createTextNode(child));
        }
      });
    } else if (typeof children === 'string') {
      element.innerHTML = children;
    }
    
    return { element };
  },
  
  div(props, children) {
    return this.element('div', props, children);
  },
  
  text(props) {
    const span = document.createElement('span');
    if (props.content) span.textContent = props.content;
    if (props.style) Object.assign(span.style, props.style);
    return { element: span };
  },
  
  button(props, children) {
    return this.element('button', props, children);
  },
  
  input(props) {
    return this.element('input', props);
  },
  
  label(props, children) {
    return this.element('label', props, children);
  }
};

// Base Component Class
window.LynxComponent = class LynxComponent {
  constructor() {
    this.shadowRoot = null;
  }
  
  render() {
    return lynx.div({}, [lynx.text({ content: 'Component' })]);
  }
  
  addEventListener(event, handler) {
    if (this.shadowRoot) {
      this.shadowRoot.addEventListener(event, handler);
    }
  }
  
  dispatchEvent(event) {
    if (this.shadowRoot) {
      this.shadowRoot.dispatchEvent(event);
    }
  }
};