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

const randomNumber = () => {
    const ranges = [
        { start: 494495, end: 494501 },
        { start: 495495, end: 495501 },
        { start: 496495, end: 496501 },
        { start: 497495, end: 497501 },
        { start: 498495, end: 498501 },
        { start: 499495, end: 499501 }
    ];

    function getRandomInRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    let selectedNumbers = [];

    while (selectedNumbers.length < 10) {
        const randomRange = ranges[Math.floor(Math.random() * ranges.length)];
        const randomNumber = getRandomInRange(randomRange.start, randomRange.end);
        if (!selectedNumbers.includes(randomNumber)) {
            selectedNumbers.push(randomNumber);
        }
    }
    return selectedNumbers;
}



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
    return status;
}

const getClaim = async (user) => {
    let claim = await fetchData("https://notpx.app/api/v1/mining/claim", user, "GET");
    console.log(`claimed: ${claim?.claimed}`);
    return claim;
}

const postStart = async (user, pixelId) => {
    let start = await fetchData("https://notpx.app/api/v1/repaint/start", user, "POST", { pixelId, newColor: "#000000" });
    console.log(`balance:${start?.balance}`);
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



        // const userAgent = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36' };
        // const addFunc = async (page) => {
        //     await page.setExtraHTTPHeaders(userAgent);

        //     const pathPreloadFile = path.join(__dirname, 'public', 'preload.js');
        //     const preloadFile = fs.readFileSync(pathPreloadFile, 'utf8');
        //     await page.evaluateOnNewDocument(preloadFile);
        // };

        const [page] = await browser.pages();
        await page.goto("https://web.telegram.org/k/#@notpixel");
        await sleep(2000);

        await page.waitForSelector("#column-center .bubbles-group-last .reply-markup a").then(e => e.click());
        await sleep(2000);
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


        let arrNumber = randomNumber();
        await getInfo(iframe, countFolder);
        await sleep(1000)
        let { charges } = await getStatus(iframe)
        await getClaim(iframe);
        await sleep(1000)
        for (let i = 0; i < charges; i++) {
            await postStart(iframe, arrNumber[i])
            await sleep(1000)
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