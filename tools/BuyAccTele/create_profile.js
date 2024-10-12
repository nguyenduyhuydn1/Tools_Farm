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

const proxyFile = require("./../data/proxy.js");
const randomUseragent = require('random-useragent');

const { HttpsProxyAgent } = require('https-proxy-agent');
const axios = require('axios');

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));


let xPosition = 0;
let yPosition = 0;
const MainBrowser = async (dataProxy, countFolder) => {
    try {
        // puppeteer.use(
        //     ProxyPlugin({
        //         address: dataProxy.ip,
        //         port: dataProxy.port,
        //         credentials: {
        //             username: dataProxy.username,
        //             password: dataProxy.password,
        //         }
        //     })
        // );

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
            ],
            ignoreDefaultArgs: ["--enable-automation"],
        });
        xPosition += 300;
        if (xPosition + 300 > 1920) {
            xPosition = 0;
            yPosition += 200;
        }

        const userAgent = randomUseragent.getRandom(ua => ua.osName === 'Android');
        const [page] = await browser.pages();
        await page.setUserAgent(userAgent);

        await sleep(3000);
        await page.goto("https://web.telegram.org/k/");
        await sleep(3000);
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


(async () => {

    // const proxyUrl = 'http://qưeqw:zxc@103.1.217.218:25218';
    // const agent = new HttpsProxyAgent(proxyUrl);
    // axios.get('https://api.ipify.org?format=json', {
    //     httpsAgent: agent,
    //     httpAgent: agent,
    //     proxy: false
    // })
    //     .then(response => {
    //         console.log('Your IP address is:', response.data.ip);
    //     })
    //     .catch(error => {
    //         console.error('Error fetching IP address:', error);
    //     });



    // // await sleep(10000)
    for (let i = 0; i < 30; i++) {
        if (i == 1) continue
        let proxyIndex = Math.floor(i / 10);
        await MainBrowser(proxyFile[proxyIndex], i);
        await sleep(1000)
        await waitForInput();
    }
})();