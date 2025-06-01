class HomePage extends LynxComponent {
  constructor() {
    this.commentsOpen = false
    this.currentVideoId = null
  }
  
  connectedCallback() {
    this.addEventListener('open-comments', (e) => {
      this.currentVideoId = e.detail.videoId
      this.commentsOpen = true
      this.render()
    })
    
    this.addEventListener('close-comments', () => {
      this.commentsOpen = false
      this.currentVideoId = null
      this.render()
    })
  }

  render() {
    return lynx.div({
      style: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#000',
        overflow: 'hidden'
      }
    }, [
      lynx.div({
        style: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          paddingTop: 'env(safe-area-inset-top)',
          zIndex: 100,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)'
        }
      }, [
        lynx.text({
          content: '🎵',
          style: {
            fontSize: '24px',
            cursor: 'pointer'
          }
        }),
        lynx.div({
          style: {
            display: 'flex',
            gap: '20px'
          }
        }, [
          lynx.text({
            content: '팔로잉',
            style: {
              color: '#666',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }
          }),
          lynx.text({
            content: '추천',
            style: {
              color: '#fff',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              borderBottom: '2px solid #fff',
              paddingBottom: '2px'
            }
          })
        ]),
        lynx.text({
          content: '🔍',
          style: {
            fontSize: '24px',
            cursor: 'pointer'
          }
        })
      ]),

      lynx.element('video-feed'),
      
      lynx.element('navigation-bar', {
        activeTab: 'home'
      }),
      
      lynx.element('comments-panel', {
        videoId: this.currentVideoId,
        isOpen: this.commentsOpen
      })
    ])
  }
}

window.HomePage = HomePage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HomePage
}