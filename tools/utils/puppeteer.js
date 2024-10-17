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

// const proxies = require("./../data/proxy.js");

async function runPuppeteer({ userDataDir = null, args = [], proxy = null }) {
    if (proxy) {
        puppeteer.use(
            ProxyPlugin({
                address: proxy.ip,
                port: proxy.port,
                credentials: {
                    username: proxy.username,
                    password: proxy.password,
                },
            })
        );
    }

    const defaultArgs = [
        // '--disable-3d-apis',               // Vô hiệu hóa WebGL
        // '--disable-accelerated-2d-canvas', // Vô hiệu hóa Canvas hardware acceleration
        // '--disable-gpu-compositing',       // Vô hiệu hóa GPU compositing
        // '--disable-video',                 // Vô hiệu hóa video decoding
        // '--disable-software-rasterizer',    // Vô hiệu hóa software rasterization

        '--test-type',
        '--disable-gpu',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-sync',
        '--ignore-certificate-errors',
        '--mute-audio',
        '--disable-notifications',
        // '--window-size=1300,1000',
        '--window-size=400,700',
        // `--window-position=0,0`,
        // '--start-maximized'
        // --disable-blink-features=AutomationControlled
        // Ẩn dấu vết cho thấy Chrome đang được điều khiển bởi một công cụ tự động hóa, điều này giúp tránh các trang web phát hiện và chặn bot tự động.
        // được sử dụng để vô hiệu hóa một tính năng đặc biệt của Chromium gọi là "AutomationControlled"
    ];

    const browser = await puppeteer.launch({
        headless: false,
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        userDataDir,
        args: [
            ...defaultArgs,
            ...args
        ],
        ignoreDefaultArgs: ["--enable-automation"],
    });

    return browser;
}

const setMobile = async (page) => {
    const iPhone = KnownDevices['iPhone 15 Pro'];
    await page.emulate(iPhone);
}

////////////////////////////////////////////////////////////////////////////////////////////////
//                                  run main with proxy                                       //                                  
////////////////////////////////////////////////////////////////////////////////////////////////

// const totalElements = 20;
// let proxies = ['x', 'y', 'z'];
// const distance = proxies.length;

// const executeWithOffset = async (callback) => {
//     for (let i = 0; i < totalElements; i++) {
//         let proxy = proxies[i % distance];
//         if (i >= 10) await callback(proxy, i);
//         else await callback(proxy = null, i);
//     }
// };

module.exports = {
    runPuppeteer,
    setMobile,
}






// (async () => {
//     for (let i = 0; i < 39; i += 2) {
//         const promises = [];

//         printFormattedTitle(`tài khoản ${i} - Profile ${i + 100}`, "red");
//         if (i > 9) {
//             let proxyIndex = Math.floor((i - 10) / 10);
//             proxyUrl = proxyFile[proxyIndex];
//             promises.push(MainBrowser(i));
//         } else {
//             promises.push(MainBrowser(i));
//         }

//         if (i + 1 < 39) {
//             printFormattedTitle(`tài khoản ${i + 1} - Profile ${i + 101}`, "red");
//             await sleep(3000);
//             if (i + 1 > 9) {
//                 let proxyIndex = Math.floor((i + 1 - 10) / 10);
//                 proxyUrl = proxyFile[proxyIndex];
//                 promises.push(MainBrowser(i + 1));
//             } else {
//                 promises.push(MainBrowser(i + 1));
//             }
//         }

//         await Promise.all(promises);
//         await sleep(1000);
//     }
//     writeTimeToFile('thời gian nhận thưởng tiếp theo', '4-cryptoRank.txt', 6).then(() => process.exit(1));
//     process.exit(1);
// })();













// ma~ cu~
// let proxy = null;

// // (async () => {
// //     for (let i = 0; i < 10; i++) {
// //         printFormattedTitle(`tài khoản ${i} - Profile ${i + 100}`, "red")
// //         if (i > 9) {
// //             let proxyIndex = Math.floor((i - 10) / 10);
// //             proxy = proxyFile[proxyIndex];
// //             await MainBrowser(i);
// //         } else {
// //             await MainBrowser(i);
// //         }
// //     }
// //     writeTimeToFile('thời gian nhận thưởng tiếp theo', '4-cryptoRank.txt', 6).then(() => process.exit(1));
// //     process.exit(1)
// // })();

