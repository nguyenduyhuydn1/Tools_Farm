const fs = require("fs-extra");
const path = require("path");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

const stealth = StealthPlugin();
stealth.enabledEvasions.delete('iframe.contentWindow');
stealth.enabledEvasions.delete('navigator.plugins');
stealth.enabledEvasions.delete('media.codecs');
puppeteer.use(stealth);
const { sleep, clickIfExists, randomNumber, readLinesToArray, userAgent, waitForInput } = require('./utils/utils.js')



async function fetchData(url, authorization, method, body = null) {
    try {
        const options = {
            headers: {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en-US,en;q=0.9,vi;q=0.8",
                "authorization": `initData ${decodeURIComponent(authorization)}`,
                "priority": "u=1, i",
                "sec-ch-ua": "\"Google Chrome\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "Referer": `https://app.notpx.app/`,
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            method
        };

        if (method.toUpperCase() === "POST" && body) {
            options.headers["Content-Type"] = "application/json";
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

// =====================================================================
// =====================================================================
// =====================================================================



const getInfo = async (user, count) => {
    let info = await fetchData("https://notpx.app/api/v1/users/me", user, "GET");
    console.log(`=============== tài khoản ${count + 1}------- ${info?.lastName} ${info?.firstName} ===================`);
    console.log(`balance: ${info?.balance}, id: ${info?.id}`);
    console.log("============================================================================");
    return info
}

const getStatus = async (user) => {
    let status = await fetchData("https://notpx.app/api/v1/mining/status", user, "GET");
    console.log(`status: ${JSON.stringify(status)}`);
    console.log("============================================================================");
    return status;
}

const getClaim = async (user) => {
    let claim = await fetchData("https://notpx.app/api/v1/mining/claim", user, "GET");
    console.log(`claimed: ${JSON.stringify(claim)}`);
    console.log("============================================================================");
    return claim;
}

const postStart = async (user, pixelId) => {
    let start = await fetchData("https://notpx.app/api/v1/repaint/start", user, "POST", { pixelId, newColor: "#2450A4" });
    console.log(`balance:${JSON.stringify(start)}`);
    return start;
}


// =====================================================================
// =====================================================================
// =====================================================================


const MainBrowser = async (localStorageData, countFolder) => {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            userDataDir: `C:\\Users\\Huy\\AppData\\Local\\Google\\Chrome\\User Data\\not_pixel ${countFolder + 500}`,
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
        await page.setUserAgent(userAgent);

        await page.goto("https://web.telegram.org/k/#@notpixel");
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
        await sleep(2000)

        await page.waitForSelector("#column-center .bubbles-group-last .reply-markup a").then(e => e.click());
        await page.waitForSelector(".popup-confirmation.active .popup-buttons button:nth-child(1)").then(e => e.click());
        await page.waitForSelector('iframe');
        let iframe = await page.evaluate(() => {
            let match;
            let iframeElement = document.querySelector("iframe");
            if (iframeElement) {
                const src = iframeElement.src;
                match = src.match(/(?<=#tgWebAppData=).*?(?=&tgWebAppVersion=7\.10)/g)[0];
            }
            return match;
        });
        // await waitForInput()
        browser.close()

        await sleep(5000)
        let arrNumber = randomNumber();
        await getInfo(iframe, countFolder);
        await sleep(1000)
        let { charges = 10 } = await getStatus(iframe)
        await sleep(1000)
        await getClaim(iframe);
        await sleep(1000)
        for (let i = 0; i < charges; i++) {
            await postStart(iframe, arrNumber[Math.floor(Math.random() * arrNumber.length - 1)])
            await sleep(1000)
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
};

(async () => {
    const dataArray = readLinesToArray();
    for (let i = 0; i < dataArray.length; i++) {
        console.log(i);

        await MainBrowser(dataArray[i], i);
        await sleep(1000)
    }
    process.exit(1)
})();