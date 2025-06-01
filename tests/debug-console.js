const puppeteer = require('puppeteer');

async function checkConsoleErrors() {
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  const errors = [];
  const warnings = [];
  const logs = [];
  
  // 콘솔 메시지 캡처
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    
    if (type === 'error') {
      errors.push(text);
      console.log('❌ ERROR:', text);
    } else if (type === 'warning') {
      warnings.push(text);
      console.log('⚠️  WARNING:', text);
    } else {
      logs.push(text);
      console.log('📝 LOG:', text);
    }
  });
  
  // 페이지 에러 캡처
  page.on('pageerror', error => {
    errors.push(error.message);
    console.log('🚨 PAGE ERROR:', error.message);
  });
  
  // 요청 실패 캡처
  page.on('requestfailed', request => {
    errors.push(`Request failed: ${request.url()}`);
    console.log('🔴 REQUEST FAILED:', request.url());
  });
  
  console.log('🌐 Loading http://localhost:3001...\n');
  
  try {
    await page.goto('http://localhost:3001', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // 페이지 내용 확인
    const content = await page.content();
    const hasApp = content.includes('id="app"');
    const bodyText = await page.evaluate(() => document.body.innerText);
    
    console.log('\n📊 페이지 분석:');
    console.log('- App 컨테이너 존재:', hasApp);
    console.log('- Body 텍스트 길이:', bodyText.length);
    console.log('- 화면에 표시된 텍스트:', bodyText.slice(0, 100));
    
    // 컴포넌트 확인
    const components = await page.evaluate(() => {
      const result = {
        lynxExists: typeof window.lynx !== 'undefined',
        customElements: Array.from(customElements.entries || []).map(([name]) => name),
        appElement: document.getElementById('app')?.innerHTML || 'empty',
        registeredComponents: window.lynx ? Object.keys(window.lynx.components || {}) : []
      };
      return result;
    });
    
    console.log('\n🔍 컴포넌트 상태:');
    console.log('- Lynx 존재:', components.lynxExists);
    console.log('- 등록된 커스텀 엘리먼트:', components.customElements);
    console.log('- 등록된 Lynx 컴포넌트:', components.registeredComponents);
    console.log('- App 엘리먼트 내용:', components.appElement.slice(0, 100));
    
  } catch (error) {
    console.error('Navigation error:', error.message);
  }
  
  console.log('\n📋 요약:');
  console.log(`- 에러: ${errors.length}개`);
  console.log(`- 경고: ${warnings.length}개`);
  console.log(`- 로그: ${logs.length}개`);
  
  await browser.close();
}

checkConsoleErrors().catch(console.error);