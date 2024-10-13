const fs = require("fs-extra");

let a = {
    "xt_instance": "{\"id\":56601720,\"idle\":true,\"time\":1728784013195}",
    "dc3_auth_key": "\"2285bfae9fa8a0b21444b39b5b32fcd4058b908c9733273910a9d89ba3fcb93d81025db16ea3a708445631c8f43677e91ed8030aefe560579b52d19b0d64115fde7c72948dd630cd4503df2c3deca6b27c1631d80fe333658235d41d8c72eef68708da42f651f93f64f1e534ac72a0dc2b834ead4390419e1bb047469fce7f15ac81bc8b6929f7e9cbb63273fa9a5e4530986972e66ac9aa0cd592bba771cc6ae7fb73994d792fb1d4632ed87a38fd28d8287eaa66d0f5d3c2bdd1b7ee2e8e88e7dc2c2a2ddb213518dd6a3e00521faa432df75c4bdbac60cec6e0f07c40fdc84770e00bd3960837873b7d3083101fe3e25be5c6bf6c76966e59a0bf14f82359\"",
    "dc2_auth_key": "\"8f4c7775cc7a40ce94c4e72d594c5ad6c2d08eaad4849ab6f6774e0d3adaa65c2d0fcb3d9ee3e8c5f10170b1151d3b4d5a8a4a435091740c2d5cafd9d1df4ec4e3672253621f3585ea5b6272cf50348f94921f92a77b107ddd6f02dde6420c8ccf7a7accc5b867417a58d50f557be5939579dd7a28f48ff24426f0e59d51ce4fbdda09f265f2271224cc9f39ee2ae018ddec922c16104abc66d0053d40e8afa0c814577e6cba16820632044d2365b35167e37912af490d28659322e1e76b3d833a1951150bb99386c1ec661c91b3b4225f6550830d8cbfa1030376e5ff6366eda37a60be46d6ea2c5281004fa6e7fbfe7fd38f6c5a58414507e6aa93f3213d82\"",
    "state_id": "1602474670",
    "dc5_server_salt": "\"839ebaaebcddae92\"",
    "tgme_sync": "{\"canRedirect\":true,\"ts\":1728727807}",
    "dc": "1",
    "user_auth": "{\"dcID\":1,\"date\":1728783928,\"id\":7553590749}",
    "dc5_auth_key": "\"bb49e8ec0ec0d75e0c296a5314929e096d932eb6bb261596c741ba2157c727747632ed305c3e99a456b205ae382611776ca571771c15f268ef7da2800fab0447b58db1eefa7c3b0e148dfa99d24f9abc10910efb304c6c8c6841318e4e703c10b8cc630761e0600adc79226208174cd8a8a7b2dac6f34cadaf0f505315cc8ee45191d83ab5bf6a831e3c61f1cd5f6b3df46d512b9da0d3ea81024f8ed87e8045541409cc44e67ef6b21938afa55bb4e4bb590cfce3d389e139a275135400d90b10227d1be90a5f0a06e0b5111c92cefd35cd3dff2a42efa799fbcbc9636dad7aaac12d069af0e81a2a03ad2409b7e344518d54b902686fa4f9a0ad0fbd19747f\"",
    "dc1_auth_key": "\"beec332e74cefa4976f67f1c87819c930e4550360a87fa97fd55af4bec0fe85a6614ce729b91c162d0f8e143f271839ad2350c81f9c1c7614b3599cefaff8852c41b500266db8673aa93945ef5b6ed7b43c50a044cd1f3fe7b0e1d9faaa498195bb4162e1e267dddb9969fa031c05629386537605864c8126b8595953aa0ba20ae1fb9422f986c1b296e9b15064254560aaf5aa717f05fb0dfc03fd715121096a42d0de078c914e957ee415e10307b5baf591dca52e0b556ab8486a545f4221baf167c7fe546f8ab8f4373a9baaf9f68ea45c05fa7d8398e2ccdf50e3b395d82388423ecf804113fb5f5c3ee0dabdd03bcda4d248108a82e460e86f6d1464b33\"",
    "k_build": "525",
    "dc3_server_salt": "\"76ca35a897397e00\"",
    "dc2_server_salt": "\"8542e934d03b3449\"",
    "dc4_auth_key": "\"7cf19fbe9071135db2a5767250608c5e5ade89f25f28074f5afaeef2f6c145477393a2c311c48451221c30fff5ac21466ae250b319a2fba1c9ea72486969b84fbe0d78f7bae1b43a9e90bc40a780fc2d09ccbcea6d8e1708f7698a4efd1484a4d8afc3562a70aa0cf84971fe9a3c4f919841d09b5d976a7b3b76e08f7d4ead50a82e30ea278e0f09b61e1aa2fde6e8272933b2652ab40529acf851e1f301191527cfd235373fc18eeba7a7543d8a56a3cb2f2ad1f971a6a1792fcbf93c51136ab6c9a6b16a2068c7343e7a8dc4dc8f5f5018f052914fd7a9969d0e13e1045d14ab133f00a15ea08e2b9eedb1e1d69539a79f7120362ace1d3b68a6a85d00ba24\"",
    "dc4_server_salt": "\"51728c664f35845b\"",
    "dc1_server_salt": "\"e5441bc23506c9a0\"",
    "auth_key_fingerprint": "\"8f4c7775\"",
    "server_time_offset": "-16"
}
for (const [key, value] of Object.entries(a)) {
    localStorage.setItem(key, value);
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
