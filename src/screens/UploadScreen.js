import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Video from 'react-native-video';
import * as ImagePicker from 'react-native-image-picker';
import { supabase } from '../config/supabase';

const UploadScreen = ({ navigation }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [uploading, setUploading] = useState(false);
  const [paused, setPaused] = useState(false);
  const videoRef = useRef(null);

  const selectVideo = () => {
    const options = {
      mediaType: 'video',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel || response.error) {
        return;
      }
      
      if (response.assets && response.assets[0]) {
        setSelectedVideo(response.assets[0]);
      }
    });
  };

  const recordVideo = () => {
    const options = {
      mediaType: 'video',
      includeBase64: false,
      cameraType: 'back',
      durationLimit: 60, // 60초 제한
    };

    ImagePicker.launchCamera(options, (response) => {
      if (response.didCancel || response.error) {
        return;
      }
      
      if (response.assets && response.assets[0]) {
        setSelectedVideo(response.assets[0]);
      }
    });
  };

  const uploadVideo = async () => {
    if (!selectedVideo || !description.trim()) {
      Alert.alert('알림', '동영상과 설명을 입력해주세요.');
      return;
    }

    setUploading(true);

    try {
      // 1. 파일명 생성
      const fileName = `videos/${Date.now()}_${Math.random().toString(36).substring(7)}.mp4`;
      
      // 2. 동영상을 Supabase Storage에 업로드
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(fileName, {
          uri: selectedVideo.uri,
          type: 'video/mp4',
          name: fileName,
        });

      if (uploadError) {
        throw uploadError;
      }

      // 3. 동영상 URL 가져오기
      const { data: urlData } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName);

      // 4. 데이터베이스에 동영상 정보 저장
      const { data: { user } } = await supabase.auth.getUser();
      
      // 해시태그 처리
      const hashtagList = hashtags.split(' ').filter(tag => tag.startsWith('#'));
      
      const { data, error } = await supabase
        .from('videos')
        .insert([{
          video_url: urlData.publicUrl,
          description: description.trim(),
          user_id: user?.id || 'anonymous',
          thumbnail_url: null, // 썸네일은 나중에 추가
          duration: 0, // 동영상 길이는 나중에 추가
          view_count: 0,
          like_count: 0,
          comment_count: 0,
          share_count: 0,
          is_private: false,
        }]);
      
      // TODO: 해시태그 저장 로직 추가

      if (error) {
        throw error;
      }

      Alert.alert(
        '업로드 완료',
        '동영상이 성공적으로 업로드되었습니다.',
        [
          { 
            text: '확인', 
            onPress: () => {
              // 업로드 후 홈으로 이동
              navigation.navigate('Home');
              // 상태 초기화
              setSelectedVideo(null);
              setDescription('');
              setHashtags('');
            }
          }
        ]
      );
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('오류', '동영상 업로드 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>새 동영상</Text>
        <TouchableOpacity 
          style={[styles.postButton, (!selectedVideo || !description.trim()) && styles.postButtonDisabled]}
          onPress={uploadVideo}
          disabled={!selectedVideo || !description.trim() || uploading}
        >
          {uploading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.postButtonText}>게시</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {!selectedVideo ? (
          <View style={styles.uploadSection}>
            <TouchableOpacity style={styles.uploadButton} onPress={recordVideo}>
              <Icon name="videocam" size={40} color="#000" />
              <Text style={styles.uploadButtonText}>동영상 촬영</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.uploadButton} onPress={selectVideo}>
              <Icon name="photo-library" size={40} color="#000" />
              <Text style={styles.uploadButtonText}>갤러리에서 선택</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.previewSection}>
            <TouchableOpacity 
              style={styles.videoPreview}
              onPress={() => setPaused(!paused)}
            >
              <Video
                ref={videoRef}
                source={{ uri: selectedVideo.uri }}
                style={styles.video}
                paused={paused}
                repeat
                resizeMode="cover"
              />
              {paused && (
                <View style={styles.playOverlay}>
                  <Icon name="play-arrow" size={60} color="rgba(255,255,255,0.8)" />
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.changeVideoButton}
              onPress={() => setSelectedVideo(null)}
            >
              <Text style={styles.changeVideoText}>동영상 변경</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>설명</Text>
          <TextInput
            style={styles.descriptionInput}
            placeholder="동영상에 대한 설명을 입력하세요..."
            placeholderTextColor="#999"
            value={description}
            onChangeText={setDescription}
            multiline
            maxLength={150}
          />
          <Text style={styles.charCount}>{description.length}/150</Text>

          <Text style={styles.inputLabel}>해시태그</Text>
          <TextInput
            style={styles.hashtagInput}
            placeholder="#해시태그 #틱톡 #동영상"
            placeholderTextColor="#999"
            value={hashtags}
            onChangeText={setHashtags}
          />
        </View>

        <View style={styles.settingsSection}>
          <TouchableOpacity style={styles.settingItem}>
            <Icon name="people" size={24} color="#000" />
            <Text style={styles.settingText}>누가 이 동영상을 볼 수 있나요?</Text>
            <Text style={styles.settingValue}>모든 사람</Text>
            <Icon name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Icon name="comment" size={24} color="#000" />
            <Text style={styles.settingText}>댓글 허용</Text>
            <Text style={styles.settingValue}>모든 사람</Text>
            <Icon name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  postButton: {
    backgroundColor: '#ff2b54',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  postButtonDisabled: {
    backgroundColor: '#ffb3c1',
  },
  postButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  uploadSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 32,
  },
  uploadButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 120,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  uploadButtonText: {
    marginTop: 8,
    fontSize: 14,
    color: '#000',
  },
  previewSection: {
    padding: 16,
    alignItems: 'center',
  },
  videoPreview: {
    width: 200,
    height: 280,
    backgroundColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  changeVideoButton: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  changeVideoText: {
    fontSize: 14,
    color: '#000',
  },
  inputSection: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  descriptionInput: {
    minHeight: 80,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000',
    textAlignVertical: 'top',
  },
  charCount: {
    textAlign: 'right',
    marginTop: 4,
    fontSize: 12,
    color: '#999',
  },
  hashtagInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#000',
  },
  settingsSection: {
    padding: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#000',
  },
  settingValue: {
    fontSize: 14,
    color: '#999',
    marginRight: 8,
  },
});

export default UploadScreen;