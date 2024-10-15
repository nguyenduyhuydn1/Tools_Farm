const { fetchData } = require('../utils/axios.js');
const { sleep, log } = require('../utils/utils');

const headers = {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "cache-control": "max-age=0",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "Referer": "https://timefarm.app/",
    "Referrer-Policy": "strict-origin-when-cross-origin"
};
let arr = [7712064825, 7417294726, 6025437423, 8148954049, 7057910081, 7562053994, 8026505897, 7324083771, 6509993479, 7743327554, 7957297517, 7831692590, 7905660385, 8113573974, 7695534109, 8075831036, 7048968680, 7608016511, 8068947743, 7553590749, 7090046306, 7867302795, 7605473717, 8029426321, 7765365077, 7686040975, 7678989712, 8011163142, 7749309191, 7829552738, 7464331054, 7662704058, 7819951856, 7672900438, 7992530894, 7448120315, 7768523312];

(async () => {
    for (let x of arr) {
        let data = await fetchData(`https://api.adsgram.ai/adv?blockId=2994&tg_id=${x}&tg_platform=web&platform=Win32&language=en`, 'get', { headers });
        if (data) {
            printFormattedTitle(`tài khoản ${x}`)
            await fetchData(data.banner.trackings[0].value, 'get', { headers });
            log(`xong nv 1`)
            await fetchData(data.banner.trackings[1].value, 'get', { headers });
            log(`xong nv 2`)
            await sleep(5000)
            await sleep(5000)
            await sleep(5000)
            await sleep(5000)
            await sleep(5000)
            await sleep(5000)
            await fetchData(data.banner.trackings[3].value, 'get', { headers });
        }

        setInterval(async () => {
            let data = await fetchData(`https://api.adsgram.ai/adv?blockId=2994&tg_id=${x}&tg_platform=web&platform=Win32&language=en`, 'get', { headers });
            if (data) {
                printFormattedTitle(`tài khoản ${x}`)
                await fetchData(data.banner.trackings[0].value, 'get', { headers });
                log(`xong nv 1`)
                await fetchData(data.banner.trackings[1].value, 'get', { headers });
                log(`xong nv 2`)
                await sleep(5000)
                await sleep(5000)
                await sleep(5000)
                await sleep(5000)
                await sleep(5000)
                await sleep(5000)
                await fetchData(data.banner.trackings[3].value, 'get', { headers });
            }
        }, 6 * 60 * 1000);
    }
})()
