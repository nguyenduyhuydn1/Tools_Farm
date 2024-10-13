const fs = require("fs-extra");
const path = require("path");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

const stealth = StealthPlugin();
stealth.enabledEvasions.delete('iframe.contentWindow');
stealth.enabledEvasions.delete('navigator.plugins');
stealth.enabledEvasions.delete('media.codecs');
puppeteer.use(stealth);

const { sleep, readLinesToArray, userAgent, waitForInput, printFormattedTitle } = require('./utils/utils.js')
const { checkIframeAndClick } = require('./utils/selector.js')
const { fetchData } = require('./utils/axios.js')


// =====================================================================
// =====================================================================
// =====================================================================
const headers = {
    "accept": "application/json, text/plain, */*",
    "accept-language": "en-US,en;q=0.9",
    "access-control-allow-origin": "*",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Google Chrome\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "Referer": "https://d2kpeuq6fthlg5.cloudfront.net/",
    "Referrer-Policy": "strict-origin-when-cross-origin"
}

// =====================================================================
// =====================================================================
// =====================================================================

let takeToken = async (iframeSrc) => {
    printFormattedTitle('đang login và xác thực', 'blue')
    let { message, data: { is_verify = null } = {} } = await fetchData("https://api.gumart.click/api/verify", "post", { body: { telegram_data: decodeURIComponent(iframeSrc), ref_id: null } })
    console.log(message);
    if (is_verify == 1) {
        let { errors, data: { access_token = null } = {} } = await fetchData("https://api.gumart.click/api/login", "post", { body: { telegram_data: decodeURIComponent(iframeSrc), ref_id: null, mode: 2, g_recaptcha_response: null } })
        if (errors) console.log(errors);
        return access_token;
    }
}

let fetchInfo = async (token) => {
    let { status_code, errors, data: { balance } } = await fetchData("https://api.gumart.click/api/home", "GET", { authKey: 'authorization', authValue: `Bearer ${token}`, headers });
    if (status_code == 200) {
        if (errors) console.log(errors);
        console.log(balance);
    }
}

let fetchClaim = async (token) => {
    let { status_code, errors, data: { claim_value = null } = {} } = await fetchData("https://api.gumart.click/api/claim", "POST", { authKey: 'authorization', authValue: `Bearer ${token}`, body: {}, headers });
    if (status_code == 200) {
        if (errors) console.log(errors);
        console.log(`Đã lấy ${claim_value}`);
    }
}


let fetchBoost = async (token) => {
    let { status_code, errors, data } = await fetchData("https://api.gumart.click/api/boost", "POST", { authKey: 'authorization', authValue: `Bearer ${token}`, body: {}, headers });
    if (status_code == 200) {
        if (errors) console.log(errors);
        if (data) {
            console.log(`Đã boost`, JSON.stringify(data));
        }
    }
}

let fetchMissions = async (token) => {
    let { status_code, errors, data } = await fetchData("https://api.gumart.click/api/missions", "get", { authKey: 'authorization', authValue: `Bearer ${token}`, headers });
    if (status_code == 200) {
        if (errors) console.log(errors);
        if (data) {
            // let mergedArray = [];

            // for (let key in data.tasks) {
            //     if (Array.isArray(data.tasks[key])) {
            //         mergedArray = mergedArray.concat(data.tasks[key]);
            //     }
            // }

            // const combinedMissions = mergedArray.filter(v => v.status !== 'finished');
            const combinedMissions = data.tasks.gumart.filter(v => v.status !== 'finished');
            return combinedMissions;
        }
    }
}

let fetchStartTask = async (token, id) => {
    let { status_code, message, errors, data } = await fetchData(`https://api.gumart.click/api/missions/${id}/start`, "POST", { authKey: 'authorization', authValue: `Bearer ${token}`, headers });
    if (status_code == 200) {
        if (errors) console.log(errors);
        if (message) console.log(message);
        return data;
    }
}

let fetchClaimTask = async (token, id) => {
    let { status_code, message, errors, data } = await fetchData(`https://api.gumart.click/api/missions/${id}/claim`, "POST", { authKey: 'authorization', authValue: `Bearer ${token}`, headers });
    console.log(status_code);

    if (status_code == 200) {
        if (errors) console.log(errors);
        if (message) console.log(message);
        if (data) console.log(data.title);
    }
}

// =====================================================================
// =====================================================================
// =====================================================================

const MainBrowser = async (localStorageData, countFolder) => {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            userDataDir: `C:\\Users\\Huy\\AppData\\Local\\Google\\Chrome\\User Data\\not_pixel ${countFolder + 800}`,
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
                '--window-size=700,400',
                `--window-position=0,0`,
            ],
            ignoreDefaultArgs: ["--enable-automation"],
        });

        const [page] = await browser.pages();
        await page.setUserAgent(userAgent);

        await page.goto("https://web.telegram.org/k/#@gumart_bot");
        await page.waitForNavigation({ waitUntil: 'networkidle0' });

        await checkIframeAndClick(page);
        const iframeSrc = await page.evaluate(() => {
            const iframeElement = document.querySelector('iframe');
            if (iframeElement) {
                return iframeElement.src.match(/(?<=#tgWebAppData=).*?(?=&tgWebAppVersion=7\.10)/g)[0];
            }
        },);
        browser.close()

        if (iframeSrc) {
            let token = await takeToken(iframeSrc);
            await fetchInfo(token);
            await fetchClaim(token);
            await fetchBoost(token);
            let promiseTasks = [];

            let tasks = await fetchMissions(token);
            for (const e of tasks) {
                console.log(e.title);
                if (e.status == "claimable") await fetchClaimTask(token, e.id);

                if (e.status == "startable") {
                    let data = await fetchStartTask(token, e.id);
                    let currentTime = Math.floor(Date.now() / 1000);
                    let futureTime = data.claimable_at;
                    let delayInSeconds = futureTime - currentTime;
                    console.log(delayInSeconds / 60);

                    promiseTasks.push(new Promise((resolve) => {
                        setTimeout(async () => {
                            await fetchClaimTask(token, e.id);
                            resolve()
                        }, delayInSeconds * 1000);
                    }));
                }
            }
            Promise.all(promiseTasks).then(() => {
                console.log('Tất cả các task đã hoàn thành');
            });

        }
    } catch (error) {
        console.error("Error:", error.message);
    }
};

let promiseTasks = [];

(async () => {
    const dataArray = readLinesToArray();
    for (let i = 0; i < dataArray.length; i++) {
        printFormattedTitle(`tài khoản ${i}`, 'blue')
        await MainBrowser(dataArray[i], i);
        await sleep(1000)
    }
    if (promiseTasks.length > 0) {
        await Promise.all(promiseTasks).then(() => {
            console.log('Tất cả các task đã hoàn thành');
        });
    }
    process.exit(1)
})();

