class CommentsPanel extends LynxComponent {
  static properties = {
    videoId: { type: String },
    isOpen: { type: Boolean },
    comments: { type: Array }
  }

  constructor() {
    super();
    this.videoId = ''
    this.isOpen = false
    this.comments = []
    this.isLoading = false
    this.commentText = ''
    this.currentUserId = 'test-user-1'
  }

  async connectedCallback() {
    if (this.videoId && this.isOpen) {
      await this.loadComments()
    }
  }

  async loadComments() {
    if (this.isLoading) return
    
    this.isLoading = true
    
    try {
      const script = document.createElement('script')
      script.type = 'module'
      script.textContent = `
        import { videosApi } from '/src/api/videos.js';
        const comments = await videosApi.getComments('${this.videoId}');
        window.dispatchEvent(new CustomEvent('comments-loaded', { detail: comments }));
      `
      document.head.appendChild(script)
      
      await new Promise((resolve) => {
        window.addEventListener('comments-loaded', (e) => {
          this.comments = e.detail
          resolve()
        }, { once: true })
      })
    } catch (error) {
      console.error('Error loading comments:', error)
      this.loadMockComments()
    } finally {
      this.isLoading = false
      this.render()
    }
  }

  loadMockComments() {
    this.comments = [
      {
        id: '1',
        content: '와 정말 멋져요! 👏',
        created_at: new Date().toISOString(),
        user: {
          username: 'user1',
          profile_picture: null
        }
      },
      {
        id: '2',
        content: '대박이네요 ㅋㅋㅋ',
        created_at: new Date(Date.now() - 3600000).toISOString(),
        user: {
          username: 'user2',
          profile_picture: null
        }
      }
    ]
  }

  async addComment() {
    if (!this.commentText.trim()) return
    
    const tempComment = {
      id: `temp-${Date.now()}`,
      content: this.commentText,
      created_at: new Date().toISOString(),
      user: {
        username: 'testuser',
        profile_picture: null
      }
    }
    
    this.comments = [tempComment, ...this.comments]
    const savedText = this.commentText
    this.commentText = ''
    this.render()
    
    try {
      const script = document.createElement('script')
      script.type = 'module'
      script.textContent = `
        import { videosApi } from '/src/api/videos.js';
        const comment = await videosApi.addComment('${this.videoId}', '${this.currentUserId}', '${savedText}');
        window.dispatchEvent(new CustomEvent('comment-added', { detail: comment }));
      `
      document.head.appendChild(script)
      
      await new Promise((resolve) => {
        window.addEventListener('comment-added', (e) => {
          const newComment = e.detail
          this.comments = this.comments.map(c => 
            c.id === tempComment.id ? newComment : c
          )
          resolve()
        }, { once: true })
      })
    } catch (error) {
      console.error('Error adding comment:', error)
      this.comments = this.comments.filter(c => c.id !== tempComment.id)
    } finally {
      this.render()
    }
  }

  close() {
    const event = new CustomEvent('close-comments', {
      bubbles: true,
      composed: true
    })
    this.dispatchEvent(event)
  }

  formatTime(dateString) {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    
    if (diff < 60000) return '방금'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}분 전`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}시간 전`
    return `${Math.floor(diff / 86400000)}일 전`
  }

  render() {
    if (!this.isOpen) return lynx.div()
    
    return lynx.div({
      style: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60vh',
        backgroundColor: '#fff',
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideUp 0.3s ease-out'
      }
    }, [
      lynx.div({
        style: {
          padding: '16px',
          borderBottom: '1px solid #eee',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }
      }, [
        lynx.text({
          content: `댓글 ${this.comments.length}개`,
          style: {
            fontSize: '16px',
            fontWeight: 'bold'
          }
        }),
        lynx.button({
          onclick: () => this.close(),
          style: {
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer'
          }
        }, [lynx.text({ content: '✕' })])
      ]),
      
      lynx.div({
        style: {
          flex: 1,
          overflowY: 'auto',
          padding: '16px'
        }
      }, 
        this.comments.map(comment => 
          lynx.div({
            style: {
              marginBottom: '16px',
              display: 'flex',
              gap: '12px'
            }
          }, [
            lynx.div({
              style: {
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#ddd',
                flexShrink: 0
              }
            }),
            lynx.div({
              style: { flex: 1 }
            }, [
              lynx.div({
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '4px'
                }
              }, [
                lynx.text({
                  content: `@${comment.user.username}`,
                  style: {
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }
                }),
                lynx.text({
                  content: this.formatTime(comment.created_at),
                  style: {
                    fontSize: '12px',
                    color: '#666'
                  }
                })
              ]),
              lynx.text({
                content: comment.content,
                style: {
                  fontSize: '14px',
                  lineHeight: '1.4'
                }
              })
            ])
          ])
        )
      ),
      
      lynx.div({
        style: {
          padding: '16px',
          borderTop: '1px solid #eee',
          display: 'flex',
          gap: '12px',
          alignItems: 'center'
        }
      }, [
        lynx.input({
          type: 'text',
          placeholder: '댓글 추가...',
          value: this.commentText,
          oninput: (e) => {
            this.commentText = e.target.value
          },
          onkeydown: (e) => {
            if (e.key === 'Enter') {
              this.addComment()
            }
          },
          style: {
            flex: 1,
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '20px',
            fontSize: '14px',
            outline: 'none'
          }
        }),
        lynx.button({
          onclick: () => this.addComment(),
          disabled: !this.commentText.trim(),
          style: {
            backgroundColor: this.commentText.trim() ? '#fe2c55' : '#ccc',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: this.commentText.trim() ? 'pointer' : 'not-allowed',
            fontSize: '18px'
          }
        }, [lynx.text({ content: '↑' })])
      ]),
      
      lynx.element('style', {}, [`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `])
    ])
  }
}

window.CommentsPanel = CommentsPanel
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CommentsPanel
}