const fs = require("fs-extra");
const path = require("path");

const { runPuppeteer, setMobile, proxies, totalElements, distance } = require('./utils/puppeteer.js');
const { sleep, formatTime, takeTimeEnd, userAgent, waitForInput, printFormattedTitle, log, writeTimeToFile } = require('./utils/utils.js');
const { checkIframeAndClick, clickIfExists } = require('./utils/selector.js');
const { fetchData } = require('./utils/axios.js');


// =====================================================================
// =====================================================================

let headers = {
    "accept": "application/json, text/plain, */*",
    "accept-encoding": "gzip, deflate, br, zstd",
    "accept-language": "en-US,en;q=0.9",
    "origin": "https://wukong-miniapp-sigma.vercel.app",
    "priority": "u=1, i",
    "Referer": "https://wukong-miniapp-sigma.vercel.app/",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
}


const fetchMine = async (token, proxy) => {
    let data = await fetchData('https://api.wuko.app/wuko-miniapp/v2/user/mine', "POST", { authKey: 'authorization', authValue: token, headers, proxy })

    if (data) {
        let [now, endTimeTimestamp] = takeTimeEnd(data.data.mineStartTimestamp * 1000, 8 * 60 * 60 * 1000);
        log(`[Start Mine Success]`, 'yellow')
        log(`end farm lúc: [${formatTime(endTimeTimestamp)}]`, 'yellow');
    }
}

// =====================================================================
// =====================================================================
// =====================================================================

// // Giả lập các thuộc tính navigator để chống phát hiện
// await page.evaluateOnNewDocument(() => {
//     Object.defineProperty(navigator, 'platform', { get: () => 'iPhone' });
//     Object.defineProperty(navigator, 'vendor', { get: () => 'Apple Inc.' });
//     Object.defineProperty(navigator, 'webdriver', { get: () => undefined }); // Bỏ cờ phát hiện bot
//     Object.defineProperty(navigator, 'languages', { get: () => ['vi-VN', 'en-US'] });

//     // Xử lý WebRTC leaks
//     Object.defineProperty(navigator, 'mediaDevices', {
//         get: () => ({
//             enumerateDevices: async () => [{ kind: 'videoinput', label: 'Camera ảo' }],
//         }),
//     });
// });

// // Chặn Canvas fingerprinting và sửa đổi dữ liệu trả về
// await page.evaluateOnNewDocument(() => {
//     const getContext = HTMLCanvasElement.prototype.getContext;
//     HTMLCanvasElement.prototype.getContext = function (...args) {
//         const context = getContext.apply(this, args);
//         if (context && context.getImageData) {
//             const originalGetImageData = context.getImageData;
//             context.getImageData = function (...imgArgs) {
//                 console.log('Phát hiện và chặn fingerprinting trên canvas!');
//                 const imageData = originalGetImageData.apply(this, imgArgs);
//                 imageData.data[0] = (imageData.data[0] + 1) % 255; // Sửa nhẹ dữ liệu để phá fingerprint.
//                 return imageData;
//             };
//         }
//         return context;
//     };
// });
const MainBrowser = async (proxy, countFolder, existToken = null) => {
    try {
        const browser = await runPuppeteer({
            userDataDir: `C:\\Users\\Huy\\AppData\\Local\\Google\\Chrome\\User Data\\Profile ${countFolder + 100}`,
            args: ['--window-size=400,800', '--disable-web-security',
                '--disable-features=IsolateOrigins,site-per-process',],
            proxy,
        });
        const [page] = await browser.pages();
        if (proxy) {
            const page2 = await browser.newPage();
            // let randomUrl = ['https://ipinfo.io/', "https://www.myip.com/"]
            // await page2.goto(randomUrl[Math.floor(Math.random() * randomUrl.length)]);
            await page2.goto("https://example.com/");
            await sleep(3000);
            await page.bringToFront();
        }

        const getAuthorization = new Promise((resolve) => {
            page.on('response', async (response) => {
                const url = response.url();
                const status = response.status();
                if (url == "https://api.wuko.app/wuko-miniapp/v2/user/signIn") {
                    if (status === 200 || status === 201) {
                        const responseBody = await response.text();
                        let token = JSON.parse(responseBody).data
                        resolve(token)
                    }
                }
            });
        });

        await setMobile(page);

        await page.goto("https://web.telegram.org/k/#@wukobot");
        let [src, iframe] = await checkIframeAndClick(page);
        await page.goto(src);
        await sleep(3000);
        await clickIfExists(page, "#root > div > div > button");
        let authorization = await getAuthorization

        let [now, endTimeTimestamp] = takeTimeEnd(authorization.user.mineStartTimestamp * 1000, 8 * 60 * 60 * 1000);
        if (now > endTimeTimestamp) await fetchMine(authorization.jwtToken, proxy);
        else log(`end farm lúc: [${formatTime(endTimeTimestamp)}], quay lai sau`, 'yellow');
        browser.close()
    } catch (error) {
        console.error("Error:", error.message);
        // await waitForInput()
    }
};


(async () => {
    let ok = false;
    for (let offset = 0; offset < distance; offset++) {
        for (let i = offset; i < totalElements; i += distance) {
            if (i == 4) continue
            // if (i == 46) {
            //     ok = true;
            // }
            // if (ok) {
            let proxy = (i > 9) ? proxies[i] : null;
            proxy = proxies[i] == 'null' ? null : proxies[i];
            printFormattedTitle(`account ${i} - Profile ${i + 100} - proxy ${proxy}`, "red");

            await MainBrowser(proxy, i);
            await sleep(1000);
            await waitForInput()
            // }
        }
    }
    writeTimeToFile('thời gian nhận thưởng tiếp theo', '10-wukong.txt', 8).then(() => process.exit(1));
    process.exit(1)
})();

