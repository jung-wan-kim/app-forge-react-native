import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('top');
  const [searchHistory, setSearchHistory] = useState(['댄스 챌린지', '맛집', '여행']);
  const [trendingTags, setTrendingTags] = useState([
    { id: '1', name: '댄스챌린지', count: '1.2M' },
    { id: '2', name: '맛집', count: '892K' },
    { id: '3', name: '여행', count: '756K' },
    { id: '4', name: '펫', count: '623K' },
    { id: '5', name: '요리', count: '512K' },
    { id: '6', name: 'OOTD', count: '445K' },
  ]);

  const renderSearchHistory = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>최근 검색</Text>
        <TouchableOpacity onPress={() => setSearchHistory([])}>
          <Text style={styles.clearText}>모두 지우기</Text>
        </TouchableOpacity>
      </View>
      {searchHistory.map((item, index) => (
        <TouchableOpacity key={index} style={styles.historyItem}>
          <Icon name="history" size={20} color="#666" />
          <Text style={styles.historyText}>{item}</Text>
          <TouchableOpacity
            onPress={() => {
              setSearchHistory(searchHistory.filter((_, i) => i !== index));
            }}
          >
            <Icon name="close" size={20} color="#666" />
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderTrendingTags = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>인기 해시태그</Text>
      <View style={styles.tagsContainer}>
        {trendingTags.map((tag) => (
          <TouchableOpacity key={tag.id} style={styles.tagButton}>
            <Text style={styles.tagName}>#{tag.name}</Text>
            <Text style={styles.tagCount}>{tag.count}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderSearchResults = () => {
    const tabs = ['top', 'users', 'videos', 'hashtags'];
    const tabLabels = {
      top: '인기',
      users: '계정',
      videos: '동영상',
      hashtags: '해시태그',
    };

    return (
      <View style={styles.resultsContainer}>
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tabLabels[tab]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <ScrollView style={styles.resultsContent}>
          <Text style={styles.noResultsText}>
            "{searchQuery}"에 대한 검색 결과
          </Text>
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="검색"
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {searchQuery.length === 0 ? (
        <ScrollView style={styles.content}>
          {renderSearchHistory()}
          {renderTrendingTags()}
        </ScrollView>
      ) : (
        renderSearchResults()
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#000',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  clearText: {
    fontSize: 14,
    color: '#666',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#000',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tagButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  tagName: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  tagCount: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  resultsContainer: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#000',
    fontWeight: 'bold',
  },
  resultsContent: {
    flex: 1,
    padding: 16,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default SearchScreen;