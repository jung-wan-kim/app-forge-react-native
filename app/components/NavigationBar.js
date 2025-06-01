class NavigationBar extends LynxComponent {
  static properties = {
    activeTab: { type: String }
  }

  constructor() {
    super();
    this.activeTab = 'home'
  }

  navigateTo(tab) {
    this.activeTab = tab
    this.render()
    window.dispatchEvent(new CustomEvent('navigation', { detail: { tab } }))
  }

  render() {
    const tabStyle = (isActive) => ({
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8px 0',
      cursor: 'pointer',
      userSelect: 'none',
      color: isActive ? '#fff' : '#666'
    })

    const iconStyle = {
      fontSize: '24px',
      marginBottom: '4px'
    }

    const labelStyle = {
      fontSize: '10px',
      fontWeight: '500'
    }

    const tabs = [
      { id: 'home', icon: '🏠', label: '홈' },
      { id: 'discover', icon: '🔍', label: '발견' },
      { id: 'create', icon: '➕', label: '', isCreate: true },
      { id: 'inbox', icon: '💬', label: '받은메시지' },
      { id: 'profile', icon: '👤', label: '프로필' }
    ]

    return lynx.div({
      style: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: '#000',
        borderTop: '1px solid #222',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 'env(safe-area-inset-bottom)',
        zIndex: 100
      }
    }, 
      tabs.map(tab => {
        if (tab.isCreate) {
          return lynx.div({
            style: {
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            },
            onclick: () => this.navigateTo(tab.id)
          }, [
            lynx.div({
              style: {
                width: '40px',
                height: '28px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                color: '#000',
                fontWeight: 'bold',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }
            }, [
              lynx.text({ content: tab.icon })
            ])
          ])
        }

        return lynx.div({
          style: tabStyle(this.activeTab === tab.id),
          onclick: () => this.navigateTo(tab.id)
        }, [
          lynx.text({
            content: tab.icon,
            style: iconStyle
          }),
          lynx.text({
            content: tab.label,
            style: labelStyle
          })
        ])
      })
    )
  }
}

window.NavigationBar = NavigationBar
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NavigationBar
}