class App extends LynxComponent {
  constructor() {
    super();  // LynxComponent를 확장하므로 super() 필요
    this.currentPage = 'home'
  }
  
  connectedCallback() {
    window.addEventListener('navigation', (e) => {
      this.currentPage = e.detail.tab
      this.render()
    })
  }
  
  render() {
    console.log('App render called, currentPage:', this.currentPage);
    
    let pageContent
    
    switch(this.currentPage) {
      case 'profile':
        pageContent = lynx.element('profile-page', {
          userId: 'test-user-1',
          isOwnProfile: true
        })
        break
      case 'create':
        pageContent = lynx.element('upload-page')
        break
      case 'discover':
        pageContent = lynx.element('search-page')
        break
      case 'home':
      default:
        pageContent = lynx.element('home-page')
        break
    }
    
    return lynx.div({
      style: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#000'
      }
    }, [pageContent])
  }
}

window.App = App
if (typeof module !== 'undefined' && module.exports) {
  module.exports = App
}