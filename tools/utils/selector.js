const { sleep, printFormattedTitle } = require('./utils.js')

async function clickIfExists(page, selector, timeout = 500, callback = () => { }) {
    const elementExists = await page.$(selector);
    if (elementExists) {
        await page.waitForSelector(selector, { hidden: true, visible: true, timeout: timeout }).then(e => e.click());
        await sleep(2000);
    } else {
        callback()
    }
}

async function checkIframeAndClick(page) {
    let iframeExists = false;
    let check = true;
    while (!iframeExists) {
        printFormattedTitle(`đang tìm và click`, 'red')
        iframeExists = await page.$('iframe') !== null;
        if (!iframeExists) {
            if (check == true) {
                check = false;
                await clickIfExists(page, "#column-center .new-message-bot-commands.is-view")
                await clickIfExists(page, ".popup-confirmation.active .popup-buttons > *")
            } else {
                check = true;
                await clickIfExists(page, "#column-center .bubbles-group-last .reply-markup > :nth-of-type(1) > :nth-of-type(1)");
                await clickIfExists(page, ".popup-confirmation.active .popup-buttons button:nth-child(1)");
            }
        }
        iframeExists = await page.$('iframe') !== null;
        await sleep(5000);
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
    clickIfExists,
    navigateToIframe,
    waitForTextContent,
    checkIframeAndClick,
}
