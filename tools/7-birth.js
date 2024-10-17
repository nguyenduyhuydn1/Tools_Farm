const fs = require("fs-extra");
const path = require("path");
const { KnownDevices } = require('puppeteer');

const { runPuppeteer } = require('./utils/puppeteer.js')
const { sleep, formatTime, userAgent, waitForInput, printFormattedTitle, log, writeTimeToFile } = require('./utils/utils.js')
const { checkIframeAndClick, clickIfExists } = require('./utils/selector.js')
const { fetchData } = require('./utils/axios.js')
// const proxies = require("./../data/proxy.js");



let options = {
    "accept": "*/*",
    "accept-encoding": "gzip, deflate, br, zstd",
    "accept-language": "en-US,en;q=0.9,vi;q=0.8",
    "access-control-request-headers": "csrf-token,telegramauth",
    "access-control-request-method": "GET",
    "origin": "https://birdx.birds.dog",
    "priority": "u=1, i",
    "referer": "https://birdx.birds.dog/",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1"
};

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

const fetchEggPlay = async (auth, proxy) => {
    await fetchData('https://api.birds.dog/minigame/egg/play', 'OPTIONS', { headers: options, proxy })
    let data = await fetchData('https://api.birds.dog/minigame/egg/play', 'GET', { authKey: 'telegramauth', authValue: `tma ${auth}`, headers, proxy })
    if (data) {
        log(`[${JSON.stringify(data)}]`);
        return data;
    }
    else {
        log(`[error fetchEggPlay()]`)
        return false;
    }
}

const fetchEggClaim = async (auth, proxy) => {
    await fetchData('https://api.birds.dog/minigame/egg/claim', 'OPTIONS', { headers: options, proxy })
    let claim = await fetchData('https://api.birds.dog/minigame/egg/claim', 'GET', { authKey: 'telegramauth', authValue: `tma ${auth}`, headers, proxy })
    if (claim) log(`claim: [${claim}]`, 'yellow')
    else log(`[error fetchEggClaim()]`)
}

// check worms có xuất hiện k để bắt
const fetchMintStatusWorms = async (auth, proxy) => {
    let options2 = {
        "access-control-request-headers": "authorization,csrf-token",
    }
    let options3 = {
        "access-control-request-headers": "authorization,csrf-token",
        "access-control-request-method": "POST",
    }
    let options4 = {
        "content-type": "application/json",
    }
    await fetchData('https://worm.birds.dog/worms/mint-status', 'OPTIONS', { headers: { ...options, ...options2 }, proxy })
    await sleep(2000)
    let status = await fetchData('https://worm.birds.dog/worms/mint-status', 'GET', { authKey: 'authorization', authValue: `tma ${auth}`, headers, proxy })
    if (status) {
        if (status.data.status == 'MINT_OPEN') {
            await fetchData('https://worm.birds.dog/worms/mint', 'OPTIONS', { headers: { ...options, ...options3 }, proxy });
            let mint = await fetchData('https://worm.birds.dog/worms/mint', 'POST', { authKey: 'authorization', authValue: `tma ${auth}`, headers: { ...options, ...options4 }, proxy, body: JSON.stringify({}) })
            console.log(JSON.stringify(mint));
        }
        log(`Sâu sẽ xuất hiện lúc: [${formatTime(status.data.nextMintTime)}]`, 'yellow')
    }
    else log(`[error fetchMintStatusWorms()]`)
}

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

        await page.goto("https://web.telegram.org/k/#@birdx2_bot");
        await page.waitForNavigation({ waitUntil: 'networkidle0' });

        const [src, iframe] = await checkIframeAndClick(page);

        await page.goto(src);
        await page.goto('https://birdx.birds.dog/mini-game');
        await sleep(3000)
        // await waitForInput()
        browser.close()

        await fetchMintStatusWorms(iframe, proxy);
        let data = await fetchEggPlay(iframe, proxy);
        if (data) {
            for (let i = 0; i < data.turn; i++) {
                await fetchEggPlay(iframe, proxy);
            }
            await fetchEggClaim(iframe, proxy);
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
};

(async () => {
    const totalElements = 10;
    let proxies = ['x', 'y', 'z'];

    for (let i = 0; i < totalElements; i++) {
        printFormattedTitle(`tài khoản ${i} - Profile ${i + 100}`, "red")
        let proxy = (i > 10) ? proxies[i % proxies.length] : null;

        await MainBrowser(proxy, i);
        await sleep(2000);
    }
    writeTimeToFile('thời gian đập trứng tiếp theo', '7-birth.txt', 3).then(() => process.exit(1));
    process.exit(1)
})();
