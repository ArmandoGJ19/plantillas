const canvas = document.getElementById('flowCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
let mouse = { x: null, y: null };
let flowFieldTime = 0;

// --- Parámetros Configurables ---
const NUM_PARTICLES = 300;
const PARTICLE_SPEED_BASE = 0.3;
const PARTICLE_LENGTH = 30; // Longitud de la estela (número de puntos en history)
const MOUSE_REPULSION_RADIUS = 150;
const MOUSE_REPULSION_STRENGTH = 5;
const FLOW_FIELD_SCALE = 0.008; // Escala del ruido (más pequeño = estructuras más grandes)
const FLOW_FIELD_STRENGTH = 0.5; // Fuerza del campo de flujo
const TIME_SPEED = 0.002; // Velocidad de evolución del campo de flujo

const A = 1664525;
const C = 1013904223;
const M = Math.pow(2, 32);
let seed = 1;

function pseudoRandom() {
    seed = (A * seed + C) % M;
    return seed / M;
}

function noise(x, y = 0, z = 0) {
    // Combinación de senos y cosenos para algo parecido a ruido coherente.
    let val = 0;
    val += Math.sin(x * 0.1 + y * 0.2 + z * 0.3);
    val += Math.cos(y * 0.15 - x * 0.05 + z * 0.2);
    val += Math.sin(x * y * 0.02 + z * 0.1);
    return (val / 3 + 1) / 2; // Normalizar a 0-1 (aproximadamente)
}


class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.history = [];
        this.maxSpeed = PARTICLE_SPEED_BASE * (1 + Math.random() * 0.5); // Variación de velocidad
        this.colorHue = Math.random() * 360; // Tono base
    }

    update() {
        // 1. Influencia del Campo de Flujo (Perlin Noise)
        const angle = noise(this.x * FLOW_FIELD_SCALE, this.y * FLOW_FIELD_SCALE, flowFieldTime) * Math.PI * 4; // Ángulo de 0 a 4PI
        this.vx += Math.cos(angle) * FLOW_FIELD_STRENGTH;
        this.vy += Math.sin(angle) * FLOW_FIELD_STRENGTH;

        // 2. Influencia del Ratón (Repulsión)
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

        // 3. Limitar velocidad
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > this.maxSpeed) {
            this.vx = (this.vx / speed) * this.maxSpeed;
            this.vy = (this.vy / speed) * this.maxSpeed;
        }

        // 4. Actualizar posición
        this.x += this.vx;
        this.y += this.vy;

        // 5. Guardar historial para la estela
        this.history.push({ x: this.x, y: this.y });
        if (this.history.length > PARTICLE_LENGTH) {
            this.history.shift();
        }

        // 6. Bordes (Wrap around)
        if (this.x > width + PARTICLE_LENGTH) {
            this.x = -PARTICLE_LENGTH;
            this.history = []; // Reiniciar historial al cruzar
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
        // Mapear velocidad a color (matiz)
        // Más velocidad -> colores más cálidos (rojo/naranja)
        // Menos velocidad -> colores más fríos (azul/verde)
        // El this.colorHue le da una base para que no todas sean del mismo color siempre
        const hue = (this.colorHue + (speed / this.maxSpeed) * 120) % 360; // 120 es el rango de cambio de matiz
        const lightness = 50 + (speed / this.maxSpeed) * 25; // Más brillo con más velocidad

        ctx.strokeStyle = `hsla(${hue}, 100%, ${lightness}%, 0.7)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Opcional: dibujar un punto al final de la estela
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
        // ctx.fillStyle = `hsla(${hue}, 100%, ${lightness}%, 0.9)`;
        // ctx.fill();
    }
}

function init() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles = [];
    for (let i = 0; i < NUM_PARTICLES; i++) {
        particles.push(new Particle());
    }
    flowFieldTime = 0; // Resetear el tiempo del campo de flujo
}

function animate() {
    // Fondo con efecto de desvanecimiento para las estelas
    ctx.fillStyle = 'rgba(5, 5, 16, 0.1)'; // Ligeramente más oscuro que el body, con alfa bajo
    ctx.fillRect(0, 0, width, height);

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    flowFieldTime += TIME_SPEED;
    requestAnimationFrame(animate);
}

// Event Listeners
window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

window.addEventListener('resize', init);

// Iniciar
init();
animate();