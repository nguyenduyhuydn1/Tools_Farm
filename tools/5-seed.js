const fs = require("fs-extra");
const path = require("path");

const { runPuppeteer, proxies, totalElements, distance } = require('./utils/puppeteer.js')
const { sleep, formatTime, userAgent, waitForInput, printFormattedTitle, log, writeTimeToFile } = require('./utils/utils.js')
const { checkIframeAndClick } = require('./utils/selector.js')
const { fetchData } = require('./utils/axios.js')
// const proxies = require("./../data/proxy.js");



// =====================================================================
// =====================================================================
// =====================================================================
const headers = {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "priority": "u=1, i",
    "sec-ch-ua": "Mozilla/5.0 (Linux; U; Android 1.5; de-de; Galaxy Build/CUPCAKE) AppleWebKit/528.5  (KHTML, like Gecko) Version/3.1.2 Mobile Safari/525.20.1",
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": "\"Android\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "Referer": "https://cf.seeddao.org/",
    "Referrer-Policy": "strict-origin-when-cross-origin",
}

const fetchClaimFarm = async (auth, proxy) => {
    let data = await fetchData('https://elb.seeddao.org/api/v1/seed/claim', 'POST', { authKey: 'telegram-data', authValue: auth, headers, proxy });
    if (data) {
        printFormattedTitle(`Claim`)
        console.log(JSON.stringify(data));
        return data
    }
}

const fetchLoginBonuses = async (auth, proxy) => {
    let data = await fetchData('https://elb.seeddao.org/api/v1/login-bonuses', 'POST', { authKey: 'telegram-data', authValue: auth, headers, proxy });
    if (data) {
        printFormattedTitle(`check daily`)
        console.log(JSON.stringify(data));
        return data
    }
}

const fetchCatchWorms = async (auth, proxy) => {
    let data = await fetchData('https://elb.seeddao.org/api/v1/worms/catch', 'POST', { authKey: 'telegram-data', authValue: auth, headers, proxy });
    if (data) {
        printFormattedTitle(`Catch Worms`)
        console.log(JSON.stringify(data));
        return data
    }
}

const fetchInfoWorms = async (auth, proxy) => {
    let { data } = await fetchData('https://elb.seeddao.org/api/v1/worms/me-all', 'GET', { authKey: 'telegram-data', authValue: auth, headers, proxy });
    if (data) {
        printFormattedTitle(`all the worms we have`)
        console.log(`we have ${data.length} worm`);
        return data
    }
}

const fetchInfoLeader = async (auth, proxy) => {
    let { data } = await fetchData('https://elb.seeddao.org/api/v1/bird/is-leader', 'GET', { authKey: 'telegram-data', authValue: auth, headers, proxy });
    if (data) {
        printFormattedTitle(`Leader`)
        console.log(JSON.stringify(data));
        return data
    }
    return false;
}

// claim do sau khi san ngoc
// check thong tin leader da di san hay chua roi hay dung ham nay
// "hunt_end_at": "2024-10-12T02:06:27.987217Z",,"status": "hunting" thi dung ham nay
const fetchCompleteHunting = async (auth, id, proxy) => {
    let data = await fetchData('https://elb.seeddao.org/api/v1/bird-hunt/complete', 'POST', { authKey: 'telegram-data', authValue: auth, headers, body: { bird_id: id }, proxy });
    if (data) {
        printFormattedTitle(`Hunting complete`)
        console.log(`hunting complete`);
        return data.data
    }
    return false;
}

// cho chim an
// check thong tin leader da di san hay chua roi hay dung ham nay
// "hunt_end_at": "2024-10-12T02:06:27.987217Z",,"status": "hunting" thi dung ham nay
const fetchBirthFeed = async (auth, info, proxy) => {
    let addHeader = {
        "accept": "application/json, text/plain, */*",
        "content-type": "application/json",
    }
    if (info) {
        let { bird_id, worm_ids } = info;
        let { data = null } = await fetchData('https://elb.seeddao.org/api/v1/bird-feed', 'POST', { authKey: 'telegram-data', authValue: auth, headers: { ...headers, ...addHeader }, body: { bird_id, worm_ids }, proxy });
        if (data) {
            printFormattedTitle(`Birth Feed`)
            return data
        }
    }
}

// lam chim thoai mai
const fetchHappyBrith = async (auth, bird_id, proxy) => {
    let addHeader = {
        "accept": "application/json, text/plain, */*",
        "content-type": "application/json",
    }
    let { data } = await fetchData('https://elb.seeddao.org/api/v1/bird-happiness', 'POST', { authKey: 'telegram-data', authValue: auth, headers: { ...headers, ...addHeader }, body: { bird_id, happiness_rate: 10000 }, proxy });
    if (data) {
        printFormattedTitle(`Happy Birth`)
        console.log(`happiness_level : ${data.happiness_level}`);
        return data
    }
}

const fetchBirthStartHunting = async (auth, bird_id, proxy) => {
    let addHeader = {
        "accept": "application/json, text/plain, */*",
        "content-type": "application/json",
    }

    let { data } = await fetchData('https://elb.seeddao.org/api/v1/bird-hunt/start', 'POST', { authKey: 'telegram-data', authValue: auth, headers: { ...headers, ...addHeader }, body: { bird_id, task_level: 0 }, proxy });
    if (data) {
        printFormattedTitle(`Birth start hunting`)
        console.log(`start hunting and end ${formatTime(data.hunt_end_at)}`);
        return data;
    }
    return false;
}


const fetchMissions = async (auth, proxy) => {
    let { data } = await fetchData('https://elb.seeddao.org/api/v1/tasks/progresses', 'GET', { authKey: 'telegram-data', authValue: auth, headers, proxy });
    if (data) {
        printFormattedTitle(`Missions`)
        data = data.filter(v => v.task_user?.completed == false || v.task_user == null);
        data.forEach(e => {
            console.log(e.name);
        });
        return data
    }
    return false;
}

const fetchClaimTask = async (auth, idTask, proxy) => {
    let data = await fetchData(`https://elb.seeddao.org/api/v1/tasks/${idTask}`, 'POST', { authKey: 'telegram-data', authValue: auth, headers, proxy });
    if (data) {
        console.log(JSON.stringify(data));
        return data
    }
}

// =====================================================================
// =====================================================================
// =====================================================================

const MainBrowser = async (proxy, countFolder, existToken = null) => {
    try {
        const reuse = async (reuseToken, reuseProxy) => {
            await fetchClaimFarm(reuseToken, reuseProxy)
            await fetchCatchWorms(reuseToken, reuseProxy)
            await fetchLoginBonuses(reuseToken, reuseProxy)
            let worms = await fetchInfoWorms(reuseToken, reuseProxy)
            let infoLeader = await fetchInfoLeader(reuseToken, reuseProxy)

            if (infoLeader) {
                let { id, status, hunt_end_at } = infoLeader;
                let check_hunt_end = Date.now() > Date.now(hunt_end_at);
                let worm_ids = worms.splice(0, 1).map(v => { if (v?.id) { return v.id } })

                if (status == 'hunting' && check_hunt_end) {
                    let checkHunting = await fetchCompleteHunting(reuseToken, id, reuseProxy);
                    await sleep(2000);
                    if (checkHunting) {
                        if (worms.length > 0) {
                            await fetchBirthFeed(reuseToken, { bird_id: id, worm_ids }, reuseProxy);
                            await sleep(2000);
                        }
                        await fetchHappyBrith(reuseToken, id, reuseProxy);
                        await sleep(2000);
                        await fetchBirthStartHunting(reuseToken, id, reuseProxy);
                        await sleep(2000);
                    }
                }
                if (status == 'in-inventory') {
                    if (worms.length > 0) {
                        await fetchBirthFeed(reuseToken, { bird_id: id, worm_ids }, reuseProxy);
                        await sleep(2000);
                    }
                    await fetchHappyBrith(reuseToken, id, reuseProxy);
                    await sleep(2000);
                    await fetchBirthStartHunting(reuseToken, id, reuseProxy);
                    await sleep(2000);
                }
            }

            // let tasks = await fetchMissions(reuseToken, reuseProxy);
            // printFormattedTitle(`Claim`, "yellow")
            // for (let x of tasks) {
            //     for (let i = 0; i <= x.repeats; i++) {
            //         await fetchClaimTask(reuseToken, x.id, reuseProxy);
            //         await sleep(1000);
            //     }
            // }
        }

        if (existToken != null && existToken.length > 2) {
            await reuse(existToken, proxy);
            return;
        }

        const browser = await runPuppeteer({
            userDataDir: `C:\\Users\\Huy\\AppData\\Local\\Google\\Chrome\\User Data\\Profile ${countFolder + 100}`,
            proxy,
        });
        const [page] = await browser.pages();
        if (proxy != null) {
            const page2 = await browser.newPage();
            await page2.goto("https://google.com");
            await sleep(3000);
            await page.bringToFront();
        }

        await page.goto("https://web.telegram.org/k/#@seed_coin_bot");
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
        const [src, isToken] = await checkIframeAndClick(page);

        // await waitForInput()
        fs.appendFileSync(pathFile, `${isToken}\n`, 'utf-8');
        browser.close()

        await reuse(isToken, proxy);
    } catch (error) {
        console.error("Error:", error.message);
        await waitForInput()
    }
};


let pathFile = path.join(__dirname, 'data', 'token', 'seed.txt');

// token het han rat nhanh
(async (check = false) => {
    let data = fs.readFileSync(pathFile, 'utf8');
    const lines = data.split('\n').map(line => line.trim()).filter(line => line.length > 0);;

    for (let offset = 0; offset < distance; offset++) {
        for (let i = offset; i < totalElements; i += distance) {
            let proxy = (i > 9) ? proxies[i] : null;
            proxy = proxies[i] == 'null' ? null : proxies[i];
            printFormattedTitle(`account ${i} - Profile ${i + 100} - proxy ${proxy}`, "red");

            if (check) await MainBrowser(proxy, i, lines[i]);
            else await MainBrowser(proxy, i);
            await sleep(1000);
        }
    }
    writeTimeToFile('thời gian nhận thưởng tiếp theo', '5-seed.txt', 4).then(() => process.exit(1));
    process.exit(1)
})();
