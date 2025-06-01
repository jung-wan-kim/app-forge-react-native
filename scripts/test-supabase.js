// Node.js 환경을 위한 fetch polyfill
global.fetch = require('node-fetch');

const { createClient } = require('@supabase/supabase-js');

// Supabase 설정
const supabaseUrl = 'https://puoscoaltsznczqdfjh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1b3Njb2FsdHN6bmN6cWRmamgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNjE2NjM1NCwiZXhwIjoyMDUxNzQyMzU0fQ.VQqYqHrCdlrMTpdjj0bniJF4e8t2OtYr0gWjx76K8gY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('Supabase 연결 테스트 중...');
  
  try {
    // 간단한 쿼리로 연결 테스트
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('연결 오류:', error);
    } else {
      console.log('✅ Supabase 연결 성공!');
    }
  } catch (err) {
    console.error('예외 발생:', err);
  }
}

testConnection();