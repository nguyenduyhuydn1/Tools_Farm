const fs = require("fs-extra");
const path = require("path");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

const stealth = StealthPlugin();
stealth.enabledEvasions.delete('iframe.contentWindow');
stealth.enabledEvasions.delete('navigator.plugins');
stealth.enabledEvasions.delete('media.codecs');
puppeteer.use(stealth);

const { sleep, clickIfExists, readLinesToArray, userAgent, waitForInput } = require('./utils/utils.js')


// =====================================================================
// =====================================================================
// =====================================================================


async function fetchData(url, authorization, method, body = null) {
    try {
        const options = {
            headers: {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en-US,en;q=0.9",
                "access-control-allow-origin": "*",
                "authorization": `Bearer ${authorization}`,
                "priority": "u=1, i",
                "sec-ch-ua": "\"Google Chrome\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site",
                "Referer": "https://d2kpeuq6fthlg5.cloudfront.net/",
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


const verifyAndLogin = async (url, method, body = null) => {
    try {
        const options = {
            headers: {
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



let takeToken = async (iframeSrc) => {
    console.log("=====================================================================");
    console.log("                           đang login và xác thực");
    console.log("=====================================================================");

    let { message, data: { is_verify = null } = {} } = await verifyAndLogin("https://api.gumart.click/api/verify", "post", { telegram_data: decodeURIComponent(iframeSrc), ref_id: null })
    console.log(message);
    if (is_verify == 1) {
        let { errors, data: { access_token = null } = {} } = await verifyAndLogin("https://api.gumart.click/api/login", "post", { telegram_data: decodeURIComponent(iframeSrc), ref_id: null, mode: 2, g_recaptcha_response: null })
        if (errors) console.log(errors);
        return access_token;
    }
}

let fetchInfo = async (token) => {
    let { status_code, errors, data: { balance } } = await fetchData("https://api.gumart.click/api/home", token, "GET");
    if (status_code == 200) {
        if (errors) console.log(errors);
        console.log(balance);
    }
}

let fetchClaim = async (token) => {
    let { status_code, errors, data: { claim_value = null } = {} } = await fetchData("https://api.gumart.click/api/claim", token, "POST", {});
    if (status_code == 200) {
        if (errors) console.log(errors);
        console.log(`Đã lấy ${claim_value}`);
    }
}

let fetchBoost = async (token) => {
    let { status_code, errors, data } = await fetchData("https://api.gumart.click/api/boost", token, "POST", {});
    if (status_code == 200) {
        if (errors) console.log(errors);
        if (data) {
            console.log(`Đã boost`, JSON.stringify(data));
        }
    }
}

let fetchMissions = async (token) => {
    let { status_code, errors, data } = await fetchData("https://api.gumart.click/api/missions", token, "get");
    if (status_code == 200) {
        if (errors) console.log(errors);
        if (data) {
            let mergedArray = [];

            for (let key in data.tasks) {
                if (Array.isArray(data.tasks[key])) {
                    mergedArray = mergedArray.concat(data.tasks[key]);
                }
            }

            const combinedMissions = mergedArray.filter(v => v.status !== 'finished');
            // const combinedMissions = data.tasks.gumart.filter(v => v.status !== 'finished');
            return combinedMissions;
        }
    }
}


let fetchStartTask = async (token, id) => {
    let { status_code, message, errors, data } = await fetchData(`https://api.gumart.click/api/missions/${id}/start`, token, "POST");
    if (status_code == 200) {
        if (errors) console.log(errors);
        if (message) console.log(message);
        return data;
    }
}

let fetchClaimTask = async (token, id) => {
    let { status_code, message, errors, data } = await fetchData(`https://api.gumart.click/api/missions/${id}/claim`, token, "POST");
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
        await page.setUserAgent(userAgent);

        await page.goto("https://web.telegram.org/k/#@gumart_bot");
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
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
        browser.close();

        if (iframeSrc) {
            console.log("=====================================================================");
            console.log(`                           tài khoản ${countFolder}`);
            console.log("=====================================================================");
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


(async () => {
    const dataArray = readLinesToArray();
    for (let i = 0; i < dataArray.length; i++) {
        await MainBrowser(dataArray[i], i);
        await sleep(1000)
        await waitForInput()
    }

    process.exit(1)
})();

