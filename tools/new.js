const fs = require("fs-extra");
const path = require("path");

const { runPuppeteer } = require('./utils/puppeteer.js')
const { sleep, formatTime, userAgent, waitForInput, printFormattedTitle, log } = require('./utils/utils.js')
const { checkIframeAndClick } = require('./utils/selector.js')
const { fetchData } = require('./utils/axios.js')
const proxyFile = require("./data/proxy.js");


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
    let data = await fetchData("https://api.gumart.click/api/verify", "post", { headers, body: { telegram_data: iframeSrc, ref_id: null }, proxyUrl })
    if (data?.data?.is_verify == 1) {
        let data2 = await fetchData("https://api.gumart.click/api/login", "post", { body: { telegram_data: iframeSrc, ref_id: null, mode: 2, g_recaptcha_response: null }, proxyUrl })
        if (data2) return data2.data.access_token;
        return false;
    }
    return false;
}

let fetchInfo = async (token) => {
    let data = await fetchData("https://api.gumart.click/api/home", "GET", { authKey: 'authorization', authValue: `Bearer ${token}`, headers, proxyUrl });
    if (data) console.log(data.data.balance);
    else console.log(`Check Error ${log('fetchInfo()')}`);
}

let fetchClaim = async (token) => {
    let data = await fetchData("https://api.gumart.click/api/claim", "POST", { authKey: 'authorization', authValue: `Bearer ${token}`, body: {}, headers, proxyUrl });
    if (data) console.log(`Đã lấy ${claim_value}`);
    else console.log(`Check Error ${log('fetchClaim()')}`);
}


let fetchBoost = async (token) => {
    let data = await fetchData("https://api.gumart.click/api/boost", "POST", { authKey: 'authorization', authValue: `Bearer ${token}`, body: {}, headers, proxyUrl });
    if (data) console.log(`Đã boost`, JSON.stringify(data));
    else console.log(`Check Error ${log('fetchBoost()')}`);
}

let fetchMissions = async (token) => {
    let data = await fetchData("https://api.gumart.click/api/missions", "get", { authKey: 'authorization', authValue: `Bearer ${token}`, headers, proxyUrl });
    if (data) {
        let { data } = data;
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

let fetchStartTask = async (token, id) => {
    let data = await fetchData(`https://api.gumart.click/api/missions/${id}/start`, "POST", { authKey: 'authorization', authValue: `Bearer ${token}`, headers, proxyUrl });
    if (data) return data;
    return false;
}

let fetchClaimTask = async (token, id) => {
    let data = await fetchData(`https://api.gumart.click/api/missions/${id}/claim`, "POST", { authKey: 'authorization', authValue: `Bearer ${token}`, headers, proxyUrl });
    if (data) console.log(data.title);
    else console.log(`Check Error ${log('fetchClaimTask()')}`);
}

// =====================================================================
// =====================================================================
// =====================================================================

const MainBrowser = async (countFolder) => {
    try {
        const browser = await runPuppeteer(`C:\\Users\\Huy\\AppData\\Local\\Google\\Chrome\\User Data\\Profile ${countFolder + 100}`, ['--disable-gpu']);
        const [page] = await browser.pages();
        if (proxyUrl != null) {
            const page2 = await browser.newPage();
            await page2.goto("https://google.com");
            await sleep(3000);
            await page.bringToFront();
        }

        await page.goto("https://web.telegram.org/k/#@gumart_bot");
        await page.waitForNavigation({ waitUntil: 'networkidle0' });

        await checkIframeAndClick(page);
        const iframeSrc = await page.evaluate(() => {
            const iframeElement = document.querySelector('iframe');
            if (iframeElement) {
                return iframeElement.src.match(/(?<=#tgWebAppData=).*?(?=&tgWebAppVersion=7\.10)/g)[0];
            }
        },);

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
                console.log(`Tất cả các task của ${log(`tài khoản ${countFolder}`)} đã hoàn thành`);
            });

        }
        // await waitForInput()
        browser.close();
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
    process.exit(1)
})();