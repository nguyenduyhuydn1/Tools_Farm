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



function printFormattedTitle(title, colorName = "blue") {
    // Định nghĩa object chứa tên màu và mã màu ANSI tương ứng
    const colors = {
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        brightRed: "\x1b[91m",
        brightGreen: "\x1b[92m",
        brightYellow: "\x1b[93m",
        brightBlue: "\x1b[94m",
        brightMagenta: "\x1b[95m",
        brightCyan: "\x1b[96m",
        white: "\x1b[97m",
        black: "\x1b[30m",
        gray: "\x1b[90m",
        brightGray: "\x1b[37m"
    };

    const reset = "\x1b[0m"; // Mã để reset về màu mặc định

    // Lấy mã màu từ object theo tên màu, mặc định là màu xanh dương (blue)
    const color = colors[colorName] || colors.blue;

    const lineLength = 40; // Độ dài của dòng kẻ
    const paddingLength = Math.max(0, Math.floor((lineLength - title.length) / 2));
    const padding = ' '.repeat(paddingLength);

    console.log(color + "=".repeat(lineLength) + reset);
    console.log(color + padding + title + padding + reset);
    console.log(color + "=".repeat(lineLength) + reset);
}


////////////////////////////////////////////////////////////////////////////////////////////////
//                                      format time                                           //                                  
////////////////////////////////////////////////////////////////////////////////////////////////
function formatTime(isoString) {
    const date = new Date(isoString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Trả về định dạng "DD/MM/YYYY HH:MM:SS"
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

////////////////////////////////////////////////////////////////////////////////////////////////
//                                       not-pixel                                            //                                  
////////////////////////////////////////////////////////////////////////////////////////////////
const randomNumber = () => {
    const ranges = [
        { start: 496496, end: 496501 },
        { start: 497496, end: 497501 },
        { start: 498496, end: 498501 },
        { start: 499496, end: 499501 },
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

module.exports = {
    sleep,
    readLinesToArray,
    userAgent,
    randomNumber,   // not-pixel
    waitForInput,
    formatTime,
    printFormattedTitle
}
