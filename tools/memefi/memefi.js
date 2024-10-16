const fs = require("fs-extra");
const path = require("path");

const { KnownDevices } = require('puppeteer');
const { runPuppeteer } = require('../utils/puppeteer.js')
const { sleep, waitForInput } = require('../utils/utils.js')
const { checkIframeAndClick } = require('../utils/selector.js')
const { fetchData } = require('../utils/axios.js')

let MainBrowser = (async (countFolder) => {
    try {
        const browser = await runPuppeteer({
            userDataDir: `C:\\Users\\Huy\\AppData\\Local\\Google\\Chrome\\User Data\\memefi ${countFolder + 300}`,
        });

        // browser.on('targetcreated', async (target) => {
        //     if (target.type() === 'page') {
        //         const newPage = await target.page();
        //         await sleep(1000);
        //         await newPage.close();
        //     }
        // });

        const [page] = await browser.pages();
        const iPhone = KnownDevices['iPhone 15 Pro'];
        await page.emulate(iPhone);
        // await page.goto('https://httpbin.org/headers');

        let memescript = path.join(__dirname, '..', 'public', 'memefi.js');
        const preMemescript = fs.readFileSync(memescript, 'utf8');
        await page.evaluateOnNewDocument(preMemescript);

        const modifiedJs = fs.readFileSync('../public/telegram-web-app.js', 'utf8');
        await page.setRequestInterception(true);

        page.on('request', request => {
            if (request.url().endsWith('telegram-web-app.js')) {
                request.respond({
                    status: 200,
                    contentType: 'application/javascript',
                    body: modifiedJs
                });
            } else {
                request.continue();
            }
        });

        await page.goto("https://web.telegram.org/k/#@memefi_coin_bot");
        let [src, query_id] = await checkIframeAndClick(page)
        await page.goto(src);

        await sleep(2000)
        await sleep(2000)
        await sleep(2000)
        await sleep(2000)
        while (true) {
            await page.click(`#root > main > div > div > div.MuiBox-root > div.MuiStack-root.css-1x0m3xf > button:nth-child(1)`);
            await sleep(500)
            await page.click(`#root > main > div > div > div.MuiBox-root.css-q4ok0g > div.MuiBox-root.css-e6aoit > div > button:nth-child(1)`);
            await sleep(500)
            await page.click("body > div.MuiDrawer-root.MuiDrawer-modal.MuiModal-root > div.MuiPaper-root.MuiPaper-elevation.MuiPaper-elevation16.MuiDrawer-paper.MuiDrawer-paperAnchorBottom.css-dsgero > div.MuiBox-root.css-4q3rnc > button");
            await sleep(2000)
            await sleep(2000)
            await sleep(2000)
            await sleep(2000)
            await sleep(2000)
            await sleep(2000)
            await sleep(2000)
            await sleep(2000)
            await sleep(2000)
            await sleep(2000)
            await sleep(2000)
        }
    } catch (error) {
        console.log("---------------------error------------------------");
        console.error(error.message);
    }
});







// 2,4,5
(async () => {
    for (let i = 4; i < 19; i++) {
        await MainBrowser(i);
        await waitForInput();
    }
})();