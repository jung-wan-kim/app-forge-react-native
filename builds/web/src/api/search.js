import { supabase } from '../config/supabase.js';

export const searchApi = {
  // 통합 검색 (사용자, 비디오, 해시태그)
  async searchAll(query, page = 0, limit = 10) {
    try {
      const searchTerm = `%${query}%`;
      
      // 사용자 검색
      const usersPromise = this.searchUsers(query, 0, 5);
      
      // 비디오 검색
      const videosPromise = this.searchVideos(query, 0, 10);
      
      // 해시태그 검색
      const hashtagsPromise = this.searchHashtags(query, 0, 5);
      
      const [users, videos, hashtags] = await Promise.all([
        usersPromise,
        videosPromise,
        hashtagsPromise
      ]);
      
      return {
        users,
        videos,
        hashtags
      };
    } catch (error) {
      console.error('Search error:', error);
      return {
        users: [],
        videos: [],
        hashtags: []
      };
    }
  },
  
  // 사용자 검색
  async searchUsers(query, page = 0, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
        .order('follower_count', { ascending: false })
        .range(page * limit, (page + 1) * limit - 1);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Search users error:', error);
      return [];
    }
  },
  
  // 비디오 검색
  async searchVideos(query, page = 0, limit = 10) {
    try {
      const { data: videos, error } = await supabase
        .from('videos')
        .select(`
          *,
          user:users!user_id(
            id,
            username,
            profile_picture,
            verified
          )
        `)
        .or(`description.ilike.%${query}%`)
        .eq('is_private', false)
        .order('view_count', { ascending: false })
        .range(page * limit, (page + 1) * limit - 1);
      
      if (error) throw error;
      
      // 각 비디오의 좋아요, 댓글 수 가져오기
      const videosWithStats = await Promise.all((videos || []).map(async (video) => {
        const { count: likesCount } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('video_id', video.id);
        
        const { count: commentsCount } = await supabase
          .from('comments')
          .select('*', { count: 'exact', head: true })
          .eq('video_id', video.id);
        
        return {
          ...video,
          likes_count: likesCount || 0,
          comments_count: commentsCount || 0
        };
      }));
      
      return videosWithStats;
    } catch (error) {
      console.error('Search videos error:', error);
      return [];
    }
  },
  
  // 해시태그 검색
  async searchHashtags(query, page = 0, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('hashtags')
        .select('*')
        .ilike('name', `%${query}%`)
        .order('usage_count', { ascending: false })
        .range(page * limit, (page + 1) * limit - 1);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Search hashtags error:', error);
      return [];
    }
  },
  
  // 해시태그로 비디오 검색
  async getVideosByHashtag(hashtagName, page = 0, limit = 10) {
    try {
      // 먼저 해시태그 ID 찾기
      const { data: hashtag, error: hashtagError } = await supabase
        .from('hashtags')
        .select('id')
        .eq('name', hashtagName.toLowerCase())
        .single();
      
      if (hashtagError || !hashtag) {
        return [];
      }
      
      // 해시태그가 연결된 비디오 찾기
      const { data: videoHashtags, error: videoHashtagsError } = await supabase
        .from('video_hashtags')
        .select('video_id')
        .eq('hashtag_id', hashtag.id);
      
      if (videoHashtagsError || !videoHashtags || videoHashtags.length === 0) {
        return [];
      }
      
      const videoIds = videoHashtags.map(vh => vh.video_id);
      
      // 비디오 정보 가져오기
      const { data: videos, error: videosError } = await supabase
        .from('videos')
        .select(`
          *,
          user:users!user_id(
            id,
            username,
            profile_picture,
            verified
          )
        `)
        .in('id', videoIds)
        .eq('is_private', false)
        .order('created_at', { ascending: false })
        .range(page * limit, (page + 1) * limit - 1);
      
      if (videosError) throw videosError;
      
      // 각 비디오의 통계 추가
      const videosWithStats = await Promise.all((videos || []).map(async (video) => {
        const { count: likesCount } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('video_id', video.id);
        
        const { count: commentsCount } = await supabase
          .from('comments')
          .select('*', { count: 'exact', head: true })
          .eq('video_id', video.id);
        
        return {
          ...video,
          likes_count: likesCount || 0,
          comments_count: commentsCount || 0
        };
      }));
      
      return videosWithStats;
    } catch (error) {
      console.error('Get videos by hashtag error:', error);
      return [];
    }
  },
  
  // 인기 해시태그 가져오기
  async getTrendingHashtags(limit = 10) {
    try {
      const { data, error } = await supabase
        .from('hashtags')
        .select('*')
        .order('usage_count', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get trending hashtags error:', error);
      return [];
    }
  }
};