const puppeteer = require('puppeteer');

async function runTests() {
  console.log('🚀 TikTok Clone Browser Test Starting...\n');
  
  const browser = await puppeteer.launch({
    headless: false, // 브라우저 UI 표시
    devtools: true, // 개발자 도구 열기
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // 콘솔 메시지 캡처
  const consoleLogs = [];
  page.on('console', msg => {
    const log = {
      type: msg.type(),
      text: msg.text(),
      location: msg.location()
    };
    consoleLogs.push(log);
    
    if (msg.type() === 'error') {
      console.log(`❌ Console Error: ${msg.text()}`);
    } else if (msg.type() === 'warning') {
      console.log(`⚠️  Console Warning: ${msg.text()}`);
    }
  });
  
  // 페이지 에러 캡처
  page.on('pageerror', error => {
    console.log(`❌ Page Error: ${error.message}`);
  });
  
  try {
    // 1. 홈페이지 로드 테스트
    console.log('\n📍 Test 1: Loading Homepage...');
    await page.goto('http://localhost:8080/', { waitUntil: 'networkidle2' });
    await page.waitForTimeout(2000);
    
    // 스크린샷 캡처
    await page.screenshot({ path: 'test-homepage.png' });
    console.log('✅ Homepage loaded - Screenshot saved as test-homepage.png');
    
    // 2. 네비게이션 바 확인
    console.log('\n📍 Test 2: Checking Navigation Bar...');
    const navButtons = await page.$$eval('navigation-bar button', buttons => 
      buttons.map(btn => btn.textContent)
    );
    console.log('Navigation buttons found:', navButtons);
    
    // 3. 업로드 페이지 테스트
    console.log('\n📍 Test 3: Testing Upload Page...');
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('navigation', { detail: { tab: 'upload' } }));
    });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-upload.png' });
    console.log('✅ Upload page loaded - Screenshot saved as test-upload.png');
    
    // 4. 검색 페이지 테스트
    console.log('\n📍 Test 4: Testing Search Page...');
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('navigation', { detail: { tab: 'search' } }));
    });
    await page.waitForTimeout(2000);
    
    // 검색어 입력 테스트
    const searchInput = await page.$('input[type="search"]');
    if (searchInput) {
      await searchInput.type('테스트 검색');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1000);
      console.log('✅ Search functionality tested');
    }
    
    await page.screenshot({ path: 'test-search.png' });
    console.log('✅ Search page loaded - Screenshot saved as test-search.png');
    
    // 5. 프로필 페이지 테스트
    console.log('\n📍 Test 5: Testing Profile Page...');
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('navigation', { detail: { tab: 'profile' } }));
    });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-profile.png' });
    console.log('✅ Profile page loaded - Screenshot saved as test-profile.png');
    
    // 테스트 결과 요약
    console.log('\n📊 Test Summary:');
    console.log('================');
    
    const errors = consoleLogs.filter(log => log.type === 'error');
    const warnings = consoleLogs.filter(log => log.type === 'warning');
    
    console.log(`Total console errors: ${errors.length}`);
    console.log(`Total console warnings: ${warnings.length}`);
    
    if (errors.length > 0) {
      console.log('\n❌ Console Errors:');
      errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error.text}`);
        if (error.location.url) {
          console.log(`   Location: ${error.location.url}:${error.location.lineNumber}`);
        }
      });
    }
    
    if (warnings.length > 0) {
      console.log('\n⚠️  Console Warnings:');
      warnings.forEach((warning, index) => {
        console.log(`${index + 1}. ${warning.text}`);
      });
    }
    
    if (errors.length === 0 && warnings.length === 0) {
      console.log('\n✅ No console errors or warnings found!');
    }
    
  } catch (error) {
    console.error('\n❌ Test failed:', error);
  }
  
  // 브라우저는 열어둠 (수동으로 추가 테스트 가능)
  console.log('\n🔍 Browser remains open for manual inspection.');
  console.log('Close the browser window when done.');
}

// 테스트 실행
runTests().catch(console.error);