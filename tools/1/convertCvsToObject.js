const fs = require("fs-extra");

let a = {}

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
