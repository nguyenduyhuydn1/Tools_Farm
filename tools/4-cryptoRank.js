const fs = require("fs-extra");
const path = require("path");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

const stealth = StealthPlugin();
stealth.enabledEvasions.delete('iframe.contentWindow');
stealth.enabledEvasions.delete('navigator.plugins');
stealth.enabledEvasions.delete('media.codecs');
puppeteer.use(stealth);

const axios = require('axios');

const { sleep, clickIfExists, readLinesToArray, userAgent } = require('./utils/utils.js')

axios.defaults.headers.common = {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
    "priority": "u=1, i",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "Referer": "https://tma.cryptorank.io/",
    "Referrer-Policy": "strict-origin-when-cross-origin"
};

// =====================================================================
// =====================================================================
// =====================================================================

async function fetchData(url, authorization, method, body = null) {
    try {
        const options = {
            headers: {
                "authorization": authorization,
            },
            method,
        };

        if (method.toUpperCase() === "POST" && body) {
            options.data = body;
        }

        const response = await axios(url, options);
        return response.data;
    } catch (error) {
        if (error.response) {
            if (error.response.status === 409) {
                console.error("Đã Farm");
            } else {
                console.error(`Error ${error.response.status}:`, error.response.data);
            }
        } else {
            // Error without response (like network issues)
            console.error("Error fetching data:", error.message);
        }
    }
}

const fetchFarming = async (auth) => {
    console.log("==============================================================");
    console.log("                       start farning")
    console.log("==============================================================");
    let data = await fetchData('https://api.cryptorank.io/v0/tma/account/start-farming', auth, 'POST', {})
    if (data) console.log(`balance hiện tại ${data.balance}`);
}

const fetchTask = async (auth) => {
    console.log("==============================================================");
    console.log("                       lấy tasks")
    console.log("==============================================================");
    let data = await fetchData('https://api.cryptorank.io/v0/tma/account/tasks', auth, 'GET', {})
    let arr;
    if (data) {
        arr = data.filter(v => v.type == 'daily' || v.name == '$1000 Solidus Ai Tech Raffle')
        arr.map(v => console.log(`nhiệm vụ: ${v.name}`))
    }
    return arr;
}

const fetchClaim = async (id, auth) => {
    console.log("==============================================================");
    console.log("                       làm nhiệm vụ")
    console.log("==============================================================");
    let data = await fetchData(`https://api.cryptorank.io/v0/tma/account/claim/task/${id}`, auth, 'POST', {})

    if (data) console.log(`đã hoàn thành nv, ${data.balance}`);
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
                // '--disable-gpu',
                // '--disable-3d-apis',               // Vô hiệu hóa WebGL
                // '--disable-accelerated-2d-canvas', // Vô hiệu hóa Canvas hardware acceleration
                // '--disable-gpu-compositing',       // Vô hiệu hóa GPU compositing
                '--disable-video',                 // Vô hiệu hóa video decoding
                '--disable-software-rasterizer',    // Vô hiệu hóa software rasterization
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
        await sleep(2000)

        await clickIfExists(page, "#column-center .new-message-bot-commands.is-view")
        await clickIfExists(page, "#column-center .bubbles-group-last .reply-markup > :nth-of-type(1) > :nth-of-type(1)")
        await clickIfExists(page, ".popup-confirmation.active .popup-buttons button:nth-child(1)")

        let authorization = await getAuthorization

        await fetchFarming(authorization);
        let tasks = await fetchTask(authorization);
        for (let x of tasks) {
            await fetchClaim(x.id, authorization)
        }
        browser.close()
    } catch (error) {
        console.error("Error:", error.message);
    }
};



(async () => {
    const dataArray = readLinesToArray();
    for (let i = 0; i < dataArray.length; i++) {
        await MainBrowser(dataArray[i], i);
        await sleep(1000)
    }
})();
