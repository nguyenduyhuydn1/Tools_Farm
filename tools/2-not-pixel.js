const fs = require("fs-extra");
const path = require("path");

const { runPuppeteer } = require('./utils/puppeteer.js')
const { sleep, formatTime, userAgent, randomNumber, waitForInput, printFormattedTitle, log } = require('./utils/utils.js')
const { checkIframeAndClick } = require('./utils/selector.js')
const { fetchData } = require('./utils/axios.js')
const proxyFile = require("./data/proxy.js");


const headers = {
    "accept": "application/json, text/plain, */*",
    "accept-language": "en-US,en;q=0.9,vi;q=0.8",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Google Chrome\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "Referer": `https://app.notpx.app/`,
    "Referrer-Policy": "strict-origin-when-cross-origin"
}
// =====================================================================
// =====================================================================
// =====================================================================
const getInfo = async (user) => {
    let info = await fetchData("https://notpx.app/api/v1/users/me", "GET", { authKey: 'authorization', authValue: `initData ${user}`, headers, proxyUrl });
    printFormattedTitle(`${info?.lastName} ${info?.firstName}`)
    log(`balance: [${info?.balance}], id: [${info?.id}]`, 'yellow');
    return info
}

const getStatus = async (user) => {
    let status = await fetchData("https://notpx.app/api/v1/mining/status", "GET", { authKey: 'authorization', authValue: `initData ${user}`, headers, proxyUrl });
    console.log(`status: ${JSON.stringify(status)}`);
    return status;
}

const getClaim = async (user) => {
    let claim = await fetchData("https://notpx.app/api/v1/mining/claim", "GET", { authKey: 'authorization', authValue: `initData ${user}`, headers, proxyUrl });
    console.log(`claimed: [${JSON.stringify(claim)}]`);
    return claim;
}

const postStart = async (user, pixelId) => {
    let start = await fetchData("https://notpx.app/api/v1/repaint/start", "POST", { authKey: 'authorization', authValue: `initData ${user}`, headers, body: { pixelId, newColor: "#2450A4" }, proxyUrl });
    log(`balance: [${JSON.stringify(start)}]`, 'yellow');
    return start;
}
// =====================================================================
// =====================================================================
// =====================================================================

const MainBrowser = async (countFolder) => {
    try {
        // `--window-position=${countFolder * 400},0`
        const browser = await runPuppeteer(`C:\\Users\\Huy\\AppData\\Local\\Google\\Chrome\\User Data\\Profile ${countFolder + 100}`, ['--disable-gpu'], proxyUrl);
        const [page] = await browser.pages();
        if (proxyUrl != null) {
            const page2 = await browser.newPage();
            await page2.goto("https://google.com");
            await sleep(3000);
            await page.bringToFront();
        }

        await page.goto("https://web.telegram.org/k/#@notpixel");
        await page.waitForNavigation({ waitUntil: 'networkidle0' });

        await checkIframeAndClick(page);
        const iframe = await page.evaluate(() => {
            const iframeElement = document.querySelector('iframe');
            if (iframeElement) {
                return iframeElement.src.match(/(?<=#tgWebAppData=).*?(?=&tgWebAppVersion=7\.10)/g)[0];
            }
        },);
        browser.close();

        let arrNumber = randomNumber();
        // await getInfo(iframe);
        let { charges } = await getStatus(iframe)
        log(`[${charges} charges]`)

        await getClaim(iframe);
        for (let i = 0; i < charges; i++) {
            await postStart(iframe, arrNumber[Math.floor(Math.random() * arrNumber.length - 1)])
        }
        // await waitForInput()
    } catch (error) {
        console.error("Error:", error.message);
    }
};

let proxyUrl = null;

(async () => {
    for (let i = 11; i < 39; i++) {
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


// (async () => {
//     for (let i = 0; i < 39; i += 2) {
//         const promises = [];

//         printFormattedTitle(`tài khoản ${i} - Profile ${i + 100}`, "red");
//         if (i > 9) {
//             let proxyIndex = Math.floor((i - 10) / 10);
//             proxyUrl = proxyFile[proxyIndex];
//             promises.push(MainBrowser(i));
//         } else {
//             promises.push(MainBrowser(i));
//         }

//         if (i + 1 < 39) {
//             printFormattedTitle(`tài khoản ${i + 1} - Profile ${i + 101}`, "red");
//             if (i + 1 > 9) {
//                 let proxyIndex = Math.floor((i + 1 - 10) / 10);
//                 proxyUrl = proxyFile[proxyIndex];
//                 promises.push(MainBrowser(i + 1));
//             } else {
//                 promises.push(MainBrowser(i + 1));
//             }
//         }

//         await Promise.all(promises);
//         await sleep(1000);
//     }
//     process.exit(1);
// })();
