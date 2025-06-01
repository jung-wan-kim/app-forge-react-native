class VideoFeed extends LynxComponent {
  static properties = {
    videos: { type: Array },
    currentIndex: { type: Number }
  }

  constructor() {
    super();
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
    this.optimizeVideoStreaming()
    
    if (this.currentIndex >= this.videos.length - 2 && this.hasMore) {
      this.loadVideos()
    }
  }

  previousVideo() {
    this.currentIndex--
    this.scrollToVideo()
    this.optimizeVideoStreaming()
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
      // 먼저 Supabase에서 데이터 가져오기 시도
      const success = await this.loadSupabaseVideos()
      
      // 실패하면 mock 데이터 사용
      if (!success) {
        this.loadMockVideos()
        this.hasMore = false
      }
      
      // 비디오 비트레이트 최적화
      this.optimizeVideoStreaming()
    } catch (error) {
      console.error('Error loading videos:', error)
      this.loadMockVideos()
      this.hasMore = false
    } finally {
      this.isLoading = false
      this.render()
    }
  }
  
  async loadSupabaseVideos() {
    try {
      const script = document.createElement('script')
      script.type = 'module'
      script.textContent = `
        import { videosApi } from '/src/api/videos.js';
        
        try {
          const videos = await videosApi.getVideos(${this.page}, 5);
          window.dispatchEvent(new CustomEvent('videos-loaded', { detail: { videos, success: true } }));
        } catch (error) {
          window.dispatchEvent(new CustomEvent('videos-loaded', { detail: { success: false, error } }));
        }
      `;
      
      document.head.appendChild(script);
      
      const result = await new Promise((resolve) => {
        window.addEventListener('videos-loaded', (e) => {
          script.remove();
          
          if (e.detail.success && e.detail.videos) {
            const newVideos = e.detail.videos;
            if (newVideos.length === 0) {
              this.hasMore = false;
            } else {
              this.videos = [...this.videos, ...newVideos];
              this.page++;
            }
            resolve(true);
          } else {
            resolve(false);
          }
        }, { once: true });
      });
      
      return result;
    } catch (error) {
      console.error('Error loading Supabase videos:', error);
      return false;
    }
  }
  
  loadMockVideos() {
    this.videos = [
      {
        id: '1',
        url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
        username: '@dancing_queen',
        description: '새로운 댄스 챌린지! 같이 해요 💃 #댄스챌린지 #틱톡댄스 #춤스타그램',
        likes_count: 125400,
        comments_count: 3421,
        shares: 892,
        user: {
          username: 'dancing_queen',
          profile_picture: null,
          verified: true
        }
      },
      {
        id: '2',
        url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_2mb.mp4',
        username: '@foodie_paradise',
        description: '오늘의 맛집 발견! 이거 진짜 맛있어요 🍕🍔 #맛집 #먹스타그램 #푸드',
        likes_count: 89234,
        comments_count: 1523,
        shares: 456,
        user: {
          username: 'foodie_paradise',
          profile_picture: null,
          verified: false
        }
      },
      {
        id: '3',
        url: 'https://sample-videos.com/video321/mp4/480/big_buck_bunny_480p_1mb.mp4',
        username: '@comedy_king',
        description: 'ㅋㅋㅋㅋ 이거 보고 안 웃으면 인정 😂 #코미디 #웃긴영상 #개그',
        likes_count: 234567,
        comments_count: 8901,
        shares: 2341,
        user: {
          username: 'comedy_king',
          profile_picture: null,
          verified: true
        }
      },
      {
        id: '4',
        url: 'https://sample-videos.com/video321/mp4/360/big_buck_bunny_360p_1mb.mp4',
        username: '@travel_diary',
        description: '제주도 여행 브이로그 🌴 숨은 명소 추천! #여행 #제주도 #브이로그',
        likes_count: 45678,
        comments_count: 892,
        shares: 234,
        user: {
          username: 'travel_diary',
          profile_picture: null,
          verified: false
        }
      },
      {
        id: '5',
        url: 'https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4',
        username: '@pet_lover',
        description: '우리집 강아지가 너무 귀여워요 🐶❤️ #펫스타그램 #강아지 #반려동물',
        likes_count: 156789,
        comments_count: 4532,
        shares: 1234,
        user: {
          username: 'pet_lover',
          profile_picture: null,
          verified: false
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
  
  optimizeVideoStreaming() {
    // 현재 비디오만 로드, 다른 비디오는 일시정지
    const videos = this.shadowRoot?.querySelectorAll('video-player')
    if (videos) {
      videos.forEach((videoPlayer, index) => {
        if (index === this.currentIndex) {
          // 현재 비디오는 자동 재생
          videoPlayer.setAttribute('isPlaying', 'true')
        } else {
          // 다른 비디오는 일시정지
          videoPlayer.setAttribute('isPlaying', 'false')
        }
      })
    }
  }
}

window.VideoFeed = VideoFeed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VideoFeed
}