import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '../config/supabase';

// 샘플 사용자 데이터
const sampleUsers = [
  {
    username: 'dancer_kim',
    email: 'dancer@example.com',
    full_name: '김댄서',
    bio: '춤추는 것을 좋아해요 💃',
    profile_picture: null,
    verified: true,
  },
  {
    username: 'cook_lee',
    email: 'cook@example.com',
    full_name: '이요리',
    bio: '맛있는 요리 레시피 공유합니다 🍳',
    profile_picture: null,
    verified: false,
  },
  {
    username: 'travel_park',
    email: 'travel@example.com',
    full_name: '박여행',
    bio: '세계 여행중 ✈️',
    profile_picture: null,
    verified: true,
  },
];

// 샘플 비디오 데이터
const sampleVideos = [
  {
    title: '멋진 댄스 챌린지',
    description: '#댄스 #챌린지 #춤스타그램',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail_url: 'https://picsum.photos/200/300?random=1',
    tags: ['댄스', '챌린지', '트렌드'],
    category: 'dance',
    duration: 30,
    views_count: 1000,
    is_private: false,
  },
  {
    title: '오늘의 요리',
    description: '초간단 파스타 레시피 #요리 #레시피 #파스타',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail_url: 'https://picsum.photos/200/300?random=2',
    tags: ['요리', '레시피', '파스타'],
    category: 'cooking',
    duration: 45,
    views_count: 2000,
    is_private: false,
  },
  {
    title: '제주도 여행 브이로그',
    description: '제주도 맛집 투어 #제주도 #여행 #맛집',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail_url: 'https://picsum.photos/200/300?random=3',
    tags: ['여행', '제주도', '브이로그'],
    category: 'travel',
    duration: 60,
    views_count: 3000,
    is_private: false,
  },
];

export default function AdminScreen() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const seedDatabase = async () => {
    try {
      setLoading(true);
      setStatus('시작: 데이터베이스 시딩...');

      // 1. 사용자 생성
      setStatus('사용자 생성중...');
      const { data: users, error: usersError } = await supabase
        .from('users')
        .insert(sampleUsers)
        .select();

      if (usersError) {
        throw new Error(`사용자 생성 오류: ${usersError.message}`);
      }

      setStatus(`${users.length}명의 사용자가 생성되었습니다.`);

      // 2. 비디오 생성
      setStatus('비디오 생성중...');
      const videosToInsert = sampleVideos.map((video, index) => ({
        ...video,
        user_id: users[index % users.length].id,
      }));

      const { data: videos, error: videosError } = await supabase
        .from('videos')
        .insert(videosToInsert)
        .select();

      if (videosError) {
        throw new Error(`비디오 생성 오류: ${videosError.message}`);
      }

      setStatus(`${videos.length}개의 비디오가 생성되었습니다.`);

      // 3. 샘플 좋아요 추가
      setStatus('좋아요 추가중...');
      const likes = [];
      for (const video of videos) {
        for (let i = 0; i < Math.min(2, users.length); i++) {
          likes.push({
            video_id: video.id,
            user_id: users[i].id,
          });
        }
      }

      if (likes.length > 0) {
        const { error: likesError } = await supabase
          .from('likes')
          .insert(likes);

        if (likesError) {
          console.error('좋아요 생성 오류:', likesError);
        }
      }

      // 4. 샘플 댓글 추가
      setStatus('댓글 추가중...');
      const sampleComments = [
        '멋져요! 👍',
        '대박이네요 ㅋㅋㅋ',
        '저도 해보고 싶어요',
        '우와 진짜 잘하시네요',
      ];

      const comments = [];
      for (const video of videos) {
        for (let i = 0; i < 2; i++) {
          comments.push({
            video_id: video.id,
            user_id: users[Math.floor(Math.random() * users.length)].id,
            content: sampleComments[Math.floor(Math.random() * sampleComments.length)],
          });
        }
      }

      if (comments.length > 0) {
        const { error: commentsError } = await supabase
          .from('comments')
          .insert(comments);

        if (commentsError) {
          console.error('댓글 생성 오류:', commentsError);
        }
      }

      setStatus('✅ 데이터베이스 시딩 완료!');
      Alert.alert('성공', '샘플 데이터가 성공적으로 추가되었습니다!');

    } catch (error) {
      console.error('오류 발생:', error);
      setStatus(`❌ 오류: ${error.message}`);
      Alert.alert('오류', error.message);
    } finally {
      setLoading(false);
    }
  };

  const clearDatabase = async () => {
    try {
      setLoading(true);
      setStatus('데이터베이스 정리중...');

      // 순서대로 삭제 (외래 키 제약 때문)
      await supabase.from('likes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('comments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('videos').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      setStatus('✅ 데이터베이스 정리 완료!');
      Alert.alert('성공', '데이터베이스가 정리되었습니다.');

    } catch (error) {
      console.error('오류 발생:', error);
      setStatus(`❌ 오류: ${error.message}`);
      Alert.alert('오류', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>관리자 도구</Text>
        <Text style={styles.subtitle}>데이터베이스 시드 관리</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>샘플 데이터</Text>
          <Text style={styles.info}>• 사용자 3명</Text>
          <Text style={styles.info}>• 비디오 3개</Text>
          <Text style={styles.info}>• 좋아요, 댓글 자동 생성</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, styles.seedButton]}
          onPress={seedDatabase}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? '처리중...' : '샘플 데이터 추가'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.clearButton]}
          onPress={clearDatabase}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? '처리중...' : '데이터베이스 정리'}
          </Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator size="large" style={styles.loader} />}

        {status !== '' && (
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>{status}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  section: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  info: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  seedButton: {
    backgroundColor: '#4CAF50',
  },
  clearButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loader: {
    marginTop: 20,
  },
  statusContainer: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  statusText: {
    fontSize: 14,
    color: '#1976d2',
  },
});