class VideoPlayer extends LynxComponent {
  static properties = {
    videoUrl: { type: String },
    isPlaying: { type: Boolean },
    isMuted: { type: Boolean },
    showControls: { type: Boolean }
  }

  constructor() {
    super();
    this.videoUrl = ''
    this.isPlaying = true
    this.isMuted = false
    this.showControls = false
    this.videoRef = null
  }

  connectedCallback() {
    // Component is connected
    this.setupVideo()
  }
  
  setupVideo() {
    // 비디오 요소 최적화 설정
    setTimeout(() => {
      const video = this.shadowRoot?.querySelector('video')
      if (video) {
        // 성능 최적화 설정
        video.preload = 'metadata' // 메타데이터만 미리 로드
        video.playsInline = true // 모바일에서 전체화면 방지
        
        // 자동 재생 최적화
        if (this.isPlaying) {
          video.muted = true
          video.play().catch(err => console.log('자동재생 실패:', err))
        }
        
        this.videoRef = video
      }
    }, 100)
  }

  togglePlay() {
    if (this.videoRef) {
      if (this.isPlaying) {
        this.videoRef.pause()
      } else {
        this.videoRef.play()
      }
      this.isPlaying = !this.isPlaying
      this.render()
    }
  }

  toggleMute() {
    if (this.videoRef) {
      this.isMuted = !this.isMuted
      this.videoRef.muted = this.isMuted
      this.render()
    }
  }


  render() {
    return lynx.div({
      style: {
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        overflow: 'hidden'
      }
    }, [
      lynx.element('video', {
        src: this.videoUrl,
        style: {
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        },
        autoplay: this.isPlaying,
        muted: this.isMuted,
        loop: true,
        playsinline: true,
        onclick: () => this.togglePlay()
      }),
      
      !this.isPlaying && lynx.div({
        style: {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80px',
          height: '80px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        },
        onclick: () => this.togglePlay()
      }, [
        lynx.div({
          style: {
            width: '0',
            height: '0',
            borderStyle: 'solid',
            borderWidth: '20px 0 20px 35px',
            borderColor: 'transparent transparent transparent #fff',
            marginLeft: '8px'
          }
        })
      ]),
      
      lynx.div({
        style: {
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          width: '40px',
          height: '40px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        },
        onclick: () => this.toggleMute()
      }, [
        lynx.text({
          content: this.isMuted ? '🔇' : '🔊',
          style: {
            fontSize: '20px'
          }
        })
      ])
    ])
  }
}

window.VideoPlayer = VideoPlayer
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VideoPlayer
}