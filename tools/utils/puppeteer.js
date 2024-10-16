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


async function runPuppeteer({ userDataDir = null, args = [], dataProxy = null }) {
    if (dataProxy) {
        puppeteer.use(
            ProxyPlugin({
                address: dataProxy.ip,
                port: dataProxy.port,
                credentials: {
                    username: dataProxy.username,
                    password: dataProxy.password,
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
        `--window-position=0,0`,
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

module.exports = {
    runPuppeteer,
    setMobile,
}
