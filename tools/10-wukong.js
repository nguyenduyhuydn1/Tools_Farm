const fs = require("fs-extra");
const path = require("path");

const { runPuppeteer } = require('./utils/puppeteer.js')
const { sleep, formatTime, userAgent, waitForInput, printFormattedTitle, log, writeTimeToFile } = require('./utils/utils.js')
const { checkIframeAndClick } = require('./utils/selector.js')
const { fetchData } = require('./utils/axios.js')
// const proxies = require("./../data/proxy.js");

// fetch("https://api.wuko.app/wuko-miniapp/v2/user/user", {
//     "headers": {
//       "accept": "application/json, text/plain, */*",
//       "accept-language": "en-US,en;q=0.9",
//       "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIwNjY0IiwiaWF0IjoxNzI5MjMzMTk2LCJleHAiOjE3MjkyNDAzOTZ9.bhLYOtdg9xxBgz_yfkCLsVuvp3R0E8dWJuzMDmO2d_c",
//       "if-none-match": "W/\"2b1-Hz9otQ72NjFShO98uMouZNb9low\"",
//       "priority": "u=1, i",
//       "sec-ch-ua": "\"Google Chrome\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
//       "sec-ch-ua-mobile": "?0",
//       "sec-ch-ua-platform": "\"Windows\"",
//       "sec-fetch-dest": "empty",
//       "sec-fetch-mode": "cors",
//       "sec-fetch-site": "cross-site",
//       "Referer": "https://wukong-miniapp-sigma.vercel.app/",
//       "Referrer-Policy": "strict-origin-when-cross-origin"
//     },
//     "body": null,
//     "method": "GET"
//   });
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
    await fetchData('https://api.wuko.app/wuko-miniapp/v2/user/mine', 'POST', { authKey: 'authorization', authValue: `Bearer ${token}` })
    await fetchData('https://api.wuko.app/wuko-miniapp/v2/user/user', 'GET', { authKey: 'authorization', authValue: `Bearer ${token}` })
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
    const lines = data.split('\n').map(line => line.trim()).filter(line => line.length > 0);;

    let proxies = fs.readFileSync(path.join(__dirname, 'data', 'proxy.txt'), 'utf8').split('\n').map(line => line.trim()).filter(line => line.length > 0);

    let totalElements = 10;
    // trong đó 3 là số proxy
    const distance = Math.floor(totalElements / 3);
    for (let offset = 0; offset < distance; offset++) {
        for (let i = offset; i < totalElements; i += distance) {
            let proxy = (i > 9) ? proxies[i] : null;
            printFormattedTitle(`account ${i} - Profile ${i + 100} - proxy ${proxy}`, "red");

            if (check) await MainBrowser(proxy, i, lines[i]);
            else await MainBrowser(proxy, i);
            await sleep(1000);
        }
    }
    writeTimeToFile('thời gian nhận thưởng tiếp theo', '4-cryptoRank.txt', 6).then(() => process.exit(1));
    process.exit(1)
})();
