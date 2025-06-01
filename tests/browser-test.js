const puppeteer = require('puppeteer');

async function testBrowser() {
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox'] 
  });
  
  const page = await browser.newPage();
  
  // 콘솔 메시지 캡처
  const messages = [];
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    messages.push({ type, text });
    
    if (type === 'error') {
      console.log('❌ ERROR:', text);
    }
  });
  
  // 페이지 에러 캡처
  page.on('pageerror', error => {
    console.log('🚨 PAGE ERROR:', error.message);
  });
  
  console.log('🌐 Testing http://localhost:3001...\n');
  
  try {
    await page.goto('http://localhost:3001', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // 2초 대기 (컴포넌트 렌더링 시간)
    await page.waitForTimeout(2000);
    
    // 페이지 상태 확인
    const pageState = await page.evaluate(() => {
      const app = document.getElementById('app');
      const getTextContent = (element) => {
        if (!element) return '';
        
        // Shadow DOM 내용 가져오기
        const getShadowText = (el) => {
          if (el.shadowRoot) {
            return el.shadowRoot.textContent || '';
          }
          return el.textContent || '';
        };
        
        let text = getShadowText(element);
        
        // 자식 요소들도 확인
        const children = element.querySelectorAll('*');
        children.forEach(child => {
          text += ' ' + getShadowText(child);
        });
        
        return text.trim();
      };
      
      return {
        hasApp: app !== null,
        appHTML: app ? app.innerHTML.slice(0, 200) : 'No app',
        appText: app ? getTextContent(app) : 'No text',
        customElements: Array.from(document.querySelectorAll('*'))
          .filter(el => el.tagName.includes('-'))
          .map(el => ({
            tag: el.tagName.toLowerCase(),
            hasShadow: !!el.shadowRoot,
            shadowHTML: el.shadowRoot ? el.shadowRoot.innerHTML.slice(0, 100) : null
          })),
        lynxStatus: {
          exists: typeof window.lynx !== 'undefined',
          components: window.lynx && window.lynx.components ? 
            Array.from(window.lynx.components.keys()) : []
        },
        errors: window.__errors || []
      };
    });
    
    console.log('📊 Page Analysis:');
    console.log('=================\n');
    
    console.log('✅ App Container:', pageState.hasApp ? 'Found' : 'Not found');
    console.log('✅ Lynx Framework:', pageState.lynxStatus.exists ? 'Loaded' : 'Not loaded');
    console.log('✅ Registered Components:', pageState.lynxStatus.components.length);
    
    if (pageState.lynxStatus.components.length > 0) {
      console.log('   Components:', pageState.lynxStatus.components.join(', '));
    }
    
    console.log('\n📦 Custom Elements:', pageState.customElements.length);
    pageState.customElements.forEach(el => {
      console.log(`   - <${el.tag}>: ${el.hasShadow ? '✅ Has shadow DOM' : '❌ No shadow DOM'}`);
      if (el.shadowHTML) {
        console.log(`     Preview: ${el.shadowHTML.replace(/\s+/g, ' ').slice(0, 50)}...`);
      }
    });
    
    console.log('\n📄 App Content:');
    console.log('   HTML:', pageState.appHTML.replace(/\s+/g, ' '));
    console.log('   Text:', pageState.appText || '(No visible text)');
    
    // 스크린샷
    await page.screenshot({ 
      path: 'app-screenshot.png',
      fullPage: true 
    });
    console.log('\n📸 Screenshot saved as app-screenshot.png');
    
    // 에러 확인
    const errors = messages.filter(m => m.type === 'error');
    if (errors.length > 0) {
      console.log('\n❌ Console Errors:', errors.length);
      errors.forEach(err => console.log('   -', err.text));
    } else {
      console.log('\n✅ No console errors!');
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testBrowser().catch(console.error);