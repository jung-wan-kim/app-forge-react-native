// Lynx Framework Core Implementation
(function() {
  'use strict';
  
  // Base Component Class
  class LynxComponent extends HTMLElement {
    static properties = {};
    
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._props = {};
      this._initialized = false;
    }
    
    connectedCallback() {
      if (!this._initialized) {
        this._initialized = true;
        this._render();
      }
    }
    
    _render() {
      const rendered = this.render();
      if (rendered) {
        this.shadowRoot.innerHTML = '';
        if (rendered instanceof Element) {
          this.shadowRoot.appendChild(rendered);
        } else if (typeof rendered === 'string') {
          this.shadowRoot.innerHTML = rendered;
        }
      }
    }
    
    render() {
      return '<div>Component</div>';
    }
  }
  
  // Lynx Framework
  const lynx = {
    components: new Map(),
    
    registerComponent(name, ComponentClass) {
      if (!customElements.get(name)) {
        // Create a proper Web Component
        const WebComponent = class extends LynxComponent {
          constructor() {
            super();
            
            // Create instance of the original component
            this._componentInstance = new ComponentClass();
            this._componentInstance.shadowRoot = this.shadowRoot;
            
            // Copy properties and methods
            Object.keys(ComponentClass.properties || {}).forEach(prop => {
              if (this._componentInstance.hasOwnProperty(prop)) {
                this[prop] = this._componentInstance[prop];
              }
            });
            
            // Bind render method to instance
            if (this._componentInstance.render) {
              this._componentInstance.render = this._componentInstance.render.bind(this._componentInstance);
            }
          }
          
          connectedCallback() {
            super.connectedCallback();
            if (this._componentInstance.connectedCallback) {
              this._componentInstance.connectedCallback.call(this._componentInstance);
            }
            // Force render after connected
            this._render();
          }
          
          render() {
            if (this._componentInstance.render) {
              const result = this._componentInstance.render.call(this._componentInstance);
              return this._processRenderResult(result);
            }
            return '';
          }
          
          _processRenderResult(result) {
            if (!result) return '';
            
            if (result.element) {
              return result.element;
            }
            
            if (typeof result === 'string') {
              return result;
            }
            
            if (result instanceof Element) {
              return result;
            }
            
            return '';
          }
        };
        
        customElements.define(name, WebComponent);
        this.components.set(name, ComponentClass);
      }
    },
    
    mount(container, element) {
      console.log('Lynx mount called', { container, element });
      
      if (!container) {
        console.error('Mount failed: no container');
        return;
      }
      
      container.innerHTML = '';
      
      if (element && element.element) {
        console.log('Mounting element with .element property');
        container.appendChild(element.element);
      } else if (element instanceof Element) {
        console.log('Mounting Element instance');
        container.appendChild(element);
      } else if (typeof element === 'string') {
        console.log('Mounting string content');
        container.innerHTML = element;
      } else {
        console.error('Mount failed: invalid element', element);
      }
    },
    
    element(tag, props = {}, children = []) {
      const element = document.createElement(tag);
      
      // Apply properties
      Object.entries(props).forEach(([key, value]) => {
        if (key === 'style' && typeof value === 'object') {
          Object.assign(element.style, value);
        } else if (key.startsWith('on')) {
          const eventName = key.slice(2).toLowerCase();
          element.addEventListener(eventName, value);
        } else if (key === 'class') {
          element.className = value;
        } else {
          element.setAttribute(key, value);
        }
      });
      
      // Add children
      const addChild = (child) => {
        if (!child) return;
        
        if (child.element) {
          element.appendChild(child.element);
        } else if (child instanceof Element) {
          element.appendChild(child);
        } else if (typeof child === 'string' || typeof child === 'number') {
          element.appendChild(document.createTextNode(String(child)));
        } else if (Array.isArray(child)) {
          child.forEach(addChild);
        }
      };
      
      if (Array.isArray(children)) {
        children.forEach(addChild);
      } else {
        addChild(children);
      }
      
      return { element };
    },
    
    div(props, children) {
      return this.element('div', props, children);
    },
    
    text(props = {}) {
      const span = document.createElement('span');
      if (props.content !== undefined) {
        span.textContent = String(props.content);
      }
      if (props.style) {
        Object.assign(span.style, props.style);
      }
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
  
  // Simple LynxComponent base class for compatibility
  window.LynxComponent = class {
    constructor() {
      // No initialization needed in base class
    }
    
    render() {
      return lynx.div({}, [lynx.text({ content: 'Default Component' })]);
    }
  };
  
  // Expose globally
  window.lynx = lynx;
})();