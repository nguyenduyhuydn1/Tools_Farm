const fs = require("fs-extra");
const path = require("path");

const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const stealth = StealthPlugin();
stealth.enabledEvasions.delete('iframe.contentWindow');
stealth.enabledEvasions.delete('navigator.plugins')
stealth.enabledEvasions.delete('media.codecs')
puppeteer.use(stealth);

const { sleep, readLinesToArray, clickIfExists, userAgent, waitForInput } = require('./../utils/utils.js')


let MainBrowser = (async (localStorageData, countFolder) => {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            userDataDir: `C:\\Users\\Huy\\AppData\\Local\\Google\\Chrome\\User Data\\memefi ${countFolder + 300}`,
            args: ['--test-type',
                '--disable-gpu',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-sync',
                '--ignore-certificate-errors',
                '--window-size=400,800'
            ],
            // devtools: true,
            ignoreDefaultArgs: ["--enable-automation"],
        });

        browser.on('targetcreated', async (target) => {
            if (target.type() === 'page') {
                const newPage = await target.page();
                await sleep(1000);
                await newPage.close();
            }
        });

        const [page] = await browser.pages();
        await page.setUserAgent(userAgent);


        // let pathPreloadFile = path.join(__dirname, '..', 'public', 'preload.js');
        // const preloadFile = fs.readFileSync(pathPreloadFile, 'utf8');
        // await page.evaluateOnNewDocument(preloadFile);

        const modifiedJs = fs.readFileSync('../public/telegram-web-app.js', 'utf8');
        await page.setRequestInterception(true);

        page.on('request', request => {
            if (request.url().endsWith('telegram-web-app.js')) {
                console.log("telegram-web----------------------");

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
        await sleep(5000);
        await page.click("#column-center .rows-wrapper-row.has-offset > div.new-message-bot-commands.is-view");
        await clickIfExists(page, "body > div.popup.popup-peer.popup-confirmation.active > div > div.popup-buttons > button:nth-child(1)")

        await page.waitForSelector('iframe');
        let iframe = await page.evaluate(() => document.querySelector("iframe")?.getAttribute('src'));
        if (iframe) await page.goto(iframe);
        await sleep(1000)
        await page.goto("https://tg-app.memefi.club/earn");
        await sleep(2000)

        let arr = await page.evaluate(() => {
            let a = document.querySelectorAll("#root > main > div > div > div.MuiBox-root.css-q4ok0g > div:nth-child(2) > div.MuiBox-root.css-4jsa2g > div");
            return a.length;
        });

        await page.goto("https://tg-app.memefi.club/earn");
        await sleep(3000)

        while (true) {
            for (let i = 6; i < arr; i++) {
                try {
                    console.log(i);
                    await page.click(`#root > main > div > div > div.MuiBox-root.css-q4ok0g > div:nth-child(2) > div.MuiBox-root.css-4jsa2g > div:nth-child(${i})`);
                    await sleep(2000)
                    await page.click("#root > main > div > div > div.MuiBox-root.css-89r8mz > div.MuiBox-root.css-0 > div > div > div")
                    await sleep(2000)
                    await page.click("body > div.MuiDrawer-root.MuiDrawer-modal.MuiModal-root > .MuiDrawer-paper.MuiDrawer-paperAnchorBottom.css-dsgero > div.MuiBox-root.css-4q3rnc > button")
                    await sleep(2000)
                    await page.click("body .MuiDrawer-paper.MuiDrawer-paperAnchorBottom > div.MuiBox-root > div > div.MuiBox-root.css-16xrt4i > button")
                    await sleep(2000)
                    await page.click("body .MuiDrawer-paper.MuiDrawer-paperAnchorBottom > div.sc-gJhJTp.braGIf.MuiBox-root.css-1daa1cd > button")
                    await sleep(2000)
                    await page.goto("https://tg-app.memefi.club/earn");
                    await sleep(2000)
                    i--
                } catch (error) {
                    await clickIfExists(page, `body .MuiDrawer-paper.MuiDrawer-paperAnchorBottom.css-dsgero > div.MuiBox-root.css-1xnhpp1 > div > div.MuiBox-root.css-16xrt4i > div > div:nth-child(1) > div.MuiStack-root.css-xhed8o > a`)
                    console.log("error");
                    await page.goto("https://tg-app.memefi.club/earn");
                    await sleep(3000)
                }
            }
        }
    } catch (error) {
        console.log("---------------------error------------------------");
        console.error(error.message);
    }
});






(async () => {
    const dataArray = readLinesToArray();
    for (let i = 0; i < dataArray.length; i++) {
        await MainBrowser(dataArray[i], i);
        await waitForInput();
    }
})();

// (async () => {
//     const dataArray = readLinesToArray();
//     for (let i = 5; i < dataArray.length; i += 2) {
//         const promises = [];

//         promises.push(MainBrowser(dataArray[i], i));

//         if (i + 1 < dataArray.length) {
//             promises.push(MainBrowser(dataArray[i + 1], i + 1));
//         }

//         await Promise.all(promises);
//         await waitForInput();
//     }
// })();
