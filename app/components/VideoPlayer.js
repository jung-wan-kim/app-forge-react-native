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
    this.setupVideoEvents()
  }

  setupVideoEvents() {
    if (this.videoRef) {
      this.videoRef.addEventListener('click', () => this.togglePlay())
      this.videoRef.addEventListener('loadeddata', () => {
        if (this.isPlaying) {
          this.videoRef.play().catch(err => {
            console.error('자동 재생 실패:', err)
            this.isMuted = true
            this.videoRef.muted = true
            this.videoRef.play()
          })
        }
      })
    }
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

  handleVideoRef(el) {
    this.videoRef = el
    this.setupVideoEvents()
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
      lynx.video({
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
        ref: (el) => this.handleVideoRef(el)
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