import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  StatusBar,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { supabase } from '../config/supabase';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// 샘플 비디오 데이터 (네트워크 오류 시 대체용)
const SAMPLE_VIDEOS = [
  {
    id: '1',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    description: '샘플 비디오 1',
    user: {
      username: 'testuser1',
      profile_picture: null,
    },
    likes_count: 100,
    comments_count: 20,
    shares_count: 5,
  },
  {
    id: '2',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    description: '샘플 비디오 2',
    user: {
      username: 'testuser2',
      profile_picture: null,
    },
    likes_count: 200,
    comments_count: 30,
    shares_count: 10,
  },
];

const VideoItem = ({ item, isActive }) => {
  const [paused, setPaused] = useState(!isActive);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setPaused(!isActive);
  }, [isActive]);

  const handleLike = () => {
    setLiked(!liked);
    // TODO: Supabase에 좋아요 저장
  };

  return (
    <View style={styles.videoContainer}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setPaused(!paused)}
        style={StyleSheet.absoluteFillObject}
      >
        <Video
          source={{ uri: item.video_url }}
          style={styles.video}
          paused={paused}
          repeat
          resizeMode="cover"
        />
      </TouchableOpacity>

      {/* 비디오 정보 */}
      <View style={styles.overlay}>
        <View style={styles.bottomSection}>
          <View style={styles.leftSection}>
            <Text style={styles.username}>@{item.user?.username || 'unknown'}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>

          <View style={styles.rightSection}>
            {/* 프로필 */}
            <TouchableOpacity style={styles.profileButton}>
              <View style={styles.profileImage}>
                <Icon name="person" size={20} color="#fff" />
              </View>
            </TouchableOpacity>

            {/* 좋아요 */}
            <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
              <Icon
                name={liked ? "favorite" : "favorite-border"}
                size={30}
                color={liked ? "#ff4757" : "#fff"}
              />
              <Text style={styles.actionText}>{item.likes_count || 0}</Text>
            </TouchableOpacity>

            {/* 댓글 */}
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="chat-bubble-outline" size={30} color="#fff" />
              <Text style={styles.actionText}>{item.comments_count || 0}</Text>
            </TouchableOpacity>

            {/* 공유 */}
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="share" size={30} color="#fff" />
              <Text style={styles.actionText}>{item.shares_count || 0}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 일시정지 아이콘 */}
      {paused && (
        <View style={styles.pauseIcon}>
          <Icon name="play-arrow" size={80} color="rgba(255,255,255,0.8)" />
        </View>
      )}
    </View>
  );
};

export default function HomeScreen() {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          user:users!user_id(
            id,
            username,
            profile_picture
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error loading videos:', error);
        setError(error.message);
        // 오류 발생 시 샘플 데이터 사용
        setVideos(SAMPLE_VIDEOS);
      } else {
        setVideos(data || SAMPLE_VIDEOS);
      }
    } catch (error) {
      console.error('Error loading videos:', error);
      setError(error.message);
      // 네트워크 오류 시 샘플 데이터 사용
      setVideos(SAMPLE_VIDEOS);
    } finally {
      setLoading(false);
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>네트워크 오류 - 샘플 데이터 표시 중</Text>
        </View>
      )}

      <FlatList
        data={videos}
        renderItem={({ item, index }) => (
          <VideoItem item={item} isActive={index === currentIndex} />
        )}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  videoContainer: {
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingBottom: 80,
  },
  leftSection: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  rightSection: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 10,
  },
  profileButton: {
    marginBottom: 25,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
  },
  pauseIcon: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorBanner: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255,71,87,0.9)',
    padding: 10,
    borderRadius: 5,
    zIndex: 1000,
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 12,
  },
});