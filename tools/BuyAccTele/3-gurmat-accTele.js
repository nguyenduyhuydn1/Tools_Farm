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
const { sleep, clickIfExists } = require('./../utils/utils.js')
const proxyFile = require("../data/proxy.js");



// =====================================================================
// =====================================================================
// =====================================================================
axios.defaults.headers.common = {
    "accept": "application/json, text/plain, */*",
    "accept-language": "en-US,en;q=0.9,vi;q=0.8",
    "access-control-allow-origin": "*",
    "content-type": "application/json",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Google Chrome\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "Referer": "https://d2kpeuq6fthlg5.cloudfront.net/",
    "Referrer-Policy": "strict-origin-when-cross-origin"
};


async function fetchData(url, authorization, method, body = null, proxyUrl = null) {
    try {
        if (proxyUrl) {
            let proxyUrlTemp = `http://${proxyUrl.username}:${proxyUrl.password}@${proxyUrl.ip.substring(7)}:${proxyUrl.port}`
            const agent = new HttpsProxyAgent(proxyUrlTemp);
            const options = {
                headers: {
                    "accept-language": "en-US,en;q=0.9",
                    "authorization": `Bearer ${authorization}`,
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
        console.error("Error fetching data:", error);
        return null;
    }
}



const verifyAndLogin = async (url, method, body = null, proxyUrl = null) => {
    try {
        let proxyUrlTemp = `http://${proxyUrl.username}:${proxyUrl.password}@${proxyUrl.ip.substring(7)}:${proxyUrl.port}`
        const agent = new HttpsProxyAgent(proxyUrlTemp);
        const options = {
            headers: {
                "accept-language": "en-US,en;q=0.9,vi;q=0.8",
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
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}


// =====================================================================
// =====================================================================
// =====================================================================



let takeToken = async (iframeSrc, dataProxy) => {
    console.log("=====================================================================");
    console.log("                           đang login và xác thực");
    console.log("=====================================================================");

    let { message, data: { is_verify = null } = {} } = await verifyAndLogin("https://api.gumart.click/api/verify", "post", { telegram_data: decodeURIComponent(iframeSrc), ref_id: null }, dataProxy)

    if (is_verify == 1) {
        console.log(message);

        let { errors, data: { access_token = null } = {} } = await verifyAndLogin("https://api.gumart.click/api/login", "post", { telegram_data: decodeURIComponent(iframeSrc), ref_id: null, mode: 2, g_recaptcha_response: null }, dataProxy)
        if (errors) console.log(errors);
        return access_token;
    }
}

let fetchInfo = async (token, dataProxy) => {
    let { status_code, errors, data: { balance } } = await fetchData("https://api.gumart.click/api/home", token, "GET", {}, dataProxy);
    if (status_code == 200) {
        if (errors) console.log(errors);
        console.log(balance);
    }
}

let fetchClaim = async (token, dataProxy) => {
    let { status_code, errors, data: { claim_value = null } = {} } = await fetchData("https://api.gumart.click/api/claim", token, "POST", {}, dataProxy);
    if (status_code == 200) {
        if (errors) console.log(errors);
        console.log(`Đã lấy ${claim_value}`);
    }
}

let fetchBoost = async (token, dataProxy) => {
    let { status_code, errors, data } = await fetchData("https://api.gumart.click/api/boost", token, "POST", {}, dataProxy);
    if (status_code == 200) {
        if (errors) console.log(errors);
        if (data) {
            console.log(`Đã boost`, JSON.stringify(data));
        }
    }
}

let fetchMissions = async (token, dataProxy) => {
    let { status_code, errors, data } = await fetchData("https://api.gumart.click/api/missions", token, "get", {}, dataProxy);
    if (status_code || status_code == 200) {
        if (errors) console.log(errors);
        if (data) {
            let mergedArray = [];

            for (let key in data.tasks) {
                if (Array.isArray(data.tasks[key])) {
                    mergedArray = mergedArray.concat(data.tasks[key]);
                }
            }

            const combinedMissions = mergedArray.filter(v => v.status !== 'finished');
            return combinedMissions;
        }
    }
}


let fetchStartTask = async (token, id, dataProxy) => {
    let { status_code, message, errors, data } = await fetchData(`https://api.gumart.click/api/missions/${id}/start`, token, "POST", {}, dataProxy);
    if (status_code == 200) {
        if (errors) console.log(errors);
        if (message) console.log(message);
        return data;
    }
}

let fetchClaimTask = async (token, id, dataProxy) => {
    let { status_code, message, errors, data } = await fetchData(`https://api.gumart.click/api/missions/${id}/claim`, token, "POST", {}, dataProxy);
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
        const page2 = await browser.newPage();
        await page2.goto("https://google.com");
        await sleep(3000);
        await page.bringToFront();
        await page.goto("https://web.telegram.org/k/#@gumart_bot");
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
        await sleep(3000);

        await clickIfExists(page, "#column-center .bubbles-group-last .reply-markup > :nth-of-type(1) > :nth-of-type(1)")
        await clickIfExists(page, ".popup-confirmation.active .popup-buttons button:nth-child(1)")

        await page.waitForSelector('iframe');
        const [urlSrc, iframeSrc] = await page.evaluate(() => {
            const iframeElement = document.querySelector('iframe');
            if (iframeElement) {
                return [iframeElement.src, iframeElement.src.match(/(?<=#tgWebAppData=).*?(?=&tgWebAppVersion=7\.10)/g)[0],];
            }
        },);
        await page.goto(urlSrc)
        await sleep(5000)
        await sleep(5000)
        await sleep(5000)

        if (iframeSrc) {
            console.log("=====================================================================");
            console.log(`                           tài khoản ${countFolder}`);
            console.log("=====================================================================");
            let token = await takeToken(iframeSrc, dataProxy);
            await fetchInfo(token, dataProxy);
            await fetchClaim(token, dataProxy);
            await fetchBoost(token, dataProxy);

            let tasks = await fetchMissions(token, dataProxy);
            for (const e of tasks) {
                console.log(e.title);
                if (e.status == "claimable") await fetchClaimTask(token, e.id, dataProxy);

                if (e.status == "startable") {
                    let data = await fetchStartTask(token, e.id, dataProxy);
                    let currentTime = Math.floor(Date.now() / 1000);
                    let futureTime = data.claimable_at;
                    let delayInSeconds = futureTime - currentTime;
                    console.log(delayInSeconds / 60);

                    promiseTasks.push(new Promise((resolve) => {
                        setTimeout(async () => {
                            await fetchClaimTask(token, e.id, dataProxy);
                            resolve()
                        }, delayInSeconds * 1000);
                    }));
                }
            }
        }
        browser.close()
    } catch (error) {
        console.error("Error:", error.message);
    }
};

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function waitForInput() {
    return new Promise((resolve) => {
        rl.on('line', (input) => {
            if (input.toLowerCase() === 's') {
                resolve();
            }
        });
    });
}
let promiseTasks = [];

(async () => {
    for (let i = 0; i < 30; i++) {
        console.log(i, "-innnnndexxx");

        if (i == 1) continue
        let proxyIndex = Math.floor(i / 10);
        await MainBrowser(proxyFile[proxyIndex], i);
        await sleep(1000)
        await waitForInput();
    }
    console.log(promiseTasks.length, "-taskkkkkkkkkkkkkkkkkkkk");
    await Promise.all(promiseTasks).then(() => {
        console.log('Tất cả các task đã hoàn thành');
    });
    process.exit(1)
})();

