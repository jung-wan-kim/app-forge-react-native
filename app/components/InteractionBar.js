class InteractionBar extends LynxComponent {
  static properties = {
    videoId: { type: String },
    likes: { type: Number },
    comments: { type: Number },
    shares: { type: Number },
    isLiked: { type: Boolean },
    isFollowing: { type: Boolean },
    user: { type: Object }
  }

  constructor() {
    super();
    this.videoId = ''
    this.likes = 0
    this.comments = 0
    this.shares = 0
    this.isLiked = false
    this.isFollowing = false
    this.user = null
    this.currentUserId = 'test-user-1'
    
    // 로컬 스토리지에서 좋아요 상태 복원
    this.loadLikeState();
  }
  
  loadLikeState() {
    if (this.videoId) {
      const likedVideos = JSON.parse(localStorage.getItem('likedVideos') || '[]');
      this.isLiked = likedVideos.includes(this.videoId);
    }
  }
  
  saveLikeState() {
    const likedVideos = JSON.parse(localStorage.getItem('likedVideos') || '[]');
    if (this.isLiked) {
      if (!likedVideos.includes(this.videoId)) {
        likedVideos.push(this.videoId);
      }
    } else {
      const index = likedVideos.indexOf(this.videoId);
      if (index > -1) {
        likedVideos.splice(index, 1);
      }
    }
    localStorage.setItem('likedVideos', JSON.stringify(likedVideos));
  }

  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  async toggleLike() {
    const previousState = this.isLiked
    const previousLikes = this.likes
    
    this.isLiked = !this.isLiked
    this.likes += this.isLiked ? 1 : -1
    this.saveLikeState();
    this.render()
    
    // 애니메이션 효과
    if (this.isLiked) {
      this.showLikeAnimation();
    }
    
    console.log('Like toggled for video:', this.videoId);
  }
  
  showLikeAnimation() {
    // 하트 애니메이션을 표시
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.cssText = `
      position: fixed;
      font-size: 60px;
      z-index: 9999;
      pointer-events: none;
      animation: heartFloat 1s ease-out forwards;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    `;
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
      heart.remove();
    }, 1000);
  }

  toggleFollow() {
    this.isFollowing = !this.isFollowing
    this.render()
  }

  openComments() {
    const event = new CustomEvent('open-comments', {
      detail: { videoId: this.videoId },
      bubbles: true,
      composed: true
    })
    window.dispatchEvent(event)
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