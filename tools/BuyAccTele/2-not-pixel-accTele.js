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
const { sleep, randomNumber, clickIfExists } = require('./../utils/utils.js')
const proxyFile = require("../data/proxy.js");




axios.defaults.headers.common = {
    "accept": "application/json, text/plain, */*",
    "accept-language": "en-US,en;q=0.9,vi;q=0.8",
    "content-type": "application/json",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Google Chrome\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "Referer": `https://app.notpx.app/`,
    "Referrer-Policy": "strict-origin-when-cross-origin"
};

async function fetchData(url, authorization, method, body = null, proxyUrl = null) {
    try {
        if (proxyUrl) {
            let proxyUrlTemp = `http://${proxyUrl.username}:${proxyUrl.password}@${proxyUrl.ip.substring(7)}:${proxyUrl.port}`
            const agent = new HttpsProxyAgent(proxyUrlTemp);

            const options = {
                method: method.toUpperCase(),
                url: url,
                headers: {
                    "authorization": `initData ${decodeURIComponent(authorization)}`,
                },
                httpsAgent: agent,
                httpAgent: agent,
                proxy: false,
            };

            if (method.toUpperCase() === "POST" && body) {
                options.data = body;
            }

            const response = await axios(options);
            return response.data;
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

// =====================================================================
// =====================================================================
// =====================================================================



const getInfo = async (user, count, dataProxy) => {
    let info = await fetchData("https://notpx.app/api/v1/users/me", user, "GET", {}, dataProxy);
    console.log("==============================================================");
    console.log(`tài khoản ${count + 1}-----${info?.lastName} ${info?.firstName}`);
    console.log(`balance: ${info?.balance}, id: ${info?.id}`);
    console.log("==============================================================");
    return info
}

const getStatus = async (user, dataProxy) => {
    let status = await fetchData("https://notpx.app/api/v1/mining/status", user, "GET", {}, dataProxy);
    console.log(`status: ${JSON.stringify(status)}`);
    console.log("==============================================================");
    return status;
}

const getClaim = async (user, dataProxy) => {
    let claim = await fetchData("https://notpx.app/api/v1/mining/claim", user, "GET", {}, dataProxy);
    console.log(`claimed: ${JSON.stringify(claim)}`);
    console.log("==============================================================");
    return claim;
}

const postStart = async (user, pixelId, dataProxy) => {
    let start = await fetchData("https://notpx.app/api/v1/repaint/start", user, "POST", { pixelId, newColor: "#000000" }, dataProxy);
    console.log(`balance:${JSON.stringify(start)}`);
    return start;
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
            userDataDir: `C:\\Users\\Huy\\AppData\\Local\\Google\\Chrome\\User Data\\BuyAccTele ${countFolder + 1000}`,
            args: [
                '--test-type',
                '--disable-gpu',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-sync',
                '--ignore-certificate-errors',
                '--mute-audio',
                '--window-size=700,700',
                `--window-position=0,0`,
            ],
            ignoreDefaultArgs: ["--enable-automation"],
        });

        const [page] = await browser.pages();
        // await page.setUserAgent(userAgent);
        const page2 = await browser.newPage();
        await page2.goto("https://google.com");
        await sleep(1000);
        await page.bringToFront();
        await page.goto("https://web.telegram.org/k/#@notpixel");
        await sleep(2000);
        await sleep(2000);
        await sleep(2000);

        await clickIfExists(page, "#column-center .new-message-bot-commands.is-view")
        await clickIfExists(page, ".popup-confirmation.active .popup-buttons > *")

        await page.waitForSelector('iframe');
        let iframe = await page.evaluate(() => {
            let match;
            let iframeElement = document.querySelector("iframe");
            if (iframeElement) {
                match = iframeElement.src.match(/(?<=#tgWebAppData=).*?(?=&tgWebAppVersion=7\.10)/g)[0];
            }
            return match;
        });
        browser.close()

        let arrNumber = randomNumber();
        await getInfo(iframe, countFolder, dataProxy);
        await sleep(1000)
        let { charges } = await getStatus(iframe, dataProxy)
        await getClaim(iframe, dataProxy);
        await sleep(1000)
        for (let i = 0; i < charges; i++) {
            await postStart(iframe, arrNumber[i], dataProxy)
            await sleep(1000)
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
};

(async () => {
    for (let i = 5; i < 30; i++) {
        console.log(i, "-innnnndexxx");

        if (i == 1) continue
        let proxyIndex = Math.floor(i / 10);
        await MainBrowser(proxyFile[proxyIndex], i);
        await sleep(1000)
    }
    process.exit(1)
})();