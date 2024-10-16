const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

window.addEventListener("DOMContentLoaded", async (event) => {
    let kucoin = setInterval(() => {
        if (window.location.href.includes('https://www.kucoin.com/miniapp/tap-game?bot_click=openminiapp')) {
            window.kucoin = true;
            clearInterval(kucoin)
        }
    }, 500);

    if (window.kucoin) {
        window.check = true;
        window.silent = true;

        let silent = document.querySelector(".iconSound--LlCOj");
        if (silent && window.silent) {
            setTimeout(() => {
                silent.click();
                window.silent = false;
            }, 3000);
        }

        setInterval(() => {
            let processElement = document.querySelector("#root .process--W73kB")
            const count = parseInt(processElement.textContent, 10);
            if (window.check) {
                document.querySelector(".frog--GPU1j").click();
                if (count < 10) window.check = false;
            } else {
                if (count > 2800) window.check = true;
            }
        }, 400);
    }
})

window.addEventListener("load", async (event) => {
    // setInterval(() => {
    // let localStorageContent = {};
    // for (let i = 0; i < localStorage.length; i++) {
    //     const key = localStorage.key(i);
    //     localStorageContent[key] = localStorage.getItem(key);
    // }
    // console.log(localStorageContent);

    //     window.getData = localStorageContent;
    // }, 2000);
});


setInterval(() => {
    try {
        if (window.location.href == "https://tg-app.memefi.club/earn" || window.location.href == "https://tg-app.memefi.club") {
            document.querySelector("html > body > div:nth-of-type(5) > div:nth-of-type(2) > .css-1dbsckc > button")?.click();
            document.querySelector(`#root > div.MuiBackdrop-root > div > button`)?.click();
            document.querySelector("body > div.MuiDrawer-root.MuiDrawer-modal.MuiModal-root > div.MuiPaper-root.MuiPaper-elevation.MuiPaper-elevation16.MuiDrawer-paper.MuiDrawer-paperAnchorBottom > div.css-1dbsckc > button")?.click()
            document.querySelector("body > div.MuiDrawer-root.MuiDrawer-modal.MuiModal-root > div.MuiPaper-root.MuiPaper-elevation.MuiPaper-elevation16.MuiDrawer-paper.MuiDrawer-paperAnchorBottom > div > button")?.click()
            document.querySelector("body > div.MuiDrawer-root.MuiDrawer-modal.MuiModal-root > div.MuiPaper-root.MuiPaper-elevation.MuiPaper-elevation16.MuiDrawer-paper.MuiDrawer-paperAnchorBottom > div.MuiBox-root > button")?.click()
            document.querySelector("body > div.MuiDrawer-root.MuiDrawer-modal.MuiModal-root.css-1a288y6 > div.MuiPaper-root.MuiPaper-elevation.MuiPaper-elevation16.MuiDrawer-paper.MuiDrawer-paperAnchorBottom.css-dsgero > div.css-1dbsckc > button")?.click()
        }
    } catch (error) {
        console.log("xx");
    }
}, 1000)







