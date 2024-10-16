const { runPuppeteer } = require('./utils/puppeteer.js')
const { sleep, formatTime, userAgent, waitForInput, printFormattedTitle, log, writeTimeToFile } = require('./utils/utils.js')
const { checkIframeAndClick } = require('./utils/selector.js')
const { fetchData } = require('./utils/axios.js')
const proxyFile = require("./data/proxy.js");


(async () => {
    let now = Date.now()
    const startTime = new Date(now);
    const endTime = new Date(startTime.getTime() + 1005);
    let client_upload_time = endTime.toISOString()

    // khả năng cao la thằng events chạy sau khi chạy các hàm gửi sự kiện

    // let tem = await fetch("https://coub-gtw.coub.com/personalize/protected/api/v1/events", {
    //     headers: {
    //         "accept": "application/json, text/javascript, */*; q=0.01",
    //         "accept-language": "en-US,en;q=0.9",
    //         "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjdjMjFkYjBiNTUxMWY4MjI0NzhkOTkwYmQxMDU3MTNhZDAzMGM1YzUifQ.eyJleHAiOjE3MjkxNzU2NDYsImlzcyI6ImNvdWIiLCJhdWQiOiJwZXJzb25hbGl6ZSIsInN1YiI6IjI1NDkyODc5In0.b0fl0rEqWycStqdo7ppQ8mpn9am18KhUu0qO76gfsWyAEDIGYh7yN5Ty_DzdChGV4VlEZDGlAeIkK9ZaSz-yP8V0KhuE4dKfQ7cQVgkXpD6fIxdBXTbb4y8wdIesuXz-Eqp8UALIysWrlyeK0EPSosK3P7HDh5jFQffDAVM70K8gxrXQfjgEHogh6r5akErLd-Wk239ncMllUpMtKq_3-60ie8Zj4AIj8sPWPY8Xu3MbRnU8TsR1ILhRv7CFHFXOU1bf8Le5yCJ_hEGe7aBO4jIxRviSSp-0YFKnIa6SqTwYXYU9GL7OJS-F0bzwknZ4xomt7yethwE9_U_sYBz6QQ",
    //         "content-type": "application/json",
    //         "priority": "u=1, i",
    //         "sec-fetch-dest": "empty",
    //         "sec-fetch-mode": "cors",
    //         "sec-fetch-site": "same-site",
    //         "Referer": "https://coub.com/",
    //         "Referrer-Policy": "strict-origin-when-cross-origin"
    //     },
    //     body: "{\"itemId\":\"205842914\",\"eventValue\":0,\"ownerId\":\"11085325\",\"coubDuration\":7.4,\"watchDuration\":1.841995,\"remixSources\":[\"25459176\",\"42581828\",\"44267936\"],\"channelId\":\"14046962\",\"communityId\":\"113\",\"eventType\":\"UNWATCH\",\"sessionId\":\"643409c7481a2c916d5b6280e943813b\",\"timestamp\":1729094283,\"sceneName\":\"rising\",\"platform\":\"tg_miniapp\",\"osType\":\"iOS (iPhone)\",\"osVersion\":\"17.5\",\"deviceModel\":\"iPhone\",\"trafficSource\":\"self\",\"country\":\"vn\"}",
    //     method: "POST"
    // });

    let res = await fetch("https://analytics.coub.com//api/event", {
        headers: {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "text/plain",
            "priority": "u=1, i",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "Referer": "https://coub.com/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        body: "{\"n\":\"coub_view\",\"u\":\"https://coub.com/tg-app/feed/rising\",\"d\":\"coub.com/tg-app\",\"r\":null,\"w\":393,\"h\":0,\"p\":\"{\\\"username\\\":\\\"undefined\\\",\\\"userId\\\":7712064825,\\\"language\\\":\\\"en-US\\\",\\\"tg_is_premium\\\":false,\\\"coub_id\\\":\\\"208412680\\\"}\"}",
        method: "POST"
    });
    const text = await res.text();
    console.log("Response Text:", text);

    let res2 = await fetch("https://api2.amplitude.com/2/httpapi", {
        headers: {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/json",
            "priority": "u=1, i",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "Referer": "https://coub.com/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        body: `{\"api_key\":\"7f6e3c8da0aaa194951e26ad48013378\",\"events\":[{\"user_id\":\"7712064825\",\"device_id\":\"75522b25-1203-4ece-850a-bad3eaf60e7d\",\"session_id\":1729088868563,\"time\":${now},\"platform\":\"Web\",\"language\":\"en-US\",\"ip\":\"$remote\",\"insert_id\":\"2dd2008e-cd60-4aa5-b583-cfc01a95edd3\",\"event_type\":\"coub_view\",\"event_properties\":{\"coub_id\":\"208412680\"},\"event_id\":109,\"library\":\"amplitude-ts/2.10.0\",\"user_agent\":\"Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1\"}],\"options\":{},\"client_upload_time\":\"${client_upload_time}\",\"request_metadata\":{\"sdk\":{\"metrics\":{\"histogram\":{}}}}}`,
        method: "POST"
    });
    const x = await res2.json();
    console.log(x);


})()








// $now = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()

// $startTime = Get-Date $now -UFormat %s
// $endTime = (Get-Date).AddMilliseconds(1005)
// $client_upload_time = $endTime.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
// $now
// $client_upload_time



// $session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
// $session.UserAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1"
// Invoke-WebRequest -UseBasicParsing -Uri "https://analytics.coub.com//api/event" `
// -Method "POST" `
// -WebSession $session `
// -Headers @{
// "authority"="analytics.coub.com"
//   "method"="POST"
//   "path"="//api/event"
//   "scheme"="https"
//   "accept"="*/*"
//   "accept-encoding"="gzip, deflate, br, zstd"
//   "accept-language"="en-US,en;q=0.9"
//   "origin"="https://coub.com"
//   "priority"="u=1, i"
//   "referer"="https://coub.com/"
//   "sec-fetch-dest"="empty"
//   "sec-fetch-mode"="cors"
//   "sec-fetch-site"="same-site"
// } `
// -ContentType "text/plain" `
// -Body "{`"n`":`"coub_view`",`"u`":`"https://coub.com/tg-app/feed/rising`",`"d`":`"coub.com/tg-app`",`"r`":null,`"w`":393,`"h`":0,`"p`":`"{\`"username\`":\`"undefined\`",\`"userId\`":7712064825,\`"language\`":\`"en-US\`",\`"tg_is_premium\`":false,\`"coub_id\`":\`"208419557\`"}`"}"



// $session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
// $session.UserAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1"
// Invoke-WebRequest -UseBasicParsing -Uri "https://api2.amplitude.com/2/httpapi" `
// -Method "POST" `
// -WebSession $session `
// -Headers @{
// "authority"="api2.amplitude.com"
//   "method"="POST"
//   "path"="/2/httpapi"
//   "scheme"="https"
//   "accept"="*/*"
//   "accept-encoding"="gzip, deflate, br, zstd"
//   "accept-language"="en-US,en;q=0.9"
//   "origin"="https://coub.com"
//   "priority"="u=1, i"
//   "referer"="https://coub.com/"
//   "sec-fetch-dest"="empty"
//   "sec-fetch-mode"="cors"
//   "sec-fetch-site"="cross-site"
// } `
// -ContentType "application/json" `
// -Body "{`"api_key`":`"7f6e3c8da0aaa194951e26ad48013378`",`"events`":[{`"user_id`":`"7712064825`",`"device_id`":`"75522b25-1203-4ece-850a-bad3eaf60e7d`",`"session_id`":1729088868563,`"time`":$now,`"platform`":`"Web`",`"language`":`"en-US`",`"ip`":`"`$remote`",`"insert_id`":`"aa3f03be-e5f2-41f7-a11a-2c92120cf8f8`",`"event_type`":`"coub_view`",`"event_properties`":{`"coub_id`":`"208419557`"},`"event_id`":90,`"library`":`"amplitude-ts/2.10.0`",`"user_agent`":`"Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1`"}],`"options`":{},`"client_upload_time`":`"$client_upload_time`",`"request_metadata`":{`"sdk`":{`"metrics`":{`"histogram`":{}}}}}"





















