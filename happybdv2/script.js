
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fireworks = [];
let particles = [];
let messageShown = false;

// MODIFICAR: La paleta de colores para los fuegos artificiales y el confeti.
const colors = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd',
    '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#ee5a24',
    '#0abde3', '#10ac84', '#f368e0', '#feca57'
];

class Firework {
    constructor(x, y, targetY, color) {
        this.x = x;
        this.y = y;
        this.targetY = targetY;
        this.color = color;
        // MODIFICAR: Velocidad del cohete. '5' es la base, '* 3' es el rango aleatorio extra.
        this.speed = Math.random() * 3 + 5;
        this.trail = [];
        this.exploded = false;
    }

    update() {
        if (!this.exploded) {
            this.trail.push({x: this.x, y: this.y});
            // MODIFICAR: Longitud de la estela del cohete.
            if (this.trail.length > 10) this.trail.shift();

            this.y -= this.speed;

            if (this.y <= this.targetY) {
                this.explode();
                this.exploded = true;
            }
        }
    }

    draw() {
        if (!this.exploded) {
            this.trail.forEach((point, index) => {
                ctx.globalAlpha = index / this.trail.length;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
                ctx.fill();
            });

            ctx.globalAlpha = 1;
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 20;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    explode() {
        // MODIFICAR: Cantidad de partículas por explosión. '30' es la base, '* 50' es el rango.
        const particleCount = Math.random() * 50 + 30;
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle(this.x, this.y, this.color));
        }

        if (!messageShown && fireworks.filter(f => f.exploded).length > 2) {
            document.getElementById('message').classList.add('show');
            messageShown = true;
            createConfetti();
        }
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        // MODIFICAR: La fuerza de la explosión. Un número más alto (ej: 15) hará que las partículas se dispersen más lejos.
        const explosionStrength = 10;
        this.vx = (Math.random() - 0.5) * explosionStrength;
        this.vy = (Math.random() - 0.5) * explosionStrength;
        this.life = 1;
        // MODIFICAR: Duración de las partículas. Un valor más bajo (ej: 0.01) las hace durar más.
        this.decay = Math.random() * 0.02 + 0.01;
        // MODIFICAR: Tamaño de las partículas. '2' es la base, '* 4' es el rango aleatorio.
        this.size = Math.random() * 4 + 2;
        // MODIFICAR: La fuerza de gravedad que afecta a las partículas al caer.
        this.gravity = 0.1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.life -= this.decay;
        this.vx *= 0.99;
        this.vy *= 0.99;
    }

    draw() {
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

function createFirework() {
    const x = Math.random() * canvas.width;
    const y = canvas.height;
    const targetY = Math.random() * canvas.height * 0.4 + (canvas.height * 0.1);
    const color = colors[Math.floor(Math.random() * colors.length)];
    fireworks.push(new Firework(x, y, targetY, color));
}

function createStars() {
    const starsContainer = document.getElementById('stars');
    starsContainer.innerHTML = '';
    // MODIFICAR: La cantidad de estrellas que aparecen en el fondo.
    const starCount = 100;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 2 + 's';
        starsContainer.appendChild(star);
    }
}

function createConfetti() {
    // MODIFICAR: La cantidad de trozos de confeti que caen.
    const confettiCount = 50;
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 3 + 's';
            document.body.appendChild(confetti);

            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }, i * 100);
    }
}

function launchFireworks() {
    // MODIFICAR: Cantidad de fuegos artificiales que se lanzan al presionar el botón.
    const launchCount = 5;
    for (let i = 0; i < launchCount; i++) {
        setTimeout(() => createFirework(), i * 200);
    }
}

function animate() {
    // MODIFICAR: El efecto de estela. Un valor más bajo (ej: 0.05) deja estelas más largas.
    ctx.fillStyle = 'rgba(12, 12, 46, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    fireworks.forEach((firework, index) => {
        firework.update();
        firework.draw();
        if (firework.exploded && firework.trail.length === 0) {
            fireworks.splice(index, 1);
        }
    });

    particles.forEach((particle, index) => {
        particle.update();
        particle.draw();
        if (particle.life <= 0) {
            particles.splice(index, 1);
        }
    });

    requestAnimationFrame(animate);
}

createStars();

// MODIFICAR: Frecuencia de los fuegos artificiales automáticos (en milisegundos. 800 = 0.8 segundos).
setInterval(createFirework, 800);

animate();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createStars();
});

// Lanzamiento inicial
setTimeout(() => {
    // MODIFICAR: Cantidad de fuegos artificiales en la ráfaga inicial.
    const initialBurst = 3;
    for (let i = 0; i < initialBurst; i++) {
        setTimeout(() => createFirework(), i * 300);
    }
}, 1000);
                            