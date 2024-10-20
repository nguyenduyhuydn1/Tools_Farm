const fs = require("fs-extra");
const path = require("path");

const { runPuppeteer, setMobile, proxies, totalElements, distance } = require('./utils/puppeteer.js');
const { sleep, formatTime, takeTimeEnd, userAgent, waitForInput, printFormattedTitle, log, writeTimeToFile } = require('./utils/utils.js');
const { checkIframeAndClick, clickIfExists } = require('./utils/selector.js');
const { fetchData } = require('./utils/axios.js');


// =====================================================================
// =====================================================================

let headers = {
    "accept": "application/json, text/plain, */*",
    "accept-encoding": "gzip, deflate, br, zstd",
    "accept-language": "en-US,en;q=0.9",
    "origin": "https://wukong-miniapp-sigma.vercel.app",
    "priority": "u=1, i",
    "Referer": "https://wukong-miniapp-sigma.vercel.app/",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
}


const fetchMine = async (token, proxy) => {
    let data = await fetchData('https://api.wuko.app/wuko-miniapp/v2/user/mine', "POST", { authKey: 'authorization', authValue: token, headers, proxy })

    if (data) {
        let [now, endTimeTimestamp] = takeTimeEnd(data.data.mineStartTimestamp * 1000, 8 * 60 * 60 * 1000);
        log(`[Start Mine Success]`, 'yellow')
        log(`end farm lúc: [${formatTime(endTimeTimestamp)}]`, 'yellow');
    }
}

// =====================================================================
// =====================================================================
// =====================================================================

const MainBrowser = async (proxy, countFolder, existToken = null) => {
    try {
        const reuse = async (reuseToken, reuseProxy) => {
            await fetchMine(reuseToken, reuseProxy);
        }

        if (existToken != null && existToken != 'null' && existToken.length > 7) {
            await reuse(existToken, proxy);
            return;
        }

        const browser = await runPuppeteer({
            userDataDir: `C:\\Users\\Huy\\AppData\\Local\\Google\\Chrome\\User Data\\Profile ${countFolder + 100}`,
            args: ['--window-size=400,800'],
            proxy,
        });
        const [page] = await browser.pages();
        if (proxy) {
            const page2 = await browser.newPage();
            // let randomUrl = ['https://ipinfo.io/', "https://www.myip.com/"]
            // await page2.goto(randomUrl[Math.floor(Math.random() * randomUrl.length)]);
            await page2.goto("https://www.myip.com/");
            await sleep(3000);
            await page.bringToFront();
        }

        const getAuthorization = new Promise((resolve) => {
            page.on('response', async (response) => {
                const url = response.url();
                const status = response.status();
                if (url == "https://api.wuko.app/wuko-miniapp/v2/user/signIn") {
                    if (status === 200 || status === 201) {
                        const responseBody = await response.text();
                        let token = JSON.parse(responseBody).data
                        resolve(token)
                    }
                }
            });
        });

        await setMobile(page);

        await page.goto("https://web.telegram.org/k/#@wukobot");
        let [src, iframe] = await checkIframeAndClick(page);
        await page.goto(src);
        await sleep(3000);

        await clickIfExists(page, "#root > div > div > button");

        let authorization = await getAuthorization

        fs.appendFileSync(pathFile, `${JSON.stringify({ token: authorization.jwtToken, countFolder })}\n`, 'utf-8');

        let [now, endTimeTimestamp] = takeTimeEnd(authorization.user.mineStartTimestamp * 1000, 8 * 60 * 60 * 1000);

        if (now > endTimeTimestamp) {
            await reuse(authorization.jwtToken, proxy);
        } else {
            log(`end farm lúc: [${formatTime(endTimeTimestamp)}], quay lai sau`, 'yellow');
        }
    } catch (error) {
        console.error("Error:", error.message);
        // await waitForInput()
    }
};


let pathFile = path.join(__dirname, 'data', 'token', 'wukong.txt');
(async (check = false) => {
    let data = fs.readFileSync(pathFile, 'utf8');
    const lines = data.split('\n').map(line => line.trim()).filter(line => line.length > 0);;

    // let ok = false;
    for (let offset = 0; offset < distance; offset++) {
        for (let i = offset; i < totalElements; i += distance) {
            if (i == 4) continue
            // if (i == 30) {
            //     ok = true;
            // }
            // if (ok) {
            let proxy = (i > 9) ? proxies[i] : null;
            proxy = proxies[i] == 'null' ? null : proxies[i];
            printFormattedTitle(`account ${i} - Profile ${i + 100} - proxy ${proxy}`, "red");

            if (check) await MainBrowser(proxy, i, lines[i]);
            else await MainBrowser(proxy, i);
            await sleep(1000);
            // }
        }
    }
    writeTimeToFile('thời gian nhận thưởng tiếp theo', '10-wukong.txt', 8).then(() => process.exit(1));
    process.exit(1)
})();

