const fs = require("fs-extra");
const path = require("path");

const { runPuppeteer } = require('./utils/puppeteer.js')
const { sleep, formatTime, userAgent, waitForInput, printFormattedTitle, log, writeTimeToFile } = require('./utils/utils.js')
const { checkIframeAndClick } = require('./utils/selector.js')
const { fetchData } = require('./utils/axios.js')
// const proxies = require("./../data/proxy.js");


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

const fetchAccount = async (auth, proxy) => {
    printFormattedTitle('start farning', "blue")
    let data = await fetchData('https://api.cryptorank.io/v0/tma/account', 'GET', { authKey: 'authorization', authValue: auth, headers, proxy })
    if (data) {
        const startTime = new Date(data.farming.timestamp);
        const endTime = new Date(startTime.getTime() + 6 * 60 * 60 * 1000 + (2 * 60 * 1000));
        const endTimeTimestamp = endTime.getTime();

        log(`bắt đầu lúc: [${formatTime(data.farming.timestamp)}] và kết thúc lúc: [${formatTime(endTimeTimestamp)}]`, 'yellow')
        return endTimeTimestamp;
    }
    return false;
}

const fetchFarming = async (auth, proxy) => {
    printFormattedTitle('start farning', "blue")
    let data = await fetchData('https://api.cryptorank.io/v0/tma/account/start-farming', 'POST', { authKey: 'authorization', authValue: auth, headers, body: {}, proxy })
    if (data) {
        console.log(`balance hiện tại ${data.balance}`);
        return true;
    }
    return false;
}

const fetchTask = async (auth, proxy) => {
    printFormattedTitle('lấy tasks', "blue")
    let data = await fetchData('https://api.cryptorank.io/v0/tma/account/tasks', 'GET', { authKey: 'authorization', authValue: auth, headers, body: {}, proxy })
    if (data) {
        data = data.filter(v => (v.type == 'daily' || v.name == '$1000 Solidus Ai Tech Raffle') && v.isDone == false)
        data.map(v => console.log(`nhiệm vụ: ${v.name}`))
        return data;
    }
    return false;
}

const fetchClaim = async (id, auth, proxy) => {
    let data = await fetchData(`https://api.cryptorank.io/v0/tma/account/claim/task/${id}`, 'POST', { authKey: 'authorization', authValue: auth, headers, body: {}, proxy })
    if (data) console.log(`đã hoàn thành nv, ${data.balance}`);
}

const fetchClaimEndFarming = async (auth, proxy) => {
    printFormattedTitle('claim farm', "blue")
    let data = await fetchData(`https://api.cryptorank.io/v0/tma/account/end-farming`, 'POST', { authKey: 'authorization', authValue: auth, headers, body: {}, proxy })
    if (data) {
        console.log(`đã hoàn thành nv, ${JSON.stringify(data)}`);
        return true;
    }
    return false;
}

// =====================================================================
// =====================================================================
// =====================================================================

const MainBrowser = async (proxy, countFolder, existToken = null) => {
    try {
        const reuse = async (reuseToken, reuseProxy) => {
            let timestamp = await fetchAccount(reuseToken, reuseProxy);
            let now = Date.now();

            if (timestamp < now) {
                await fetchClaimEndFarming(reuseToken, reuseProxy);
                await sleep("5000")
                await fetchFarming(reuseToken, reuseProxy);

                let tasks = await fetchTask(reuseToken, reuseProxy);
                if (tasks.length > 0) {
                    printFormattedTitle('làm nhiệm vụ', "blue")
                    for (let x of tasks) {
                        await fetchClaim(x.id, reuseToken, reuseProxy);
                    }
                }
            }
        }

        if (existToken != null && existToken.length > 2) {
            await reuse(existToken, proxy);
            return;
        }

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

        // await waitForInput()
        fs.appendFileSync(pathFile, `${authorization}\n`, 'utf-8');
        browser.close();

        await reuse(authorization, proxy);
    } catch (error) {
        console.error("Error:", error.message);
        await waitForInput()
    }
};

let pathFile = path.join(__dirname, 'data', 'token', 'cryptoRank.txt');
(async (check = true) => {
    let data = fs.readFileSync(pathFile, 'utf8');
    const lines = data.split('\n');
    const totalElements = 10;
    let proxies = ['x', 'y', 'z'];

    for (let i = 0; i < totalElements; i++) {
        printFormattedTitle(`tài khoản ${i} - Profile ${i + 100}`, "red")
        let proxy = (i > 10) ? proxies[i % proxies.length] : null;

        if (check) await MainBrowser(proxy, i, lines[i]);
        else await MainBrowser(proxy, i);
        await sleep(2000);
    }
    writeTimeToFile('thời gian nhận thưởng tiếp theo', '4-cryptoRank.txt', 6).then(() => process.exit(1));
    process.exit(1)
})();
