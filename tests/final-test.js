const puppeteer = require('puppeteer');

async function finalTest() {
  console.log('🚀 Final Test - Checking TikTok Clone App\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Capture all console messages
  const consoleLogs = [];
  page.on('console', msg => {
    const text = msg.text();
    consoleLogs.push({ type: msg.type(), text });
    
    if (msg.type() === 'error') {
      console.log('❌ Console Error:', text);
    } else if (text.includes('mounted') || text.includes('registered')) {
      console.log('✅', text);
    }
  });
  
  console.log('Loading http://localhost:3001...\n');
  
  try {
    await page.goto('http://localhost:3001', { 
      waitUntil: 'networkidle2',
      timeout: 10000 
    });
    
    // Wait for components to render
    await page.waitForTimeout(3000);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'final-screenshot.png',
      fullPage: true 
    });
    
    // Get final state
    const finalState = await page.evaluate(() => {
      const app = document.getElementById('app');
      
      // Helper to get all text from element including shadow DOM
      const getAllText = (element) => {
        if (!element) return '';
        
        let text = '';
        
        // Check shadow DOM
        if (element.shadowRoot) {
          const walker = document.createTreeWalker(
            element.shadowRoot,
            NodeFilter.SHOW_TEXT,
            null,
            false
          );
          
          let node;
          while (node = walker.nextNode()) {
            text += node.textContent.trim() + ' ';
          }
        }
        
        // Check children
        const children = element.querySelectorAll('*');
        children.forEach(child => {
          if (child.shadowRoot) {
            text += getAllText(child);
          }
        });
        
        return text.trim();
      };
      
      // Get visible elements
      const visibleElements = [];
      const allElements = app ? app.querySelectorAll('*') : [];
      
      allElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          visibleElements.push({
            tag: el.tagName.toLowerCase(),
            text: getAllText(el).slice(0, 50)
          });
        }
      });
      
      return {
        hasContent: app && app.children.length > 0,
        visibleText: getAllText(app),
        visibleElements: visibleElements.slice(0, 10),
        customElementCount: document.querySelectorAll('*').length
      };
    });
    
    console.log('\n📊 Final Results:');
    console.log('==================\n');
    
    console.log('✅ Page loaded successfully');
    console.log('✅ Screenshot saved: final-screenshot.png');
    console.log(`✅ Total elements: ${finalState.customElementCount}`);
    console.log(`✅ Has content: ${finalState.hasContent}`);
    
    if (finalState.visibleText) {
      console.log('\n📄 Visible Text:');
      console.log(finalState.visibleText.slice(0, 200) + '...');
    } else {
      console.log('\n❌ No visible text found');
    }
    
    if (finalState.visibleElements.length > 0) {
      console.log('\n🔍 Visible Elements:');
      finalState.visibleElements.forEach(el => {
        console.log(`   - <${el.tag}>: ${el.text || '(no text)'}`);
      });
    }
    
    // Check for errors
    const errors = consoleLogs.filter(log => log.type === 'error');
    if (errors.length === 0) {
      console.log('\n✅ No console errors!');
    } else {
      console.log(`\n❌ Found ${errors.length} console errors`);
    }
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('\n🏁 Test completed!');
  console.log('Check final-screenshot.png to see the rendered page.');
}

finalTest().catch(console.error);