class SearchPage extends LynxComponent {
  constructor() {
    super();
    this.searchQuery = '';
    this.searchResults = [];
    this.trendingHashtags = [
      { tag: '댄스챌린지', count: '1.2M' },
      { tag: '맛집투어', count: '892K' },
      { tag: '펫스타그램', count: '756K' },
      { tag: '여행브이로그', count: '623K' },
      { tag: '코미디', count: '512K' },
      { tag: '뷰티팁', count: '445K' },
      { tag: '운동루틴', count: '389K' },
      { tag: '요리레시피', count: '334K' }
    ];
    this.recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
  }
  
  handleSearch(value) {
    this.searchQuery = value;
    if (value.trim()) {
      this.performSearch();
    } else {
      this.searchResults = [];
      this.render();
    }
  }
  
  performSearch() {
    // Mock search results
    const allVideos = [
      { id: '1', username: 'dancing_queen', description: '새로운 댄스 챌린지!' },
      { id: '2', username: 'foodie_paradise', description: '오늘의 맛집 발견!' },
      { id: '3', username: 'comedy_king', description: 'ㅋㅋㅋㅋ 이거 보고 안 웃으면 인정' },
      { id: '4', username: 'travel_diary', description: '제주도 여행 브이로그' },
      { id: '5', username: 'pet_lover', description: '우리집 강아지가 너무 귀여워요' }
    ];
    
    this.searchResults = allVideos.filter(video => 
      video.username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    
    // Save to recent searches
    if (!this.recentSearches.includes(this.searchQuery)) {
      this.recentSearches.unshift(this.searchQuery);
      this.recentSearches = this.recentSearches.slice(0, 10);
      localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches));
    }
    
    this.render();
  }
  
  clearRecentSearches() {
    this.recentSearches = [];
    localStorage.removeItem('recentSearches');
    this.render();
  }
  
  searchHashtag(tag) {
    this.searchQuery = '#' + tag;
    this.handleSearch(this.searchQuery);
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
        overflowY: 'auto'
      }
    }, [
      // Search Header
      lynx.div({
        style: {
          backgroundColor: '#fff',
          padding: '16px',
          paddingTop: 'calc(env(safe-area-inset-top) + 16px)',
          borderBottom: '1px solid #eee',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }
      }, [
        lynx.div({
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }
        }, [
          lynx.input({
            type: 'text',
            placeholder: '검색',
            value: this.searchQuery,
            oninput: (e) => this.handleSearch(e.target.value),
            style: {
              flex: 1,
              padding: '10px 16px',
              backgroundColor: '#f0f0f0',
              border: 'none',
              borderRadius: '20px',
              fontSize: '16px',
              outline: 'none'
            }
          }),
          lynx.button({
            onclick: () => window.dispatchEvent(new CustomEvent('navigation', { detail: { tab: 'home' } })),
            style: {
              background: 'none',
              border: 'none',
              fontSize: '16px',
              cursor: 'pointer',
              padding: '8px'
            }
          }, [lynx.text({ content: '취소' })])
        ])
      ]),
      
      // Search Results or Default Content
      this.searchQuery.trim() ? 
        // Search Results
        lynx.div({
          style: { backgroundColor: '#fff', marginTop: '8px' }
        }, [
          lynx.div({
            style: {
              padding: '16px',
              borderBottom: '1px solid #eee'
            }
          }, [
            lynx.text({
              content: `'${this.searchQuery}' 검색 결과`,
              style: { fontWeight: 'bold' }
            })
          ]),
          
          ...this.searchResults.map(result => 
            lynx.div({
              style: {
                padding: '16px',
                borderBottom: '1px solid #f0f0f0',
                cursor: 'pointer'
              },
              onclick: () => console.log('View video:', result.id)
            }, [
              lynx.text({
                content: `@${result.username}`,
                style: {
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginBottom: '4px',
                  display: 'block'
                }
              }),
              lynx.text({
                content: result.description,
                style: {
                  fontSize: '14px',
                  color: '#666'
                }
              })
            ])
          ),
          
          this.searchResults.length === 0 && lynx.div({
            style: {
              padding: '40px',
              textAlign: 'center',
              color: '#666'
            }
          }, [lynx.text({ content: '검색 결과가 없습니다' })])
        ]) :
        
        // Default Content (Recent & Trending)
        lynx.div({}, [
          // Recent Searches
          this.recentSearches.length > 0 && lynx.div({
            style: {
              backgroundColor: '#fff',
              marginTop: '8px'
            }
          }, [
            lynx.div({
              style: {
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #eee'
              }
            }, [
              lynx.text({
                content: '최근 검색',
                style: { fontWeight: 'bold' }
              }),
              lynx.button({
                onclick: () => this.clearRecentSearches(),
                style: {
                  background: 'none',
                  border: 'none',
                  color: '#666',
                  fontSize: '14px',
                  cursor: 'pointer'
                }
              }, [lynx.text({ content: '모두 지우기' })])
            ]),
            
            ...this.recentSearches.map(search => 
              lynx.div({
                style: {
                  padding: '12px 16px',
                  borderBottom: '1px solid #f0f0f0',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                },
                onclick: () => this.handleSearch(search)
              }, [
                lynx.text({ content: '🕐', style: { fontSize: '16px' } }),
                lynx.text({ content: search })
              ])
            )
          ]),
          
          // Trending Hashtags
          lynx.div({
            style: {
              backgroundColor: '#fff',
              marginTop: '8px'
            }
          }, [
            lynx.div({
              style: {
                padding: '16px',
                borderBottom: '1px solid #eee'
              }
            }, [
              lynx.text({
                content: '인기 해시태그',
                style: { fontWeight: 'bold' }
              })
            ]),
            
            ...this.trendingHashtags.map((hashtag, index) => 
              lynx.div({
                style: {
                  padding: '16px',
                  borderBottom: '1px solid #f0f0f0',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                },
                onclick: () => this.searchHashtag(hashtag.tag)
              }, [
                lynx.div({
                  style: {
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#fe2c55',
                    color: '#fff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: 'bold'
                  }
                }, [lynx.text({ content: (index + 1).toString() })]),
                
                lynx.div({ style: { flex: 1 } }, [
                  lynx.text({
                    content: `#${hashtag.tag}`,
                    style: {
                      fontSize: '16px',
                      fontWeight: 'bold',
                      display: 'block',
                      marginBottom: '4px'
                    }
                  }),
                  lynx.text({
                    content: `${hashtag.count} 게시물`,
                    style: {
                      fontSize: '14px',
                      color: '#666'
                    }
                  })
                ])
              ])
            )
          ])
        ]),
      
      // Bottom Navigation
      lynx.element('navigation-bar', {
        activeTab: 'discover'
      })
    ]);
  }
}

window.SearchPage = SearchPage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SearchPage
}