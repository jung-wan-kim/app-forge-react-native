class UploadPage extends LynxComponent {
  constructor() {
    super();
    this.selectedFile = null
    this.videoPreviewUrl = null
    this.description = ''
    this.hashtags = []
    this.privacy = 'public'
    this.allowComments = true
    this.allowDuet = true
    this.isUploading = false
  }
  
  handleFileSelect(event) {
    const file = event.target.files[0]
    if (file && file.type.startsWith('video/')) {
      this.selectedFile = file
      this.videoPreviewUrl = URL.createObjectURL(file)
      this.render()
    } else {
      alert('비디오 파일을 선택해주세요')
    }
  }
  
  handleDescriptionChange(value) {
    this.description = value
    this.extractHashtags()
  }
  
  extractHashtags() {
    const hashtagRegex = /#[\w가-힣]+/g
    const matches = this.description.match(hashtagRegex) || []
    this.hashtags = matches.map(tag => tag.substring(1))
  }
  
  togglePrivacy() {
    this.privacy = this.privacy === 'public' ? 'private' : 'public'
    this.render()
  }
  
  toggleComments() {
    this.allowComments = !this.allowComments
    this.render()
  }
  
  toggleDuet() {
    this.allowDuet = !this.allowDuet
    this.render()
  }
  
  async uploadVideo() {
    if (!this.selectedFile || !this.description.trim()) {
      alert('비디오와 설명을 모두 입력해주세요')
      return
    }
    
    this.isUploading = true
    this.render()
    
    try {
      // Mock upload process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert('비디오가 성공적으로 업로드되었습니다!')
      
      // Reset form
      this.selectedFile = null
      this.videoPreviewUrl = null
      this.description = ''
      this.hashtags = []
      this.privacy = 'public'
      this.allowComments = true
      this.allowDuet = true
      
      // Navigate back to home
      window.dispatchEvent(new CustomEvent('navigation', { detail: { tab: 'home' } }))
    } catch (error) {
      console.error('Upload error:', error)
      alert('업로드 중 오류가 발생했습니다')
    } finally {
      this.isUploading = false
      this.render()
    }
  }
  
  cancel() {
    if (this.videoPreviewUrl) {
      URL.revokeObjectURL(this.videoPreviewUrl)
    }
    window.dispatchEvent(new CustomEvent('navigation', { detail: { tab: 'home' } }))
  }
  
  render() {
    return lynx.div({
      style: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column'
      }
    }, [
      // Header
      lynx.div({
        style: {
          padding: '16px',
          paddingTop: 'calc(env(safe-area-inset-top) + 16px)',
          borderBottom: '1px solid #eee',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }
      }, [
        lynx.button({
          onclick: () => this.cancel(),
          style: {
            background: 'none',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer'
          }
        }, [lynx.text({ content: '취소' })]),
        
        lynx.text({
          content: '새 게시물',
          style: {
            fontSize: '18px',
            fontWeight: 'bold'
          }
        }),
        
        lynx.button({
          onclick: () => this.uploadVideo(),
          disabled: !this.selectedFile || !this.description.trim() || this.isUploading,
          style: {
            background: 'none',
            border: 'none',
            fontSize: '16px',
            fontWeight: 'bold',
            color: this.selectedFile && this.description.trim() && !this.isUploading ? '#fe2c55' : '#ccc',
            cursor: this.selectedFile && this.description.trim() && !this.isUploading ? 'pointer' : 'not-allowed'
          }
        }, [lynx.text({ content: this.isUploading ? '업로드 중...' : '게시' })])
      ]),
      
      // Content
      lynx.div({
        style: {
          flex: 1,
          overflowY: 'auto',
          padding: '16px'
        }
      }, [
        // Video Preview or Upload Button
        !this.selectedFile ? 
          lynx.label({
            style: {
              display: 'block',
              width: '100%',
              aspectRatio: '9/16',
              maxHeight: '400px',
              backgroundColor: '#f8f8f8',
              border: '2px dashed #ddd',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              marginBottom: '24px'
            }
          }, [
            lynx.input({
              type: 'file',
              accept: 'video/*',
              onchange: (e) => this.handleFileSelect(e),
              style: { display: 'none' }
            }),
            lynx.text({
              content: '📹',
              style: { fontSize: '48px', marginBottom: '16px' }
            }),
            lynx.text({
              content: '비디오 선택',
              style: {
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '8px'
              }
            }),
            lynx.text({
              content: '또는 파일을 여기로 드래그하세요',
              style: {
                fontSize: '14px',
                color: '#666'
              }
            })
          ]) :
          lynx.div({
            style: {
              width: '100%',
              aspectRatio: '9/16',
              maxHeight: '400px',
              backgroundColor: '#000',
              borderRadius: '8px',
              overflow: 'hidden',
              marginBottom: '24px',
              position: 'relative'
            }
          }, [
            lynx.element('video', {
              src: this.videoPreviewUrl,
              controls: true,
              style: {
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }
            }),
            lynx.button({
              onclick: () => {
                URL.revokeObjectURL(this.videoPreviewUrl)
                this.selectedFile = null
                this.videoPreviewUrl = null
                this.render()
              },
              style: {
                position: 'absolute',
                top: '8px',
                right: '8px',
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                fontSize: '16px'
              }
            }, [lynx.text({ content: '✕' })])
          ]),
          
        // Description
        lynx.div({
          style: { marginBottom: '24px' }
        }, [
          lynx.label({
            style: {
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '8px',
              display: 'block'
            }
          }, [lynx.text({ content: '설명' })]),
          lynx.element('textarea', {
            placeholder: '설명을 입력하세요... #해시태그',
            value: this.description,
            oninput: (e) => this.handleDescriptionChange(e.target.value),
            style: {
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px',
              resize: 'vertical',
              minHeight: '100px',
              fontFamily: 'inherit'
            }
          })
        ]),
        
        // Hashtags
        this.hashtags.length > 0 && lynx.div({
          style: {
            marginBottom: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px'
          }
        }, 
          this.hashtags.map(tag => 
            lynx.div({
              style: {
                backgroundColor: '#f0f0f0',
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: '14px'
              }
            }, [lynx.text({ content: `#${tag}` })])
          )
        ),
        
        // Settings
        lynx.div({
          style: {
            borderTop: '1px solid #eee',
            paddingTop: '16px'
          }
        }, [
          // Privacy
          lynx.div({
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              cursor: 'pointer'
            },
            onclick: () => this.togglePrivacy()
          }, [
            lynx.div({}, [
              lynx.text({
                content: '공개 범위',
                style: {
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginBottom: '4px'
                }
              }),
              lynx.text({
                content: this.privacy === 'public' ? '모든 사람' : '나만 보기',
                style: {
                  fontSize: '14px',
                  color: '#666'
                }
              })
            ]),
            lynx.text({
              content: this.privacy === 'public' ? '🌐' : '🔒',
              style: { fontSize: '20px' }
            })
          ]),
          
          // Comments
          lynx.div({
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }
          }, [
            lynx.text({
              content: '댓글 허용',
              style: { fontSize: '16px' }
            }),
            lynx.div({
              onclick: () => this.toggleComments(),
              style: {
                width: '48px',
                height: '28px',
                backgroundColor: this.allowComments ? '#fe2c55' : '#ccc',
                borderRadius: '14px',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }
            }, [
              lynx.div({
                style: {
                  position: 'absolute',
                  top: '2px',
                  left: this.allowComments ? '22px' : '2px',
                  width: '24px',
                  height: '24px',
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                  transition: 'left 0.2s'
                }
              })
            ])
          ]),
          
          // Duet
          lynx.div({
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }
          }, [
            lynx.text({
              content: '듀엣 허용',
              style: { fontSize: '16px' }
            }),
            lynx.div({
              onclick: () => this.toggleDuet(),
              style: {
                width: '48px',
                height: '28px',
                backgroundColor: this.allowDuet ? '#fe2c55' : '#ccc',
                borderRadius: '14px',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }
            }, [
              lynx.div({
                style: {
                  position: 'absolute',
                  top: '2px',
                  left: this.allowDuet ? '22px' : '2px',
                  width: '24px',
                  height: '24px',
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                  transition: 'left 0.2s'
                }
              })
            ])
          ])
        ])
      ])
    ])
  }
}

window.UploadPage = UploadPage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UploadPage
}