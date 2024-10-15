const fs = require("fs-extra");

let a = {
    "kz_version": "\"K\"",
    "xt_instance": "{\"id\":28702807,\"idle\":true,\"time\":1728983418958}",
    "dc3_auth_key": "\"94a34ebf488dab225258694ef37472ef0119741d38465a9894ba6d65bbdcad385cf42efaf5d101af66a09d69a06b56f41b21b1c3a01e74bbe14a270664cd990335b77e6c9874f65f3a08b1d24bc85133881c3f773ca56e69d7837a1a3b2f07809b0c505e9ed40646d228891380396e0bf9f40ec6be2a129842ccafa2d2a5a45c5b8388a91680f948db86d944bc60c6553f99427476e642d2ec04ce3eeb897dcb48e0d6edb4dba11022c5ead23baf5693ad0e219650c6cc4406b966afa8a28a6bd0b4072ce00dfbc9a14f46c9c5770bafece18de5a864b02556099a2b65cc6d2459e0dbec0993651628436952b1b8bf1c96cb175bc34c6363b788d7cfbded5de4\"",
    "dc2_auth_key": "\"5d2bf266b160c9b16e2190909d5631959e84d044e6750004ab711239a1d0d0e251db960fe9b4905bf07c21173a9d87663b85f839608795ed75b94008271c929c30838e89a8bf3d4f27761f4051e6cd153156a5ffb9fa821f0b47d6d580fbc7fc725ade33c368db0b5a816b9091a71045038de40cfcbcaac87ed819b48e45d922e60ae5db79541b13171b8933c26c9315dc6d0d2fd6edc88263b5d743e016e3eb74654a070a05e56692e4324050cfa9ddb87c6d2d338877fb86dc665d8d18a33124e95efdbf4a892e15682e04761f8999b132c75b8c5112396c9d1e051a61acc61ae2f2152f36031049db8fe5c067271f368befbdc0b54c161e05b85f2a87f37c\"",
    "state_id": "2414516630",
    "dc5_server_salt": "\"5f53bc26d8b7de5e\"",
    "tgme_sync": "{\"canRedirect\":true,\"ts\":1728980931}",
    "dc": "5",
    "user_auth": "{\"dcID\":5,\"date\":1728983394,\"id\":7712064825}",
    "dc5_auth_key": "\"1aa8ef343111c3dfdc44a64465b53737c54b03610d41e7485f50230d8251c56d7689455e4287b70a7814ffea9919e95d01c28b87dd0bb4deb553aa0fbcf4f2d1301c8b55ef6b014cc4d03152fcca98f92dd38ac22dd1af5855beeea91e9d8a52608b2a5cb3e747e4d5f23f9a9bc2afeb95d33609f688c150b4a2420430b840072d874c2da3b613347da06e37cc9e3aa7a07a48fc0d7d96331c1ebab751be8c9ee2edb6a5a9c833b8fa0a3ea9906ddd90e54cbd78ff75ec4a9aaf391c9eaff8133f35847499e4398e479b2dfe3ea44f10816efba0a560608db68636729e09ed36b12ec509bfedc5793394951731c2c96de0d23d109afa36d9697c92cb5cfe431f\"",
    "dc1_auth_key": "\"a4ba2b675e2684eafb6af2ba5662b3e0a8bf9c05e4a34a60669514819717bba69d54a0bb0150e6ebb9cf096a466e264bb3cb19eb8f67678b3d6d523009c8ce552d1eab31db92f5e9950d55366d4d0d257b4315466d16a18c98ca59e82db2cc4062bce72c69ab14e389e8a4b773b2823f11e62f8c3dbb41f275b151a937f39d11ffc69b3a3eb55d299b654a4c2b44dc17977ba0f5d27baa592d91f957a7461fc2ecec79690ad3a84c2a52d4969645babc34cb50b3c26679ba1f8577e900c3645cb901361ad7569c44d3f6d6cd4480422970325c15a9225cfbd4a118938efaf21c5e1a92013b80d0d96aefd845ed538430c872aedcd2937cd1902314718e9c65ea\"",
    "k_build": "525",
    "dc3_server_salt": "\"4b63734894c47336\"",
    "dc2_server_salt": "\"b70b73ac47646568\"",
    "dc4_auth_key": "\"77a220cc041b5cd035ceb1c7006a88c3dcfb7e6a9e590b03323e18ad8e0d673419c26cca0821c8d72763a10a03b4bc6b2ee8c56132ae5014e30f3c217f5f293335d4b6c9392fcb00260bf21ef6b452ed7fe9155c0479553e0ee1e13abe8285197b70cb9354d58d39970de11e7373e1d7d4e97f48517abb48dcffcaab5286d17bc565cc3f3aae62595b6315108666d2e086482a069afb89eb130580f724b6410265c1b9a74a6c6cdda35d014b62c8b88f1476a0a45f09d3ce85e120e36f875e3474659a871579ebe0c58bb6b39a914d5d56ba8fa929471317f74245b89f8f362f2a084e706926dca45d22fb52f00f7bda0fe9d8eff22e9df283d363ba16114635\"",
    "dc4_server_salt": "\"a92a8dc31101327c\"",
    "dc1_server_salt": "\"cb935da6e55e43bb\"",
    "auth_key_fingerprint": "\"5d2bf266\"",
    "server_time_offset": "-7"
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
