
const canvas = document.getElementById('balloonCanvas');
const ctx = canvas.getContext('2d');

let balloons = [];
// MODIFICAR: Cantidad de globos que aparecen en pantalla.
const numBalloons = 30;

// MODIFICAR: Paleta de colores para los globos (puedes añadir o quitar colores).
const balloonColors = ['#ff69b4', '#ffc0cb', '#add8e6', '#90ee90', '#ffd700', '#ffa07a', '#dda0dd', '#87cefa'];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Balloon {
    constructor(x, y, radius, color, dx, dy) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dx = dx;
        this.dy = dy;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.radius);
        ctx.lineTo(this.x, this.y + this.radius + this.radius * 1.5);
        // MODIFICAR: Color del hilo del globo.
        ctx.strokeStyle = '#555';
        // MODIFICAR: Grosor del hilo del globo.
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
    }

    update() {
        this.x += this.dx;
        this.y -= this.dy;

        if (this.y + this.radius < 0) {
            this.y = canvas.height + this.radius;
            this.x = Math.random() * canvas.width;
            // MODIFICAR: Rango de velocidad de los globos cuando reaparecen.
            this.dx = (Math.random() - 0.5) * 2;
            this.dy = Math.random() * 2 + 1;
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
        // MODIFICAR: Rango de tamaño de los globos. '15' es el mínimo, '20' es el rango aleatorio.
        const radius = Math.random() * 20 + 15;
        const x = Math.random() * (canvas.width - radius * 2) + radius;
        const y = Math.random() * canvas.height + canvas.height;
        const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
        // MODIFICAR: Rango de velocidad inicial de los globos.
        const dx = (Math.random() - 0.5) * 2;
        const dy = Math.random() * 2 + 1;
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

initBalloons();
animate();

window.addEventListener('resize', () => {
    resizeCanvas();
    initBalloons();
});
                            