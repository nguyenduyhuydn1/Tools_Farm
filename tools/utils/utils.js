const fs = require("fs-extra");
const path = require("path");

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
//                                       log color                                            //                                  
////////////////////////////////////////////////////////////////////////////////////////////////
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

const reset = "\x1b[0m";

function printFormattedTitle(title, colorName = "blue") {
    const color = colors[colorName] || colors.blue;

    const lineLength = 40; // Độ dài của dòng kẻ
    const paddingLength = Math.max(0, Math.floor((lineLength - title.length) / 2));
    const padding = ' '.repeat(paddingLength);

    console.log(color + "=".repeat(lineLength) + reset);
    console.log(color + padding + title + padding + reset);
    console.log(color + "=".repeat(lineLength) + reset);
}

function log(message, colorName = 'red') {
    const color = colors[colorName] || colors.blue;

    // Tìm các chuỗi trong ngoặc vuông và tô màu chúng
    const regex = /\[(.*?)\]/g;
    let formattedMessage = message.replace(regex, (_, group) => {
        // Tô màu cho nội dung trong ngoặc vuông và bỏ ngoặc
        return `${color}${group}${reset}`;
    });

    console.log(formattedMessage);
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
        { start: 872892, end: 872932 },
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

async function writeTimeToFile(content, nameFile, time = 4) {
    const startTime = new Date(Date.now());
    const endTime = new Date(startTime.getTime() + time * 60 * 60 * 1000);
    const endTimeTimestamp = endTime.getTime();

    log(`${content}: [${formatTime(endTimeTimestamp)}]`, 'blue');
    fs.writeFileSync(path.join(__dirname, '..', 'time', nameFile), formatTime(endTimeTimestamp), 'utf-8');
}

module.exports = {
    sleep,
    readLinesToArray,
    userAgent,
    randomNumber,   // not-pixel
    waitForInput,
    formatTime,
    printFormattedTitle,
    log,
    writeTimeToFile
}
