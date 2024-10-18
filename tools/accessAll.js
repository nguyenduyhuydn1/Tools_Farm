const fs = require("fs-extra");
const path = require("path");
// https://en.wikipedia.org/wiki/List_of_Android_smartphones#G
// https://developer.apple.com/library/archive/documentation/DeviceInformation/Reference/iOSDeviceCompatibility/Displays/Displays.html
const { runPuppeteer, setMobile, proxies, totalElements, distance } = require('./utils/puppeteer.js');
const { sleep, formatTime, userAgent, waitForInput, printFormattedTitle, log, writeTimeToFile } = require('./utils/utils.js');
const { checkIframeAndClick } = require('./utils/selector.js');
const { fetchData } = require('./utils/axios.js');


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

// let localStorageContent = {};
// for (let i = 0; i < localStorage.length; i++) {
//     const key = localStorage.key(i);
//     localStorageContent[key] = localStorage.getItem(key);
// }
// console.log(localStorageContent);

// set localstorage
// await page.goto("https://web.telegram.org/");
// await page.evaluate((data) => {
// for (const [key, value] of Object.entries(data)) {
//     localStorage.setItem(key, value);
// }
// }, localStorageData);
// await page.reload();
const MainBrowser = async (proxy, countFolder, existToken = null) => {
    try {
        const browser = await runPuppeteer({
            userDataDir: `C:\\Users\\Huy\\AppData\\Local\\Google\\Chrome\\User Data\\Profile ${countFolder + 100}`,
            proxy,
        });
        const [page] = await browser.pages();
        if (proxy != null) {
            const page2 = await browser.newPage();
            await page2.goto("https://google.com");
            await sleep(3000);
            await page.bringToFront();
        }

        // await setMobile(page);

        // const addFunc = async (page) => {
        //     const pathPreloadFile = path.join(__dirname, 'public', 'preload.js');
        //     const preloadFile = fs.readFileSync(pathPreloadFile, 'utf8');
        //     await page.evaluateOnNewDocument(preloadFile);
        // };
        // await addFunc(page);

        // const modifiedJs = fs.readFileSync('./public/telegram-web-app.js', 'utf8');
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

        // const [src, iframe] = await checkIframeAndClick(page);
        // await page.goto(src);
        // await sleep(5000)

        // fs.appendFileSync(path.join(__dirname, 'data', 'major.txt'), `${iframeSrc}\n`, 'utf-8');
        // await sleep(5000)
        // await sleep(5000)
        // await waitForInput()
        // browser.close()
    } catch (error) {
        console.error("Error:", error.message);
    }
};

(async () => {
    for (let i = 10; i < 51; i++) {
        let proxy = (i > 9) ? proxies[i] : null;
        printFormattedTitle(`account ${i} - Profile ${i + 100} - proxy ${proxy}`, "red");
        await MainBrowser(proxy, i);
        await waitForInput();
    }
    process.exit(1);
})();

