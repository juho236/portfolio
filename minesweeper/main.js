const tiles = []
const flags = []

let width = 32
let height = 32
let tilewidth = 50
let tileheight = 50

let chance = 6

let active = true

const update = (x,y) => {
    if (active) {
        if (tiles[x] && tiles[y]) {
            const tile = tiles[x][y]
            if (flags[x][y] == false) {
                if (tile == 0) {
                    active = false
                    for (let tx=0;tx<width;tx++) {
                        for (let ty=0;ty<height;ty++) {
                            if (tiles[tx] && tiles[tx][ty] == 0) {
                                const el = document.getElementById(tx+"/"+ty)
                                el.classList = "bomb tile"
                            }
                        }
                    }
                } else {
                    tiles[x][y] = -1
                    let bombs = 0
                    for (let tx=x-1;tx<=x+1;tx++) {
                        for (let ty=y-1;ty<=y+1;ty++) {
                            if (tiles[tx] && tiles[tx][ty] == 0) {
                                bombs++
                            }
                        }
                    }
                    const el = document.getElementById(x+"/"+y)
                    if (bombs == 0) {
                        el.classList = "known tile"
                        for (let tx=x-1;tx<=x+1;tx++) {
                            for (let ty=y-1;ty<=y+1;ty++) {
                                if (tiles[tx] && tiles[tx][ty] != -1) {
                                    update(tx,ty)
                                }
                            }
                        }
                    } else {
                        el.classList = "known tile color"+bombs
                        el.innerHTML = bombs
                    }
                }
            }
        }
    } else {
        active = true
        clear()
        start()
    }
}
const flag = (x,y) => {
    if (active && tiles[x][y] != -1) {
        const el = document.getElementById(x+"/"+y)
        if (flags[x][y] == true) {
            flags[x][y] = false
            el.classList = "unknown tile"
        } else {
            flags[x][y] = true
            el.classList = "flag tile"
        }
    }
}
const clear = () => {
    const frame = document.getElementById("mainframe")
    frame.remove()
    const newFrame = document.createElement("main")
    newFrame.id = "mainframe"
    document.body.appendChild(newFrame)
}
const start = () => {
    const frame = document.getElementById("mainframe")
    const tilewidth = 1000/width
    const tileheight = 1000/height


    for (let x=0;x<width;x++) {
        tiles[x]=[]
        flags[x]=[]
        for (let y=0;y<height;y++) {
            tiles[x][y] = Math.ceil(Math.random()-1/chance)
            flags[x][y] = false
            const fr = document.createElement("div")
            fr.id = x+"/"+y
            fr.classList = "unknown tile"
            fr.style.fontSize = ((tilewidth+tileheight)/2-4)+"px"
            fr.style.width = (tilewidth-4)+"px"
            fr.style.height = (tileheight-4)+"px"
            fr.style.left = (x*tilewidth)+"px"
            fr.style.top = (y*tileheight)+"px"
            fr.onclick = () => {
                update(x,y)
                let match = true
                for (let tx=0;tx<width;tx++) {
                    for (let ty=0;ty<height;ty++) {
                        if (tiles[tx][ty] == 1) {
                            match = false
                            break
                        }
                    }
                }
                if (match) {
                    active = false
                }
            }
            fr.oncontextmenu = () => {
                event.preventDefault()
                flag(x,y)
            }
            frame.appendChild(fr)
        }
    }
}
start()

const refresh = () => {
    active = true
    clear()
    start()
}

const vars = ["width","height","chance","refresh"]
const navbar = document.getElementById("navbar")
for (let i=0;i<vars.length;i++) {
    const I = vars[i]
    const frame = document.createElement("div")
    const label = document.createElement("label")
    const input = document.createElement("input")
    input.type = "number"
    switch (I) {
        case "width":{
            label.innerHTML = "Set width in tiles"
            input.value = width
            input.oninput = () => {
                width = Number(input.value)
                refresh()
            }
            break
        } case "height":{
            label.innerHTML = "Set height in tiles"
            input.value = height
            input.oninput = () => {
                height = Number(input.value)
                refresh()
            }
            break
        } case "chance":{
            label.innerHTML = "Change for a mine to spawn (the bigger number the smaller chance)"
            input.value = chance
            input.oninput = () => {
                chance = Number(input.value)
                refresh()
            }
            break
        } case "refresh":{
            label.innerHTML = "Refresh the entire game"
            input.type = "button"
            input.value = "Refresh"
            input.onclick = refresh
            break
        }
    }
    frame.appendChild(label)
    frame.appendChild(input)
    navbar.appendChild(frame)
}