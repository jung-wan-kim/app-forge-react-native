class VideoFeed extends LynxComponent {
  static properties = {
    videos: { type: Array },
    currentIndex: { type: Number }
  }

  constructor() {
    this.videos = []
    this.currentIndex = 0
    this.touchStartY = 0
    this.scrollThreshold = 50
    this.page = 0
    this.isLoading = false
    this.hasMore = true
  }

  connectedCallback() {
    this.setupTouchEvents()
    this.loadVideos()
  }

  setupTouchEvents() {
    const container = this.shadowRoot?.querySelector('.video-feed-container')
    if (container) {
      container.addEventListener('touchstart', (e) => this.handleTouchStart(e))
      container.addEventListener('touchmove', (e) => this.handleTouchMove(e))
      container.addEventListener('touchend', (e) => this.handleTouchEnd(e))
      
      container.addEventListener('wheel', (e) => this.handleWheel(e))
    }
  }

  handleTouchStart(e) {
    this.touchStartY = e.touches[0].clientY
  }

  handleTouchMove(e) {
    e.preventDefault()
  }

  handleTouchEnd(e) {
    const touchEndY = e.changedTouches[0].clientY
    const diff = this.touchStartY - touchEndY

    if (Math.abs(diff) > this.scrollThreshold) {
      if (diff > 0 && this.currentIndex < this.videos.length - 1) {
        this.nextVideo()
      } else if (diff < 0 && this.currentIndex > 0) {
        this.previousVideo()
      }
    }
  }

  handleWheel(e) {
    e.preventDefault()
    if (e.deltaY > 0 && this.currentIndex < this.videos.length - 1) {
      this.nextVideo()
    } else if (e.deltaY < 0 && this.currentIndex > 0) {
      this.previousVideo()
    }
  }

  nextVideo() {
    this.currentIndex++
    this.scrollToVideo()
    
    if (this.currentIndex >= this.videos.length - 2 && this.hasMore) {
      this.loadVideos()
    }
  }

  previousVideo() {
    this.currentIndex--
    this.scrollToVideo()
  }

  scrollToVideo() {
    const container = this.shadowRoot?.querySelector('.video-feed-container')
    if (container) {
      container.style.transform = `translateY(-${this.currentIndex * 100}vh)`
    }
  }

  async loadVideos() {
    if (this.isLoading || !this.hasMore) return
    
    this.isLoading = true
    
    try {
      const script = document.createElement('script')
      script.type = 'module'
      script.textContent = `
        import { videosApi } from '/src/api/videos.js';
        const videos = await videosApi.getVideos(${this.page});
        window.dispatchEvent(new CustomEvent('videos-loaded', { detail: videos }));
      `
      document.head.appendChild(script)
      
      await new Promise((resolve) => {
        window.addEventListener('videos-loaded', (e) => {
          const newVideos = e.detail
          if (newVideos.length === 0) {
            this.hasMore = false
          } else {
            this.videos = [...this.videos, ...newVideos]
            this.page++
          }
          resolve()
        }, { once: true })
      })
    } catch (error) {
      console.error('Error loading videos:', error)
      this.loadMockVideos()
    } finally {
      this.isLoading = false
      this.render()
    }
  }
  
  loadMockVideos() {
    this.videos = [
      {
        id: '1',
        url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
        username: '@testuser1',
        description: '첫 번째 테스트 비디오입니다 #틱톡클론 #테스트',
        likes_count: 1234,
        comments_count: 56,
        shares: 12,
        user: {
          username: 'testuser1',
          profile_picture: null,
          verified: false
        }
      },
      {
        id: '2',
        url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_2mb.mp4',
        username: '@testuser2',
        description: '두 번째 테스트 비디오입니다 #개발중',
        likes_count: 5678,
        comments_count: 123,
        shares: 45,
        user: {
          username: 'testuser2',
          profile_picture: null,
          verified: true
        }
      }
    ]
  }

  render() {
    return lynx.div({
      class: 'video-feed-container',
      style: {
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        transition: 'transform 0.3s ease-out',
        transform: `translateY(-${this.currentIndex * 100}vh)`
      }
    }, 
      this.videos.map((video, index) => 
        lynx.div({
          style: {
            position: 'relative',
            width: '100%',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column'
          }
        }, [
          lynx.element('video-player', {
            videoUrl: video.url,
            isPlaying: index === this.currentIndex
          }),
          
          lynx.div({
            style: {
              position: 'absolute',
              bottom: '80px',
              left: '16px',
              right: '80px',
              color: '#fff',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)'
            }
          }, [
            lynx.text({
              content: `@${video.user?.username || video.username}`,
              style: {
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '8px'
              }
            }),
            lynx.text({
              content: video.description,
              style: {
                fontSize: '14px',
                lineHeight: '1.4'
              }
            })
          ]),
          
          lynx.element('interaction-bar', {
            videoId: video.id,
            likes: video.likes_count || video.likes,
            comments: video.comments_count || video.comments,
            shares: video.shares || 0,
            user: video.user
          })
        ])
      )
    )
  }
}

window.VideoFeed = VideoFeed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VideoFeed
}