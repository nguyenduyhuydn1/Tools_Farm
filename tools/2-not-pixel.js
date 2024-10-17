const fs = require("fs-extra");
const path = require("path");

const { runPuppeteer } = require('./utils/puppeteer.js')
const { sleep, formatTime, userAgent, randomNumber, waitForInput, printFormattedTitle, log } = require('./utils/utils.js')
const { checkIframeAndClick } = require('./utils/selector.js')
const { fetchData } = require('./utils/axios.js')
// const proxies = require("./../data/proxy.js");

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
// const getInfo = async (user, proxy) => {
//     let info = await fetchData("https://notpx.app/api/v1/users/me", "GET", { authKey: 'authorization', authValue: `initData ${user}`, headers, proxy });
//     printFormattedTitle(`${info?.lastName} ${info?.firstName}`)
//     log(`balance: [${info?.balance}], id: [${info?.id}]`, 'yellow');
//     return info
// }

const getStatus = async (user, proxy) => {
    let status = await fetchData("https://notpx.app/api/v1/mining/status", "GET", { authKey: 'authorization', authValue: `initData ${user}`, headers, proxy });
    console.log(`status: ${JSON.stringify(status)}`);
    return status;
}

const getClaim = async (user, proxy) => {
    let claim = await fetchData("https://notpx.app/api/v1/mining/claim", "GET", { authKey: 'authorization', authValue: `initData ${user}`, headers, proxy });
    console.log(`claimed: [${JSON.stringify(claim)}]`);
    return claim;
}

const postStart = async (user, pixelId, proxy) => {
    let start = await fetchData("https://notpx.app/api/v1/repaint/start", "POST", { authKey: 'authorization', authValue: `initData ${user}`, headers, body: { pixelId, newColor: "#000000" }, proxy });
    log(`balance: [${JSON.stringify(start)}]`, 'yellow');
    return start;
}

// =====================================================================
// =====================================================================
// =====================================================================

const MainBrowser = async (proxy, countFolder, existToken = null) => {
    try {
        const reuse = async (reuseToken, reuseProxy) => {
            let arrNumber = randomNumber();
            let { charges } = await getStatus(reuseToken, reuseProxy);
            log(`[${charges} charges]`)

            await getClaim(reuseToken, reuseProxy);
            for (let i = 0; i < charges; i++) {
                await postStart(reuseToken, arrNumber[Math.floor(Math.random() * arrNumber.length - 1)], reuseProxy);
                await sleep(500)
            }
        }

        if (existToken != null && existToken.length > 2) {
            await reuse(existToken, proxy);
            return;
        }

        ///////////////////////////////////////////////////////////////////////////////////
        //                            run browser to take token                          //                                  
        ///////////////////////////////////////////////////////////////////////////////////

        const browser = await runPuppeteer({
            userDataDir: `C:\\Users\\Huy\\AppData\\Local\\Google\\Chrome\\User Data\\Profile ${countFolder + 100}`,
            proxy,
        });

        const [page] = await browser.pages();
        if (proxy != null) {
            const page2 = await browser.newPage();
            await page2.goto("https://google.com");
            await sleep(3000);
            await page.bringToFront();
        }

        await page.goto("https://web.telegram.org/k/#@notpixel");
        await page.waitForNavigation({ waitUntil: 'networkidle0' });

        const [src, isToken] = await checkIframeAndClick(page);
        // await page.goto(src);
        // await waitForInput()
        fs.appendFileSync(pathFile, `${isToken}\n`, 'utf-8');
        browser.close();

        await reuse(isToken, proxy);
    } catch (error) {
        console.error("Error:", error);
        await waitForInput()
    }
};

let pathFile = path.join(__dirname, 'data', 'token', 'not-pixel.txt');
(async (check = false) => {
    let data = fs.readFileSync(pathFile, 'utf8');
    const lines = data.split('\n');
    const totalElements = 10;
    let proxies = ['x', 'y', 'z'];

    for (let i = 0; i < totalElements; i++) {
        printFormattedTitle(`tài khoản ${i} - Profile ${i + 100}`, "red")
        let proxy = (i > 10) ? proxies[i % proxies.length] : null;

        if (check) await MainBrowser(proxy, i, lines[i]);
        else await MainBrowser(proxy, i);
        await sleep(2000);
    }
    process.exit(1)
})();
