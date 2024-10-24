const arr = ["104.239.105.43", "198.37.98.248", "136.0.88.38", "161.123.115.77", "162.218.208.125", "154.73.249.21", "38.154.227.58", "38.154.204.46", "104.238.37.9"]; // Mảng IP cần kiểm tra

// Hàm async để gọi API cho từng trang
async function fetchProxies(page) {
    const url = `https://proxylist.geonode.com/api/proxy-list?limit=500&page=${page}&sort_by=lastChecked&sort_type=desc`;
    const response = await fetch(url);
    const data = await response.json();
    return data.data;
}

// Hàm để lặp qua tất cả các trang và kiểm tra IP
async function checkIPs() {
    try {
        let allProxies = [];

        // Lặp qua 14 trang để lấy toàn bộ proxy
        for (let page = 0; page < 14; page++) {
            const proxies = await fetchProxies(page);
            allProxies = allProxies.concat(proxies); // Ghép proxy từ mỗi trang
        }

        const proxyIPs = allProxies.map(proxy => proxy.ip); // Trích xuất IP từ toàn bộ proxy

        // Kiểm tra từng IP trong mảng arr
        arr.forEach(ip => {
            if (proxyIPs.includes(ip)) {
                console.log(`IP ${ip} có tồn tại trong danh sách proxy.`);
            } else {
                console.log(`IP ${ip} không tồn tại trong danh sách proxy.`);
            }
        });
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

// Gọi hàm kiểm tra IP
checkIPs();
