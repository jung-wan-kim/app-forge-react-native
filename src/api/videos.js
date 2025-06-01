import { supabase } from '../config/supabase.js';

export const videosApi = {
  async getVideos(page = 0, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          user:users!user_id(
            id,
            username,
            profile_picture,
            verified
          ),
          likes:likes(count),
          comments:comments(count)
        `)
        .eq('is_private', false)
        .order('created_at', { ascending: false })
        .range(page * limit, (page + 1) * limit - 1);

      if (error) throw error;

      return data.map(video => ({
        ...video,
        likes_count: video.likes?.[0]?.count || 0,
        comments_count: video.comments?.[0]?.count || 0,
        user: video.user || {}
      }));
    } catch (error) {
      console.error('Error fetching videos:', error);
      return [];
    }
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