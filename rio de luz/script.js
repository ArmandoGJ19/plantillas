
const canvas = document.getElementById('flowCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
let mouse = { x: null, y: null };
let flowFieldTime = 0;

// --- ZONA DE MODIFICACIÓN PRINCIPAL ---

// MODIFICAR: Cantidad total de partículas en la pantalla.
const NUM_PARTICLES = 300;
// MODIFICAR: Velocidad base de las partículas (números más altos = más rápido).
const PARTICLE_SPEED_BASE = 0.3;
// MODIFICAR: Longitud de la estela de cada partícula (número más alto = estela más larga).
const PARTICLE_LENGTH = 30;
// MODIFICAR: El área alrededor del ratón que repele las partículas (en píxeles).
const MOUSE_REPULSION_RADIUS = 150;
// MODIFICAR: La fuerza con la que el ratón empuja las partículas (más alto = empujón más fuerte).
const MOUSE_REPULSION_STRENGTH = 5;
// MODIFICAR: La escala del "viento". Números más pequeños (ej: 0.002) crean patrones más amplios y suaves. Números más grandes (ej: 0.02) crean más turbulencia.
const FLOW_FIELD_SCALE = 0.008;
// MODIFICAR: La fuerza general del "viento" que mueve las partículas.
const FLOW_FIELD_STRENGTH = 0.5;
// MODIFICAR: La velocidad a la que el patrón de "viento" cambia con el tiempo (más alto = cambia más rápido, 0 = estático).
const TIME_SPEED = 0.002;

// --- FIN DE LA ZONA DE MODIFICACIÓN ---



function pseudoRandom() {
    seed = (1664525 * seed + 1013904223) % Math.pow(2, 32);
    return seed / Math.pow(2, 32);
}

function noise(x, y = 0, z = 0) {
    let val = 0;
    val += Math.sin(x * 0.1 + y * 0.2 + z * 0.3);
    val += Math.cos(y * 0.15 - x * 0.05 + z * 0.2);
    val += Math.sin(x * y * 0.02 + z * 0.1);
    return (val / 3 + 1) / 2;
}

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.history = [];
        this.maxSpeed = PARTICLE_SPEED_BASE * (1 + Math.random() * 0.5);
        this.colorHue = Math.random() * 360;
    }

    update() {
        const angle = noise(this.x * FLOW_FIELD_SCALE, this.y * FLOW_FIELD_SCALE, flowFieldTime) * Math.PI * 4;
        this.vx += Math.cos(angle) * FLOW_FIELD_STRENGTH;
        this.vy += Math.sin(angle) * FLOW_FIELD_STRENGTH;

        if (mouse.x !== null && mouse.y !== null) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < MOUSE_REPULSION_RADIUS && distance > 0) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (MOUSE_REPULSION_RADIUS - distance) / MOUSE_REPULSION_RADIUS * MOUSE_REPULSION_STRENGTH;
                this.vx += forceDirectionX * force;
                this.vy += forceDirectionY * force;
            }
        }

        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > this.maxSpeed) {
            this.vx = (this.vx / speed) * this.maxSpeed;
            this.vy = (this.vy / speed) * this.maxSpeed;
        }

        this.x += this.vx;
        this.y += this.vy;

        this.history.push({ x: this.x, y: this.y });
        if (this.history.length > PARTICLE_LENGTH) {
            this.history.shift();
        }

        if (this.x > width + PARTICLE_LENGTH) {
            this.x = -PARTICLE_LENGTH;
            this.history = [];
        } else if (this.x < -PARTICLE_LENGTH) {
            this.x = width + PARTICLE_LENGTH;
            this.history = [];
        }
        if (this.y > height + PARTICLE_LENGTH) {
            this.y = -PARTICLE_LENGTH;
            this.history = [];
        } else if (this.y < -PARTICLE_LENGTH) {
            this.y = height + PARTICLE_LENGTH;
            this.history = [];
        }
    }

    draw() {
        if (this.history.length < 2) return;

        ctx.beginPath();
        ctx.moveTo(this.history[0].x, this.history[0].y);
        for (let i = 1; i < this.history.length; i++) {
            ctx.lineTo(this.history[i].x, this.history[i].y);
        }

        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        const hue = (this.colorHue + (speed / this.maxSpeed) * 120) % 360;
        const lightness = 50 + (speed / this.maxSpeed) * 25;

        // MODIFICAR: La opacidad de las estelas (valor de 0.0 a 1.0).
        const opacity = 0.7;
        ctx.strokeStyle = `hsla(${hue}, 100%, ${lightness}%, ${opacity})`;

        // MODIFICAR: Grosor de la línea de la estela.
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }
}

function init() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles = [];
    for (let i = 0; i < NUM_PARTICLES; i++) {
        particles.push(new Particle());
    }
    flowFieldTime = 0;
}

function animate() {
    // MODIFICAR: El efecto de "desvanecimiento" de las estelas.
    ctx.fillStyle = 'rgba(5, 5, 16, 0.1)';
    ctx.fillRect(0, 0, width, height);

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    flowFieldTime += TIME_SPEED;
    requestAnimationFrame(animate);
}

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

window.addEventListener('resize', init);

init();
animate();
                            