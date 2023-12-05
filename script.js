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
    a.onclick = () => {
        def = "Default"
    }
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
const addImg = (parent,cl,src) => {
    const img = addElement("img",parent,cl,"")
    img.src = (src || "")
    return img
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
        addH1(main,"Koodi","text bold")
        addOtherLink(main,"Githubin lähdekoodi")
    }},Tetris:{Call:()=>{
        const main = document.getElementById("main")
        const iframe = addElement("iframe",main,"gameframe","")
        iframe.src = "tetris/index.html"
    }},TransitionTest:{Call:()=>{
        const main = document.getElementById("main")
        addButton(main,"Default Transition","text button",()=>{
            update("TransitionTest","Default")
        })
        addButton(main,"Reversed Transition","text button",()=>{
            update("TransitionTest","Reverse")
        })
        addButton(main,"Fade","text button",()=>{
            update("TransitionTest","Fade")
        })
        addButton(main,"Spin clockwise","text button",()=>{
            update("TransitionTest","Spin")
        })
        addButton(main,"Skewed Transition","text button",()=>{
            update("TransitionTest","Rotate")
        })
        addButton(main,"Star effect (never ends!!!)","text button",()=>{
            update("TransitionTest","star")
        })
        addButton(main,"Special Transition (hash change)","text button",()=>{
            update("TransitionTest","Special")
        })
        addButton(main,"Rocket Transition","text button",()=>{
            update("TransitionTest","Special2")
        })
    }}
}

const easingStyles = {
    In:{
        Sine:(alpha)=>{
            return 1-Math.sin((1-alpha)*Math.PI/2)
        }
    },Out:{
        Sine:(alpha)=>{
            return Math.sin(alpha*Math.PI/2)
        }
    },InOut:{
        Sine:(alpha)=>{
            return Math.sin((alpha-0.5)*Math.PI)/2+0.5
        }
    },
}

const transitions = {
    Default:{
        Start:(transitionTarget,transition)=>{
            transitionTarget.style.right = "0%"
            transition.style.left = "100%"
        },InFrames:30,In:(alpha,transitionTarget,transition)=>{
            transitionTarget.style.right = (alpha*100)+"%"
            transition.style.left = ((1-alpha)*100)+"%"
        },Timeout:500,OutFrames:30,Out:(alpha,transitionTarget,transition)=>{
            transitionTarget.style.right = (alpha*100-100)+"%"
            transition.style.left = (-alpha*100)+"%"
        },Reset:(transitionTarget,transition)=>{
            transitionTarget.style.right = ""
            transition.style.left = ""
        }
    },Reverse:{
        Start:(transitionTarget,transition)=>{
            transitionTarget.style.left = "0%"
            transition.style.right = "100%"
        },InFrames:30,In:(alpha,transitionTarget,transition)=>{
            transitionTarget.style.left = (alpha*100)+"%"
            transition.style.right = ((1-alpha)*100)+"%"
        },Timeout:500,OutFrames:30,Out:(alpha,transitionTarget,transition)=>{
            transitionTarget.style.left = (alpha*100-100)+"%"
            transition.style.right = (-alpha*100)+"%"
        },Reset:(transitionTarget,transition)=>{
            transitionTarget.style.left = ""
            transition.style.right = ""
        }
    },Fade:{
        Start:(transitionTarget,transition)=>{
            transition.style.opacity = 0
        },InFrames:60,In:(alpha,transitionTarget,transition)=>{
            transition.style.opacity = alpha
        },Timeout:500,OutFrames:60,Out:(alpha,transitionTarget,transition)=>{
            transition.style.opacity = 1-alpha
        },Reset:(transitionTarget,transition)=>{
            transitionTarget.style.opacity = ""
            transition.style.opacity = ""
        }
    },Spin:{
        Start:(transitionTarget,transition)=>{
            transition.style.opacity = 0
            transition.style.rotate = "-180deg"
        },InFrames:60,In:(alpha,transitionTarget,transition)=>{
            transition.style.opacity = alpha
            transitionTarget.style.rotate = (alpha*180)+"deg"
            transition.style.rotate = (alpha*180-180)+"deg"
        },Timeout:500,OutFrames:60,Out:(alpha,transitionTarget,transition)=>{
            transition.style.opacity = 1-alpha
            transitionTarget.style.rotate = (alpha*180-180)+"deg"
            transition.style.rotate = (alpha*180)+"deg"
        },Reset:(transitionTarget,transition)=>{
            transition.style.opacity = ""
            transitionTarget.style.rotate = ""
            transition.style.rotate = ""
        },ActivateBackground:true
    },Rotate:{
        Start:(transitionTarget,transition)=>{
            transition.style.transform = "rotateX(-90deg)"
        },InFrames:60,EaseIn:easingStyles.InOut.Sine,In:(alpha,transitionTarget,transition)=>{
            transitionTarget.style.transform = "rotateX("+(Math.min(alpha*180,90))+"deg)"
            transition.style.transform = "rotateX("+(Math.max(-(1-alpha)*180,-90))+"deg)"
        },Timeout:0,OutFrames:60,EaseOut:easingStyles.InOut.Sine,Out:(alpha,transitionTarget,transition)=>{
            transitionTarget.style.transform = "rotateX("+(Math.max(-(1-alpha)*180,-90))+"deg)"
            transition.style.transform = "rotateX("+(Math.min(alpha*180,90))+"deg)"
        },Reset:(transitionTarget,transition)=>{
            transitionTarget.style.transform = ""
            transition.style.transform = ""
        },ActivateBackground:true
    },star:{
        Start:(transitionTarget,transition)=>{
            transition.style.opacity = 0
            transitionTarget.style.opacity = 1
        },InFrames:360,In:(alpha,transitionTarget,transition)=>{
            transitionTarget.style.opacity = 1-alpha
        },ActivateBackground:true,Timeout:100000000000000
    },Special:{
        Start:(transitionTarget,transition)=>{
            transitionTarget.style.left = "0%"
            transition.style.right = "100%"
            transition.style.top = "30%"
            transition.style.transform = "scale(0.5) skewY(-10deg)"
        },InFrames:120,In:(alpha,transitionTarget,transition)=>{
            const alpha1 = easingStyles.InOut.Sine(Math.min(alpha*4,1))
            const alpha2 = easingStyles.InOut.Sine(Math.min(Math.max(alpha*4-1,0),1))
            const alpha3 = easingStyles.InOut.Sine(Math.max(alpha*2,1)-1)
            transitionTarget.style.transform = "scale("+(1-alpha1/2)+") skewY("+(-alpha2*10)+"deg)"
            transitionTarget.style.left = (alpha3*100)+"%"
            transitionTarget.style.top = (alpha3*-30)+"%"
            transition.style.right = ((1-alpha3)*100)+"%"
            transition.style.top = ((1-alpha3)*30)+"%"
        },Timeout:500,OutFrames:120,Out:(alpha,transitionTarget,transition)=>{
            const alpha1 = easingStyles.InOut.Sine(Math.min(alpha*2,1))
            const alpha2 = easingStyles.InOut.Sine(Math.min(Math.max(alpha*4-2,0),1))
            const alpha3 = easingStyles.InOut.Sine(Math.min(Math.max(alpha*4-3,0),1))
            transitionTarget.style.transform = "scale("+(0.5+alpha3/2)+") skewY("+(alpha2*10-10)+"deg)"
            transitionTarget.style.left = (alpha1*100-100)+"%"
            transitionTarget.style.top = (alpha1*-30+30)+"%"
            transition.style.right = (alpha1*-100)+"%"
            transition.style.top = (alpha1*-30)+"%"
        },Reset:(transitionTarget,transition)=>{
            transitionTarget.style.transform = ""
            transitionTarget.style.top = ""
            transitionTarget.style.left = ""
            transition.style.right = ""
            transition.style.top = ""
            transition.style.transform = ""
        },ActivateBackground:true
    },Special2:{
        Start:(transitionTarget,transition)=>{
            transitionTarget.style.left = "0%"
            transition.style.right = "100%"
            transition.style.transform = "scale(0.5)"
        },InFrames:120,In:(alpha,transitionTarget,transition)=>{
            const alpha1 = easingStyles.InOut.Sine(Math.min(alpha*4,1))
            const alpha2 = easingStyles.InOut.Sine(Math.min(Math.max(alpha*4-1,0),1))
            const alpha3 = easingStyles.Out.Sine(Math.max(alpha*2,1)-1)
            transitionTarget.style.transform = "scale("+(1-alpha1/2)+")"
            transitionTarget.style.left = (alpha2*100)+"%"
            transition.style.right = (100-alpha3*100)+"%"
        },Timeout:500,OutFrames:120,Out:(alpha,transitionTarget,transition)=>{
            const alpha1 = easingStyles.In.Sine(Math.min(alpha*2,1))
            const alpha2 = easingStyles.InOut.Sine(Math.min(Math.max(alpha*4-2,0),1))
            const alpha3 = easingStyles.InOut.Sine(Math.min(Math.max(alpha*4-3,0),1))
            transitionTarget.style.transform = "scale("+(0.5+alpha3/2)+")"
            transitionTarget.style.left = (alpha2*100-100)+"%"
            transition.style.right = (alpha1*-100)+"%"
        },Reset:(transitionTarget,transition)=>{
            transitionTarget.style.transform = ""
            transitionTarget.style.left = ""
            transition.style.right = ""
            transition.style.transform = ""
        },ActivateBackground:true
    }
}

let frames = 0
let backgroundInt = 0

const effectFrame = addDiv(document.body,"starframe")
const layers = [
    {Scale:100,Multiplier:0.1,Opacity:0.25},
    {Scale:200,Multiplier:0.2,Opacity:0.3},
    {Scale:300,Multiplier:0.3,Opacity:0.45},
    {Scale:450,Multiplier:0.45,Opacity:0.6},
    {Scale:600,Multiplier:0.6,Opacity:0.7},
    {Scale:800,Multiplier:0.8,Opacity:0.9},
    {Scale:1000,Multiplier:1,Opacity:1},
]
for (let i=0;i<layers.length;i++) {
    const l = layers[i]
    const scale = l.Scale
    const el = addDiv(effectFrame,"starfield")
    el.style.backgroundSize = (scale)+"px "+(scale)+"px"
    el.style.opacity = l.Opacity
    layers[i] = {Ref:el,Scale:scale,Multiplier:l.Multiplier}
}

const activateBackground = () => {
    window.clearInterval(backgroundInt)
    backgroundInt = window.setInterval(()=>{
        frames++
        for (let i=0;i<layers.length;i++) {
            const l = layers[i]
            const el = l.Ref
            el.style.backgroundPosition = (frames*l.Multiplier)+"px"
        }
    },1)
}
const deActivateBackground = () => {
    frames = 0
    window.clearInterval(backgroundInt)
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

let def = "Special"
const update = (newId,transitionId) => {
    console.log(transitionId)
    def = "Special"
    if (!transitionId) {
        transitionId = "Default"
    }
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
        window.onhashchange = undefined
        active = false
        let timeout
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
        location.href = str+"#"+newId
        const transitionTarget = document.getElementById("transitiontarget")
        const transition = document.getElementById("transition")
    



        const transIndex = transitions[transitionId]

        window.onhashchange = () => {
            window.clearInterval(runIds.cooltransition)
            window.clearTimeout(timeout)
            transIndex.Reset(transitionTarget,transition)
            update(getId(),def)
        }


        transition.style.display = "block"

        transIndex.Start(transitionTarget,transition)
        const easeIn = function(){
            if (transIndex.EaseIn) {
                return transIndex.EaseIn
            } else {
                return (alpha)=>{
                    return alpha
                }
            }
        }()
        const easeOut = function(){
            if (transIndex.EaseOut) {
                return transIndex.EaseOut
            } else {
                return (alpha)=>{
                    return alpha
                }
            }
        }()
        if (transIndex.ActivateBackground) {
            activateBackground()
        }
        run((alpha)=>{
            transIndex.In(easeIn(alpha),transitionTarget,transition)
        },transIndex.InFrames,"cooltransition",()=>{
            const c = () => {
                window.onhashchange = () => {
                    update(getId(),def)
                }
                run((alpha)=>{
                    transIndex.Out(easeOut(alpha),transitionTarget,transition)
                },transIndex.OutFrames,"cooltransition",()=>{
                    deActivateBackground()
                    active = true
                    transition.style.display = "none"
                    transIndex.Reset(transitionTarget,transition)
                })
            }
            if (transIndex.Timeout) {
                timeout = window.setTimeout(c,transIndex.Timeout)
            } else {
                c()
            }
            
            cont()
        })
    } else {
        window.onhashchange = () => {
            update(getId(),def)
        }
        cont()
    }
}

update()

const headerButtons = [
    {Position:"left",Type:"Icon",Source:"noise.png"},
    {Position:"left",Type:"Text",Text:"Kuva ja teksti vasemmalla"},
    {Position:"right",Type:"Text",Text:"Teksti oikealla"},
    {Position:"right",Type:"Link",Text:"Linkki oikealla siirtymätestiin",Target:"#TransitionTest",Transition:"Rotate"}
]

const navButtons = [
    {Title:"Kotisivu",Description:"Takaisin kotisivulle",ButtonType:"popup",ButtonText:"Mene",PopupQuestion:"Haluatko takaisin kotisivulle?",PopupTarget:"Default",Transition:"Default"},
    {Title:"Minesweeper",Description:"Koodasin parissa tunnissa minesweeperin kun oli tylsää",ButtonType:"popup",ButtonText:"Pelaa",PopupQuestion:"Haluatko mennä pelaaman minesweeperiä?",PopupTarget:"Minesweeper",Transition:"Reverse"},
    {Title:"Tetris",Description:"Oli tylsää niin koodasin tetriksen",ButtonType:"popup",ButtonText:"Pelaa",PopupQuestion:"Haluatko mennä pelaaman tetristä?",PopupTarget:"Tetris",Transition:"Spin"},
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
                        def = list.Transition
                        closepopup()
                    }
                    addButton(popupframe,"Ei","no button text").onclick = closepopup
                })
            }
        }
    })
}

const header = document.getElementById("header")
for (let i=0;i<headerButtons.length;i++) {
    const list = headerButtons[i]
    const div = addDiv(header,"headeritem")
    switch (list.Position) {
        case "right":{
            div.classList += " right"
            break
        } case "left":{
            div.classList += " left"
            break
        }
    }
    switch (list.Type) {
        case "Icon" :{
            addImg(div,"headericon",list.Source)
            break
        } case "Text":{
            addP(div,list.Text,"text")
            break
        } case "Link":{
            addLink(div,list.Text,"headerlink text",list.Target).onclick = () => {
                def = list.Transition
            }
            break
        }
    }
}