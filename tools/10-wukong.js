const fs = require("fs-extra");
const path = require("path");

const { runPuppeteer, setMobile, proxies, totalElements, distance } = require('./utils/puppeteer.js');
const { sleep, formatTime, takeTimeEnd, userAgent, waitForInput, printFormattedTitle, log, writeTimeToFile } = require('./utils/utils.js');
const { checkIframeAndClick } = require('./utils/selector.js');
const { fetchData } = require('./utils/axios.js');

const headers = {
    "accept": "application/json, text/plain, */*",
    "accept-language": "en-US,en;q=0.9",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Google Chrome\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "Referer": "https://wukong-miniapp-sigma.vercel.app/",
    "Referrer-Policy": "strict-origin-when-cross-origin"
}

// =====================================================================
// =====================================================================
// =====================================================================

const fetchMine = async (token) => {
    await fetchData('https://api.wuko.app/wuko-miniapp/v2/user/mine', 'POST', { authKey: 'authorization', authValue: token })
}

// =====================================================================
// =====================================================================
// =====================================================================

const MainBrowser = async (proxy, countFolder, existToken = null) => {
    try {
        const reuse = async (reuseToken, reuseProxy) => {

        }

        if (existToken != null && existToken.length > 2) {
            await reuse(existToken, proxy);
            return;
        }

        const browser = await runPuppeteer({
            userDataDir: `C:\\Users\\Huy\\AppData\\Local\\Google\\Chrome\\User Data\\Profile ${countFolder + 100}`,
            args: ['--window-size=900,800'],
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

        await page.goto("https://web.telegram.org/k/#@wukobot");
        await page.waitForNavigation({ waitUntil: 'networkidle0' });

        let [src, iframe] = await checkIframeAndClick(page);
        await page.goto(src);
        await sleep(3000);

        let dataLocalStorage = await page.evaluate(() => {
            let localStorageContent = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                localStorageContent[key] = localStorage.getItem(key);
            }
            return localStorageContent;
        });
        await waitForInput()

        fs.appendFileSync(pathFile, `${dataLocalStorage.WUKONG_FE_TOKEN}\n`, 'utf-8');
        // browser.close();
        // await waitForInput()
        let wuKongToken = dataLocalStorage.WUKONG_FE_TOKEN;
        let dataUser = JSON.parse(dataLocalStorage.WUKONG_FE_USER);

        let [now, endTimeTimestamp] = takeTimeEnd(dataUser.mineStartTimestamp * 1000, 8 * 60 * 60 * 1000);
        log(`farm xong lúc: [${formatTime(endTimeTimestamp)}]`, 'yellow');
        if (now > endTimeTimestamp) {
            await reuse(wuKongToken, proxy);
        }
    } catch (error) {
        console.error("Error:", error.message);
        await waitForInput()
    }
};


let pathFile = path.join(__dirname, 'data', 'token', 'wukong.txt');

(async (check = false) => {
    let data = fs.readFileSync(pathFile, 'utf8');
    const lines = data.split('\n').map(line => line.trim()).filter(line => line.length > 0);;

    for (let offset = 0; offset < distance; offset++) {
        for (let i = offset; i < totalElements; i += distance) {
            let proxy = (i > 9) ? proxies[i] : null;
            printFormattedTitle(`account ${i} - Profile ${i + 100} - proxy ${proxy}`, "red");

            if (check) await MainBrowser(proxy, i, lines[i]);
            else await MainBrowser(proxy, i);
            await sleep(1000);
        }
    }
    writeTimeToFile('thời gian nhận thưởng tiếp theo', '10-wokong.txt', 8).then(() => process.exit(1));
    process.exit(1)
})();
