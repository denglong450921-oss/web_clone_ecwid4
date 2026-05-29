const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });

    console.log('Navigating to https://my.ecwid.com/cp/?lang=zh-CN#register ...');
    await page.goto('https://my.ecwid.com/cp/?lang=zh-CN#register', { waitUntil: 'networkidle0', timeout: 60000 });

    // Wait for something that looks like the app has loaded.
    // Usually there is an element with class "gwt-DialogBox" or something in GWT/Angular.
    // We will just wait a few seconds.
    console.log('Waiting for 5 seconds for JS to render...');
    await new Promise(r => setTimeout(r, 5000));

    const html = await page.content();
    fs.writeFileSync('src/app/register_raw.html', html);

    console.log('Rendered HTML saved to src/app/register_raw.html');
    await browser.close();
})();
