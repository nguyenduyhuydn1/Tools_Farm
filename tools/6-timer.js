const fs = require("fs-extra");
const path = require("path");
const { KnownDevices } = require('puppeteer');

const { runPuppeteer, proxies, totalElements, distance } = require('./utils/puppeteer.js')
const { sleep, formatTime, userAgent, waitForInput, printFormattedTitle, log, writeTimeToFile } = require('./utils/utils.js')
const { checkIframeAndClick } = require('./utils/selector.js')
const { fetchData } = require('./utils/axios.js')



const headers = {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "priority": "u=1, i",
    "sec-ch-ua": "Mozilla/5.0 (Linux; U; Android 1.5; de-de; Galaxy Build/CUPCAKE) AppleWebKit/528.5  (KHTML, like Gecko) Version/3.1.2 Mobile Safari/525.20.1",
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": "\"Android\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "Referer": "https://timefarm.app/",
    "Referrer-Policy": "strict-origin-when-cross-origin",
}


// =====================================================================
// =====================================================================
// =====================================================================

const fetchInfo = async (auth, proxy) => {
    printFormattedTitle('Info', 'blue')
    let data = await fetchData('https://tg-bot-tap.laborx.io/api/v1/farming/info', 'GET', { authKey: 'authorization', authValue: `Bearer ${auth}`, headers, proxy })
    if (data) return data;
    return false;
}

const fetchFarmingFinish = async (auth, proxy) => {
    printFormattedTitle('farming is finished', 'blue')
    let data = await fetchData('https://tg-bot-tap.laborx.io/api/v1/farming/finish', 'POST', { authKey: 'authorization', authValue: `Bearer ${auth}`, headers, body: {}, proxy })
    if (data) {
        console.log(JSON.stringify(data));
        return true;
    }
    return false;
}

const fetchFarmingStart = async (auth, proxy) => {
    printFormattedTitle('farming is Started', 'blue')
    let data = await fetchData('https://tg-bot-tap.laborx.io/api/v1/farming/start', 'POST', { authKey: 'authorization', authValue: `Bearer ${auth}`, headers, body: {}, proxy })
    if (data) {
        console.log(JSON.stringify(data));
        return true;
    }
    return false;
}

// const fetchTasks = async (auth) => {
//     printFormattedTitle('tasks', 'blue')
//     let data = await fetchData('https://tg-bot-tap.laborx.io/api/v1/tasks', 'GET', { authKey: 'authorization', authValue: `Bearer ${auth}`, headers })
//     if (data) {
//         data = data.filter(v => v.submission == null)
//         return data;
//     }
//     return false;
// }

// const fetchSubmissions = async (auth, id) => {
//     printFormattedTitle('Submissions', 'blue')
//     let data = await fetchData(`https://tg-bot-tap.laborx.io/api/v1/tasks/${id}/submissions`, 'POST', { authKey: 'authorization', authValue: `Bearer ${auth}`, headers })
//     if (data) console.log(JSON.stringify(data));
// }

// const fetchClaims = async (auth, id, title) => {
//     printFormattedTitle('Claims', 'blue')
//     let data = await fetchData(`https://tg-bot-tap.laborx.io/api/v1/tasks/${id}/claims`, 'POST', { authKey: 'authorization', authValue: `Bearer ${auth}`, headers, body: {} })
//     if (data) {
//         console.log(title);
//         console.log(JSON.stringify(data));
//     }
// }

// const fetchWatchVideo = async () => {
//     printFormattedTitle('Watch video', 'blue')
//     let data = await fetchData(`https://api.adsgram.ai/adv?blockId=2994&tg_id=7712064825&tg_platform=web&platform=Win32&language=en`, 'GET', { headers })
//     if (data) console.log(JSON.stringify(data));
// }

// =====================================================================
// =====================================================================
// =====================================================================


const MainBrowser = async (proxy, countFolder, existToken = null) => {
    try {
        const reuse = async (reuseToken, reuseProxy) => {
            let info = await fetchInfo(reuseToken, reuseProxy);
            if (info) {
                const startTime = new Date(info.activeFarmingStartedAt);
                const endTime = new Date(startTime.getTime() + 3 * 60 * 60 * 1000);
                const endTimeTimestamp = endTime.getTime();
                let now = Date.now()

                console.log(JSON.stringify(info));
                log(`time: [${now > endTimeTimestamp}]`, 'yellow')
                if (now > endTimeTimestamp) {
                    await fetchFarmingFinish(reuseToken, reuseProxy);
                    await sleep(5000);
                    await fetchFarmingStart(reuseToken, reuseProxy);
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

        const getAuthorization = new Promise((resolve) => {
            page.on('response', async (response) => {
                const url = response.url();
                const status = response.status();
                if (url == "https://tg-bot-tap.laborx.io/api/v1/auth/validate-init/v2") {
                    if (status === 200) {
                        const responseBody = await response.text();
                        let token = JSON.parse(responseBody).token
                        resolve(token)
                    }
                }
            });
        });

        await page.goto("https://web.telegram.org/k/#@TimeFarmCryptoBot");
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


let pathFile = path.join(__dirname, 'data', 'token', 'timer.txt');

(async (check = true) => {
    let data = fs.readFileSync(pathFile, 'utf8');
    const lines = data.split('\n').map(line => line.trim()).filter(line => line.length > 0);;

    for (let offset = 0; offset < distance; offset++) {
        for (let i = offset; i < totalElements; i += distance) {
            let proxy = (i > 9) ? proxies[i] : null;
            proxy = proxies[i] == 'null' ? null : proxies[i];
            printFormattedTitle(`account ${i} - Profile ${i + 100} - proxy ${proxy}`, "red");

            if (check) await MainBrowser(proxy, i, lines[i]);
            else await MainBrowser(proxy, i);
            await sleep(1000);
        }
    }
    writeTimeToFile('thời gian nhận thưởng tiếp theo', '6-timer.txt', 4).then(() => process.exit(1));
    process.exit(1)
})();
