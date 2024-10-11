const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

const stealth = StealthPlugin();
stealth.enabledEvasions.delete('iframe.contentWindow');
stealth.enabledEvasions.delete('navigator.plugins');
stealth.enabledEvasions.delete('media.codecs');
puppeteer.use(stealth);

const { sleep, clickIfExists, readLinesToArray, formatTime, userAgent, waitForInput } = require('./utils/utils.js')
const { fetchData } = require('./utils/axios.js')
console.log(userAgent);

// =====================================================================
// =====================================================================
// =====================================================================
const headers = {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "priority": "u=1, i",
    "sec-ch-ua": "Mozilla/5.0 (Linux; U; Android 1.5; de-de; Galaxy Build/CUPCAKE) AppleWebKit/528.5  (KHTML, like Gecko) Version/3.1.2 Mobile Safari/525.20.1",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "Referer": "https://cf.seeddao.org/",
    "Referrer-Policy": "strict-origin-when-cross-origin",
}

const fetchClaimFarm = async (auth) => {
    let data = await fetchData('https://elb.seeddao.org/api/v1/seed/claim', 'POST', { authKey: 'telegram-data', authValue: auth, headers });
    if (data) {
        console.log("==============================================================");
        console.log("                       Claim")
        console.log("==============================================================");
        console.log(JSON.stringify(data));
        return data
    }
}

const fetchLoginBonuses = async (auth) => {
    let data = await fetchData('https://elb.seeddao.org/api/v1/login-bonuses', 'POST', { authKey: 'telegram-data', authValue: auth, headers });
    if (data) {
        console.log("==============================================================");
        console.log("                       check daily")
        console.log("==============================================================");
        console.log(JSON.stringify(data));
        return data
    }
}

const fetchInfoWorms = async (auth) => {
    let { data } = await fetchData('https://elb.seeddao.org/api/v1/worms/me-all', 'GET', { authKey: 'telegram-data', authValue: auth, headers });
    if (data) {
        console.log("==============================================================");
        console.log("                       all the worms we have")
        console.log("==============================================================");
        console.log(`we have ${data.length} worm`);
        return data
    }
}

const fetchInfoLeader = async (auth) => {
    let { data } = await fetchData('https://elb.seeddao.org/api/v1/bird/is-leader', 'GET', { authKey: 'telegram-data', authValue: auth, headers });
    if (data) {
        console.log("==============================================================");
        console.log("                       Leader")
        console.log("==============================================================");
        console.log(JSON.stringify(data));
        return data
    }
}

// claim do sau khi san ngoc
// check thong tin leader da di san hay chua roi hay dung ham nay
// "hunt_end_at": "2024-10-12T02:06:27.987217Z",,"status": "hunting" thi dung ham nay
const fetchCompleteHunting = async (auth, id) => {
    let { data } = await fetchData('https://elb.seeddao.org/api/v1/bird-hunt/complete', 'POST', { authKey: 'telegram-data', authValue: auth, headers, body: { bird_id: id } });
    if (data) {
        console.log("==============================================================");
        console.log("                       Hunting complete")
        console.log("==============================================================");
        console.log(`hunting`);
        return data
    }
}


// cho chim an
// check thong tin leader da di san hay chua roi hay dung ham nay
// "hunt_end_at": "2024-10-12T02:06:27.987217Z",,"status": "hunting" thi dung ham nay
const fetchBirthFeed = async (auth, info) => {
    let addHeader = {
        "accept": "application/json, text/plain, */*",
        "content-type": "application/json",
    }
    if (info) {
        let { bird_id, worm_ids } = info;
        let { data } = await fetchData('https://elb.seeddao.org/api/v1/bird-feed', 'POST', { authKey: 'telegram-data', authValue: auth, headers: { ...headers, ...addHeader }, body: { bird_id, worm_ids } });
        if (data) {
            console.log("==============================================================");
            console.log("                       Birth Feed")
            console.log("==============================================================");
            console.log(``);
            return data
        }
    }
}


// lam chim thoai mai
const fetchHappyBrith = async (auth, bird_id) => {
    let addHeader = {
        "accept": "application/json, text/plain, */*",
        "content-type": "application/json",
    }
    if (info) {
        let { data } = await fetchData('https://elb.seeddao.org/api/v1/bird-happiness', 'POST', { authKey: 'telegram-data', authValue: auth, headers: { ...headers, ...addHeader }, body: { bird_id, happiness_rate: 10000 } });
        if (data) {
            console.log("==============================================================");
            console.log("                       Happy Birth")
            console.log("==============================================================");
            console.log(`happiness_level : ${data.happiness_level}`);
            return data
        }
    }
}

const fetchBirthStartHunting = async (auth, bird_id) => {
    let addHeader = {
        "accept": "application/json, text/plain, */*",
        "content-type": "application/json",
    }

    let { data } = await fetchData('https://elb.seeddao.org/api/v1/bird-hunt/start', 'POST', { authKey: 'telegram-data', authValue: auth, headers: { ...headers, ...addHeader }, body: { bird_id, task_level: 0 } });
    if (data) {
        console.log("==============================================================");
        console.log("                       Birth start hunting")
        console.log("==============================================================");
        console.log(`start hunting and end ${formatTime(data.hunt_end_at)}`);
        return data
    }
}


const fetchMissions = async (auth) => {
    let { data } = await fetchData('https://elb.seeddao.org/api/v1/tasks/progresses', 'GET', { authKey: 'telegram-data', authValue: auth, headers, });
    if (data) {
        console.log("==============================================================");
        console.log("                       Missions")
        console.log("==============================================================");
        data = data.filter(v => v.task_user?.completed == null);
        return data
    }
}

const fetchClaimTask = async (auth, idTask) => {
    let { data } = await fetchData(`https://elb.seeddao.org/api/v1/tasks/${idTask}`, 'POST', { authKey: 'telegram-data', authValue: auth, headers, });
    if (data) {
        return data
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
            userDataDir: `C: \\Users\\Huy\\AppData\\Local\\Google\\Chrome\\User Data\\not_pixel ${countFolder + 800} `,
            args: [
                // // '--disable-3d-apis',               // Vô hiệu hóa WebGL
                // // '--disable-accelerated-2d-canvas', // Vô hiệu hóa Canvas hardware acceleration
                // // '--disable-gpu-compositing',       // Vô hiệu hóa GPU compositing
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
                `--window - position=0, 0`,
            ],
            ignoreDefaultArgs: ["--enable-automation"],
        });

        const [page] = await browser.pages();

        await page.goto("https://web.telegram.org/k/#@seed_coin_bot");
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
        await sleep(2000)

        await clickIfExists(page, "#column-center .bubbles-group-last .reply-markup > :nth-of-type(1) > :nth-of-type(1)")
        await clickIfExists(page, ".popup-confirmation.active .popup-buttons button:nth-child(1)")
        await clickIfExists(page, "#column-center .new-message-bot-commands.is-view")

        await page.waitForSelector('iframe');
        const iframeSrc = await page.evaluate(() => {
            const iframeElement = document.querySelector('iframe');
            if (iframeElement) {
                return iframeElement.src.match(/(?<=#tgWebAppData=).*?(?=&tgWebAppVersion=7\.10)/g)[0];
            }
        },);
        // browser.close()

        if (iframeSrc) {
            console.log("=====================================================================");
            console.log(`                        tài khoản ${countFolder} `);
            console.log("=====================================================================");


        }
    } catch (error) {
        console.error("Error:", error.message);
    }
};

let promiseTasks = [];

(async () => {
    const dataArray = readLinesToArray();
    for (let i = 0; i < dataArray.length; i++) {
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

