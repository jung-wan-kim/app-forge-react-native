import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ActionButton from './ActionButton';
import HeartIcon from './icons/HeartIcon';
import CommentIcon from './icons/CommentIcon';
import ShareIcon from './icons/ShareIcon';
import AvatarIcon from './icons/AvatarIcon';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const formatCount = (count) => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

const VideoPlayer = ({ item, isActive }) => {
  const [paused, setPaused] = useState(!isActive);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setPaused(!isActive);
  }, [isActive]);

  const handleLike = () => {
    setLiked(!liked);
    // TODO: Supabase에 좋아요 저장
  };

  const handleComment = () => {
    // TODO: 댓글 화면 열기
  };

  const handleShare = () => {
    // TODO: 공유 기능
  };

  return (
    <View style={styles.container}>
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

      {/* 오버레이 */}
      <View style={styles.overlay}>
        <View style={styles.bottomSection}>
          {/* 왼쪽: 사용자 정보 */}
          <View style={styles.leftSection}>
            <Text style={styles.username}>@{item.user?.username || 'unknown'}</Text>
            <Text style={styles.description} numberOfLines={2}>
              {item.description}
            </Text>
            {item.music && (
              <View style={styles.musicContainer}>
                <Icon name="music-note" size={14} color="#fff" style={styles.musicIcon} />
                <Text style={styles.musicText} numberOfLines={1}>{item.music}</Text>
              </View>
            )}
          </View>

          {/* 오른쪽: 액션 버튼들 */}
          <View style={styles.rightSection}>
            {/* 프로필 */}
            <TouchableOpacity style={styles.profileButton}>
              <AvatarIcon size={48} hasImage={false} />
              <View style={styles.addButton}>
                <Icon name="add" size={16} color="#fff" />
              </View>
            </TouchableOpacity>

            {/* 좋아요 */}
            <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
              <View style={[styles.actionIconWrapper, liked && styles.actionIconActive]}>
                <HeartIcon size={28} color={liked ? "#ff4757" : "#fff"} filled={liked} />
              </View>
              <Text style={styles.actionText}>{formatCount(item.likes_count || 0)}</Text>
            </TouchableOpacity>

            {/* 댓글 */}
            <TouchableOpacity style={styles.actionButton} onPress={handleComment}>
              <View style={styles.actionIconWrapper}>
                <CommentIcon size={28} color="#fff" />
              </View>
              <Text style={styles.actionText}>{formatCount(item.comments_count || 0)}</Text>
            </TouchableOpacity>

            {/* 공유 */}
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <View style={styles.actionIconWrapper}>
                <ShareIcon size={28} color="#fff" />
              </View>
              <Text style={styles.actionText}>{formatCount(item.shares_count || 0)}</Text>
            </TouchableOpacity>

            {/* 음악 */}
            <TouchableOpacity style={styles.musicButton}>
              <View style={styles.musicDisc}>
                <Icon name="music-note" size={20} color="#fff" />
              </View>
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

const styles = StyleSheet.create({
  container: {
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
    paddingHorizontal: 12,
    paddingBottom: 85,
  },
  leftSection: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingRight: 12,
  },
  rightSection: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  description: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  musicContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  musicIcon: {
    marginRight: 6,
  },
  musicText: {
    color: '#fff',
    fontSize: 13,
    flex: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  profileButton: {
    marginBottom: 25,
    alignItems: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: -8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#ff0050',
    justifyContent: 'center',
    alignItems: 'center',
  },
  musicButton: {
    marginTop: 15,
  },
  musicDisc: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 12,
    borderColor: 'rgba(255, 255, 255, 0.2)',
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
  actionButton: {
    alignItems: 'center',
    marginBottom: 25,
  },
  actionIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  actionIconActive: {
    backgroundColor: 'rgba(255, 71, 87, 0.2)',
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});

export default VideoPlayer;