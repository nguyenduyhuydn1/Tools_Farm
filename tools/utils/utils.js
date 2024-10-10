const fs = require("fs-extra");

const randomUseragent = require('random-useragent');
const userAgent = randomUseragent.getRandom(ua => ua.osName === 'Android');

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const readLinesToArray = () => {
    const lines = fs.readFileSync(`${__dirname}/../data/localStorage.txt`, 'utf-8').trim().split('\n');
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

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
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

////////////////////////////////////////////////////////////////////////////////////////////////
//                                       not-pixel                                            //                                  
////////////////////////////////////////////////////////////////////////////////////////////////
const randomNumber = () => {
    const ranges = [
        { start: 494495, end: 494501 },
        { start: 495495, end: 495501 },
        { start: 496495, end: 496501 },
        { start: 497495, end: 497501 },
        { start: 498495, end: 498501 },
        { start: 499495, end: 499501 }
    ];

    function getRandomInRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    let selectedNumbers = [];

    while (selectedNumbers.length < 10) {
        const randomRange = ranges[Math.floor(Math.random() * ranges.length)];
        const randomNumber = getRandomInRange(randomRange.start, randomRange.end);
        if (!selectedNumbers.includes(randomNumber)) {
            selectedNumbers.push(randomNumber);
        }
    }
    return selectedNumbers;
}
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

async function clickIfExists(page, selector, timeout = 500, callback = () => { }) {
    const elementExists = await page.$(selector);
    if (elementExists) {
        await page.waitForSelector(selector, { hidden: true, visible: true, timeout: timeout }).then(e => e.click());
        await sleep(2000);
    } else {
        callback()
    }
}

async function navigateToIframe(page, regex = false) {
    await page.waitForSelector('iframe');
    const iframeSrc = await page.evaluate((regex) => {
        const iframeElement = document.querySelector('iframe');
        if (iframeElement) {
            if (regex) return iframeElement.src.match(/(?<=#tgWebAppData=).*?(?=&tgWebAppVersion=7\.10)/g)[0];
            return iframeElement.src;
        }
    }, regex);
    if (iframeSrc) {
        await page.goto(iframeSrc)
    } else {
    }
}

async function waitForTextContent(page, selector, text, timeout = 10000) {
    // Kiểm tra sự thay đổi trong DOM: Khi bạn muốn đợi một phần tử có nội dung hoặc thuộc tính thay đổi.
    await page.waitForFunction(
        (selector, text) => {
            const element = document.querySelector(selector);
            return element.textContent == text;
        },
        { timeout },
        selector,
        text
    );
}

module.exports = {
    sleep,
    readLinesToArray,
    userAgent,
    randomNumber,   // not-pixel
    clickIfExists,
    waitForInput,
}
