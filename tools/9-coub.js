const fs = require("fs-extra");
const path = require("path");
const { KnownDevices } = require('puppeteer');

const { runPuppeteer, setMobile } = require('./utils/puppeteer.js')
const { sleep, formatTime, userAgent, waitForInput, printFormattedTitle, log, writeTimeToFile } = require('./utils/utils.js')
const { checkIframeAndClick, clickIfExists } = require('./utils/selector.js')
const { fetchData } = require('./utils/axios.js')
// const proxies = require("./../data/proxy.js");



let headers = {
    "accept": "application/json, text/plain, */*",
    "accept-language": "en-US,en;q=0.9,vi;q=0.8",
    "accept-encoding": "gzip, deflate, br, zstd",
    "priority": "u=1, i",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "csrf-token": "",
    "origin": "https://birdx.birds.dog",
    "csrf-token": "",
    "Referer": "https://birdx.birds.dog/",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1"
}
// =====================================================================
// =====================================================================
// =====================================================================

// =====================================================================
// =====================================================================
// =====================================================================


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

        await setMobile(page);

        await page.goto("https://web.telegram.org/k/#@coub");
        await page.waitForNavigation({ waitUntil: 'networkidle0' });

        const [src, iframe] = await checkIframeAndClick(page);
        await page.goto(src);
        await sleep(3000)
        await sleep(3000)

        await waitForInput()
        // setInterval(async () => {
        //     const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
        //     let arr = document.querySelectorAll("body > div > div > div > div.coubs-list__inner > div.page > div.coub.coub--timeline.coub--normal-card");
        //     console.log(arr.length);

        //     if (arr.length > 0) {
        //         for (let x of arr) {
        //             let a = x.querySelector('div.coub__inner > div.coub__vd > div.coub__description > div.coub-description__buttons > div > div.coub__like-button > span');
        //             a.click()
        //             console.log(a)
        //             await sleep(1000)
        //         }
        //         window.check = true;
        //     }
        // }, 10000);

    } catch (error) {
        console.error("Error:", error.message);
    }
};



// khong co token
(async () => {
    let proxies = fs.readFileSync(path.join(__dirname, 'data', 'proxy.txt'), 'utf8').split('\n').map(line => line.trim()).filter(line => line.length > 0);

    let totalElements = 10;
    // trong đó 3 là số proxy
    const distance = Math.floor(totalElements / 3);
    for (let offset = 0; offset < distance; offset++) {
        for (let i = offset; i < totalElements; i += distance) {
            let proxy = (i > 10) ? proxies[i] : null;
            printFormattedTitle(`account ${i} - Profile ${i + 100} - proxy ${proxy}`, "red");

            await MainBrowser(proxy, i);
            await waitForInput()
        }
    }
    writeTimeToFile('thời gian nhận thưởng tiếp theo', '6-timer.txt', 24).then(() => process.exit(1));
    process.exit(1)
})();
