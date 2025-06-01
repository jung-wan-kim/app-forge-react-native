const http = require('http');

const PORT = process.env.PORT || 3001;
const BASE_URL = `http://localhost:${PORT}`;

// 색상 코드
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function runQuickTests() {
  console.log(`${colors.blue}🚀 TikTok Clone 빠른 테스트${colors.reset}\n`);
  
  const tests = [
    {
      name: '서버 응답 확인',
      test: async () => {
        const res = await makeRequest(BASE_URL);
        return res.statusCode === 200;
      }
    },
    {
      name: 'HTML 구조 확인',
      test: async () => {
        const res = await makeRequest(BASE_URL);
        return res.data.includes('<div id="app">') && 
               res.data.includes('TikTok Clone');
      }
    },
    {
      name: '컴포넌트 스크립트 로드',
      test: async () => {
        const res = await makeRequest(BASE_URL);
        return res.data.includes('VideoPlayer.js') && 
               res.data.includes('VideoFeed.js') &&
               res.data.includes('NavigationBar.js');
      }
    },
    {
      name: 'Lynx 프레임워크 로드',
      test: async () => {
        const res = await makeRequest(BASE_URL);
        return res.data.includes('lynx.registerComponent');
      }
    },
    {
      name: '정적 파일 서빙 (CSS)',
      test: async () => {
        const res = await makeRequest(BASE_URL);
        return res.data.includes('style>') && 
               res.data.includes('background-color: #000');
      }
    }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const { name, test } of tests) {
    try {
      const result = await test();
      if (result) {
        console.log(`${colors.green}✅ ${name}${colors.reset}`);
        passed++;
      } else {
        console.log(`${colors.red}❌ ${name}${colors.reset}`);
        failed++;
      }
    } catch (error) {
      console.log(`${colors.red}❌ ${name} - 오류: ${error.message}${colors.reset}`);
      failed++;
    }
  }
  
  console.log(`\n${colors.blue}=====================================`);
  console.log(`결과: ${passed}/${tests.length} 테스트 통과${colors.reset}`);
  
  if (failed === 0) {
    console.log(`${colors.green}🎉 모든 테스트를 통과했습니다!${colors.reset}`);
  } else {
    console.log(`${colors.yellow}⚠️  ${failed}개의 테스트가 실패했습니다.${colors.reset}`);
  }
  
  // 추가 정보
  console.log(`\n${colors.blue}📱 브라우저에서 테스트하기:${colors.reset}`);
  console.log(`   ${BASE_URL}`);
  console.log(`\n${colors.blue}📱 모바일에서 테스트하기:${colors.reset}`);
  
  const os = require('os');
  const interfaces = os.networkInterfaces();
  const addresses = [];
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push(iface.address);
      }
    }
  }
  
  if (addresses.length > 0) {
    console.log(`   http://${addresses[0]}:${PORT}`);
  }
  
  process.exit(failed > 0 ? 1 : 0);
}

runQuickTests().catch(console.error);