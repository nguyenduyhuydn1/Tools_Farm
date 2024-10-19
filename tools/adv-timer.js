const fs = require("fs-extra");
const path = require("path");

const { runPuppeteer } = require('./utils/puppeteer.js')
const { sleep, formatTime, userAgent, waitForInput, printFormattedTitle, log } = require('./utils/utils.js')
const { checkIframeAndClick } = require('./utils/selector.js')
const { fetchData } = require('./utils/axios.js')
const proxyFile = require("./data/proxy.js");


const headers = {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "cache-control": "max-age=0",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "Referer": "https://timefarm.app/",
    "Referrer-Policy": "strict-origin-when-cross-origin"
};


let arr = [7712064825, 7417294726, 6025437423, 8148954049, 7057910081, 7562053994, 8026505897, 7324083771, 6509993479, 7743327554];

const MainBrowser = async (countFolder, dataProxy = null) => {
    await sleep(countFolder * 6000);
    setInterval(async () => {
        printFormattedTitle(`tài khoản ${countFolder} - Profile ${countFolder + 100}`, "red")
        let data = await fetchData(`https://api.adsgram.ai/adv?blockId=2994&tg_id=${arr[countFolder]}&tg_platform=web&platform=Win32&language=en`, 'get', { headers, proxyUrl: dataProxy });
        if (data) {
            let tracking1 = await fetchData(data.banner.trackings[0].value, 'get', { headers, proxyUrl: dataProxy });
            log(`xong nv 1 [${JSON.stringify(tracking1)}]`)
            let tracking2 = await fetchData(data.banner.trackings[1].value, 'get', { headers, proxyUrl: dataProxy });
            log(`xong nv 2 [${JSON.stringify(tracking2)}]`)
            await sleep(5000)
            await sleep(5000)
            await sleep(5000)
            await sleep(5000)
            await sleep(5000)
            await sleep(5000)
            let tracking3 = await fetchData(data.banner.trackings[3].value, 'get', { headers, proxyUrl: dataProxy });
            log(`xong nv 3 [${JSON.stringify(tracking3)}]`)
        }
    }, 6 * 60 * 1000);
};


(async () => {
    let proxyUrl = null;
    for (let i = 0; i < arr.length; i++) {
        if (i > 9) {
            let proxyIndex = Math.floor((i - 10) / 10);
            proxyUrl = proxyFile[proxyIndex];
            await MainBrowser(i, proxyUrl);
        } else {
            await MainBrowser(i);
        }
    }
})();
