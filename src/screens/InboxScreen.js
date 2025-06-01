import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const InboxScreen = () => {
  const notifications = [
    {
      id: '1',
      type: 'like',
      user: { username: 'user123', avatar: null },
      message: '님이 회원님의 동영상을 좋아합니다.',
      time: '2시간 전',
    },
    {
      id: '2',
      type: 'comment',
      user: { username: 'dancing_queen', avatar: null },
      message: '님이 댓글을 남겼습니다: "대박이네요!"',
      time: '5시간 전',
    },
    {
      id: '3',
      type: 'follow',
      user: { username: 'foodie_paradise', avatar: null },
      message: '님이 회원님을 팔로우하기 시작했습니다.',
      time: '1일 전',
    },
  ];

  const renderNotification = ({ item }) => {
    const getIcon = () => {
      switch (item.type) {
        case 'like':
          return <Icon name="favorite" size={24} color="#ff2b54" />;
        case 'comment':
          return <Icon name="chat-bubble" size={24} color="#00a6ff" />;
        case 'follow':
          return <Icon name="person-add" size={24} color="#6c5ce7" />;
        default:
          return <Icon name="notifications" size={24} color="#666" />;
      }
    };

    return (
      <TouchableOpacity style={styles.notificationItem}>
        <View style={styles.iconContainer}>
          {getIcon()}
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.notificationText}>
            <Text style={styles.username}>@{item.user.username}</Text>
            {item.message}
          </Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>알림</Text>
      </View>

      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="notifications-none" size={64} color="#ccc" />
            <Text style={styles.emptyText}>새로운 알림이 없습니다</Text>
          </View>
        }
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
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  listContent: {
    flexGrow: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  notificationText: {
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
  },
  username: {
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#999',
  },
});

export default InboxScreen;