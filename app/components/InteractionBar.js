class InteractionBar extends LynxComponent {
  static properties = {
    videoId: { type: String },
    likes: { type: Number },
    comments: { type: Number },
    shares: { type: Number },
    isLiked: { type: Boolean },
    isFollowing: { type: Boolean }
  }

  constructor() {
    super()
    this.videoId = ''
    this.likes = 0
    this.comments = 0
    this.shares = 0
    this.isLiked = false
    this.isFollowing = false
  }

  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  toggleLike() {
    this.isLiked = !this.isLiked
    this.likes += this.isLiked ? 1 : -1
    this.render()
  }

  toggleFollow() {
    this.isFollowing = !this.isFollowing
    this.render()
  }

  openComments() {
    console.log('댓글 열기:', this.videoId)
  }

  shareVideo() {
    console.log('공유하기:', this.videoId)
  }

  render() {
    const buttonStyle = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '24px',
      cursor: 'pointer',
      userSelect: 'none'
    }

    const iconStyle = {
      width: '40px',
      height: '40px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '4px',
      fontSize: '24px'
    }

    const textStyle = {
      fontSize: '12px',
      color: '#fff',
      fontWeight: '600'
    }

    return lynx.div({
      style: {
        position: 'absolute',
        right: '16px',
        bottom: '100px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 10
      }
    }, [
      lynx.div({
        style: {
          ...buttonStyle,
          marginBottom: '32px'
        },
        onclick: () => this.toggleFollow()
      }, [
        lynx.div({
          style: {
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#666',
            position: 'relative',
            marginBottom: '-12px'
          }
        }),
        lynx.div({
          style: {
            backgroundColor: this.isFollowing ? '#333' : '#fe2c55',
            color: '#fff',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 'bold'
          }
        }, [
          lynx.text({ content: this.isFollowing ? '✓' : '+' })
        ])
      ]),

      lynx.div({
        style: buttonStyle,
        onclick: () => this.toggleLike()
      }, [
        lynx.div({
          style: iconStyle
        }, [
          lynx.text({ 
            content: '❤️',
            style: {
              filter: this.isLiked ? 'none' : 'grayscale(1)',
              transform: this.isLiked ? 'scale(1.2)' : 'scale(1)',
              transition: 'all 0.2s ease'
            }
          })
        ]),
        lynx.text({
          content: this.formatNumber(this.likes),
          style: textStyle
        })
      ]),

      lynx.div({
        style: buttonStyle,
        onclick: () => this.openComments()
      }, [
        lynx.div({
          style: iconStyle
        }, [
          lynx.text({ content: '💬' })
        ]),
        lynx.text({
          content: this.formatNumber(this.comments),
          style: textStyle
        })
      ]),

      lynx.div({
        style: buttonStyle,
        onclick: () => this.shareVideo()
      }, [
        lynx.div({
          style: iconStyle
        }, [
          lynx.text({ content: '📤' })
        ]),
        lynx.text({
          content: this.formatNumber(this.shares),
          style: textStyle
        })
      ])
    ])
  }
}

window.InteractionBar = InteractionBar
if (typeof module !== 'undefined' && module.exports) {
  module.exports = InteractionBar
}