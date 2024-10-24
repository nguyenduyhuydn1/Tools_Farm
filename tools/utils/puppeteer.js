const fs = require("fs-extra");
const path = require("path");

const { KnownDevices, executablePath } = require('puppeteer');
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const ProxyPlugin = require('puppeteer-extra-plugin-proxy');

const stealth = StealthPlugin();
stealth.enabledEvasions.delete('iframe.contentWindow');
stealth.enabledEvasions.delete('navigator.plugins');
stealth.enabledEvasions.delete('media.codecs');
const AnonymizeUA = require('puppeteer-extra-plugin-anonymize-ua');

// Add the anonymize UA plugin
puppeteer.use(AnonymizeUA());
puppeteer.use(stealth);

async function runPuppeteer({ userDataDir = null, args = [], proxy = null }) {
    const defaultArgs = [
        '--disable-features=Translate,OptimizationHints,MediaRouter,DialMediaRouteProvider,CalculateNativeWinOcclusion,InterestFeedContentSuggestions,CertificateTransparencyComponentUpdater,AutofillServerCommunication,PrivacySandboxSettings4,AutomationControlled',
        // '--disable-3d-apis',               // Vô hiệu hóa WebGL
        // '--disable-video',                 // Vô hiệu hóa video decoding
        // '--disable-accelerated-2d-canvas', // Tắt tăng tốc canvas 2D
        // '--disable-gl-drawing-for-tests',

        '--test-type',
        // '--disable-gpu',               // Vô hiệu hóa GPU
        // '--disable-gpu-compositing',       // Vô hiệu hóa GPU compositing
        // '--disable-software-rasterizer', // Tắt rasterizer dự phòng bằng phần mềm
        '--no-sandbox',                 // Bỏ sandbox để tăng tính ổn định
        '--disable-dev-shm-usage', // Hạn chế bộ nhớ dùng cho shared memory
        '--disable-setuid-sandbox',
        '--disable-sync',
        '--ignore-certificate-errors',
        '--mute-audio',
        '--disable-notifications',
        '--window-size=1300,1000',
        // '--window-size=300,800',
        `--window-position=0,0`,
        // '--start-maximized'
        '--disable-blink-features=AutomationControlled',
        // Ẩn dấu vết cho thấy Chrome đang được điều khiển bởi một công cụ tự động hóa, điều này giúp tránh các trang web phát hiện và chặn bot tự động.
        // được sử dụng để vô hiệu hóa một tính năng đặc biệt của Chromium gọi là "AutomationControlled"
    ];

    if (proxy) {
        const regex = /http:\/\/(?<username>[^:]+):(?<password>[^@]+)@(?<ip>[\d.]+):(?<port>\d+)/;
        const match = proxy.match(regex);

        const { username, password, ip, port } = match.groups;
        puppeteer.use(
            ProxyPlugin({
                address: ip,
                port: port,
                credentials: {
                    username: username,
                    password: password,
                },
            })
        );

        // phải fix lỗi ở puppeteer-extra-plugin-proxy nếu không là k chạy đc proxy
        const browser = await puppeteer.launch({
            headless: false,
            // executablePath: executablePath(),
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            userDataDir,
            args: [
                ...defaultArgs,
                ...args,
                `--proxy-server=${ip}:${port}`
            ],
            // devtools: true,
            ignoreDefaultArgs: ["--enable-automation"],
        });

        return browser;
    } else {
        const browser = await puppeteer.launch({
            headless: false,
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            userDataDir,
            args: [
                ...defaultArgs,
                ...args,
            ],
            // devtools: true,
            ignoreDefaultArgs: ["--enable-automation"],
        });

        return browser;
    }
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

let proxies = fs.readFileSync(path.join(__dirname, '..', 'data', 'proxy.txt'), 'utf8').split('\n').map(line => line.trim()).filter(line => line.length > 0);
let totalElements = 51;
let distance = 5;

module.exports = {
    runPuppeteer,
    setMobile,
    proxies,
    totalElements,
    distance,
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







// const totalElements = 10;
// let proxies = ['x', 'y', 'z']

// // chạy bao nhiêu acc trên 1 proxy
// const distance = proxies.length;

// const getProxy = (index) => {
//     if (index >= 0 && index < 3) return proxies[0];
//     if (index >= 3 && index < 6) return proxies[1];
//     if (index >= 6 && index < 9) return proxies[2];
//     return null;
// }

// const executeWithOffset = async (callback) => {
//     for (let offset = 0; offset < distance; offset++) {
//         for (let i = offset; i < totalElements; i += distance) {
//             const proxy = getProxy(i);
//             // await callback(proxy = null, i);
//             console.log(i, proxy);

//         }
//     }
// }
// executeWithOffset(() => { })




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



// cach moi nhung da bi loai
// let pathFile = path.join(__dirname, 'data', 'token', 'not-pixel.txt');
// (async (check = false) => {
//     let data = fs.readFileSync(pathFile, 'utf8');
//     const lines = data.split('\n');
//     const totalElements = 10;
//     let proxies = ['x', 'y', 'z'];

//     for (let i = 0; i < totalElements; i++) {
//         printFormattedTitle(`tài khoản ${i} - Profile ${i + 100}`, "red")
//         let proxy = (i > 10) ? proxies[i % proxies.length] : null;

//         if (check) await MainBrowser(proxy, i, lines[i]);
//         else await MainBrowser(proxy, i);
//         await sleep(1000);
//     }
//     process.exit(1)
// })();









// (async () => {
//     let proxies = fs.readFileSync(path.join(__dirname, 'data', 'proxy.txt'), 'utf8').split('\n')
//         .map(line => line.trim())
//         .filter(line => line.length > 0);

//     let totalElements = 10;
//     // trong đó 3 là số proxy
//     const distance = Math.floor(totalElements / 3);
//     for (let offset = 0; offset < distance; offset++) {
//         for (let i = offset; i < totalElements; i += distance) {
//             let proxy = proxies[i];
//             printFormattedTitle(`account ${i} - Profile ${i + 100} - proxy ${proxy}`, "red");
//             if (i > 10) await MainBrowser(proxy, i);
//             else await MainBrowser(null, i);
//             await sleep(1000);
//         }
//     }
//     process.exit(1)
// })();
