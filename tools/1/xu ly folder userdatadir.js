// const puppeteer = require("puppeteer-extra");

// (async () => {
//     const browser = await puppeteer.launch({
//         headless: false,
//         args: ['--remote-debugging-port=9222', '--remote-debugging-address=0.0.0.0', '--no-sandbox'],
//     });

//     const page = await browser.newPage();

//     await page.goto('https://google.com/', { waitUntil: 'networkidle0' });
// })()












// const puppeteer = require('puppeteer-core');

// async function runBrowser() {
//     const browser = await puppeteer.connect({
//         browserURL: 'http://127.0.0.1:9222', // Kết nối tới Chrome từ xa
//         defaultViewport: null,
//     });

//     const page = await browser.newPage();
//     await page.goto('https://example.com');
//     console.log('Trang đã được mở thành công!');

// }

// runBrowser();
