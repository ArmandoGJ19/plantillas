const canvas = document.getElementById('balloonCanvas');
const ctx = canvas.getContext('2d');

let balloons = [];
// MODIFICAR: Cantidad de globos que aparecen en pantalla
const numBalloons = 30;
// MODIFICAR: Paleta de colores para los globos
const balloonColors = ['#ff69b4', '#ffc0cb', '#add8e6', '#90ee90', '#ffd700', '#ffa07a', '#dda0dd', '#87cefa'];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Balloon {
    constructor(x, y, radius, color, dx, dy) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dx = dx;
        this.dy = dy;
        this.stringPhase = Math.random() * Math.PI * 2;
        this.stringAmplitude = Math.random() * 5 + 3;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();

        const stringLength = this.radius * 2;
        const waveFrequency = 0.1;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.radius);
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 2;
        for (let i = 0; i < stringLength; i++) {
            const offsetX = Math.sin(i * waveFrequency + this.stringPhase) * this.stringAmplitude;
            const posY = this.y + this.radius + i;
            const posX = this.x + offsetX;
            ctx.lineTo(posX, posY);
        }
        ctx.stroke();
        ctx.closePath();
    }

    update() {
        this.x += this.dx;
        this.y -= this.dy;

        // MODIFICAR: Velocidad del meneo del hilo del globo (número más alto = más rápido)
        this.stringPhase += 0.05;

        if (this.y + this.radius < 0) {
            this.y = canvas.height + this.radius;
            this.x = Math.random() * canvas.width;
            // MODIFICAR: Rango de velocidad de los globos cuando reaparecen
            this.dx = (Math.random() - 0.5) * 1; // Velocidad horizontal (rango: -0.5 a 0.5)
            this.dy = Math.random() * 1 + 0.5;   // Velocidad vertical (rango: 0.5 a 1.5)
        }

        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        this.draw();
    }
}

function initBalloons() {
    balloons = [];
    for (let i = 0; i < numBalloons; i++) {
        const radius = Math.random() * 20 + 15;
        const x = Math.random() * (canvas.width - radius * 2) + radius;
        const y = Math.random() * canvas.height + canvas.height;
        const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];

        // MODIFICAR: Rango de velocidad inicial de los globos
        const dx = (Math.random() - 0.5) * 1; // Velocidad horizontal (rango: -0.5 a 0.5)
        const dy = Math.random() * 1 + 0.5;   // Velocidad vertical (rango: 0.5 a 1.5)

        balloons.push(new Balloon(x, y, radius, color, dx, dy));
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    balloons.forEach(balloon => {
        balloon.update();
    });
}

function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}
function handleResize() {
    resizeCanvas();
    initBalloons();
}

resizeCanvas();
initBalloons();
animate();

window.addEventListener('resize', debounce(handleResize, 250));