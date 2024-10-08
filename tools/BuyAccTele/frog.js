const fs = require("fs-extra");
const path = require("path");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

const stealth = StealthPlugin();
stealth.enabledEvasions.delete('iframe.contentWindow');
stealth.enabledEvasions.delete('navigator.plugins');
stealth.enabledEvasions.delete('media.codecs');
puppeteer.use(stealth);
const ProxyPlugin = require('puppeteer-extra-plugin-proxy');
puppeteer.use(
    ProxyPlugin({
        address: '103.171.217.218',
        port: '25218',
        credentials: {
            username: 'userntn171217218',
            password: 'pK9ZYybthu'
        }
    })
);
const proxyFile = require("./../data/proxy.js");
const randomUseragent = require('random-useragent');

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

let xPosition = 0;
let yPosition = 0;
const MainBrowser = async (dataProxy, countFolder) => {
    try {
        // let proxyServer = `--proxy-server=${dataProxy.ip}`;
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
                '--window-size=600,600',
                `--window-position=${xPosition},${yPosition}`,
                // proxyServer
            ],
            ignoreDefaultArgs: ["--enable-automation"],
        });
        xPosition += 300;
        if (xPosition + 300 > 1920) {
            xPosition = 0;
            yPosition += 200;
        }

        // const userAgent = randomUseragent.getRandom(ua => ua.osName === 'Android');
        const addFunc = async (page) => {
            const pathPreloadFile = path.join(__dirname, 'public', 'preload.js');
            const preloadFile = fs.readFileSync(pathPreloadFile, 'utf8');
            await page.evaluateOnNewDocument(preloadFile);
        };
        const [page] = await browser.pages();

        // if (dataProxy.username && dataProxy.password) {
        //     await page.authenticate({
        //         username: dataProxy.username,
        //         password: dataProxy.password
        //     });
        // }
        await addFunc(page);
        // await page.setUserAgent(userAgent);

        await page.goto("https://web.telegram.org/k");
        await sleep(3000);
        await page.waitForSelector("#column-center .bubbles-group-last .reply-markup a").then(e => e.click());
        await sleep(1000);
        await page.waitForSelector(".popup-confirmation.active .popup-buttons button:nth-child(1)").then(e => e.click());
        await page.waitForSelector('iframe');
        let iframe = await page.evaluate(() => document.querySelector("iframe")?.getAttribute('src'));
        if (iframe) await page.goto(iframe);
        await sleep(3000);
    } catch (error) {
        console.error("Error:", error.message);
    }
};

// (async () => {
//     const dataArray = readLinesToArray();
//     for (let i = 0; i < dataArray.length; i += 2) {
//         const promises = [];

//         promises.push(MainBrowser(dataArray[i], i));

//         if (i + 1 < dataArray.length) {
//             promises.push(MainBrowser(dataArray[i + 1], i + 1));
//         }

//         await Promise.all(promises);
//         await sleep(1000);
//     }
// })();





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


(async () => {
    // await sleep(10000)
    for (let i = 1; i < 30; i++) {
        if (i == 1) continue
        let proxyIndex = Math.floor(i / 10);
        await MainBrowser(proxyFile[proxyIndex], i);
        await sleep(1000)
        await waitForInput();
    }
})();