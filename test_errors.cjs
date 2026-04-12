const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  
  page.on('pageerror', err => {
    errors.push(err.message);
  });
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  console.log('Navigating to login...');
  await page.goto('http://localhost:5173/login');
  
  await page.fill('input[type="email"]', 'brisco.official@gmail.com');
  await page.fill('input[type="password"]', 'Usman.123'); // Adjust based on your db
  await page.click('button[type="submit"]');

  console.log('Waiting for network idle after login...');
  await page.waitForTimeout(3000); // give it time to load

  console.log('Navigating to /users...');
  await page.goto('http://localhost:5173/users');
  await page.waitForTimeout(3000); // give it time to render
  
  console.log('--- ERRORS ENCOUNTERED ---');
  console.log(errors.join('\n'));

  await browser.close();
})();
