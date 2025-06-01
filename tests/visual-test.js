const puppeteer = require('puppeteer');

async function visualTest() {
  console.log('🎯 Visual Test Starting...\n');
  
  const browser = await puppeteer.launch({
    headless: false, // 브라우저를 실제로 보기 위해
    defaultViewport: {
      width: 390,
      height: 844,
      isMobile: true,
      hasTouch: true
    },
    args: ['--no-sandbox']
  });
  
  const page = await browser.newPage();
  
  // 콘솔 로그 캡처
  page.on('console', msg => {
    console.log(`[${msg.type()}]`, msg.text());
  });
  
  page.on('error', err => {
    console.error('❌ Page error:', err.message);
  });
  
  console.log('📱 Opening http://localhost:3001...');
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle2' });
  
  // 스크린샷 찍기
  await page.screenshot({ 
    path: 'test-screenshot.png',
    fullPage: true 
  });
  console.log('📸 Screenshot saved as test-screenshot.png');
  
  // DOM 상태 확인
  const pageInfo = await page.evaluate(() => {
    const app = document.getElementById('app');
    const components = Array.from(document.querySelectorAll('*')).filter(el => 
      el.tagName.includes('-')
    );
    
    return {
      appContent: app ? app.innerHTML : 'No app element',
      appChildren: app ? app.children.length : 0,
      customElements: components.map(el => ({
        tag: el.tagName.toLowerCase(),
        hasContent: el.shadowRoot ? !!el.shadowRoot.innerHTML : false,
        innerHTML: el.innerHTML.slice(0, 100)
      })),
      bodyText: document.body.innerText || 'No text content',
      lynxLoaded: typeof window.lynx !== 'undefined',
      componentsRegistered: window.lynx ? Object.keys(window.lynx.components || {}).length : 0
    };
  });
  
  console.log('\n📊 Page Analysis:');
  console.log('- Lynx loaded:', pageInfo.lynxLoaded);
  console.log('- Components registered:', pageInfo.componentsRegistered);
  console.log('- App children:', pageInfo.appChildren);
  console.log('- Custom elements found:', pageInfo.customElements.length);
  console.log('- Body text:', pageInfo.bodyText.slice(0, 100));
  
  if (pageInfo.customElements.length > 0) {
    console.log('\n🔍 Custom Elements:');
    pageInfo.customElements.forEach(el => {
      console.log(`  - <${el.tag}>: ${el.hasContent ? 'Has shadow content' : 'No shadow content'}`);
    });
  }
  
  console.log('\n⏳ Keeping browser open for 10 seconds for visual inspection...');
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  await browser.close();
  console.log('\n✅ Test completed!');
}

visualTest().catch(console.error);