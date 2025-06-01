import { supabase } from '../config/supabase.js';

export const videosApi = {
  async getVideos(page = 0, limit = 10) {
    try {
      // 먼저 비디오 목록 가져오기
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
        .eq('is_private', false)
        .order('created_at', { ascending: false })
        .range(page * limit, (page + 1) * limit - 1);

      if (videosError) throw videosError;

      // 각 비디오의 좋아요와 댓글 수 가져오기
      const videosWithCounts = await Promise.all(videos.map(async (video) => {
        // 좋아요 수
        const { count: likesCount } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('video_id', video.id);

        // 댓글 수
        const { count: commentsCount } = await supabase
          .from('comments')
          .select('*', { count: 'exact', head: true })
          .eq('video_id', video.id);

        return {
          ...video,
          likes_count: likesCount || 0,
          comments_count: commentsCount || 0,
          user: video.user || {}
        };
      }));

      return videosWithCounts;
    } catch (error) {
      console.error('Error fetching videos:', error);
      return [];
    }
  },

  // 실시간 비디오 스트림 구독
  subscribeToNewVideos(callback) {
    const subscription = supabase
      .channel('public:videos')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'videos',
        filter: 'is_private=eq.false'
      }, payload => {
        callback(payload.new);
      })
      .subscribe();

    return subscription;
  },

  async likeVideo(videoId, userId) {
    try {
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('video_id', videoId)
        .eq('user_id', userId)
        .single();

      if (existingLike) {
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('id', existingLike.id);
        if (error) throw error;
        return { liked: false };
      } else {
        const { error } = await supabase
          .from('likes')
          .insert({ video_id: videoId, user_id: userId });
        if (error) throw error;
        return { liked: true };
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  },

  async getComments(videoId) {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          user:users!user_id(
            id,
            username,
            profile_picture
          )
        `)
        .eq('video_id', videoId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  },

  async addComment(videoId, userId, content) {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          video_id: videoId,
          user_id: userId,
          content
        })
        .select(`
          *,
          user:users!user_id(
            id,
            username,
            profile_picture
          )
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }
};