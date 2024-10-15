const fs = require("fs-extra");
const path = require("path");
// const { isProcessRunning, pathCookiesFile, taskKill, uploadFile } = require('./utils.js')
const { KnownDevices } = require('puppeteer');

const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const stealth = StealthPlugin();
stealth.enabledEvasions.delete('iframe.contentWindow');
stealth.enabledEvasions.delete('navigator.plugins')
stealth.enabledEvasions.delete('media.codecs')
puppeteer.use(stealth);
const randomUseragent = require('random-useragent');


const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

const readLinesToArray = () => {
    const lines = fs.readFileSync(`../data/localStorage.txt`, 'utf-8').trim().split('\n');
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


let MainBrowser = (async (countFolder) => {
    try {
        // let userAgent = { 'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36' }
        const browser = await puppeteer.launch({
            headless: false,
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            userDataDir: `C:\\Users\\Huy\\AppData\\Local\\Google\\Chrome\\User Data\\memefi ${countFolder + 300}`,
            args: ['--test-type',
                '--disable-gpu',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-sync',
                '--ignore-certificate-errors',
                '--window-size=400,800'
            ],
            // devtools: true,
            ignoreDefaultArgs: ["--enable-automation"],
        });

        // browser.on('targetcreated', async (target) => {
        //     if (target.type() === 'page') {
        //         const newPage = await target.page();
        //         await sleep(1000);
        //         await newPage.close();
        //     }
        // });

        // const userAgent = randomUseragent.getRandom(ua => ua.osName === 'Android');
        const [page] = await browser.pages();
        const iPhone = KnownDevices['iPhone 15 Pro'];
        await page.emulate(iPhone);
        // await page.setUserAgent(userAgent);
        // await page.setExtraHTTPHeaders({
        //     "accept": "*/*",
        //     "accept-language": "en-US,en;q=0.9,vi;q=0.8",
        //     "cache-control": "no-cache",
        //     "content-type": "application/json",
        //     "pragma": "no-cache",
        //     "user-agent": "Mozilla/5.0 (Linux; Android 12; Pixel 6 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36",
        //     "sec-ch-ua": "\"Chromium\";v=\"114\", \"Google Chrome\";v=\"114\", \";Not A Brand\";v=\"8\"",
        //     "sec-ch-ua-mobile": "?1",
        //     "sec-ch-ua-platform": "\"Android\"",
        //     "sec-fetch-dest": "empty",
        //     "sec-fetch-mode": "cors",
        //     "sec-fetch-site": "cross-site",
        //     "Referrer-Policy": "strict-origin-when-cross-origin"
        // });
        // // let pathPreloadFile = path.join(__dirname, 'public', 'preload.js');
        // // const preloadFile = fs.readFileSync(pathPreloadFile, 'utf8');
        // // await page.evaluateOnNewDocument(preloadFile);
        // await page.goto('https://httpbin.org/headers');

        // // Lấy nội dung của trang và in ra để kiểm tra
        // const content = await page.content();
        // console.log(content);

        // let memescript = path.join(__dirname, '..', 'public', 'memefi.js');
        // const preMemescript = fs.readFileSync(memescript, 'utf8');
        // await page.evaluateOnNewDocument(preMemescript);

        const modifiedJs = fs.readFileSync('../public/telegram-web-app.js', 'utf8');
        await page.setRequestInterception(true);

        page.on('request', request => {
            if (request.url().endsWith('telegram-web-app.js')) {
                request.respond({
                    status: 200,
                    contentType: 'application/javascript',
                    body: modifiedJs
                });
            } else {
                request.continue();
            }
        });

        await page.goto("https://web.telegram.org/k/");
        // await page.goto("https://web.telegram.org/k/#@memefi_coin_bot");
        // await page.waitForSelector('iframe');
        // let iframe = await page.evaluate(() => document.querySelector("iframe")?.getAttribute('src'));
        // if (iframe) await page.goto(iframe);
        // await sleep(2000)
        // await sleep(2000)
        // await sleep(2000)
        // while (true) {
        //     await page.click(`#root > main > div > div > div.MuiBox-root > div.MuiStack-root.css-1x0m3xf > button:nth-child(1)`);
        //     await sleep(500)
        //     await page.click(`#root > main > div > div > div.MuiBox-root.css-q4ok0g > div.MuiBox-root.css-e6aoit > div > button:nth-child(1)`);
        //     await sleep(500)
        //     await page.click(`body > div.MuiDrawer-root.MuiDrawer-modal.MuiModal-root.css-1muh5pq > div.MuiPaper-root.MuiPaper-elevation.MuiPaper-elevation16.MuiDrawer-paper.MuiDrawer-paperAnchorBottom.css-dsgero > div.MuiBox-root.css-4q3rnc > button`);
        //     await sleep(2000)
        //     await sleep(2000)
        //     await sleep(2000)
        //     await sleep(2000)
        //     await sleep(2000)
        //     await sleep(2000)
        //     await sleep(2000)
        //     await sleep(2000)
        //     await sleep(2000)
        //     await sleep(2000)
        //     await sleep(2000)
        // }
    } catch (error) {
        console.log("---------------------error------------------------");
        console.error(error.message);
    }
});






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

// 2,4,5
(async () => {
    const dataArray = readLinesToArray();
    for (let i = 4; i < dataArray.length; i++) {
        await MainBrowser(i);
        await waitForInput();
    }
})();

// var element = document.querySelector('body');

// // Khi người dùng click vào phần tử
// element.addEventListener('click', function(event) {
//     event.preventDefault(); // Ngăn chặn hành động click mặc định

//     // Tạo đối tượng Touch
//     var touch = new Touch({
//         identifier: Date.now(), // Một ID duy nhất cho chạm
//         target: element, // Phần tử mục tiêu
//         clientX: event.clientX, // Tọa độ X của sự kiện click
//         clientY: event.clientY, // Tọa độ Y của sự kiện click
//         pageX: event.pageX, // Tọa độ X trên trang
//         pageY: event.pageY, // Tọa độ Y trên trang
//         screenX: event.screenX, // Tọa độ X trên màn hình
//         screenY: event.screenY  // Tọa độ Y trên màn hình
//     });

//     // Tạo sự kiện touchend với đối tượng Touch
//     var touchEvent = new TouchEvent('touchend', {
//         bubbles: true,
//         cancelable: true,
//         changedTouches: [touch], // Đối tượng touch phải là mảng chứa đối tượng Touch
//         touches: [touch], // Mảng touches hiện tại
//         targetTouches: [] // Mảng targetTouches (các điểm đang chạm vào phần tử đích)
//     });

//     // Kích hoạt sự kiện touchend
//     element.dispatchEvent(touchEvent);

//     console.log('Click event turned into touchend');
// });