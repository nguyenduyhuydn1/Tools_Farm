const fs = require("fs-extra");
const path = require("path");
const { KnownDevices } = require('puppeteer');

const { runPuppeteer } = require('./utils/puppeteer.js')
const { sleep, formatTime, userAgent, waitForInput, printFormattedTitle, log, writeTimeToFile } = require('./utils/utils.js')
const { checkIframeAndClick } = require('./utils/selector.js')
const { fetchData } = require('./utils/axios.js')
const proxyFile = require("./data/proxy.js");



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

const fetchInfo = async (auth) => {
    printFormattedTitle('Info', 'blue')
    let data = await fetchData('https://tg-bot-tap.laborx.io/api/v1/farming/info', 'GET', { authKey: 'authorization', authValue: `Bearer ${auth}`, headers, proxyUrl })
    if (data) return data;
    return false;
}

const fetchFarmingFinish = async (auth) => {
    printFormattedTitle('farming is finished', 'blue')
    let data = await fetchData('https://tg-bot-tap.laborx.io/api/v1/farming/finish', 'POST', { authKey: 'authorization', authValue: `Bearer ${auth}`, headers, body: {}, proxyUrl })
    if (data) {
        console.log(JSON.stringify(data));
        return true;
    }
    return false;
}

const fetchFarmingStart = async (auth) => {
    printFormattedTitle('farming is Started', 'blue')
    let data = await fetchData('https://tg-bot-tap.laborx.io/api/v1/farming/start', 'POST', { authKey: 'authorization', authValue: `Bearer ${auth}`, headers, body: {}, proxyUrl })
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


const MainBrowser = async (countFolder) => {
    try {
        const browser = await runPuppeteer({
            userDataDir: `C:\\Users\\Huy\\AppData\\Local\\Google\\Chrome\\User Data\\Profile ${countFolder + 100}`,
            dataProxy: proxyUrl,
        });
        const [page] = await browser.pages();
        if (proxyUrl != null) {
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

        const [src, iframe] = await checkIframeAndClick(page);
        let authorization = await getAuthorization

        let info = await fetchInfo(authorization);
        if (info) {
            const startTime = new Date(info.activeFarmingStartedAt);
            const endTime = new Date(startTime.getTime() + 3 * 60 * 60 * 1000);
            const endTimeTimestamp = endTime.getTime();
            let now = Date.now()

            console.log(JSON.stringify(info));
            log(`time: [${now > endTimeTimestamp}]`, 'yellow')
            if (now > endTimeTimestamp) {
                await fetchFarmingFinish(authorization);
                await sleep(5000);
                await fetchFarmingStart(authorization);
            }
        }

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

// (async () => {
//     for (let i = 0; i < 39; i += 2) {
//         const promises = [];

//         printFormattedTitle(`tài khoản ${i} - Profile ${i + 100}`, "red");
//         if (i > 9) {
//             let proxyIndex = Math.floor((i - 10) / 10);
//             proxyUrl = proxyFile[proxyIndex];
//             promises.push(MainBrowser(i));
//         } else {
//             promises.push(MainBrowser(i));
//         }

//         if (i + 1 < 39) {
//             printFormattedTitle(`tài khoản ${i + 1} - Profile ${i + 101}`, "red");
//             if (i + 1 > 9) {
//                 let proxyIndex = Math.floor((i + 1 - 10) / 10);
//                 proxyUrl = proxyFile[proxyIndex];
//                 promises.push(MainBrowser(i + 1));
//             } else {
//                 promises.push(MainBrowser(i + 1));
//             }
//         }

//         await Promise.all(promises);
//         await sleep(1000);
//     }
//     process.exit(1);
// })();
