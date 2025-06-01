import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  StatusBar,
  Text,
  TouchableOpacity,
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { supabase } from '../config/supabase';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

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
              <View style={styles.profileImage} />
              <View style={styles.followButton}>
                <Icon name="add" size={12} color="#fff" />
              </View>
            </TouchableOpacity>

            {/* 좋아요 */}
            <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
              <Icon
                name={liked ? 'favorite' : 'favorite-border'}
                size={30}
                color={liked ? '#ff2b54' : '#fff'}
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
              <Text style={styles.actionText}>{item.shares || 0}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 일시정지 아이콘 */}
      {paused && (
        <View style={styles.pausedOverlay}>
          <Icon name="play-arrow" size={80} color="rgba(255,255,255,0.8)" />
        </View>
      )}
    </View>
  );
};

const HomeScreen = () => {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      // Supabase에서 동영상 가져오기
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          users (
            username,
            profile_image_url
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        // 데이터 형식 맞추기
        const formattedVideos = data.map(video => ({
          id: video.id,
          video_url: video.video_url,
          description: video.description,
          user: video.users,
          likes_count: video.like_count,
          comments_count: video.comment_count,
          shares: video.share_count,
        }));
        setVideos(formattedVideos);
      } else {
        // 데이터가 없으면 Mock 데이터 사용
        const mockVideos = [
          {
            id: '1',
            video_url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
            description: '새로운 댄스 챌린지! 같이 해요 💃 #댄스챌린지 #틱톡댄스',
            user: { username: 'dancing_queen' },
            likes_count: 125400,
            comments_count: 3421,
            shares: 892,
          },
          {
            id: '2',
            video_url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_2mb.mp4',
            description: '오늘의 맛집 발견! 🍕🍔 #맛집 #먹스타그램',
            user: { username: 'foodie_paradise' },
            likes_count: 89234,
            comments_count: 1523,
            shares: 456,
          },
        ];
        setVideos(mockVideos);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading videos:', error);
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
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>로딩중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.headerText}>팔로잉</Text>
        </TouchableOpacity>
        <Text style={[styles.headerText, styles.headerTextActive]}>추천</Text>
        <TouchableOpacity>
          <Icon name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={videos}
        renderItem={({ item, index }) => (
          <VideoItem item={item} isActive={index === currentIndex} />
        )}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    paddingHorizontal: 20,
  },
  headerText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 20,
  },
  headerTextActive: {
    color: '#fff',
  },
  videoContainer: {
    height: SCREEN_HEIGHT,
    backgroundColor: '#000',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    width: 80,
    alignItems: 'center',
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  description: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 10,
  },
  profileButton: {
    marginBottom: 20,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#666',
    borderWidth: 2,
    borderColor: '#fff',
  },
  followButton: {
    position: 'absolute',
    bottom: -5,
    alignSelf: 'center',
    backgroundColor: '#ff2b54',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    marginBottom: 20,
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
  pausedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;