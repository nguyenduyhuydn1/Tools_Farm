const { fetchData } = require('../utils/axios.js');
const { sleep } = require('../utils/utils');
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

(async () => {
    let data = await fetchData('https://api.adsgram.ai/adv?blockId=2994&tg_id=7743327554&tg_platform=web&platform=Win32&language=en', 'get', { headers });
    if (data) {
        await fetchData(data.banner.trackings[0].value, 'get', { headers });
        console.log(1);

        await fetchData(data.banner.trackings[1].value, 'get', { headers });
        console.log(2);
        await sleep(5000)
        await sleep(5000)
        await sleep(5000)
        await sleep(5000)
        await sleep(5000)
        await sleep(5000)
        console.log(3);
        await fetchData(data.banner.trackings[3].value, 'get', { headers });
    }
    console.log("xxxxxxxx");

    setInterval(async () => {
        let data = await fetchData('https://api.adsgram.ai/adv?blockId=2994&tg_id=7743327554&tg_platform=web&platform=Win32&language=en', 'get', { headers });
        if (data) {
            await fetchData(data.banner.trackings[0].value, 'get', { headers });
            console.log(1);

            await fetchData(data.banner.trackings[1].value, 'get', { headers });
            console.log(2);
            await sleep(5000)
            await sleep(5000)
            await sleep(5000)
            await sleep(5000)
            await sleep(5000)
            await sleep(5000)
            console.log(3);
            await fetchData(data.banner.trackings[3].value, 'get', { headers });
        }
    }, 6 * 60 * 1000);
})()
