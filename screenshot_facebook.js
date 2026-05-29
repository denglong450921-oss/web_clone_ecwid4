const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });

    await page.goto('http://localhost:3000/facebook', { waitUntil: 'networkidle2' });

    // Scroll down to trigger IntersectionObserver animations
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });

    // Wait a bit for CSS transitions
    await new Promise(r => setTimeout(r, 2000));

    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));

    await page.screenshot({ path: 'facebook.png', fullPage: true });

    await browser.close();
    console.log('Facebook screenshot saved as facebook.png');
})();
