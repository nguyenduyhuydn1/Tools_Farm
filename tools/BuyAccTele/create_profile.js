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


const { HttpsProxyAgent } = require('https-proxy-agent');
const axios = require('axios');
const { sleep, waitForInput, userAgent } = require('./../utils/utils.js');
const { checkIframeAndClick, clickIfExists } = require('./../utils/selector.js');

const proxyFile = require("../data/proxy.js");
const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));


let xPosition = 0;
let yPosition = 0;
const MainBrowser = async (dataProxy, countFolder) => {
    try {
        puppeteer.use(
            ProxyPlugin({
                address: dataProxy.ip,
                port: dataProxy.port,
                credentials: {
                    username: dataProxy.username,
                    password: dataProxy.password,
                }
            })
        );

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

        const [page] = await browser.pages();
        await page.setUserAgent(userAgent);

        await sleep(3000);
        await page.goto("https://web.telegram.org/k/");
        await sleep(3000);
    } catch (error) {
        console.error("Error:", error.message);
    }
};





(async () => {
    for (let i = 0; i < 30; i++) {
        if (i == 1) continue
        let proxyIndex = Math.floor(i / 10);
        await MainBrowser(proxyFile[proxyIndex], i);
        await sleep(1000)
        await waitForInput();
    }
})();