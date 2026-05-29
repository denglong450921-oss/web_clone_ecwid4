const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });

    await page.goto('http://localhost:3000/register', { waitUntil: 'networkidle2' });

    // Wait a bit for CSS to apply
    await new Promise(r => setTimeout(r, 2000));

    await page.screenshot({ path: 'register.png', fullPage: true });

    await browser.close();
    console.log('Register screenshot saved as register.png');
})();
