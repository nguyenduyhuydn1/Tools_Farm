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
    const lines = fs.readFileSync('localStorage.txt', 'utf-8').trim().split('\n');
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

const MainBrowser = async (localStorageData) => {
    try {
        const userAgent = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36' };

        const browser = await puppeteer.launch({
            headless: false,
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            args: [
                '--test-type',
                '--disable-gpu',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-sync',
                '--ignore-certificate-errors',
                '--window-size=700,700'
                // '--window-position=100,100'
            ],
            ignoreDefaultArgs: ["--enable-automation"],
        });

        // const addFunc = async (page) => {
        //     await page.setExtraHTTPHeaders(userAgent);

        //     const pathPreloadFile = path.join(__dirname, 'public', 'preload.js');
        //     const preloadFile = fs.readFileSync(pathPreloadFile, 'utf8');
        //     await page.evaluateOnNewDocument(preloadFile);
        // };

        const [page] = await browser.pages();
        // await addFunc(page);

        await page.goto("https://web.telegram.org/");
        await page.evaluate((data) => {
            for (const [key, value] of Object.entries(data)) {
                localStorage.setItem(key, value);
            }
        }, localStorageData);
        await page.reload();
        await page.goto("https://web.telegram.org/k/#@notpixel");
        await sleep(2000);
        await sleep(2000);
        await sleep(2000);
        await sleep(2000);
        await sleep(2000);
        await sleep(2000);
        await sleep(2000);
        await sleep(2000);

        await page.click("#column-center .rows-wrapper-row.has-offset > div.new-message-bot-commands.is-view");
        await sleep(2000);
        await page.click("body > div.popup.popup-peer.popup-confirmation.active > div > div.popup-buttons > button:nth-child(1)")
        await sleep(5000);
        await page.waitForSelector('iframe');
        let iframe = await page.evaluate(() => {
            let match;
            let iframeElement = document.querySelector("iframe");
            if (iframeElement) {
                const src = iframeElement.src;
                match = src.match(/(?<=#tgWebAppData=).*?(?=&tgWebAppVersion=7\.10)/g)[0];
            }
            return match;
        });

        console.log(iframe);
        await sleep(1000)
        fs.appendFileSync('query.txt', `${iframe}\n`, 'utf-8');
    } catch (error) {
        console.error("Error:", error.message);
    }
};




const readline = require('readline');

// Tạo giao diện đọc từ stdin
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
    const dataArray = readLinesToArray();
    for (let i = 0; i < dataArray.length; i++) {
        await MainBrowser(dataArray[i]);
        // await waitForInput()
    }
})();
