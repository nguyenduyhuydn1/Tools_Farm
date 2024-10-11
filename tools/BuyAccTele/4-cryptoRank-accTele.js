const fs = require("fs-extra");
const path = require("path");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const ProxyPlugin = require('puppeteer-extra-plugin-proxy');

const stealth = StealthPlugin();
stealth.enabledEvasions.delete('iframe.contentWindow');
stealth.enabledEvasions.delete('navigator.plugins');
stealth.enabledEvasions.delete('media.codecs');
puppeteer.use(stealth);

const { HttpsProxyAgent } = require('https-proxy-agent');
const axios = require('axios');
const { sleep, clickIfExists, waitForInput, userAgent } = require('./../utils/utils.js')
const proxyFile = require("../data/proxy.js");

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

async function fetchData(url, authorization, method, body = null, proxyUrl = null, headers = null) {
    try {
        if (proxyUrl) {
            let proxyUrlTemp = `http://${proxyUrl.username}:${proxyUrl.password}@${proxyUrl.ip.substring(7)}:${proxyUrl.port}`
            const agent = new HttpsProxyAgent(proxyUrlTemp);
            const options = {
                headers: {
                    "authorization": authorization,
                    ...headers
                },
                method,
                httpsAgent: agent,
                httpAgent: agent,
                proxy: false
            };

            if (method.toUpperCase() === "POST" && body) {
                options.data = body;
            }

            const response = await axios(url, options);
            return response.data;
        }
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

const fetchFarming = async (auth, dataProxy) => {
    console.log("==============================================================");
    console.log("                       start farning")
    console.log("==============================================================");
    let data = await fetchData('https://api.cryptorank.io/v0/tma/account/start-farming', auth, 'POST', {}, dataProxy)
    if (data) {
        console.log(`balance hiện tại ${JSON.stringify(data)}`);
        return data;
    }
}

const fetchTask = async (auth, dataProxy) => {
    console.log("==============================================================");
    console.log("                       lấy tasks")
    console.log("==============================================================");
    let data = await fetchData('https://api.cryptorank.io/v0/tma/account/tasks', auth, 'GET', {}, dataProxy)
    let arr;
    if (data) {
        arr = data.filter(v => (v.type == 'daily' || v.name == '$1000 Solidus Ai Tech Raffle') && v.isDone == false)
        arr.map(v => console.log(`nhiệm vụ: ${v.name}`))
    }
    return arr;
}

const fetchClaim = async (id, auth, dataProxy) => {
    console.log("==============================================================");
    console.log("                       làm nhiệm vụ")
    console.log("==============================================================");
    let data = await fetchData(`https://api.cryptorank.io/v0/tma/account/claim/task/${id}`, auth, 'POST', {}, dataProxy)

    if (data) console.log(`đã hoàn thành nv, ${JSON.stringify(data)}`);
}

const fetchClaimEndFarming = async (auth, dataProxy) => {
    console.log("==============================================================");
    console.log("                       claim farm")
    console.log("==============================================================");

    let headers = { "sec-ch-ua": "\"Google Chrome\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"", }
    let data = await fetchData(`https://api.cryptorank.io/v0/tma/account/end-farming`, auth, 'POST', {}, dataProxy, headers)

    if (data) {
        console.log(`đã hoàn thành nv, ${JSON.stringify(data)}`);
        return data;
    }
}


// =====================================================================
// =====================================================================
// =====================================================================

const MainBrowser = async (dataProxy, countFolder) => {
    try {
        puppeteer.use(
            ProxyPlugin({
                address: dataProxy.ip,
                port: dataProxy.port,
                credentials: {
                    username: dataProxy.username,
                    password: dataProxy.password,
                }
            })
        );

        const browser = await puppeteer.launch({
            headless: false,
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            userDataDir: `C:\\Users\\Huy\\AppData\\Local\\Google\\Chrome\\User Data\\BuyAccTele ${countFolder + 1000}`,          //BuyAccTele
            args: [
                // '--disable-3d-apis',               // Vô hiệu hóa WebGL
                // '--disable-accelerated-2d-canvas', // Vô hiệu hóa Canvas hardware acceleration
                // '--disable-gpu-compositing',       // Vô hiệu hóa GPU compositing
                '--disable-video',                 // Vô hiệu hóa video decoding
                '--disable-software-rasterizer',    // Vô hiệu hóa software rasterization

                '--test-type',
                // '--disable-gpu',
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
        const page2 = await browser.newPage();
        await page2.goto("https://google.com");
        await sleep(3000);
        await page.bringToFront();
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
        await sleep(3000)
        await clickIfExists(page, "#column-center .new-message-bot-commands.is-view")
        await clickIfExists(page, ".popup-confirmation.active .popup-buttons button:nth-child(1)")

        let authorization = await getAuthorization
        browser.close()

        let check1 = await fetchClaimEndFarming(authorization, dataProxy);
        await sleep("5000")
        let check2 = await fetchFarming(authorization, dataProxy);
        if (!(check1 && check2)) {
            await sleep("5000")
            await fetchClaimEndFarming(authorization, dataProxy);
            await sleep("5000")
            await fetchFarming(authorization, dataProxy);
        }

        let tasks = await fetchTask(authorization, dataProxy);
        for (let x of tasks) {
            await fetchClaim(x.id, authorization, dataProxy);
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
};



(async () => {
    for (let i = 0; i < 30; i++) {
        console.log(i, "-innnnndexxx");

        if (i == 1) continue
        let proxyIndex = Math.floor(i / 10);
        await MainBrowser(proxyFile[proxyIndex], i);
        await sleep(1000)
        // await waitForInput()
    }
    process.exit(1)
})();
