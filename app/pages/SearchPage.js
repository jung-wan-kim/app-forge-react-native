class SearchPage extends LynxComponent {
  constructor() {
    super();
    this.searchQuery = ''
    this.searchResults = {
      users: [],
      videos: [],
      hashtags: []
    }
    this.isLoading = false
    this.activeTab = 'top' // top, users, videos, hashtags
    this.trendingHashtags = []
    this.searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]')
  }
  
  async connectedCallback() {
    await this.loadTrendingHashtags()
  }
  
  async loadTrendingHashtags() {
    try {
      // 일단 mock 데이터 사용
      this.trendingHashtags = [
        { name: '댄스챌린지', usage_count: 1200000 },
        { name: '맛집', usage_count: 892000 },
        { name: '여행', usage_count: 756000 },
        { name: '펫', usage_count: 623000 },
        { name: '요리', usage_count: 512000 },
        { name: 'OOTD', usage_count: 445000 },
        { name: '운동', usage_count: 389000 },
        { name: '일상', usage_count: 334000 }
      ];
      this.render();
    } catch (error) {
      console.error('Error loading trending hashtags:', error);
    }
  }
  
  async handleSearch(query) {
    if (!query.trim()) {
      this.searchQuery = '';
      this.render();
      return;
    }
    
    this.searchQuery = query;
    this.isLoading = true;
    this.render();
    
    // 검색 기록에 추가
    this.addToSearchHistory(query);
    
    // Mock search results
    setTimeout(() => {
      this.searchResults = {
        users: [
          { id: '1', username: 'dancing_queen', full_name: '춤추는 여왕', follower_count: 125400, verified: true },
          { id: '2', username: 'foodie_paradise', full_name: '맛집 탐험가', follower_count: 89234, verified: false }
        ],
        videos: [
          { id: '1', description: '새로운 댄스 챌린지!', view_count: 125400, likes_count: 12540, user: { username: 'dancing_queen' } },
          { id: '2', description: '오늘의 맛집 발견!', view_count: 89234, likes_count: 8923, user: { username: 'foodie_paradise' } },
          { id: '3', description: 'ㅋㅋㅋㅋ 이거 보고 안 웃으면 인정', view_count: 234567, likes_count: 23456, user: { username: 'comedy_king' } }
        ],
        hashtags: [
          { name: query.replace('#', ''), usage_count: 50000 }
        ]
      };
      
      this.isLoading = false;
      this.render();
    }, 500);
  }
  
  addToSearchHistory(query) {
    const history = this.searchHistory.filter(item => item !== query);
    history.unshift(query);
    this.searchHistory = history.slice(0, 10); // 최대 10개까지
    localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
  }
  
  clearSearchHistory() {
    this.searchHistory = [];
    localStorage.removeItem('searchHistory');
    this.render();
  }
  
  removeFromHistory(query) {
    this.searchHistory = this.searchHistory.filter(item => item !== query);
    localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    this.render();
  }
  
  switchTab(tab) {
    this.activeTab = tab;
    this.render();
  }
  
  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }
  
  render() {
    return lynx.div({
      style: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#f8f8f8',
        display: 'flex',
        flexDirection: 'column'
      }
    }, [
      // Header with search bar
      lynx.div({
        style: {
          backgroundColor: '#fff',
          padding: '16px',
          paddingTop: 'calc(env(safe-area-inset-top) + 16px)',
          borderBottom: '1px solid #eee'
        }
      }, [
        lynx.div({
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }
        }, [
          lynx.button({
            onclick: () => window.dispatchEvent(new CustomEvent('navigation', { detail: { tab: 'home' } })),
            style: {
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer'
            }
          }, [lynx.text({ content: '←' })]),
          
          lynx.input({
            type: 'search',
            placeholder: '검색',
            value: this.searchQuery,
            oninput: (e) => {
              this.searchQuery = e.target.value;
            },
            onkeypress: (e) => {
              if (e.key === 'Enter') {
                this.handleSearch(e.target.value);
              }
            },
            style: {
              flex: 1,
              padding: '10px 16px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: '#f0f0f0',
              fontSize: '16px',
              outline: 'none'
            }
          })
        ])
      ]),
      
      // Content
      lynx.div({
        style: {
          flex: 1,
          overflowY: 'auto',
          backgroundColor: '#fff'
        }
      }, [
        // Loading state
        this.isLoading && lynx.div({
          style: {
            padding: '40px',
            textAlign: 'center'
          }
        }, [lynx.text({ content: '검색 중...' })]),
        
        // No search query - show trending and history
        !this.searchQuery && !this.isLoading && lynx.div({}, [
          // Search history
          this.searchHistory.length > 0 && lynx.div({
            style: { padding: '16px' }
          }, [
            lynx.div({
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px'
              }
            }, [
              lynx.text({
                content: '최근 검색',
                style: {
                  fontSize: '16px',
                  fontWeight: 'bold'
                }
              }),
              lynx.button({
                onclick: () => this.clearSearchHistory(),
                style: {
                  background: 'none',
                  border: 'none',
                  color: '#666',
                  fontSize: '14px',
                  cursor: 'pointer'
                }
              }, [lynx.text({ content: '모두 지우기' })])
            ]),
            
            this.searchHistory.map(query => 
              lynx.div({
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: '1px solid #f0f0f0'
                }
              }, [
                lynx.div({
                  onclick: () => this.handleSearch(query),
                  style: {
                    flex: 1,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }
                }, [
                  lynx.text({ content: '🔍', style: { fontSize: '16px' } }),
                  lynx.text({ content: query })
                ]),
                lynx.button({
                  onclick: () => this.removeFromHistory(query),
                  style: {
                    background: 'none',
                    border: 'none',
                    color: '#999',
                    fontSize: '18px',
                    cursor: 'pointer'
                  }
                }, [lynx.text({ content: '×' })])
              ])
            )
          ]),
          
          // Trending hashtags
          lynx.div({
            style: { padding: '16px' }
          }, [
            lynx.text({
              content: '인기 해시태그',
              style: {
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '16px',
                display: 'block'
              }
            }),
            lynx.div({
              style: {
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }
            }, 
              this.trendingHashtags.map(hashtag => 
                lynx.button({
                  onclick: () => this.handleSearch(`#${hashtag.name}`),
                  style: {
                    backgroundColor: '#f0f0f0',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }
                }, [
                  lynx.text({ content: `#${hashtag.name}` }),
                  hashtag.usage_count > 0 && lynx.text({
                    content: ` ${this.formatNumber(hashtag.usage_count)}`,
                    style: { color: '#666' }
                  })
                ])
              )
            )
          ])
        ]),
        
        // Search results
        this.searchQuery && !this.isLoading && lynx.div({}, [
          // Tabs
          lynx.div({
            style: {
              display: 'flex',
              borderBottom: '1px solid #eee'
            }
          }, [
            this.renderTab('top', '인기'),
            this.renderTab('users', '계정'),
            this.renderTab('videos', '동영상'),
            this.renderTab('hashtags', '해시태그')
          ]),
          
          // Tab content
          lynx.div({
            style: { padding: '16px' }
          }, [
            this.activeTab === 'top' && this.renderTopResults(),
            this.activeTab === 'users' && this.renderUserResults(),
            this.activeTab === 'videos' && this.renderVideoResults(),
            this.activeTab === 'hashtags' && this.renderHashtagResults()
          ])
        ])
      ]),
      
      // Bottom navigation
      lynx.element('navigation-bar', {
        activeTab: 'search'
      })
    ])
  }
  
  renderTab(id, label) {
    const isActive = this.activeTab === id;
    return lynx.button({
      onclick: () => this.switchTab(id),
      style: {
        flex: 1,
        padding: '16px',
        backgroundColor: '#fff',
        border: 'none',
        borderBottom: isActive ? '2px solid #000' : '2px solid transparent',
        fontSize: '14px',
        fontWeight: isActive ? 'bold' : 'normal',
        color: isActive ? '#000' : '#666',
        cursor: 'pointer'
      }
    }, [lynx.text({ content: label })])
  }
  
  renderTopResults() {
    const hasResults = this.searchResults.users.length > 0 || 
                      this.searchResults.videos.length > 0 || 
                      this.searchResults.hashtags.length > 0;
    
    if (!hasResults) {
      return lynx.div({
        style: {
          padding: '40px',
          textAlign: 'center',
          color: '#666'
        }
      }, [lynx.text({ content: '검색 결과가 없습니다' })])
    }
    
    return lynx.div({}, [
      // Top users
      this.searchResults.users.length > 0 && lynx.div({
        style: { marginBottom: '24px' }
      }, [
        lynx.text({
          content: '계정',
          style: {
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '12px',
            display: 'block'
          }
        }),
        this.searchResults.users.slice(0, 3).map(user => this.renderUserItem(user))
      ]),
      
      // Top videos
      this.searchResults.videos.length > 0 && lynx.div({}, [
        lynx.text({
          content: '동영상',
          style: {
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '12px',
            display: 'block'
          }
        }),
        lynx.div({
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2px'
          }
        }, this.searchResults.videos.slice(0, 6).map(video => this.renderVideoThumbnail(video)))
      ])
    ])
  }
  
  renderUserResults() {
    if (this.searchResults.users.length === 0) {
      return lynx.div({
        style: {
          padding: '40px',
          textAlign: 'center',
          color: '#666'
        }
      }, [lynx.text({ content: '사용자를 찾을 수 없습니다' })])
    }
    
    return lynx.div({}, 
      this.searchResults.users.map(user => this.renderUserItem(user))
    )
  }
  
  renderVideoResults() {
    if (this.searchResults.videos.length === 0) {
      return lynx.div({
        style: {
          padding: '40px',
          textAlign: 'center',
          color: '#666'
        }
      }, [lynx.text({ content: '동영상을 찾을 수 없습니다' })])
    }
    
    return lynx.div({
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '2px',
        margin: '-16px'
      }
    }, this.searchResults.videos.map(video => this.renderVideoThumbnail(video)))
  }
  
  renderHashtagResults() {
    if (this.searchResults.hashtags.length === 0) {
      return lynx.div({
        style: {
          padding: '40px',
          textAlign: 'center',
          color: '#666'
        }
      }, [lynx.text({ content: '해시태그를 찾을 수 없습니다' })])
    }
    
    return lynx.div({}, 
      this.searchResults.hashtags.map(hashtag => 
        lynx.div({
          onclick: () => this.handleSearch(`#${hashtag.name}`),
          style: {
            padding: '16px 0',
            borderBottom: '1px solid #f0f0f0',
            cursor: 'pointer'
          }
        }, [
          lynx.div({
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }
          }, [
            lynx.text({
              content: `#${hashtag.name}`,
              style: {
                fontSize: '16px',
                fontWeight: 'bold'
              }
            }),
            lynx.text({
              content: `${this.formatNumber(hashtag.usage_count)} 게시물`,
              style: {
                fontSize: '14px',
                color: '#666'
              }
            })
          ])
        ])
      )
    )
  }
  
  renderUserItem(user) {
    return lynx.div({
      onclick: () => window.dispatchEvent(new CustomEvent('navigation', { 
        detail: { tab: 'profile', userId: user.id } 
      })),
      style: {
        display: 'flex',
        alignItems: 'center',
        padding: '12px 0',
        cursor: 'pointer'
      }
    }, [
      lynx.div({
        style: {
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: '#ddd',
          marginRight: '12px',
          backgroundImage: user.profile_picture ? `url(${user.profile_picture})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }
      }),
      lynx.div({
        style: { flex: 1 }
      }, [
        lynx.div({
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }
        }, [
          lynx.text({
            content: `@${user.username}`,
            style: {
              fontSize: '16px',
              fontWeight: 'bold'
            }
          }),
          user.verified && lynx.text({
            content: '✓',
            style: {
              color: '#20D5EC',
              fontSize: '14px'
            }
          })
        ]),
        user.full_name && lynx.text({
          content: user.full_name,
          style: {
            fontSize: '14px',
            color: '#666'
          }
        }),
        lynx.text({
          content: `${this.formatNumber(user.follower_count || 0)} 팔로워`,
          style: {
            fontSize: '12px',
            color: '#999'
          }
        })
      ])
    ])
  }
  
  renderVideoThumbnail(video) {
    const thumbnailUrl = video.thumbnail_url || 'https://picsum.photos/200/300?random=' + video.id;
    return lynx.div({
      onclick: () => window.dispatchEvent(new CustomEvent('navigation', { 
        detail: { tab: 'video', videoId: video.id } 
      })),
      style: {
        position: 'relative',
        paddingBottom: '133.33%',
        backgroundColor: '#ddd',
        cursor: 'pointer',
        backgroundImage: `url(${thumbnailUrl})`,
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
        lynx.text({ content: this.formatNumber(video.view_count || 0) })
      ])
    ])
  }
}

window.SearchPage = SearchPage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SearchPage
}