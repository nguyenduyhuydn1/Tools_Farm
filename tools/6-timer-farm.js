const fs = require("fs-extra");
const path = require("path");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

const stealth = StealthPlugin();
stealth.enabledEvasions.delete('iframe.contentWindow');
stealth.enabledEvasions.delete('navigator.plugins');
stealth.enabledEvasions.delete('media.codecs');
puppeteer.use(stealth);


const { sleep, readLinesToArray, printFormattedTitle, waitForInput } = require('./utils/utils.js')
const { checkIframeAndClick, clickIfExists } = require('./utils/selector.js')
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

const fetchInfo = async (auth) => {
    printFormattedTitle('Info', 'blue')
    let data = await fetchData('https://tg-bot-tap.laborx.io/api/v1/farming/info', 'GET', { authKey: 'authorization', authValue: `Bearer ${auth}`, headers })
    if (data) return data;
    return false;
}

const fetchFarmingFinish = async (auth) => {
    printFormattedTitle('farming is finished', 'blue')
    let data = await fetchData('https://tg-bot-tap.laborx.io/api/v1/farming/finish', 'POST', { authKey: 'authorization', authValue: `Bearer ${auth}`, headers, body: {} })
    if (data) {
        console.log(JSON.stringify(data));
        return true;
    }
    return false;
}

const fetchFarmingStart = async (auth) => {
    printFormattedTitle('farming is Started', 'blue')
    let data = await fetchData('https://tg-bot-tap.laborx.io/api/v1/farming/start', 'POST', { authKey: 'authorization', authValue: `Bearer ${auth}`, headers, body: {} })
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
                '--window-size=700,600',
                `--window-position=0,0`,
            ],
            ignoreDefaultArgs: ["--enable-automation"],
        });

        const [page] = await browser.pages();

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
        let info = await fetchInfo(authorization);
        if (info) {
            const startTime = new Date(info.activeFarmingStartedAt);
            const endTime = new Date(startTime.getTime() + 3 * 60 * 60 * 1000);
            const endTimeTimestamp = endTime.getTime();
            let now = Date.now()
            if (now > endTimeTimestamp) {
                await fetchFarmingFinish(authorization);
                await sleep(5000);
                await fetchFarmingStart(authorization);
            }
        }
        // browser.close()
        // await waitForInput()
    } catch (error) {
        console.error("Error:", error.message);
    }
};

// let promiseTasks = [];

(async () => {
    const dataArray = readLinesToArray();
    for (let i = 0; i < dataArray.length; i++) {
        printFormattedTitle(`tài khoản ${i}`, "red");
        await MainBrowser(dataArray[i], i);
    }
    // if (promiseTasks.length > 0) {
    //     await Promise.all(promiseTasks).then(() => {
    //         console.log('Tất cả các task đã hoàn thành');
    //     });
    // }
    process.exit(1)
})();
