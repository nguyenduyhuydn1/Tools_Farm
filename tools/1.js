const randomUseragent = require('random-useragent');
const fs = require("fs-extra");

const { KnownDevices } = require('puppeteer');
(async () => {
    // console.log(randomUseragent.getAll().includes('galaxy'));
    fs.writeFileSync('1.txt', JSON.stringify(KnownDevices), 'utf-8')

    // await fetch("https://coub-gtw.coub.com/personalize/protected/api/v1/events", {
    //     headers: {
    //         "accept": "*/*",
    //         "accept-encoding": "gzip, deflate, br, zstd",
    //         "accept-language": "en-US,en;q=0.9,vi;q=0.8",
    //         "priority": "u=1, i",
    //         "access-control-request-headers": "authorization,content-type",
    //         "access-control-request-method": "POST",
    //         "sec-fetch-dest": "empty",
    //         "sec-fetch-mode": "cors",
    //         "sec-fetch-site": "same-site",
    //         "Referer": "https://coub.com/",
    //         "Referrer-Policy": "strict-origin-when-cross-origin"
    //     },
    //     body: null,
    //     method: "OPTIONS"
    // });


    // let num = Number(String(Date.now()).slice(0, -3));

    // await fetch("https://coub-gtw.coub.com/personalize/protected/api/v1/events", {
    //     "headers": {
    //         "accept": "application/json, text/javascript, */*; q=0.01",
    //         "accept-language": "en-US,en;q=0.9,vi;q=0.8",
    //         "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjdjMjFkYjBiNTUxMWY4MjI0NzhkOTkwYmQxMDU3MTNhZDAzMGM1YzUifQ.eyJleHAiOjE3MjkyNzEyODMsImlzcyI6ImNvdWIiLCJhdWQiOiJwZXJzb25hbGl6ZSIsInN1YiI6IjI1NDkyODc5In0.MLw3_qwef4RvY76fHzvvzcZwmCTC1IN-fxwNlvtlOXTlqFvPiIXH0KqvU63_hoH4AHofr-7k3IoYqiBpshVRGWHUWETUkItoByJqUGbIbbp1Lc15TME7-8bwe0kfh3ItVfF6nVcED1uIFYFEetI7dS61b7JnhU894kcDl5gwGY0CXutRV69qCtz8McObBY8qny0oR-tLzFWkUYL6VYDbdRq4fpFf4ZsZHh1eCB3BJPC_Yidv2g8EswMJ-_GUCB9SX3ZvikivRf_keTlrpbpMIJ77ug1-gZCtZNQvqeaH_7iyr9EacmG6OJrAHm0Fhbd4vnAZn4X4pqXqMU-lAFn6Vw",
    //         "content-type": "application/json",
    //         "priority": "u=1, i",
    //         "sec-fetch-dest": "empty",
    //         "sec-fetch-mode": "cors",
    //         "sec-fetch-site": "same-site",
    //         "Referer": "https://coub.com/",
    //         "Referrer-Policy": "strict-origin-when-cross-origin"
    //     },
    //     body: `{\"itemId\":\"210031255\",\"eventValue\":5,\"ownerId\":\"15045987\",\"coubDuration\":10.04,\"watchDuration\":60.199999999999996,\"remixSources\":[],\"channelId\":\"18055166\",\"communityId\":\"76\",\"eventType\":\"WATCH\",\"sessionId\":\"ca5802084613816312182679eebcfa9e\",\"timestamp\":${num},\"sceneName\":\"rising\",\"platform\":\"tg_miniapp\",\"osType\":\"iOS (iPhone)\",\"osVersion\":\"16.6\",\"deviceModel\":\"iPhone\",\"trafficSource\":\"self\",\"country\":\"vn\"}`,
    //     method: "POST"
    // });
})()