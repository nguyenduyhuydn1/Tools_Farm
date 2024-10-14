const fs = require("fs-extra");
const path = require("path");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

const stealth = StealthPlugin();
stealth.enabledEvasions.delete('iframe.contentWindow');
stealth.enabledEvasions.delete('navigator.plugins');
stealth.enabledEvasions.delete('media.codecs');
puppeteer.use(stealth);

const { sleep, readLinesToArray, userAgent, printFormattedTitle } = require('./utils/utils.js')
const { checkIframeAndClick } = require('./utils/selector.js')
const { fetchData } = require('./utils/axios.js')


const headers = {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
    "priority": "u=1, i",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "Referer": "https://tma.cryptorank.io/",
    "Referrer-Policy": "strict-origin-when-cross-origin"
}
// =====================================================================
// =====================================================================
// =====================================================================


const fetchFarming = async (auth) => {
    printFormattedTitle('start farning', "blue")
    let data = await fetchData('https://api.cryptorank.io/v0/tma/account/start-farming', 'POST', { authKey: 'authorization', authValue: auth, headers, body: {} })
    if (data) {
        console.log(`balance hiện tại ${data.balance}`);
        return true;
    }
    return false;
}

const fetchTask = async (auth) => {
    printFormattedTitle('lấy tasks', "blue")
    let data = await fetchData('https://api.cryptorank.io/v0/tma/account/tasks', 'GET', { authKey: 'authorization', authValue: auth, headers, body: {} })
    if (data) {
        data = data.filter(v => (v.type == 'daily' || v.name == '$1000 Solidus Ai Tech Raffle') && v.isDone == false)
        data.map(v => console.log(`nhiệm vụ: ${v.name}`))
        return data;
    }
    return false;
}

const fetchClaim = async (id, auth) => {
    let data = await fetchData(`https://api.cryptorank.io/v0/tma/account/claim/task/${id}`, 'POST', { authKey: 'authorization', authValue: auth, headers, body: {} })
    if (data) console.log(`đã hoàn thành nv, ${data.balance}`);
}

const fetchClaimEndFarming = async (auth) => {
    printFormattedTitle('claim farm', "blue")
    let data = await fetchData(`https://api.cryptorank.io/v0/tma/account/end-farming`, 'POST', { authKey: 'authorization', authValue: auth, headers, body: {} })
    if (data) {
        console.log(`đã hoàn thành nv, ${JSON.stringify(data)}`);
        return true;
    }
    return false;
}

// =====================================================================
// =====================================================================
// =====================================================================

const MainBrowser = async (localStorageData, countFolder) => {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            userDataDir: `C:\\Users\\Huy\\AppData\\Local\\Google\\Chrome\\User Data\\Profile ${countFolder + 100}`,
            args: [
                // '--disable-3d-apis',               // Vô hiệu hóa WebGL
                // '--disable-accelerated-2d-canvas', // Vô hiệu hóa Canvas hardware acceleration
                // '--disable-gpu-compositing',       // Vô hiệu hóa GPU compositing
                // '--disable-video',                 // Vô hiệu hóa video decoding
                // '--disable-software-rasterizer',    // Vô hiệu hóa software rasterization

                '--test-type',
                '--disable-gpu',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-sync',
                '--ignore-certificate-errors',
                '--mute-audio',
                '--window-size=700,400',
                `--window-position=0,0`,
            ],
            ignoreDefaultArgs: ["--enable-automation"],
        });

        const [page] = await browser.pages();
        await page.setUserAgent(userAgent);

        await page.setRequestInterception(true);

        const getAuthorization = new Promise((resolve) => {
            page.on('request', request => {
                if (request.url() == 'https://api.cryptorank.io/v0/tma/account') {
                    if (request.headers().authorization) {
                        let authorization = request.headers().authorization;
                        resolve(authorization);
                    }
                }
                request.continue();
            });
        });
        await page.goto("https://web.telegram.org/k/#@CryptoRank_app_bot");
        await page.waitForNavigation({ waitUntil: 'networkidle0' });

        await checkIframeAndClick(page);

        let authorization = await getAuthorization

        let check1 = await fetchClaimEndFarming(authorization);
        await sleep("5000")
        let check2 = await fetchFarming(authorization);
        if (!(check1 && check2)) {
            await sleep("5000")
            await fetchClaimEndFarming(authorization);
            await sleep("5000")
            await fetchFarming(authorization);
        }
        browser.close()

        let tasks = await fetchTask(authorization);
        if (tasks) {
            printFormattedTitle('làm nhiệm vụ', "blue")
            for (let x of tasks) {
                await fetchClaim(x.id, authorization)
            }
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
};



(async () => {
    const dataArray = readLinesToArray();
    for (let i = 0; i < dataArray.length; i++) {
        printFormattedTitle(`tài khoản ${i}`, "blue")
        await MainBrowser(dataArray[i], i);
    }
    process.exit(1)
})();
