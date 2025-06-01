import { supabase } from '../config/supabase.js';

export const profileApi = {
  // 사용자 프로필 정보 가져오기
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  },

  // 사용자의 비디오 목록 가져오기
  async getUserVideos(userId, page = 0, limit = 9) {
    try {
      const { data: videos, error } = await supabase
        .from('videos')
        .select(`
          id,
          video_url,
          thumbnail_url,
          description,
          created_at,
          views,
          is_private
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(page * limit, (page + 1) * limit - 1);

      if (error) throw error;

      // 각 비디오의 좋아요 수 가져오기
      const videosWithStats = await Promise.all(videos.map(async (video) => {
        const { count: likesCount } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('video_id', video.id);

        return {
          ...video,
          likes: likesCount || 0
        };
      }));

      return videosWithStats;
    } catch (error) {
      console.error('Error fetching user videos:', error);
      return [];
    }
  },

  // 사용자의 통계 정보 가져오기
  async getUserStats(userId) {
    try {
      // 팔로잉 수
      const { count: followingCount } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', userId);

      // 팔로워 수
      const { count: followersCount } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', userId);

      // 전체 좋아요 수
      const { data: userVideos } = await supabase
        .from('videos')
        .select('id')
        .eq('user_id', userId);

      let totalLikes = 0;
      if (userVideos && userVideos.length > 0) {
        const videoIds = userVideos.map(v => v.id);
        const { count: likesCount } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .in('video_id', videoIds);
        totalLikes = likesCount || 0;
      }

      return {
        following: followingCount || 0,
        followers: followersCount || 0,
        likes: totalLikes
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return {
        following: 0,
        followers: 0,
        likes: 0
      };
    }
  },

  // 사용자가 좋아요한 비디오 목록 가져오기
  async getUserLikedVideos(userId, page = 0, limit = 9) {
    try {
      const { data: likes, error } = await supabase
        .from('likes')
        .select(`
          video:videos(
            id,
            video_url,
            thumbnail_url,
            description,
            created_at,
            views,
            user:users!user_id(
              id,
              username,
              profile_picture
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(page * limit, (page + 1) * limit - 1);

      if (error) throw error;

      // 각 비디오의 좋아요 수 추가
      const videosWithStats = await Promise.all(likes.map(async (like) => {
        if (like.video) {
          const { count: likesCount } = await supabase
            .from('likes')
            .select('*', { count: 'exact', head: true })
            .eq('video_id', like.video.id);

          return {
            ...like.video,
            likes: likesCount || 0
          };
        }
        return null;
      }));

      return videosWithStats.filter(v => v !== null);
    } catch (error) {
      console.error('Error fetching liked videos:', error);
      return [];
    }
  },

  // 팔로우/언팔로우
  async toggleFollow(followerId, followingId) {
    try {
      const { data: existingFollow } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', followerId)
        .eq('following_id', followingId)
        .single();

      if (existingFollow) {
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('id', existingFollow.id);
        if (error) throw error;
        return { following: false };
      } else {
        const { error } = await supabase
          .from('follows')
          .insert({
            follower_id: followerId,
            following_id: followingId
          });
        if (error) throw error;
        return { following: true };
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      throw error;
    }
  },

  // 프로필 업데이트
  async updateProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
};