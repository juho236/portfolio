const tabs = {};

function pairs(list,call) {
    for (const i in list) {
        call(i,list[i]);
    }
}

const maintablist = getEl("main-tablist");
function linkTab(tabId,buttonText,buttonClick) {
    const btn = document.createElement("div");
    btn.classList = "tab-closed";
    const b = document.createElement("button");
    b.classList = "tab-button";
    b.innerHTML = buttonText;
    b.onclick = function() {
        if (tabAnimation == false) {
            if (buttonClick) {
                buttonClick();
            }
            enableTab(tabId);
        }
    };
    btn.appendChild(b);
    maintablist.appendChild(btn);

    const ct = getEl(tabId + "-content");

    function step(el) {
        const list = el.childNodes;
        let index = undefined;
        pairs(list,function(i,c) {
            switch (c.tagName) {
                case "LI" :{
                    step(c);
                    break;
                } case "DIV" :{
                    if (c.classList == "inset-title") {
                        index = c;
                    }
                    break;
                } case "UL" :{
                    const dropdown = document.createElement("button");
                    dropdown.classList = "dropdown-button";

                    const img = document.createElement("img");
                    img.classList = "dropdown-icon";

                    dropdown.appendChild(img);
                    let open = false;
                    dropdown.onclick = () => {
                        open = !open;
                        if (open == true) {
                            img.src = "icons/dropdown-open.png";
                            c.style.display = "block";
                        } else {
                            img.src = "icons/dropdown-closed.png";
                            c.style.display = "none";
                        }
                    };
                    dropdown.onclick();
                    index.appendChild(dropdown);
                    step(c);
                    break;
                }
            }
        });
    }
    step(ct);

    tabs[tabId] = {Window:getEl(tabId),Content:ct,Button:btn};
}
let previous = undefined;
async function enableTab(index) {
    tabAnimation = true;
    let t = undefined;
    for (const tabId in tabs) {
        const tab = tabs[tabId];
        if (tabId == index) {
            t = tab;
        } 
        tab.Button.classList = "tab-closed";
        tab.Window.style.display = "none";
        tab.Content.style.display = "none";
    }
    t.Button.classList = "tab-open";
    t.Window.style.display = "block";
    t.Content.style.display = "block";

    if (previous != t) {
        if (previous) {
            previous.Button.classList = "tab-open";
            previous.Window.style.display = "block";
            previous.Content.style.display = "block";
        }
    
        t.Window.style.opacity = 0;
        t.Content.style.opacity = 0;
        if (previous) {
            await run(250,function(a) {
                previous.Window.style.opacity = 1 - a;
                previous.Content.style.opacity = 1 - a;
            });
            previous.Button.classList = "tab-closed";
            previous.Window.style.display = "none";
            previous.Content.style.display = "none";
        }
        await run(250,function(a) {
            t.Window.style.opacity = a;
            t.Content.style.opacity = a;
        });
    }
    previous = t;
    tabAnimation = false;
}

linkTab("tabs-main","Etusivu");
linkTab("tabs-info","Tietoja minusta");
linkTab("tabs-games","Koodaukset");

enableTab("tabs-main");