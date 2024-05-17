function newPromise(call) {
    return new Promise(call);
}
function getEl(id) {
    return document.getElementById(id);
}

async function run(timeout,call) {
    return newPromise(function(resolve) {
        const st = new Date().getTime();
        const update = () => {
            const dt = new Date().getTime() - st;
            if (dt < timeout) {
                call(dt/timeout);
                window.requestAnimationFrame(update);
            } else {
                call(1);
                resolve();
            }
        };
        call(0);
        window.requestAnimationFrame(update);
    });
}

function alphaSin(a) {
    return Math.sin((a - 0.5) * Math.PI) / 2 + 0.5;
}

async function wait(timeout) {
    return newPromise(function(resolve) {
        window.setTimeout(function() {resolve()},timeout);
    });
}

async function mainAnimation() {
    const main = getEl("main-content"),header = getEl("main-header");
    if (animation == true) {
        await wait(1500);
        await run(2000,function(a) {
            header.style.opacity = a;
        });
        await run(2000,function(a) {
            main.style.opacity = a;
        })
    } else {
        await run(500,function(a) {
            header.style.opacity = a;
            main.style.opacity = a;
        });
    }
}
const animation = false;
mainAnimation();

async function hash() {
    const hash = document.URL;
    const split = hash.split("#");
    if (split[1]) {
        const el = getEl(split[1]);
        await run(500,function(a) {
            el.style.background = `rgb(248,103,144,${alphaSin(a)})`;
        });
        await run(1500,function(a) {
            el.style.background = `rgb(248,103,144,${alphaSin(1-a)})`;
        });
    }
}

hash();
window.onhashchange = hash;