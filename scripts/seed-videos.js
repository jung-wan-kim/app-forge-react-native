// Node.js 환경을 위한 fetch polyfill
global.fetch = require('node-fetch');

const { createClient } = require('@supabase/supabase-js');

// Supabase 설정
const supabaseUrl = 'https://puoscoaltsznczqdfjh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1b3Njb2FsdHN6bmN6cWRmamgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNjE2NjM1NCwiZXhwIjoyMDUxNzQyMzU0fQ.VQqYqHrCdlrMTpdjj0bniJF4e8t2OtYr0gWjx76K8gY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
    tags: ['댄스', '챌린지', '트렌드'],
    category: 'dance',
  },
  {
    title: '오늘의 요리',
    description: '초간단 파스타 레시피 #요리 #레시피 #파스타',
    tags: ['요리', '레시피', '파스타'],
    category: 'cooking',
  },
  {
    title: '제주도 여행 브이로그',
    description: '제주도 맛집 투어 #제주도 #여행 #맛집',
    tags: ['여행', '제주도', '브이로그'],
    category: 'travel',
  },
  {
    title: '귀여운 강아지',
    description: '우리집 강아지 일상 #강아지 #펫스타그램 #일상',
    tags: ['동물', '강아지', '일상'],
    category: 'pets',
  },
  {
    title: '운동 루틴',
    description: '홈트레이닝 30분 루틴 #운동 #홈트 #다이어트',
    tags: ['운동', '피트니스', '홈트레이닝'],
    category: 'fitness',
  },
];

async function seedDatabase() {
  try {
    console.log('🌱 시작: 데이터베이스 시딩...');

    // 1. 기존 데이터 삭제 (선택적)
    console.log('🧹 기존 데이터 정리중...');
    await supabase.from('likes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('comments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('videos').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // 2. 사용자 생성
    console.log('👥 사용자 생성중...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .insert(sampleUsers)
      .select();

    if (usersError) {
      console.error('사용자 생성 오류:', usersError);
      return;
    }

    console.log(`✅ ${users.length}명의 사용자가 생성되었습니다.`);

    // 3. videos 버킷의 파일 목록 가져오기
    console.log('📹 버킷에서 비디오 파일 가져오는 중...');
    const { data: files, error: listError } = await supabase
      .storage
      .from('videos')
      .list();

    if (listError) {
      console.error('버킷 파일 목록 오류:', listError);
      return;
    }

    if (!files || files.length === 0) {
      console.log('⚠️  버킷에 비디오 파일이 없습니다. 샘플 URL 사용...');
      
      // 샘플 비디오 URL 사용
      const sampleVideoUrls = [
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      ];

      // 4. 비디오 데이터 생성 (샘플 URL 사용)
      const videosToInsert = sampleVideos.map((video, index) => ({
        ...video,
        user_id: users[index % users.length].id,
        video_url: sampleVideoUrls[index % sampleVideoUrls.length],
        thumbnail_url: `https://picsum.photos/200/300?random=${index}`,
        duration: Math.floor(Math.random() * 60) + 15, // 15-75초
        views_count: Math.floor(Math.random() * 10000),
        is_private: false,
      }));

      const { data: videos, error: videosError } = await supabase
        .from('videos')
        .insert(videosToInsert)
        .select();

      if (videosError) {
        console.error('비디오 생성 오류:', videosError);
        return;
      }

      console.log(`✅ ${videos.length}개의 비디오가 생성되었습니다.`);

      // 5. 샘플 좋아요 및 댓글 추가
      await addSampleInteractions(users, videos);

    } else {
      console.log(`📁 ${files.length}개의 파일을 찾았습니다.`);

      // 4. 비디오 데이터 생성 (버킷 파일 사용)
      const videosToInsert = [];
      
      for (let i = 0; i < Math.min(files.length, sampleVideos.length); i++) {
        const file = files[i];
        
        // 비디오 파일만 처리
        if (file.name.endsWith('.mp4') || file.name.endsWith('.mov')) {
          // Public URL 생성
          const { data: urlData } = supabase
            .storage
            .from('videos')
            .getPublicUrl(file.name);

          videosToInsert.push({
            ...sampleVideos[i],
            user_id: users[i % users.length].id,
            video_url: urlData.publicUrl,
            thumbnail_url: `https://picsum.photos/200/300?random=${i}`,
            duration: Math.floor(Math.random() * 60) + 15,
            views_count: Math.floor(Math.random() * 10000),
            is_private: false,
          });
        }
      }

      if (videosToInsert.length === 0) {
        console.log('⚠️  비디오 파일이 없습니다. 샘플 URL로 대체합니다.');
        // 위의 샘플 URL 로직 사용
        return;
      }

      const { data: videos, error: videosError } = await supabase
        .from('videos')
        .insert(videosToInsert)
        .select();

      if (videosError) {
        console.error('비디오 생성 오류:', videosError);
        return;
      }

      console.log(`✅ ${videos.length}개의 비디오가 생성되었습니다.`);

      // 5. 샘플 좋아요 및 댓글 추가
      await addSampleInteractions(users, videos);
    }

    console.log('🎉 데이터베이스 시딩 완료!');

  } catch (error) {
    console.error('❌ 오류 발생:', error);
  }
}

async function addSampleInteractions(users, videos) {
  console.log('💬 샘플 상호작용 추가중...');

  // 좋아요 추가
  const likes = [];
  for (const video of videos) {
    // 각 비디오에 랜덤하게 좋아요 추가
    const likeCount = Math.floor(Math.random() * users.length);
    const shuffledUsers = [...users].sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < likeCount; i++) {
      likes.push({
        video_id: video.id,
        user_id: shuffledUsers[i].id,
      });
    }
  }

  if (likes.length > 0) {
    const { error: likesError } = await supabase
      .from('likes')
      .insert(likes);

    if (likesError) {
      console.error('좋아요 생성 오류:', likesError);
    } else {
      console.log(`✅ ${likes.length}개의 좋아요가 추가되었습니다.`);
    }
  }

  // 댓글 추가
  const sampleComments = [
    '멋져요! 👍',
    '대박이네요 ㅋㅋㅋ',
    '저도 해보고 싶어요',
    '우와 진짜 잘하시네요',
    '더 많은 영상 올려주세요!',
    '이거 어떻게 하는거예요?',
    '완전 재밌어요 ㅎㅎ',
    '최고입니다 👏',
  ];

  const comments = [];
  for (const video of videos) {
    // 각 비디오에 랜덤하게 댓글 추가
    const commentCount = Math.floor(Math.random() * 5);
    
    for (let i = 0; i < commentCount; i++) {
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
    } else {
      console.log(`✅ ${comments.length}개의 댓글이 추가되었습니다.`);
    }
  }
}

// 스크립트 실행
seedDatabase();