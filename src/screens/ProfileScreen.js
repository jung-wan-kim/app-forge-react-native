import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { supabase } from '../config/supabase';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const VIDEO_WIDTH = (SCREEN_WIDTH - 4) / 3;

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [activeTab, setActiveTab] = useState('videos');
  const [stats, setStats] = useState({
    following: 142,
    followers: 10234,
    likes: 89432,
  });

  useEffect(() => {
    loadUserData();
    loadUserVideos();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser({
        id: user?.id || 'anonymous',
        username: 'my_username',
        name: '내 이름',
        bio: '틱톡을 즐기는 중 🎥',
        avatar: null,
      });
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const loadUserVideos = async () => {
    // Mock 데이터 사용
    const mockVideos = [
      { id: '1', thumbnail: null, views: 15234 },
      { id: '2', thumbnail: null, views: 8923 },
      { id: '3', thumbnail: null, views: 45678 },
      { id: '4', thumbnail: null, views: 2341 },
      { id: '5', thumbnail: null, views: 67890 },
      { id: '6', thumbnail: null, views: 12345 },
    ];
    setVideos(mockVideos);
  };

  const renderVideo = ({ item }) => (
    <TouchableOpacity style={styles.videoItem}>
      <View style={styles.videoThumbnail}>
        <Icon name="play-arrow" size={30} color="#fff" />
      </View>
      <View style={styles.viewsContainer}>
        <Icon name="play-arrow" size={12} color="#fff" />
        <Text style={styles.viewsText}>{item.views.toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="person-add" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.username}>@{user?.username || 'username'}</Text>
        <TouchableOpacity>
          <Icon name="menu" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Icon name="person" size={50} color="#666" />
          </View>
        </View>

        <Text style={styles.name}>{user?.name || '이름'}</Text>
        <Text style={styles.bio}>{user?.bio || ''}</Text>

        <View style={styles.statsContainer}>
          <TouchableOpacity style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.following}</Text>
            <Text style={styles.statLabel}>팔로잉</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.followers.toLocaleString()}</Text>
            <Text style={styles.statLabel}>팔로워</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.likes.toLocaleString()}</Text>
            <Text style={styles.statLabel}>좋아요</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>프로필 편집</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton}>
            <Icon name="share" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'videos' && styles.activeTab]}
          onPress={() => setActiveTab('videos')}
        >
          <Icon name="grid-on" size={24} color={activeTab === 'videos' ? '#000' : '#999'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'likes' && styles.activeTab]}
          onPress={() => setActiveTab('likes')}
        >
          <Icon name="favorite-border" size={24} color={activeTab === 'likes' ? '#000' : '#999'} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={videos}
        renderItem={renderVideo}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.videosContainer}
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  avatarContainer: {
    marginVertical: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 50,
    borderRadius: 4,
    marginRight: 4,
  },
  editButtonText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  shareButton: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 4,
    marginLeft: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  videosContainer: {
    paddingBottom: 20,
  },
  videoItem: {
    width: VIDEO_WIDTH,
    height: VIDEO_WIDTH * 1.3,
    backgroundColor: '#f0f0f0',
    margin: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
  },
  viewsContainer: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewsText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 2,
    fontWeight: '600',
  },
});

export default ProfileScreen;