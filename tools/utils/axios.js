const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');


async function fetchData(url, method, { authKey = null, authValue = null, headers = {}, body = null, proxy = null, timeout = 5000 } = {}) {
    try {
        const requestOptions = {
            method,
            timeout,
            headers: {
                ...headers,
            },
            proxy: false,
        };

        // Thêm authorization header nếu có authKey và authValue
        if (authKey && authValue) {
            requestOptions.headers[authKey] = decodeURIComponent(authValue);
        }

        // Thêm proxy nếu có
        if (proxy) {
            const { username, password, ip, port } = proxy;
            const agent = new HttpsProxyAgent(`http://${username}:${password}@${ip.substring(7)}:${port}`);
            requestOptions.httpsAgent = agent;
            requestOptions.httpAgent = agent;
        }

        if (["POST", "PUT"].includes(method.toUpperCase()) && body) {
            requestOptions.data = body;
        }

        const response = await axios(url, requestOptions);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error("Error Response:", error.response.data);
        } else if (error.request) {
            console.error("No Response from server:", error.request);
        } else {
            console.error("Request Error:", error.message);
        }
        return null;
    }
}


module.exports = {
    fetchData,
}