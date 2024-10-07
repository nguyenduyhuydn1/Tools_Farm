const fs = require('fs');

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const readLinesToArray = () => {
    const lines = fs.readFileSync('1.txt', 'utf-8').trim().split('\n');
    const array = [];
    lines.forEach(line => { array.push(line) });
    return array;
};

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



async function fetchData(url, authorization, method, body = null) {
    try {
        const options = {
            headers: {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en-US,en;q=0.9,vi;q=0.8",
                "authorization": `initData ${decodeURIComponent(authorization)}`,
                "priority": "u=1, i",
                "sec-ch-ua": "\"Google Chrome\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "Referer": `https://app.notpx.app/`,
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            method
        };

        if (method.toUpperCase() === "POST" && body) {
            options.headers["Content-Type"] = "application/json";
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

// =====================================================================
// =====================================================================
// =====================================================================

const getInfo = async (user) => {
    let info = await fetchData("https://notpx.app/api/v1/users/me", user, "GET");
    console.log(`=============== tài khoản ${info?.lastName} ${info?.firstName} ===================`);
    console.log(`balance: ${info?.balance}, id: ${info?.id}`);
    console.log("============================================================================");
    return info
}

const getStatus = async (user) => {
    let status = await fetchData("https://notpx.app/api/v1/mining/status", user, "GET");
    return status;
}

const getClaim = async (user) => {
    let claim = await fetchData("https://notpx.app/api/v1/mining/claim", user, "GET");
    console.log(`claimed: ${claim?.claimed}`);
    return claim;
}

const postStart = async (user, pixelId) => {
    let start = await fetchData("https://notpx.app/api/v1/repaint/start", user, "POST", { pixelId, newColor: "#000000" });
    console.log(`balance:${start?.balance}`);
    return start;
}

(async () => {
    let arrUser = await readLinesToArray();
    let arrNumber = randomNumber();

    for (x of arrUser) {
        await getInfo(x);
        await sleep(1000)
        let { charges } = await getStatus(x)
        await getClaim(x);
        await sleep(1000)
        for (let i = 0; i < charges; i++) {
            await postStart(user, arrNumber[i])
            await sleep(1000)
        }
        await sleep(1000)
    }
    await sleep(5000)
})()