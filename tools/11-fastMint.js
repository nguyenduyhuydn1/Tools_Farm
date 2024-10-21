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
    "origin": "https://chaingn.org",
    "priority": "u=1, i",
    "Referer": "https://chaingn.org",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
}


const fetchInfoAndStart = async (token, proxy) => {
    const options = {
        "access-control-request-headers": "authorization",
        "access-control-request-method": "GET"
    }

    await fetchData('https://api.chaingn.org/wallets', "OPTIONS", {
        headers: { ...headers, ...options },
        proxy,
    })
    let data = await fetchData('https://api.chaingn.org/wallets', "GET", {
        authKey: 'authorization',
        authValue: `Bearer ${token}`,
        headers,
        proxy,
    })

    if (data) {
        console.log(JSON.stringify(data));
        return data;
    }
    return false;
}


const fetchClaim = async (token, id, proxy) => {
    const options = {
        "access-control-request-headers": "authorization,content-type",
        "access-control-request-method": "POST"
    }

    await fetchData('https://api.chaingn.org/wallet/claim', "OPTIONS", {
        headers: { ...headers, ...options },
        proxy,
    })
    let data = await fetchData('https://api.chaingn.org/wallet/claim', "POST", {
        authKey: 'authorization',
        authValue: `Bearer ${token}`,
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: { id: id },
        proxy,
    })

    if (data) log(`[claim success]`, 'yellow')
}

const fetchStartFarm = async (token, id, proxy) => {
    const options = {
        "access-control-request-headers": "authorization,content-type",
        "access-control-request-method": "POST"
    }

    await fetchData('https://api.chaingn.org/wallet/farm', "OPTIONS", {
        headers: { ...headers, ...options },
        proxy,
    })
    let data = await fetchData('https://api.chaingn.org/wallet/farm', "POST", {
        authKey: 'authorization',
        authValue: `Bearer ${token}`,
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: { id: id },
        proxy,
    })

    if (data) log(`[start success]`, 'yellow')

}
// =====================================================================
// =====================================================================
// =====================================================================

const MainBrowser = async (proxy, countFolder, existToken = null) => {
    try {
        const browser = await runPuppeteer({
            userDataDir: `C:\\Users\\Huy\\AppData\\Local\\Google\\Chrome\\User Data\\Profile ${countFolder + 100}`,
            args: ['--window-size=700,800',
                // '--disable-web-security',
                // '--disable-features=IsolateOrigins,site-per-process',
            ],
            proxy,
        });
        const [page] = await browser.pages();
        if (proxy) {
            const page2 = await browser.newPage();
            // let randomUrl = ['https://ipinfo.io/', "https://www.myip.com/"]
            // await page2.goto(randomUrl[Math.floor(Math.random() * randomUrl.length)]);
            await page2.goto("https://example.com/");
            await sleep(3000);
            await page.bringToFront();
        }

        await setMobile(page);
        await page.goto("https://web.telegram.org/k/#@fastmintapp_bot");
        let [src, iframe] = await checkIframeAndClick(page);
        await page.goto(src);
        let cookies = await page.cookies();

        let isVisitToday = cookies.find(obj => obj.name == "isVisitToday");
        let sessionToken = cookies.find(obj => obj.name == "sessionToken");
        let isToken = sessionToken.value;
        let checkVisit = isVisitToday.value;

        if (!(checkVisit == true || checkVisit == 'true')) {
            let clicked = false;
            while (!clicked) {
                printFormattedTitle(`Waiting click Check visit...`, 'red')
                await clickIfExists(page, 'body > div > div > button');
                await sleep(5000);
                iframeExists = await page.$('iframe') !== null;
                setTimeout(() => {
                    clicked = true;
                }, 10000);
            }
        }
        browser.close();

        let data = await fetchInfoAndStart(isToken, proxy);
        if (data) {
            if (data.length > 2) {
                log(`[data id lớn hơn 1 coi lại , ${data.length}]`, 'red')
                await waitForInput()
            }
            let { id, startFarmDate } = data[0];
            if (startFarmDate == null || startFarmDate == 'null') {
                await fetchStartFarm(isToken, id, proxy);
            } else {
                let [now, endTimeTimestamp] = takeTimeEnd(startFarmDate, 6 * 60 * 60 * 1000);
                if (now > endTimeTimestamp) {
                    await fetchClaim(isToken, id, proxy);
                    await fetchStartFarm(isToken, id, proxy);
                }
            }
        }
    } catch (error) {
        console.error("Error:", error.message);
        // await waitForInput()
    }
};


(async () => {
    let ok = true;
    for (let offset = 0; offset < distance; offset++) {
        for (let i = offset; i < totalElements; i += distance) {
            if (i == 4) continue

            if (i == 35) {
                ok = true;
            }
            if (ok) {
                let proxy = (i > 9) ? proxies[i] : null;
                proxy = proxies[i] == 'null' ? null : proxies[i];
                printFormattedTitle(`account ${i} - Profile ${i + 100} - proxy ${proxy}`, "red");

                await MainBrowser(proxy, i);
                // await waitForInput();
            }
        }
    }
    writeTimeToFile('thời gian nhận thưởng tiếp theo', '11-fastmint.txt', 8).then(() => process.exit(1));
    process.exit(1)
})();

