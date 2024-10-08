const fs = require("fs-extra");
const path = require("path");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

const stealth = StealthPlugin();
stealth.enabledEvasions.delete('iframe.contentWindow');
stealth.enabledEvasions.delete('navigator.plugins');
stealth.enabledEvasions.delete('media.codecs');
puppeteer.use(stealth);

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const readLinesToArray = () => {
    const lines = fs.readFileSync('../data/localStorage.txt', 'utf-8').trim().split('\n');
    const array = [];
    lines.forEach(line => {
        const obj = {};
        const keyValuePairs = line.split('\t');
        keyValuePairs.forEach(pair => {
            if (pair) {
                const [key, value] = pair.split(': ');
                obj[key] = value;
            }
        });
        array.push(obj);
    });
    return array;
};





const MainBrowser = async (localStorageData, count) => {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            // userDataDir: `C:\\Users\\Huy\\AppData\\Local\\Google\\Chrome\\User Data\\Profile ${countFolder + 100}`,      //Kucoi
            // userDataDir: `C:\\Users\\Huy\\AppData\\Local\\Google\\Chrome\\User Data\\not_pixel ${count + 500}`,          //not-pixel
            // userDataDir: `C:\\Users\\Huy\\AppData\\Local\\Google\\Chrome\\User Data\\not_pixel ${count + 800}`,          //gumart
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
        await page.goto("https://web.telegram.org/");
        await page.evaluate((data) => {
            for (const [key, value] of Object.entries(data)) {
                localStorage.setItem(key, value);
            }
        }, localStorageData);
        await page.reload();
        await sleep(2000);
        await browser.close();

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
    } catch (error) {
        console.error("Error:", error.message);
    }
};




// const readline = require('readline');

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

// function waitForInput() {
//     return new Promise((resolve) => {
//         rl.on('line', (input) => {
//             if (input.toLowerCase() === 's') {
//                 resolve();
//             }
//         });
//     });
// }

(async () => {
    const dataArray = readLinesToArray();
    for (let i = 0; i < dataArray.length; i++) {
        await MainBrowser(dataArray[i], i);
        await sleep(1000)
    }
})();