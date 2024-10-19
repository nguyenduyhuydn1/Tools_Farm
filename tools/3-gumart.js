const fs = require("fs-extra");
const path = require("path");

const { runPuppeteer, proxies, totalElements, distance } = require('./utils/puppeteer.js');
const { sleep, formatTime, userAgent, waitForInput, printFormattedTitle, log, writeTimeToFile } = require('./utils/utils.js');
const { checkIframeAndClick } = require('./utils/selector.js');
const { fetchData } = require('./utils/axios.js');


const headers = {
    "accept": "application/json, text/plain, */*",
    "accept-language": "en-US,en;q=0.9",
    "access-control-allow-origin": "*",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Google Chrome\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "Referer": "https://d2kpeuq6fthlg5.cloudfront.net/",
    "Referrer-Policy": "strict-origin-when-cross-origin"
}

// =====================================================================
// =====================================================================
// =====================================================================
let fetchInfo = async (token, proxy) => {
    let data = await fetchData("https://api.gumart.click/api/home", "GET", { authKey: 'authorization', authValue: `Bearer ${token}`, headers, proxy });
    if (data) console.log(data.data.balance);
    else console.log(`Check Error ${log('fetchInfo()')}`);
}

let fetchClaim = async (token, proxy) => {
    let data = await fetchData("https://api.gumart.click/api/claim", "POST", { authKey: 'authorization', authValue: `Bearer ${token}`, body: {}, headers, proxy });
    if (data) console.log(`Đã lấy`, JSON.stringify(data));
    else console.log(`Check Error ${log('fetchClaim()')}`);
}

let fetchBoost = async (token, proxy) => {
    let data = await fetchData("https://api.gumart.click/api/boost", "POST", { authKey: 'authorization', authValue: `Bearer ${token}`, body: {}, headers, proxy });
    if (data) console.log(`Đã boost`, JSON.stringify(data));
    else console.log(`Check Error ${log('fetchBoost()')}`);
}

let fetchMissions = async (token, proxy) => {
    printFormattedTitle('Missions');
    let res = await fetchData("https://api.gumart.click/api/missions", "GET", { authKey: 'authorization', authValue: `Bearer ${token}`, headers, proxy });
    if (res) {
        // let mergedArray = [];
        // let tasks = res.data.tasks;
        // for (let key in task) {
        //     if (Array.isArray(tasks[key])) {
        //         mergedArray = mergedArray.concat(tasks[key]);
        //     }
        // }

        // const combinedMissions = mergedArray.filter(v => v.status !== 'finished');

        let tasks = res.data.tasks;
        const combinedMissions = tasks.gumart.filter(v => v.status !== 'finished');
        return combinedMissions;
    }
}

let fetchStartTask = async (token, id, proxy) => {
    let data = await fetchData(`https://api.gumart.click/api/missions/${id}/start`, "POST", { authKey: 'authorization', authValue: `Bearer ${token}`, headers, proxy });
    if (data) return data;
    return false;
}

let fetchClaimTask = async (token, id, proxy) => {
    let data = await fetchData(`https://api.gumart.click/api/missions/${id}/claim`, "POST", { authKey: 'authorization', authValue: `Bearer ${token}`, headers, proxy });
    if (data) console.log(JSON.stringify(data));
    else console.log(`Check Error ${log('fetchClaimTask()')}`);
}

// =====================================================================
// =====================================================================
// =====================================================================

const MainBrowser = async (proxy, countFolder, existToken = null) => {
    try {
        const reuse = async (reuseToken, reuseProxy) => {
            await fetchInfo(reuseToken, reuseProxy);
            await fetchClaim(reuseToken, reuseProxy);
            await fetchBoost(reuseToken, reuseProxy);

            let tasks = await fetchMissions(reuseToken, reuseProxy);
            for (const e of tasks) {
                console.log(e.title);
                if (e.status == "claimable") await fetchClaimTask(reuseToken, e.id, reuseProxy);
                if (e.status == "startable") {
                    let data = await fetchStartTask(reuseToken, e.id, reuseProxy);
                    let currentTime = Math.floor(Date.now() / 1000);
                    let futureTime = data.claimable_at;
                    let delayInSeconds = futureTime - currentTime;

                    promiseTasks.push(new Promise((resolve) => {
                        setTimeout(async () => {
                            await fetchClaimTask(reuseToken, e.id, reuseProxy);
                            resolve();
                        }, delayInSeconds * 1000);
                    }));
                }
            }
            Promise.all(promiseTasks).then(() => {
                log(`Tất cả các task của [tài khoản ${countFolder}] đã hoàn thành`, 'yellow');
            });
        }

        if (existToken != null && existToken.length > 2) {
            await reuse(existToken, proxy);
            return;
        }

        ///////////////////////////////////////////////////////////////////////////////////
        //                            run browser to take token                          //                                  
        ///////////////////////////////////////////////////////////////////////////////////

        const browser = await runPuppeteer({
            userDataDir: `C:\\Users\\Huy\\AppData\\Local\\Google\\Chrome\\User Data\\Profile ${countFolder + 100}`,
            proxy,
        });
        const [page] = await browser.pages();
        if (proxy != null) {
            const page2 = await browser.newPage();
            await page2.goto("https://www.myip.com/");
            await sleep(1000);
            await page.bringToFront();
        }

        const getAuthorization = new Promise((resolve) => {
            page.on('response', async (response) => {
                const url = response.url();
                const status = response.status();
                if (url == "https://api.gumart.click/api/login") {
                    if (status === 200) {
                        const responseBody = await response.text();
                        let token = JSON.parse(responseBody).data.access_token
                        resolve(token)
                    }
                }
            });
        });

        await page.goto("https://web.telegram.org/k/#@gumart_bot");
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
        await checkIframeAndClick(page);
        let isToken = await getAuthorization;

        // await waitForInput()
        // await sleep(5000)
        // await sleep(5000)
        fs.appendFileSync(pathFile, `${isToken}\n`, 'utf-8');
        // browser.close();

        await reuse(isToken, proxy);
    } catch (error) {
        console.error("Error:", error.message);
        await waitForInput()
    }
};

let promiseTasks = [];
let pathFile = path.join(__dirname, 'data', 'token', 'gumart.txt');

// phan tu 26
(async (check = false) => {
    let data = fs.readFileSync(pathFile, 'utf8');
    const lines = data.split('\n').map(line => line.trim()).filter(line => line.length > 0);;
    let ok = false;
    for (let offset = 0; offset < distance; offset++) {
        for (let i = offset; i < totalElements; i += distance) {
            if (i == 4) continue
            if (i == 26) {
                ok = true;
            }
            if (ok) {
                let proxy = (i > 9) ? proxies[i] : null;
                proxy = proxies[i] == 'null' ? null : proxies[i];
                printFormattedTitle(`account ${i} - Profile ${i + 100} - proxy ${proxy}`, "red");

                if (check) await MainBrowser(proxy, i, lines[i]);
                else await MainBrowser(proxy, i);
                await sleep(1000);
            }
        }
    }
    if (promiseTasks.length > 0) {
        await Promise.all(promiseTasks).then(() => {
            console.log('Tất cả các task đã hoàn thành');
        });
    }
    writeTimeToFile('thời gian nhận thưởng tiếp theo', '3-gumart.txt', 2).then(() => process.exit(1));
    process.exit(1)
})();
