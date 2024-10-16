const fs = require("fs-extra");
const path = require("path");
const { KnownDevices } = require('puppeteer');

const { runPuppeteer } = require('./utils/puppeteer.js')
const { sleep, formatTime, userAgent, waitForInput, printFormattedTitle, log, writeTimeToFile } = require('./utils/utils.js')
const { checkIframeAndClick } = require('./utils/selector.js')
const { fetchData } = require('./utils/axios.js')
const proxyFile = require("./data/proxy.js");


// =====================================================================
// =====================================================================
// =====================================================================


// =====================================================================
// =====================================================================
// =====================================================================

// userDataDir: `C:\\Users\\Huy\\AppData\\Local\\Google\\Chrome\\User Data\\Profile ${count + 100}`,            //Kucoi
// userDataDir: `C:\\Users\\Huy\\AppData\\Local\\Google\\Chrome\\User Data\\memefi ${count + 300}`,             //memefi
// userDataDir: `C:\\Users\\Huy\\AppData\\Local\\Google\\Chrome\\User Data\\not_pixel ${count + 500}`,          //not-pixel
// userDataDir: `C:\\Users\\Huy\\AppData\\Local\\Google\\Chrome\\User Data\\not_pixel ${count + 800}`,          //gumart

// 30acc
// userDataDir: `C:\\Users\\Huy\\AppData\\Local\\Google\\Chrome\\User Data\\BuyAccTele ${count + 1000}`,        //BuyAccTele
const MainBrowser = async (countFolder) => {
    try {
        const browser = await runPuppeteer(`C:\\Users\\Huy\\AppData\\Local\\Google\\Chrome\\User Data\\Profile ${countFolder + 100}`, [], proxyUrl);
        const [page] = await browser.pages();
        if (proxyUrl != null) {
            const page2 = await browser.newPage();
            await page2.goto("https://google.com");
            await sleep(3000);
            await page.bringToFront();
        }
        // const iPhone = KnownDevices['iPhone 15 Pro'];
        // await page.emulate(iPhone);

        // let memescript = path.join(__dirname, '..', 'public', 'memefi.js');
        // const preMemescript = fs.readFileSync(memescript, 'utf8');
        // await page.evaluateOnNewDocument(preMemescript);

        // const modifiedJs = fs.readFileSync('../public/telegram-web-app.js', 'utf8');
        // await page.setRequestInterception(true);

        // page.on('request', request => {
        //     if (request.url().endsWith('telegram-web-app.js')) {
        //         request.respond({
        //             status: 200,
        //             contentType: 'application/javascript',
        //             body: modifiedJs
        //         });
        //     } else {
        //         request.continue();
        //     }
        // });


        await page.goto("https://web.telegram.org/k/");
        await page.waitForNavigation({ waitUntil: 'networkidle0' });

        await checkIframeAndClick(page);
        const iframeSrc = await page.evaluate(() => {
            const iframeElement = document.querySelector('iframe');
            if (iframeElement) {
                return iframeElement.src.match(/(?<=#tgWebAppData=).*?(?=&tgWebAppVersion=7\.10)/g)[0];
            }
        },);

        fs.appendFileSync(path.join(__dirname, 'data', 'major.txt'), `${iframeSrc}\n`, 'utf-8');
        // await sleep(5000)
        // await sleep(5000)
        // await sleep(5000)
        // await waitForInput()
        browser.close()
    } catch (error) {
        console.error("Error:", error.message);
    }
};

let proxyUrl = null;

(async () => {
    for (let i = 0; i < 39; i++) {
        printFormattedTitle(`tài khoản ${i} - Profile ${i + 100}`, "red")
        if (i > 9) {
            let proxyIndex = Math.floor((i - 10) / 10);
            proxyUrl = proxyFile[proxyIndex];
            await MainBrowser(i);
        } else {
            await MainBrowser(i);
        }
    }
    writeTimeToFile('thời gian nhận thưởng tiếp theo', '6-timer.txt', 4).then(() => process.exit(1));
    process.exit(1)
})();