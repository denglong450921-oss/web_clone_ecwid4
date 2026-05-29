const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const pages = ['http://localhost:3000', 'http://localhost:3000/promote', 'http://localhost:3000/facebook', 'http://localhost:3000/manage', 'http://localhost:3000/register'];
    
    for (const url of pages) {
        console.log(`\n--- Auditing ${url} ---`);
        const page = await browser.newPage();
        
        page.on('console', msg => {
            if (msg.type() === 'error' || msg.type() === 'warning') {
                console.log(`[${msg.type().toUpperCase()}] ${msg.text()}`);
            }
        });
        
        page.on('response', response => {
            if (!response.ok()) {
                console.log(`[NETWORK ERROR] ${response.status()} ${response.url()}`);
            }
        });

        try {
            await page.goto(url, { waitUntil: 'networkidle2' });
            
            // Check for elements that are wider than the viewport (horizontal scroll issue)
            const horizontalScroll = await page.evaluate(() => {
                return document.documentElement.scrollWidth > document.documentElement.clientWidth;
            });
            console.log(`[LAYOUT] Horizontal scrolling present: ${horizontalScroll}`);
            
            // Trigger scroll to fire IntersectionObservers
            await page.evaluate(() => {
                window.scrollBy(0, window.innerHeight);
            });
            
            // Wait a bit for animations
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Check if animation classes were added
            const animatedElements = await page.evaluate(() => {
                return document.querySelectorAll('.animate--animated, .hpc-animate--animated, .promote-paralax--animated').length;
            });
            console.log(`[ANIMATION] Activated animated elements: ${animatedElements}`);
            
        } catch (e) {
            console.log(`Error auditing ${url}: ${e.message}`);
        }
        await page.close();
    }

    await browser.close();
})();
