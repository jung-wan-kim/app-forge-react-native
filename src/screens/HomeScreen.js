import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  StatusBar,
  Text,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '../config/supabase';
import VideoPlayer from '../components/VideoPlayer';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// 샘플 비디오 데이터 (네트워크 오류 시 대체용)
const SAMPLE_VIDEOS = [
  {
    id: '1',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    description: '멋진 댄스 챌린지! 함께 추어요 💃 #댄스 #챌린지 #트렌드 #fyp',
    user: {
      username: 'dancer_kim',
      profile_picture: null,
    },
    likes_count: 12500,
    comments_count: 230,
    shares_count: 145,
    music: '♬ Original Sound - dancer_kim',
  },
  {
    id: '2',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    description: '오늘의 요리 🍳 초간단 파스타 레시피 #요리 #레시피 #파스타 #먹방',
    user: {
      username: 'cook_lee',
      profile_picture: null,
    },
    likes_count: 8700,
    comments_count: 156,
    shares_count: 89,
    music: '♬ Cooking Time - BGM President',
  },
];


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
          <VideoPlayer item={item} isActive={index === currentIndex} />
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