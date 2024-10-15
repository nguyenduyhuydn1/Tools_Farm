const { fetchData } = require('../utils/axios.js');
const { sleep, log } = require('../utils/utils');

// const headers = {
//     "accept": "application/json, text/plain, */*",
//     "accept-encoding": "gzip, deflate, br, zstd",
//     "accept-language": "en-US,en;q=0.9,vi;q=0.8",
//     "priority": "u=1, i",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-site",
//     "access-control-request-method": "GET",
//     "access-control-request-headers": "csrf-token,telegramauth",
//     "origin": "https://birdx.birds.dog",
//     "Referer": "https://birdx.birds.dog/",
//     "Referrer-Policy": "strict-origin-when-cross-origin",
//     'user-agent': "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1"
// };

let options = {
    "accept": "*/*",
    "accept-encoding": "gzip, deflate, br, zstd",
    "accept-language": "en-US,en;q=0.9,vi;q=0.8",
    "access-control-request-headers": "csrf-token,telegramauth",
    "access-control-request-method": "GET",
    "origin": "https://birdx.birds.dog",
    "priority": "u=1, i",
    "referer": "https://birdx.birds.dog/",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1"
};
(async () => {
    let aaa = {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9,vi;q=0.8",
        "accept-encoding": "gzip, deflate, br, zstd",
        "priority": "u=1, i",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "csrf-token": "",
        "origin": "https://birdx.birds.dog",
        "csrf-token": "",
        "telegramauth": "tma query_id=AAE5xaxLAwAAADnFrEtC68EI&user=%7B%22id%22%3A7712064825%2C%22first_name%22%3A%22Hoangdnvn3%20%F0%9F%9B%92%F0%9F%8C%B1SEED%22%2C%22last_name%22%3A%22Nguyen%F0%9F%90%A6%20SUI%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1728960194&hash=e8700a83f04cd892374582b3050e769700a918cba362d5c8f213fbe8aa3ff1c5",
        "Referer": "https://birdx.birds.dog/",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1"
    }
    let a = await fetchData('https://api.birds.dog/minigame/egg/play', 'OPTIONS', { headers: options })
    let b = await fetchData('https://api.birds.dog/minigame/egg/play', 'GET', { headers: aaa })
    let c = await fetchData('https://api.birds.dog/minigame/egg/join', 'OPTIONS', { headers: aaa })
    let d = await fetchData('https://api.birds.dog/minigame/egg/turn', 'OPTIONS', { headers: aaa })
    let e = await fetchData('https://api.birds.dog/minigame/egg/join', 'GET', { headers: aaa })
    let f = await fetchData('https://api.birds.dog/minigame/egg/turn', 'GET', { headers: aaa })
    console.log(data);
})()

