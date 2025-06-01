import { supabase } from '../config/supabase.js';

export const uploadApi = {
  // 동영상 업로드
  async uploadVideo(file, userId) {
    try {
      console.log('Starting video upload:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        userId: userId
      });

      // 파일명 생성 (timestamp + random)
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `videos/${fileName}`;

      console.log('Uploading to path:', filePath);

      // Supabase Storage에 업로드
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful:', uploadData);

      // 공개 URL 가져오기
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath);

      console.log('Public URL:', publicUrl);

      return { 
        path: filePath, 
        url: publicUrl 
      };
    } catch (error) {
      console.error('Video upload error:', error);
      throw error;
    }
  },

  // 썸네일 업로드
  async uploadThumbnail(file, userId) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}_${Date.now()}_thumb.${fileExt}`;
      const filePath = `thumbnails/${fileName}`;

      const { data, error } = await supabase.storage
        .from('videos')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath);

      return { 
        path: filePath, 
        url: publicUrl 
      };
    } catch (error) {
      console.error('Thumbnail upload error:', error);
      throw error;
    }
  },

  // 비디오 정보 DB에 저장
  async createVideoPost(videoData) {
    try {
      const { data, error } = await supabase
        .from('videos')
        .insert({
          user_id: videoData.userId,
          video_url: videoData.videoUrl,
          thumbnail_url: videoData.thumbnailUrl || null,
          description: videoData.description,
          duration: videoData.duration || 0,
          width: videoData.width || 720,
          height: videoData.height || 1280,
          is_private: videoData.isPrivate || false,
          allow_comments: videoData.allowComments || true,
          allow_duet: videoData.allowDuet || true,
          hashtags: videoData.hashtags || []
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Create video post error:', error);
      throw error;
    }
  },

  // 비디오 삭제
  async deleteVideo(videoId, userId) {
    try {
      // 먼저 비디오 정보 가져오기
      const { data: video, error: fetchError } = await supabase
        .from('videos')
        .select('video_url, thumbnail_url')
        .eq('id', videoId)
        .eq('user_id', userId)
        .single();

      if (fetchError) throw fetchError;

      // Storage에서 파일 삭제
      if (video.video_url) {
        const videoPath = video.video_url.split('/').slice(-2).join('/');
        await supabase.storage.from('videos').remove([videoPath]);
      }

      if (video.thumbnail_url) {
        const thumbPath = video.thumbnail_url.split('/').slice(-2).join('/');
        await supabase.storage.from('videos').remove([thumbPath]);
      }

      // DB에서 레코드 삭제
      const { error: deleteError } = await supabase
        .from('videos')
        .delete()
        .eq('id', videoId)
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      return { success: true };
    } catch (error) {
      console.error('Delete video error:', error);
      throw error;
    }
  }
};