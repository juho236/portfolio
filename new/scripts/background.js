class Matrix2D {
    constructor(v0,v1,v2,v3,v4,v5) {
        if (v3 == undefined || v4 == undefined || v5 == undefined) {
            this.x1 = Math.cos(v2);
            this.x2 = -Math.sin(v2);
            this.x3 = v0;
            this.y1 = Math.sin(v2);
            this.y2 = Math.cos(v2);
            this.y3 = v1;
        } else {
            this.x1 = v0;
            this.x2 = v1;
            this.x3 = v2;
            this.y1 = v3;
            this.y2 = v4;
            this.y3 = v5;
        }
    }
    multiply(matrix2) {
        const ret = new Matrix2D(0,0,0,0,0,0);
        ret.x1 = this.x1 * matrix2.x1 + this.x2 * matrix2.y1;
        ret.x2 = this.x1 * matrix2.x2 + this.x2 * matrix2.y2;
        ret.x3 = this.x1 * matrix2.x3 + this.x2 * matrix2.y3 + this.x3;
        ret.y1 = this.y1 * matrix2.x1 + this.y2 * matrix2.y1;
        ret.y2 = this.y1 * matrix2.x2 + this.y2 * matrix2.y2;
        ret.y3 = this.y1 * matrix2.x3 + this.y2 * matrix2.y3 + this.y3;
        return ret;
    }
    x1;
    x2;
    x3;
    y1;
    y2;
    y3;
}

class Particle {
    constructor(particle,lifetime,location,velocity,acceleration) {
        this.id = particle;
        this.lifetime = lifetime;
        this.creationtime = new Date().getTime();
        this.location = location;
        this.velocity = velocity;
        this.acceleration = acceleration;
    }
    id;
    creationtime;
    lifetime;
    location;
    velocity;
    acceleration;
}
class Star extends Particle {
    constructor(lifetime,location,velocity,acceleration,r,g,b) {
        super("Star",lifetime,location,velocity,acceleration);
        this.r = r;
        this.g = g;
        this.b = b;
    }
    r;
    g;
    b;
    size;
}

const canvas = document.getElementById("main-background");
const ctx = canvas.getContext("2d");

const st = new Date().getTime();
let ot = st;

const particles = [];

const rate = 100;
let lastTime = 0;

function random(s,e) {
    return Math.random() * (e - s) + s;
}
function randint(s,e) {
    return Math.round(random(s,e));
}

function updater() {
    const t = new Date().getTime();
    const et = t - st;
    const dt = Math.min(50,t - ot);
    ot = t;

    const w = canvas.clientWidth, h = canvas.clientHeight;

    canvas.width = w;
    canvas.height = h;

    const ww = w/2,hh = h/2;

    lastTime += dt;
    while (lastTime > 1000/rate) {
        lastTime -= 1000/rate;
        let i = 0;
        while (true) {
            const v = particles[i];
            if (v == undefined) {
                particles[i] = new Star(random(9000,11000),new Matrix2D(random(-ww,ww),random(-hh,hh),random(-Math.PI,Math.PI)),new Matrix2D(0,0,random(0,0.01)),new Matrix2D(0,random(0.0001,0.001),0),255,51,54);
                break;
            }
            i++;
        }
    }
    ctx.clearRect(0,0,w,h);
    for (const i in particles) {
        const particle = particles[i];
        if (particle != undefined) {
            const lt = t - particle.creationtime;
            if (lt > particle.lifetime) {
                delete particles[i];
            } else {
                const a = lt / particle.lifetime;
                const color = `rgb(${particle.r},${particle.g},${particle.b},${(Math.min(a*4,1) - Math.max(a*4 - 3,0)) / 2})`;
                particle.velocity = particle.velocity.multiply(particle.acceleration);
                particle.location = particle.location.multiply(particle.velocity);

                const size = 5;

                const p0 = particle.location.multiply(new Matrix2D(0,-size,0));
                const p1 = p0.multiply(new Matrix2D(size,size,0));
                const p2 = p1.multiply(new Matrix2D(-size,size,0));
                const p3 = p2.multiply(new Matrix2D(-size,-size,0));

                //console.log(p0.x3)
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.moveTo(ww + p0.x3,hh + p0.y3);
                ctx.lineTo(ww + p1.x3,hh + p1.y3);
                ctx.lineTo(ww + p2.x3,hh + p2.y3);
                ctx.lineTo(ww + p3.x3,hh + p3.y3);
                ctx.lineTo(ww + p0.x3,hh + p0.y3);
                ctx.fill();
            }
        }
    }

    window.requestAnimationFrame(updater);
}

window.requestAnimationFrame(updater);