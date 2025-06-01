class ProfilePage extends LynxComponent {
  static properties = {
    userId: { type: String },
    isOwnProfile: { type: Boolean }
  }
  
  constructor() {
    super();
    this.userId = 'test-user-1'
    this.isOwnProfile = true
    this.user = null
    this.videos = []
    this.stats = {
      following: 0,
      followers: 0,
      likes: 0
    }
    this.activeTab = 'videos'
  }
  
  async connectedCallback() {
    await this.loadUserData()
  }
  
  async loadUserData() {
    // Mock data with more realistic content
    this.user = {
      id: this.userId,
      username: 'k_creator',
      full_name: '김크리에이터',
      bio: '일상을 특별하게 ✨\n춤, 요리, 여행 콘텐츠\n협업문의: creator@email.com',
      profile_picture: null,
      verified: true,
      website: 'linktr.ee/k_creator'
    }
    
    this.stats = {
      following: 324,
      followers: 157000,
      likes: 2345000
    }
    
    // 실제 비디오 데이터와 연결
    this.videos = [
      {
        id: '1',
        thumbnail: 'https://picsum.photos/200/300?random=1',
        views: 125400,
        likes: 12540,
        created_at: new Date().toISOString(),
        description: '새로운 댄스 챌린지!'
      },
      {
        id: '2',
        thumbnail: 'https://picsum.photos/200/300?random=2',
        views: 89234,
        likes: 8923,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        description: '오늘의 맛집 발견!'
      },
      {
        id: '3',
        thumbnail: 'https://picsum.photos/200/300?random=3',
        views: 234567,
        likes: 23456,
        created_at: new Date(Date.now() - 172800000).toISOString(),
        description: 'ㅋㅋㅋㅋ 이거 보고 안 웃으면 인정'
      },
      {
        id: '4',
        thumbnail: 'https://picsum.photos/200/300?random=4',
        views: 45678,
        likes: 4567,
        created_at: new Date(Date.now() - 259200000).toISOString(),
        description: '제주도 여행 브이로그'
      },
      {
        id: '5',
        thumbnail: 'https://picsum.photos/200/300?random=5',
        views: 156789,
        likes: 15678,
        created_at: new Date(Date.now() - 345600000).toISOString(),
        description: '우리집 강아지가 너무 귀여워요'
      },
      {
        id: '6',
        thumbnail: 'https://picsum.photos/200/300?random=6',
        views: 67890,
        likes: 6789,
        created_at: new Date(Date.now() - 432000000).toISOString(),
        description: '요리 레시피 공개!'
      }
    ]
    
    // 좋아요한 비디오 목록
    const likedVideos = JSON.parse(localStorage.getItem('likedVideos') || '[]');
    this.likedVideosList = this.videos.filter(v => likedVideos.includes(v.id));
    
    this.render()
  }
  
  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }
  
  switchTab(tab) {
    this.activeTab = tab
    this.render()
  }
  
  editProfile() {
    console.log('프로필 편집')
  }
  
  shareProfile() {
    console.log('프로필 공유')
  }
  
  render() {
    if (!this.user) {
      return lynx.div({
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundColor: '#f8f8f8'
        }
      }, [lynx.text({ content: '로딩중...' })])
    }
    
    return lynx.div({
      style: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#f8f8f8',
        overflowY: 'auto'
      }
    }, [
      // Header
      lynx.div({
        style: {
          backgroundColor: '#fff',
          padding: '16px',
          paddingTop: 'calc(env(safe-area-inset-top) + 16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #eee'
        }
      }, [
        lynx.text({ content: '←', style: { fontSize: '24px', cursor: 'pointer' } }),
        lynx.text({
          content: `@${this.user.username}`,
          style: { fontSize: '18px', fontWeight: 'bold' }
        }),
        lynx.div({
          style: { display: 'flex', gap: '16px' }
        }, [
          lynx.text({ content: '🔔', style: { fontSize: '24px', cursor: 'pointer' } }),
          lynx.text({ content: '⋮', style: { fontSize: '24px', cursor: 'pointer' } })
        ])
      ]),
      
      // Profile Info
      lynx.div({
        style: {
          backgroundColor: '#fff',
          padding: '24px 16px',
          borderBottom: '1px solid #eee'
        }
      }, [
        // Avatar and Username
        lynx.div({
          style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '16px'
          }
        }, [
          lynx.div({
            style: {
              width: '96px',
              height: '96px',
              borderRadius: '50%',
              backgroundColor: '#ddd',
              marginBottom: '12px'
            }
          }),
          lynx.text({
            content: `@${this.user.username}`,
            style: { fontSize: '16px', fontWeight: 'bold' }
          })
        ]),
        
        // Stats
        lynx.div({
          style: {
            display: 'flex',
            justifyContent: 'space-around',
            marginBottom: '20px'
          }
        }, [
          this.renderStat('팔로잉', this.stats.following),
          this.renderStat('팔로워', this.stats.followers),
          this.renderStat('좋아요', this.stats.likes)
        ]),
        
        // Action Buttons
        lynx.div({
          style: {
            display: 'flex',
            gap: '8px',
            marginBottom: '16px'
          }
        }, [
          this.isOwnProfile ? 
            lynx.button({
              onclick: () => this.editProfile(),
              style: {
                flex: 1,
                padding: '8px',
                backgroundColor: '#f8f8f8',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }
            }, [lynx.text({ content: '프로필 편집' })]) :
            lynx.button({
              style: {
                flex: 1,
                padding: '8px',
                backgroundColor: '#fe2c55',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }
            }, [lynx.text({ content: '팔로우' })]),
            
          lynx.button({
            onclick: () => this.shareProfile(),
            style: {
              padding: '8px 16px',
              backgroundColor: '#f8f8f8',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer'
            }
          }, [lynx.text({ content: '↗' })])
        ]),
        
        // Bio
        this.user.bio && lynx.div({
          style: {
            fontSize: '14px',
            lineHeight: '1.4',
            marginBottom: '8px',
            whiteSpace: 'pre-wrap'
          }
        }, [lynx.text({ content: this.user.bio })]),
        
        // Website
        this.user.website && lynx.text({
          content: this.user.website,
          style: {
            fontSize: '14px',
            color: '#666',
            textDecoration: 'underline'
          }
        })
      ]),
      
      // Tabs
      lynx.div({
        style: {
          backgroundColor: '#fff',
          display: 'flex',
          borderBottom: '1px solid #eee'
        }
      }, [
        this.renderTab('videos', '📹', '비디오'),
        this.renderTab('liked', '❤️', '좋아요'),
        this.renderTab('private', '🔒', '비공개')
      ]),
      
      // Content Grid
      lynx.div({
        style: {
          backgroundColor: '#fff',
          padding: '2px',
          paddingBottom: '80px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2px'
        }
      }, 
        this.activeTab === 'videos' ? 
          this.videos.map(video => this.renderVideoThumbnail(video)) :
        this.activeTab === 'liked' && this.likedVideosList && this.likedVideosList.length > 0 ?
          this.likedVideosList.map(video => this.renderVideoThumbnail(video)) :
          [lynx.div({
            style: {
              gridColumn: '1 / -1',
              padding: '40px',
              textAlign: 'center',
              color: '#666'
            }
          }, [lynx.text({ content: '아직 콘텐츠가 없습니다' })])]
      ),
      
      // Bottom Navigation
      lynx.element('navigation-bar', {
        activeTab: 'profile'
      })
    ])
  }
  
  renderStat(label, value) {
    return lynx.div({
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer'
      }
    }, [
      lynx.text({
        content: this.formatNumber(value),
        style: { fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }
      }),
      lynx.text({
        content: label,
        style: { fontSize: '13px', color: '#666' }
      })
    ])
  }
  
  renderTab(id, icon, label) {
    const isActive = this.activeTab === id
    return lynx.div({
      onclick: () => this.switchTab(id),
      style: {
        flex: 1,
        padding: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        cursor: 'pointer',
        borderBottom: isActive ? '2px solid #000' : '2px solid transparent'
      }
    }, [
      lynx.text({ content: icon }),
      lynx.text({
        content: label,
        style: {
          fontSize: '14px',
          fontWeight: isActive ? 'bold' : 'normal',
          color: isActive ? '#000' : '#666'
        }
      })
    ])
  }
  
  renderVideoThumbnail(video) {
    return lynx.div({
      style: {
        position: 'relative',
        paddingBottom: '133.33%',
        backgroundColor: '#ddd',
        cursor: 'pointer',
        backgroundImage: `url(${video.thumbnail})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }
    }, [
      lynx.div({
        style: {
          position: 'absolute',
          bottom: '4px',
          left: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          color: '#fff',
          fontSize: '12px',
          textShadow: '0 1px 2px rgba(0,0,0,0.5)'
        }
      }, [
        lynx.text({ content: '▶' }),
        lynx.text({ content: this.formatNumber(video.views) })
      ])
    ])
  }
}

window.ProfilePage = ProfilePage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProfilePage
}