const fs = require("fs-extra");
const path = require("path");

const { runPuppeteer } = require('./utils/puppeteer.js')
const { sleep, formatTime, userAgent, waitForInput, printFormattedTitle, log } = require('./utils/utils.js')
const { checkIframeAndClick } = require('./utils/selector.js')
const { fetchData } = require('./utils/axios.js')
const proxyFile = require("./data/proxy.js");


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

const fetchAccount = async (auth) => {
    printFormattedTitle('start farning', "blue")
    let data = await fetchData('https://api.cryptorank.io/v0/tma/account', 'GET', { authKey: 'authorization', authValue: auth, headers, proxyUrl })
    if (data) {
        const startTime = new Date(data.farming.timestamp);
        const endTime = new Date(startTime.getTime() + 6 * 60 * 60 * 1000 + (2 * 60 * 1000));
        const endTimeTimestamp = endTime.getTime();

        console.log(`bắt đầu lúc: ${log(formatTime(data.farming.timestamp))} và kết thúc lúc: ${log(formatTime(endTimeTimestamp))}`);
        return endTimeTimestamp;
    }
    return false;
}

const fetchFarming = async (auth) => {
    printFormattedTitle('start farning', "blue")
    let data = await fetchData('https://api.cryptorank.io/v0/tma/account/start-farming', 'POST', { authKey: 'authorization', authValue: auth, headers, body: {}, proxyUrl })
    if (data) {
        console.log(`balance hiện tại ${data.balance}`);
        return true;
    }
    return false;
}

const fetchTask = async (auth) => {
    printFormattedTitle('lấy tasks', "blue")
    let data = await fetchData('https://api.cryptorank.io/v0/tma/account/tasks', 'GET', { authKey: 'authorization', authValue: auth, headers, body: {}, proxyUrl })
    if (data) {
        data = data.filter(v => (v.type == 'daily' || v.name == '$1000 Solidus Ai Tech Raffle') && v.isDone == false)
        data.map(v => console.log(`nhiệm vụ: ${v.name}`))
        return data;
    }
    return false;
}

const fetchClaim = async (id, auth) => {
    let data = await fetchData(`https://api.cryptorank.io/v0/tma/account/claim/task/${id}`, 'POST', { authKey: 'authorization', authValue: auth, headers, body: {}, proxyUrl })
    if (data) console.log(`đã hoàn thành nv, ${data.balance}`);
}

const fetchClaimEndFarming = async (auth) => {
    printFormattedTitle('claim farm', "blue")
    let data = await fetchData(`https://api.cryptorank.io/v0/tma/account/end-farming`, 'POST', { authKey: 'authorization', authValue: auth, headers, body: {}, proxyUrl })
    if (data) {
        console.log(`đã hoàn thành nv, ${JSON.stringify(data)}`);
        return true;
    }
    return false;
}

// =====================================================================
// =====================================================================
// =====================================================================

const MainBrowser = async (countFolder) => {
    try {
        const browser = await runPuppeteer(`C:\\Users\\Huy\\AppData\\Local\\Google\\Chrome\\User Data\\Profile ${countFolder + 100}`, ['--disable-gpu']);
        const [page] = await browser.pages();
        if (proxyUrl != null) {
            const page2 = await browser.newPage();
            await page2.goto("https://google.com");
            await sleep(3000);
            await page.bringToFront();
        }

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

        let timestamp = await fetchAccount(authorization);
        let now = Date.now();

        if (timestamp < now) {
            let check1 = await fetchClaimEndFarming(authorization);
            await sleep("5000")
            let check2 = await fetchFarming(authorization);
            if (!(check1 && check2)) {
                await sleep("5000")
                await fetchClaimEndFarming(authorization);
                await sleep("5000")
                await fetchFarming(authorization);
            }

            let tasks = await fetchTask(authorization);
            if (tasks) {
                printFormattedTitle('làm nhiệm vụ', "blue")
                for (let x of tasks) {
                    await fetchClaim(x.id, authorization)
                }
            }
        }
        // await waitForInput()
        browser.close();
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
    process.exit(1)
})();