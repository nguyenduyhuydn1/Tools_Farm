const fs = require("fs-extra");
const path = require("path");
const { KnownDevices } = require('puppeteer');

const { runPuppeteer } = require('./utils/puppeteer.js')
const { sleep, formatTime, userAgent, waitForInput, printFormattedTitle, log, writeTimeToFile } = require('./utils/utils.js')
const { checkIframeAndClick, clickIfExists } = require('./utils/selector.js')
const { fetchData } = require('./utils/axios.js')
const proxyFile = require("./data/proxy.js");


let xPosition = 0;
let yPosition = 0;
const MainBrowser = async (countFolder) => {
    try {
        const browser = await runPuppeteer({
            userDataDir: `C:\\Users\\Huy\\AppData\\Local\\Google\\Chrome\\User Data\\memefi ${countFolder + 300}`,
            args: ['--window-size=400,300', `--window-position=${xPosition},${yPosition}`],
            dataProxy: proxyUrl,
        });
        xPosition += 300;
        if (xPosition + 300 > 1920) {
            xPosition = 0;
            yPosition += 200;
        }
        const addFunc = async (page) => {
            const pathPreloadFile = path.join(__dirname, 'public', 'preload.js');
            const preloadFile = fs.readFileSync(pathPreloadFile, 'utf8');
            await page.evaluateOnNewDocument(preloadFile);
        };
        const [page] = await browser.pages();
        await addFunc(page);

        if (proxyUrl != null) {
            const page2 = await browser.newPage();
            await page2.goto("https://google.com");
            await sleep(3000);
            await page.bringToFront();
        }

        await page.goto("https://web.telegram.org/k/#@xkucoinbot");
        const [src, iframe] = await checkIframeAndClick(page);
        await page.goto(src);
        await sleep(1000);

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
        },);
    } catch (error) {
        console.error("Error:", error.message);
    }
};

let proxyUrl = null;

(async () => {
    for (let i = 0; i < 10; i++) {
        printFormattedTitle(`tài khoản ${i} - Profile ${i + 100}`, "red")
        if (i > 9) {
            let proxyIndex = Math.floor((i - 10) / 10);
            proxyUrl = proxyFile[proxyIndex];
            await MainBrowser(i);
        } else {
            await MainBrowser(i);
        }
    }
})();
