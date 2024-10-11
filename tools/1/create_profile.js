const fs = require("fs-extra");
const path = require("path");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

const stealth = StealthPlugin();
stealth.enabledEvasions.delete('iframe.contentWindow');
stealth.enabledEvasions.delete('navigator.plugins');
stealth.enabledEvasions.delete('media.codecs');
puppeteer.use(stealth);

const { sleep, readLinesToArray, waitForInput, clickIfExists } = require('./../utils/utils.js')


// let localStorageContent = {};
// for (let i = 0; i < localStorage.length; i++) {
//     const key = localStorage.key(i);
//     localStorageContent[key] = localStorage.getItem(key);
// }
// console.log(localStorageContent);

const MainBrowser = async (localStorageData, count) => {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            userDataDir: `C:\\Users\\Huy\\AppData\\Local\\Google\\Chrome\\User Data\\Profile ${count + 100}`,      //Kucoi
            // userDataDir: `C:\\Users\\Huy\\AppData\\Local\\Google\\Chrome\\User Data\\memefi ${count + 300}`,             //memefi
            // userDataDir: `C:\\Users\\Huy\\AppData\\Local\\Google\\Chrome\\User Data\\not_pixel ${count + 500}`,          //not-pixel
            // userDataDir: `C:\\Users\\Huy\\AppData\\Local\\Google\\Chrome\\User Data\\not_pixel ${count + 800}`,          //gumart
            // userDataDir: `C:\\Users\\Huy\\AppData\\Local\\Google\\Chrome\\User Data\\BuyAccTele ${count + 1000}`,          //BuyAccTele
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
                // --disable-blink-features=AutomationControlled
                // Ẩn dấu vết cho thấy Chrome đang được điều khiển bởi một công cụ tự động hóa, điều này giúp tránh các trang web phát hiện và chặn bot tự động.
                // được sử dụng để vô hiệu hóa một tính năng đặc biệt của Chromium gọi là "AutomationControlled"
            ],
            ignoreDefaultArgs: ["--enable-automation"],
        });

        const [page] = await browser.pages();
        // await page.goto("https://web.telegram.org/k/");

        // await page.evaluate((data) => {
        // for (const [key, value] of Object.entries(data)) {
        //     localStorage.setItem(key, value);
        // }
        // }, localStorageData);
        // await page.reload();
        // await sleep(2000);
        // await browser.close();
        // await page.goto("https://web.telegram.org/k/#@major");
        // await page.waitForNavigation({ waitUntil: 'networkidle0' });
        // await sleep(3000);
        // await clickIfExists(page, "#column-center .bubbles-group-last .reply-markup > :nth-of-type(1) > :nth-of-type(1)")
        // await clickIfExists(page, ".popup-confirmation.active .popup-buttons button:nth-child(1)")
        // await clickIfExists(page, "#column-center .new-message-bot-commands.is-view")

        // await page.waitForSelector('iframe');
        // let iframe = await page.evaluate(() => {
        //     let match;
        //     let iframeElement = document.querySelector("iframe");
        //     if (iframeElement) {
        //         const src = iframeElement.src;
        //         match = src.match(/(?<=#tgWebAppData=).*?(?=&tgWebAppVersion=7\.10)/g)[0];
        //     }
        //     return match;
        // });
        // fs.appendFileSync('users.txt', `${iframe}\n`, 'utf-8');
        // browser.close()
    } catch (error) {
        console.error("Error:", error.message);
    }
};


(async () => {
    const dataArray = readLinesToArray();
    for (let i = 9; i < 300; i++) {
        await MainBrowser(dataArray[i], i);
        await sleep(1000)
        await waitForInput();
    }
})();