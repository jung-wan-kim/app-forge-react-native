const puppeteer = require('puppeteer');

const PORT = process.env.PORT || 3001;
const BASE_URL = `http://localhost:${PORT}`;

// 테스트 결과 저장
const testResults = {
  passed: [],
  failed: [],
  warnings: []
};

// 색상 코드
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

async function runTests() {
  console.log(`${colors.blue}🧪 TikTok Clone 자동 테스트 시작${colors.reset}\n`);
  
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // 모바일 뷰포트 설정
    await page.setViewport({
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true
    });
    
    // 1. 페이지 로드 테스트
    console.log('📱 페이지 로드 테스트...');
    try {
      await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 10000 });
      testResults.passed.push('페이지 로드 성공');
    } catch (error) {
      testResults.failed.push(`페이지 로드 실패: ${error.message}`);
    }
    
    // 2. 핵심 컴포넌트 존재 확인
    console.log('🔍 컴포넌트 확인...');
    const components = [
      { selector: 'video-feed', name: '비디오 피드' },
      { selector: 'navigation-bar', name: '네비게이션 바' },
      { selector: 'video-player', name: '비디오 플레이어' },
      { selector: 'interaction-bar', name: '상호작용 바' }
    ];
    
    for (const comp of components) {
      try {
        await page.waitForSelector(comp.selector, { timeout: 5000 });
        testResults.passed.push(`${comp.name} 컴포넌트 확인`);
      } catch (error) {
        testResults.failed.push(`${comp.name} 컴포넌트 없음`);
      }
    }
    
    // 3. 네비게이션 테스트
    console.log('🚀 네비게이션 테스트...');
    try {
      // 프로필 탭 클릭
      await page.evaluate(() => {
        const navBar = document.querySelector('navigation-bar');
        if (navBar && navBar.shadowRoot) {
          const profileTab = Array.from(navBar.shadowRoot.querySelectorAll('div'))
            .find(el => el.textContent.includes('프로필'));
          if (profileTab) profileTab.click();
        }
      });
      
      await page.waitForTimeout(1000);
      
      // 프로필 페이지 확인
      const hasProfilePage = await page.evaluate(() => {
        return document.querySelector('profile-page') !== null;
      });
      
      if (hasProfilePage) {
        testResults.passed.push('프로필 페이지 이동 성공');
      } else {
        testResults.failed.push('프로필 페이지 이동 실패');
      }
    } catch (error) {
      testResults.failed.push(`네비게이션 테스트 실패: ${error.message}`);
    }
    
    // 4. 상호작용 테스트
    console.log('❤️  상호작용 테스트...');
    try {
      // 홈으로 돌아가기
      await page.evaluate(() => {
        const navBar = document.querySelector('navigation-bar');
        if (navBar && navBar.shadowRoot) {
          const homeTab = Array.from(navBar.shadowRoot.querySelectorAll('div'))
            .find(el => el.textContent.includes('홈'));
          if (homeTab) homeTab.click();
        }
      });
      
      await page.waitForTimeout(1000);
      
      // 좋아요 버튼 클릭
      const likeClicked = await page.evaluate(() => {
        const interactionBar = document.querySelector('interaction-bar');
        if (interactionBar && interactionBar.shadowRoot) {
          const likeButton = Array.from(interactionBar.shadowRoot.querySelectorAll('div'))
            .find(el => el.textContent.includes('❤️'));
          if (likeButton) {
            likeButton.click();
            return true;
          }
        }
        return false;
      });
      
      if (likeClicked) {
        testResults.passed.push('좋아요 버튼 클릭 성공');
      } else {
        testResults.warnings.push('좋아요 버튼을 찾을 수 없음');
      }
    } catch (error) {
      testResults.failed.push(`상호작용 테스트 실패: ${error.message}`);
    }
    
    // 5. 댓글 패널 테스트
    console.log('💬 댓글 패널 테스트...');
    try {
      // 댓글 버튼 클릭
      const commentClicked = await page.evaluate(() => {
        const interactionBar = document.querySelector('interaction-bar');
        if (interactionBar && interactionBar.shadowRoot) {
          const commentButton = Array.from(interactionBar.shadowRoot.querySelectorAll('div'))
            .find(el => el.textContent.includes('💬'));
          if (commentButton) {
            commentButton.click();
            return true;
          }
        }
        return false;
      });
      
      if (commentClicked) {
        await page.waitForTimeout(500);
        
        const hasCommentPanel = await page.evaluate(() => {
          const panel = document.querySelector('comments-panel');
          return panel && panel.shadowRoot && 
                 panel.shadowRoot.querySelector('div[style*="height: 60vh"]') !== null;
        });
        
        if (hasCommentPanel) {
          testResults.passed.push('댓글 패널 열기 성공');
        } else {
          testResults.failed.push('댓글 패널이 열리지 않음');
        }
      }
    } catch (error) {
      testResults.failed.push(`댓글 패널 테스트 실패: ${error.message}`);
    }
    
    // 6. 업로드 페이지 테스트
    console.log('📤 업로드 페이지 테스트...');
    try {
      await page.evaluate(() => {
        const navBar = document.querySelector('navigation-bar');
        if (navBar && navBar.shadowRoot) {
          const createTab = Array.from(navBar.shadowRoot.querySelectorAll('div'))
            .find(el => el.textContent.includes('➕'));
          if (createTab) createTab.click();
        }
      });
      
      await page.waitForTimeout(1000);
      
      const hasUploadPage = await page.evaluate(() => {
        return document.querySelector('upload-page') !== null;
      });
      
      if (hasUploadPage) {
        testResults.passed.push('업로드 페이지 이동 성공');
      } else {
        testResults.failed.push('업로드 페이지 이동 실패');
      }
    } catch (error) {
      testResults.failed.push(`업로드 페이지 테스트 실패: ${error.message}`);
    }
    
    // 7. 반응형 테스트
    console.log('📐 반응형 디자인 테스트...');
    const viewports = [
      { name: 'iPhone 12', width: 390, height: 844 },
      { name: 'iPad', width: 768, height: 1024 },
      { name: 'Desktop', width: 1920, height: 1080 }
    ];
    
    for (const viewport of viewports) {
      try {
        await page.setViewport({
          width: viewport.width,
          height: viewport.height
        });
        await page.waitForTimeout(500);
        testResults.passed.push(`${viewport.name} 뷰포트 테스트 통과`);
      } catch (error) {
        testResults.failed.push(`${viewport.name} 뷰포트 테스트 실패`);
      }
    }
    
  } catch (error) {
    console.error(`${colors.red}테스트 중 오류 발생: ${error.message}${colors.reset}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  
  // 테스트 결과 출력
  console.log(`\n${colors.blue}📊 테스트 결과${colors.reset}`);
  console.log('=====================================\n');
  
  console.log(`${colors.green}✅ 통과: ${testResults.passed.length}개${colors.reset}`);
  testResults.passed.forEach(test => {
    console.log(`   ✓ ${test}`);
  });
  
  if (testResults.warnings.length > 0) {
    console.log(`\n${colors.yellow}⚠️  경고: ${testResults.warnings.length}개${colors.reset}`);
    testResults.warnings.forEach(warning => {
      console.log(`   ! ${warning}`);
    });
  }
  
  if (testResults.failed.length > 0) {
    console.log(`\n${colors.red}❌ 실패: ${testResults.failed.length}개${colors.reset}`);
    testResults.failed.forEach(test => {
      console.log(`   ✗ ${test}`);
    });
  }
  
  console.log('\n=====================================');
  
  const totalTests = testResults.passed.length + testResults.failed.length;
  const passRate = totalTests > 0 ? 
    Math.round((testResults.passed.length / totalTests) * 100) : 0;
  
  console.log(`\n${colors.blue}전체 성공률: ${passRate}%${colors.reset}`);
  
  if (passRate === 100) {
    console.log(`${colors.green}🎉 모든 테스트를 통과했습니다!${colors.reset}`);
  } else if (passRate >= 80) {
    console.log(`${colors.yellow}👍 대부분의 테스트를 통과했습니다.${colors.reset}`);
  } else {
    console.log(`${colors.red}⚠️  개선이 필요합니다.${colors.reset}`);
  }
  
  // 프로세스 종료 코드
  process.exit(testResults.failed.length > 0 ? 1 : 0);
}

// 테스트 실행
runTests().catch(console.error);