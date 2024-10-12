const fs = require("fs-extra");
const path = require("path");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

const stealth = StealthPlugin();
stealth.enabledEvasions.delete('iframe.contentWindow');
stealth.enabledEvasions.delete('navigator.plugins');
stealth.enabledEvasions.delete('media.codecs');
puppeteer.use(stealth);
const randomUseragent = require('random-useragent');

// Generate a random Android user-agent string


const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const readLinesToArray = () => {
    const lines = fs.readFileSync(`${__dirname}/data/localStorage.txt`, 'utf-8').trim().split('\n');
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


let xPosition = 0;
let yPosition = 0;
const MainBrowser = async (localStorageData, countFolder) => {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            userDataDir: `C:\\Users\\Huy\\AppData\\Local\\Google\\Chrome\\User Data\\Profile ${countFolder + 100}`,
            args: [
                '--test-type',
                '--disable-gpu',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-sync',
                '--ignore-certificate-errors',
                '--mute-audio',
                '--window-size=600,300',
                `--window-position=${xPosition},${yPosition}`,
                // '--proxy-server=http://proxy-server:port'
            ],
            ignoreDefaultArgs: ["--enable-automation"],
        });
        xPosition += 300;
        if (xPosition + 300 > 1920) {
            xPosition = 0;
            yPosition += 200;
        }

        // const addFunc = async (page) => {
        //     const pathPreloadFile = path.join(__dirname, 'public', 'preload.js');
        //     const preloadFile = fs.readFileSync(pathPreloadFile, 'utf8');
        //     await page.evaluateOnNewDocument(preloadFile);
        // };

        const userAgent = randomUseragent.getRandom(ua => ua.osName === 'Android');
        const [page] = await browser.pages();
        await page.setUserAgent(userAgent);

        // await addFunc(page);

        // await page.goto("https://web.telegram.org/");
        // await page.evaluate((data) => {
        //     for (const [key, value] of Object.entries(data)) {
        //         localStorage.setItem(key, value);
        //     }
        // }, localStorageData);
        // await page.reload();


        // const modifiedJs = fs.readFileSync('./public/telegram-web-app.js', 'utf8');
        // await page.setRequestInterception(true);

        // page.on('request', request => {
        //     if (request.url().endsWith('telegram-web-app.js')) {
        //         request.respond({
        //             status: 200,
        //             contentType: 'application/javascript',
        //             body: modifiedJs
        //         });
        //     } else {
        //         request.continue();
        //     }
        // });

        await page.goto("https://web.telegram.org/k/#@xkucoinbot");
        await sleep(2000);
        await page.waitForSelector("#column-center .bubbles-group-last .reply-markup a").then(e => e.click());
        await sleep(2000);
        await page.waitForSelector(".popup-confirmation.active .popup-buttons button:nth-child(1)").then(e => e.click());
        await page.waitForSelector('iframe');
        let iframe = await page.evaluate(() => document.querySelector("iframe")?.getAttribute('src'));
        if (iframe) await page.goto(iframe);

        await sleep(3000);
        await page.evaluate(() => {
            window.check = true;
            window.silent = true;

            let silent = document.querySelector(".iconSound--LlCOj");
            if (silent && window.silent) {
                setTimeout(() => {
                    silent.click();
                    window.silent = false;
                }, 3000);
            }

            setInterval(() => {
                let processElement = document.querySelector("#root .process--W73kB")
                const count = parseInt(processElement.textContent, 10);
                if (window.check) {
                    document.querySelector(".frog--GPU1j").click();
                    if (count < 10) window.check = false;
                } else {
                    if (count > 2800) window.check = true;
                }
            }, 400);
        });
    } catch (error) {
        console.error("Error:", error.message);
    }
};

(async () => {
    const dataArray = readLinesToArray();
    for (let i = 0; i < dataArray.length; i++) {
        await MainBrowser(dataArray[i], i);
        await sleep(1000)
    }
})();

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
