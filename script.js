let active = true
const addElement = (id,parent,classlist,text) => {
    const el = document.createElement(id)
    el.classList = classlist
    el.innerHTML = text
    parent.appendChild(el)
    return el
}
const addButton = (parent,text,cl,onclickevent) => {
    const btn = addElement("Button",parent,cl,text)
    if (onclickevent) {
        btn.onclick = () => {
            if (active == true) {
                onclickevent()
            }
        }
    }
    return btn
}
const addLink = (parent,text,cl,ref) => {
    const a = addElement("a",parent,cl,text)
    a.href = ref
    return a 
}
const addH1 = (parent,text,cl) => {
    return addElement("h1",parent,cl,text)
}
const addH2 = (parent,text,cl) => {
    return addElement("h2",parent,cl,text)
}
const addP = (parent,text,cl) => {
    return addElement("p",parent,cl,text)
}
const addDiv = (parent,cl) => {
    return addElement("div",parent,cl,"")
}

const createPopup = (width,height,popupcreationcall) => {
    const bg = document.getElementById("popupbg")
    bg.style.display = "block"
    const popup = document.getElementById("popup")
    popup.style.left = "calc(50% - "+(width/2)+"%)"
    popup.style.top = "calc(50% - "+(height/2)+"%)"
    popup.style.width = width+"%"
    popup.style.height = height+"%"
    popup.innerHTML = ""
    popupcreationcall(popup,()=>{
        bg.style.display = "none"
    })
}

const pages = {
    Default:{Call:()=>{
        const main = document.getElementById("main")
        addH1(main,"Juhon hullu portfolio","text bold")
        addP(main,"Ihan hullu","text")
        addH2(main,"Mitäs kaikkea tällä sivulla on?","text bold")
        addP(main,"Tällä sivulla on projektit tai linkki niihin, jotka haluan näyttää. Kaikki jutut pitäisi näkyä sivun oikeassa reunassa.","text")
        addH2(main,"Mitä kaikkea osaan?","text")
    }},Minesweeper:{Call:()=>{
        const main = document.getElementById("main")
        const iframe = addElement("iframe",main,"gameframe","")
        iframe.src = "minesweeper/index.html"
    }},Tetris:{Call:()=>{
        const main = document.getElementById("main")
        const iframe = addElement("iframe",main,"gameframe","")
        iframe.src = "tetris/index.html"
    }}
}

const getId = () => {
    const url = document.URL
    let str = ""
    let i=url.length
    while (true) {
        i--
        if (i>=0) {
            const char = url.charAt(i)
            if (char=="#") {
                break
            } else {
                str = char+str
            }  
        } else {
            break
        }
    }
    if (!pages[str]) {
        str = "Default"
    }
    console.log(str)
    return str
}

let id = getId()

const runIds = []
const run = (call,frames,id,endcall) => {
    if (runIds[id]) {
        window.clearInterval(runIds[id])
    }
    let f = 0
    const int = window.setInterval(()=>{
        f++
        if (f<frames) {
            call(f/frames)
        } else {
            call(1)
            if (endcall) {
                endcall()
            }
            window.clearInterval(int)
        }
    },1/120)
    runIds[id] = int
}


const update = (newId) => {
    const main = document.getElementById("main")
    const nav = document.getElementById("nav")
    const header = document.getElementById("header")
    const cont = () => {
        main.innerHTML = ""
        const list = pages[id]
        list.Call()
        const createScroll = (target) => {
            target.style.top = "0px"
            let current = 0
            let targetPos = 0
            let int = 0
            target.onwheel = () => {
                const deltaY = -event.deltaY
                targetPos = Math.max(Math.min(0,targetPos+deltaY),-(target.offsetHeight-window.innerHeight+header.offsetHeight+16))
                window.clearInterval(int)
                int = window.setInterval(()=>{
                    const diff = targetPos-current
                    if (Math.abs(diff)<1) {
                        window.clearInterval(int)
                    }
                    current = current+diff/16
                    target.style.top = current+"px"
                },1)
            }
        }
        createScroll(main)
        createScroll(nav)
    }
    main.onwheel = undefined
    nav.onwheel = undefined
    if (newId) {
        active = false
        let timeout
        window.onhashchange = () => {
            window.clearInterval(runIds.cooltransition)
            window.clearTimeout(timeout)
            update(getId())
        }
        let str = ""
        for (let i=0;i<document.URL.length;i++) {
            const char = document.URL.charAt(i)
            if (char=="#") {
                break
            } else {
                str = str + char
            }
        }
        id = newId
        document.URL = str
        const transitionTarget = document.getElementById("transitiontarget")
        const transition = document.getElementById("transition")

        run((alpha)=>{
            transitionTarget.style.right = (alpha*100)+"%"
            transition.style.left = ((1-alpha)*100)+"%"
        },30,"cooltransition",()=>{
            timeout = window.setTimeout(()=>{
                document.URL = str+newId
                window.onhashchange = () => {
                    update(getId())
                }
                run((alpha)=>{
                    transitionTarget.style.right = (alpha*100-100)+"%"
                    transition.style.left = (-alpha*100)+"%"
                },30,"cooltransition",()=>{
                    active = true
                })
            },500)
            cont()
        })
    } else {
        window.onhashchange = () => {
            update(getId())
        }
        cont()
    }
}

update()


const navButtons = [
    {Title:"Kotisivu",Description:"Takaisin kotisivulle",ButtonType:"popup",ButtonText:"Mene",PopupQuestion:"Haluatko takaisin kotisivulle?",PopupTarget:"Default"},
    {Title:"Minesweeper",Description:"Koodasin parissa tunnissa minesweeperin kun oli tylsää",ButtonType:"popup",ButtonText:"Pelaa",PopupQuestion:"Haluatko mennä pelaaman minesweeperiä?",PopupTarget:"Minesweeper"},
    {Title:"Tetris",Description:"Oli tylsää niin koodasin tetriksen",ButtonType:"popup",ButtonText:"Pelaa",PopupQuestion:"Haluatko mennä pelaaman tetristä?",PopupTarget:"Tetris"},
]

const nav = document.getElementById("nav")
for (let i=0;i<navButtons.length;i++) {
    const list = navButtons[i]
    const div = addDiv(nav,"navbutton")
    addH1(div,list.Title,"text bold")
    addH2(div,list.Description,"text")
    addButton(div,list.ButtonText,"link button text",() => {
        switch (list.ButtonType) {
            case "popup":{
                createPopup(25,25,(popupframe,closepopup)=>{
                    addH1(popupframe,list.PopupQuestion,"text bold")
                    addLink(popupframe,"Kyllä","yes button text","#"+list.PopupTarget).onclick = () => {
                        closepopup()
                        update(list.PopupTarget)
                    }
                    addButton(popupframe,"Ei","no button text").onclick = closepopup
                })
            }
        }
    })
}