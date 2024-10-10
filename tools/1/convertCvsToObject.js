const fs = require("fs-extra");

let a = {
    "xt_instance": "{\"id\":66461575,\"idle\":true,\"time\":1728572014923}",
    "tgme_sync": "{\"canRedirect\":true,\"ts\":1728571964}",
    "dc5_server_salt": "\"7bc4b272b97fb6af\"",
    "dc2_auth_key": "\"1b3f981730e98426e6a90fdad1adaa35f7e3bb9a91f829ebd2ce86d6ef393ae31a0b986920ed5849b1867bcfea12e2ad1b1f002e74aa8ed36136d7e57bdedf489eb11b2cf68bd09eefd4611d973270c5bcd4ed473c16615c0805d2501f56353d1d093df8255ca23a0f87fff7dd69bb9455baf18c9f796e43b3d5dbf398bdb91efee3409e14057cf8692fdf5e6fc6e94997639dcbb52e9b7c1eca90ac21930168fe97d760d4ee4f0b088c35e591f5f36f0b0a5f7bd60515af16af37a4603c81696c1adfc394b9c42af35f57a901edb8d26414a38269b793359558cb09de3017639daed9e550897a09370f5121cc743611a365200fc6eafd90d8243c1d8e4dc0e4\"",
    "dc": "5",
    "user_auth": "{\"dcID\":5,\"date\":1728571930,\"id\":7743327554}",
    "dc5_auth_key": "\"81a3d9616f1e38b86246c1a20b499174c0df80bb428ce766b70573738f7cf428d6c94496ed075d32274d18dc0372aa05cd72ba933a53cf4742060535f0cb866aeae1735f2219b3f044efbb7b22e6aff557ddfb4e493f54dd1672f8a784e3d312e677dee10e8feb97aa9a309a997d5c16c87fbeefdb0610c2d731c743597c07128a09acfeebf0ab2b741e57668eef0031929dd94df0f0b29d757c48d3c709d2a13c4844504d3b227281ab4c7ba71457ddf0f06a08cf99767a21828d555b18cc1278d04c5b19732508882cf405d9be55a48cea3c4dceb19320d348ff5fb724e421675886ae9413962bdacfe0e7c2b975adbd4b47d5fb424603d40a550fcfe95568\"",
    "state_id": "2005458999",
    "k_build": "525",
    "dc1_auth_key": "\"b481fc5f70335cd9aac656dc76a47e1ac8fc5591720a7505c7e7ed7af315a8d384e3c3af79e6cf9fba0e4e2b52a95bc36bef19f01904fdc60660ed4d10f5984b907feb30f3783842fd3a17f2ad40c5173beb49dfa7662dbd753d0f9d1d738e9dd267636b5587d38cf09085489a31b76bed1c6fdbdfdddafb0fe017f98fa46aac3bbbdfe921e62590ef226798e93c6f8f74a9f9a6fbf9e29399d4e84ead4f67b1904b2fd627b4d6d84006a323fb4df9bab0bb7ac4235993c6248f49673d70ea4a89828fdb988f8206d09c5ec49811951c5745d3f8643b892be2d21b71303928c4d4f6f9107b9d44dadd5cc9f98830c9afc1c7626fe436c7f371aa45b5c84fd3a4\"",
    "dc2_server_salt": "\"0ba39887a6a60d0b\"",
    "dc1_server_salt": "\"51589cf9a4169445\"",
    "auth_key_fingerprint": "\"1b3f9817\"",
    "server_time_offset": "-1"
}

const writeDataToLocalStorage = (data) => {
    let txtContent = '';
    for (let key in data) {
        txtContent += `${key}: ${data[key]}\t`;
    }
    txtContent += '\n';

    fs.appendFileSync('localStorage.txt', txtContent, 'utf-8');
}


const readLinesToArray = () => {
    const lines = fs.readFileSync('localStorage.txt', 'utf-8').trim().split('\n');
    const array = [];

    lines.forEach(line => {
        const obj = {};
        const keyValuePairs = line.split('\t');
        keyValuePairs.forEach(pair => {
            if (pair) {
                const [key, value] = pair.split(': ');
                try {
                    obj[key] = value; // Attempt to parse JSON
                } catch (e) {
                    console.log(value);
                    obj[key] = value; // If parsing fails, treat as string
                }
            }
        });
        array.push(obj);
    });

    return array;
}


// writeDataToLocalStorage(a);

const dataArray = readLinesToArray();
console.log(dataArray);








// let localStorageContent = {};
// for (let i = 0; i < localStorage.length; i++) {
//     const key = localStorage.key(i);
//     localStorageContent[key] = localStorage.getItem(key);
// }
// console.log(localStorageContent);
