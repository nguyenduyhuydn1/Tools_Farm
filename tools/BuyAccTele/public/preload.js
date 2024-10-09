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