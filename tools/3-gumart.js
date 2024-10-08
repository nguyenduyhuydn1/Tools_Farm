const fs = require("fs-extra");
const path = require("path");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

const stealth = StealthPlugin();
stealth.enabledEvasions.delete('iframe.contentWindow');
stealth.enabledEvasions.delete('navigator.plugins');
stealth.enabledEvasions.delete('media.codecs');
puppeteer.use(stealth);

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const readLinesToArray = () => {
    const lines = fs.readFileSync(`${__dirname}/data/localStorage.txt`, 'utf-8').trim().split('\n');
    const array = [];
    lines.forEach(line => {
        const obj = {};
        const keyValuePairs = line.split('\t');
        keyValuePairs.forEach(pair => {
            if (pair) {
                const [key, value] = pair.split(': ');
                obj[key] = value;
            }
        });
        array.push(obj);
    });
    return array;
};

async function clickIfExists(page, selector, timeout = 500, callback = () => { }) {
    const elementExists = await page.$(selector);
    if (elementExists) {
        await page.waitForSelector(selector, { hidden: true, visible: true, timeout: timeout }).then(e => e.click());
        await sleep(2000);
    } else {
        callback()
    }
}


async function navigateToIframe(page, regex = false) {
    await page.waitForSelector('iframe');
    const iframeSrc = await page.evaluate((regex) => {
        const iframeElement = document.querySelector('iframe');
        if (iframeElement) {
            if (regex) return iframeElement.src.match(/(?<=#tgWebAppData=).*?(?=&tgWebAppVersion=7\.10)/g)[0];
            return iframeElement.src;
        }
    }, regex);
    if (iframeSrc) {
        await page.goto(iframeSrc)
    } else {
    }
}

async function waitForTextContent(page, selector, text, timeout = 10000) {
    await page.waitForFunction(
        (selector, text) => {
            const element = document.querySelector(selector);
            return element.textContent == text;
        },
        { timeout },
        selector,
        text
    );
}













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
    let { status_code, errors } = await fetchData("https://api.gumart.click/api/boost", token, "POST", {});
    if (status_code == 200) {
        if (errors) console.log(errors);
        console.log(`Đã boost`);
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

        await page.goto("https://web.telegram.org/k/#@gumart_bot");
        await sleep(2000);

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
        await sleep(5000)
        if (iframeSrc) {
            console.log("=====================================================================");
            console.log(`                           tài khoản ${countFolder}`);
            console.log("=====================================================================");

            let token = await takeToken(iframeSrc);
            await fetchInfo(token);
            await fetchClaim(token);
            await fetchBoost(token);
        }
        browser.close();


        // ngày sau có thể dùng
        // await clickIfExists(page, "#__nuxt > div > div > section > div > button")

        // let selectorCheckAccount = "#__nuxt > div > div > section > div > div:nth-child(2) > button"
        // await waitForTextContent(page, selectorCheckAccount, 'Let’s go!', 20000)
        // await clickIfExists(page, selectorCheckAccount)
        // await sleep(2000);
        // await sleep(2000);
        // await sleep(2000);
        // await sleep(2000);
        // await sleep(2000);
        // await sleep(2000);
        // await sleep(2000);
        // await sleep(2000);
        // await sleep(2000);
        // await sleep(2000);
        // await clickIfExists(page, "#__nuxt div.swiper-slide.swiper-slide-active > div > div:nth-child(3) > button");
        // // await clickIfExists(page, "#__nuxt > div > div > section > div.relative > button");
        // // await clickIfExists(page, "#__nuxt > div > div > section > div.relative div.transition-all > button");


        // await sleep(2000);
        // await sleep(2000);
        // await sleep(2000);
    } catch (error) {
        await sleep(2000);
        await sleep(2000);
        await sleep(2000);
        await sleep(2000);
        await sleep(2000);
        await sleep(2000);
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