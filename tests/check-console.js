const puppeteer = require('puppeteer');

async function checkConsole() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  });
  
  const page = await browser.newPage();
  
  const logs = [];
  
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    logs.push({ type, text });
    
    // 색상 코드
    const colors = {
      error: '\x1b[31m',
      warning: '\x1b[33m',
      info: '\x1b[34m',
      log: '\x1b[0m',
      reset: '\x1b[0m'
    };
    
    const color = colors[type] || colors.log;
    console.log(`${color}[${type.toUpperCase()}] ${text}${colors.reset}`);
  });
  
  page.on('pageerror', error => {
    console.log('\x1b[31m[PAGE ERROR]', error.message, '\x1b[0m');
  });
  
  console.log('🔍 Checking console output for http://localhost:3001\n');
  
  try {
    await page.goto('http://localhost:3001', { 
      waitUntil: 'networkidle2',
      timeout: 10000 
    });
    
    // Wait for potential async operations
    await page.waitForTimeout(2000);
    
    // Check if app is visible
    const appState = await page.evaluate(() => {
      const app = document.getElementById('app');
      const appContainer = app ? app.querySelector('app-container') : null;
      
      return {
        hasApp: !!app,
        hasAppContainer: !!appContainer,
        appChildren: app ? app.children.length : 0,
        appHTML: app ? app.innerHTML.slice(0, 100) : '',
        bodyText: document.body.innerText.slice(0, 200)
      };
    });
    
    console.log('\n📊 App State:');
    console.log('- Has app div:', appState.hasApp);
    console.log('- Has app-container:', appState.hasAppContainer);
    console.log('- App children:', appState.appChildren);
    console.log('- App HTML preview:', appState.appHTML);
    console.log('- Body text:', appState.bodyText || '(empty)');
    
    // Summary
    const errors = logs.filter(l => l.type === 'error');
    const warnings = logs.filter(l => l.type === 'warning');
    
    console.log('\n📋 Summary:');
    console.log(`- Total logs: ${logs.length}`);
    console.log(`- Errors: ${errors.length}`);
    console.log(`- Warnings: ${warnings.length}`);
    
    if (errors.length === 0) {
      console.log('\n✅ No errors found!');
    } else {
      console.log('\n❌ Errors found - check output above');
    }
    
  } catch (error) {
    console.error('\n❌ Navigation failed:', error.message);
  }
  
  await browser.close();
}

checkConsole().catch(console.error);