const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS 설정
app.use(cors());

// 정적 파일 서빙
app.use(express.static('app'));
app.use('/src', express.static('src'));

// 기본 라우트
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'app', 'index.html'));
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 TikTok Clone 서버가 포트 ${PORT}에서 실행 중입니다`);
  console.log(`📱 http://localhost:${PORT} 에서 앱을 확인하세요`);
});