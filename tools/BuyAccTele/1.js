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
        for (let x of data.banner.trackings) {
            if (x.name == 'render') {
                await fetchData(x.value, 'get', { headers });
            }
            if (x.name == 'show') {
                await fetchData(x.value, 'get', { headers });
            }
            if (x.name == 'reward') {
                await sleep(15000)
                await fetchData(x.value, 'get', { headers });
            }
        }
    }
})()
