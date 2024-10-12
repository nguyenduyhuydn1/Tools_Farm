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







