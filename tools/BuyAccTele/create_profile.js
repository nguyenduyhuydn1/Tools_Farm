const fs = require("fs-extra");
const path = require("path");
const { KnownDevices } = require('puppeteer');

const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const ProxyPlugin = require('puppeteer-extra-plugin-proxy');

const stealth = StealthPlugin();
stealth.enabledEvasions.delete('iframe.contentWindow');
stealth.enabledEvasions.delete('navigator.plugins');
stealth.enabledEvasions.delete('media.codecs');
puppeteer.use(stealth);

const { sleep, waitForInput, userAgent, printFormattedTitle } = require('./../utils/utils.js');
const { checkIframeAndClick, clickIfExists } = require('./../utils/selector.js');
const proxyFile = require("../data/proxy.js");

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
                '--window-size=1400,1000',
                `--window-position=0,0`,
                // '--start-maximized'
            ],
            devtools: true,
            ignoreDefaultArgs: ["--enable-automation"],
        });


        const [page] = await browser.pages();
        // const iPhone = KnownDevices['iPhone 15 Pro'];
        // await page.emulate(iPhone);

        const page2 = await browser.newPage();
        await page2.goto("https://google.com");
        await sleep(3000);
        await page.bringToFront();


        await page.goto('https://httpbin.org/headers', { waitUntil: 'networkidle2' });


        // await page.goto("https://web.telegram.org/k/");

        // await checkIframeAndClick(page)
        // const iframeSrc = await page.evaluate(() => {
        //     const iframeElement = document.querySelector('iframe');
        //     if (iframeElement) {
        //         return iframeElement.src.match(/(?<=#tgWebAppData=).*?(?=&tgWebAppVersion=7\.10)/g)[0];
        //     }
        // },);

        // fs.appendFileSync(path.join(__dirname, 'data', 'Blum.txt'), `${iframeSrc}\n`, 'utf-8');
        // // await sleep(3000);
        // // await sleep(3000);
        // // await sleep(3000);
        // // await sleep(3000);
        // browser.close()
    } catch (error) {
        console.error("Error:", error.message);
    }
};





(async () => {
    for (let i = 0; i < 30; i++) {
        printFormattedTitle(i, 'red')
        if (i == 1) continue
        let proxyIndex = Math.floor(i / 10);
        await MainBrowser(proxyFile[proxyIndex], i);
        await waitForInput();

    }
})();