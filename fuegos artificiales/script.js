
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
const restartButton = document.getElementById('restartButton');

let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

// --- ZONA DE MODIFICACIÓN PRINCIPAL ---

// MODIFICAR: El texto que se formará con partículas.
const TEXT_TO_FORM = "Felicidades";
// MODIFICAR: Velocidad a la que las partículas viajan para formar el texto.
const TEXT_PARTICLE_SPEED = 2.5;
// MODIFICAR: Cuánto tiempo (en fotogramas, ~60 por segundo) permanece el texto visible antes de desaparecer.
const TEXT_PARTICLE_LIFESPAN_AT_TARGET = 500;
// MODIFICAR: Retraso inicial (en milisegundos) antes de que comience la formación del texto.
const TEXT_FORMATION_DELAY = 1000;
// MODIFICAR: Retraso (en milisegundos) DESPUÉS de la formación del texto, antes de que empiecen los fuegos artificiales.
const RANDOM_FIREWORKS_DELAY = 4000;
// MODIFICAR: El número total de fuegos artificiales que se lanzarán en la secuencia final.
const NUM_RANDOM_FIREWORKS = 12;
// MODIFICAR: El intervalo de tiempo (en milisegundos) entre cada lanzamiento de la secuencia final.
const RANDOM_FIREWORK_LAUNCH_INTERVAL = 500;

// MODIFICAR: La paleta de colores para los fuegos artificiales y el texto.
const fireworkColors = [
    '#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE',
    '#448AFF', '#40C4FF', '#18FFFF', '#64FFDA', '#69F0AE',
    '#B2FF59', '#EEFF41', '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40'
];

// --- FIN DE LA ZONA DE MODIFICACIÓN ---


let textParticles = [];
let randomFireworks = [];
let textTargetPoints = [];
let textFormationStarted = false;
let randomFireworksStarted = false;
let randomFireworksLaunched = 0;
let fireworkLaunchTimeout;

function getRandomColor() {
    return fireworkColors[Math.floor(Math.random() * fireworkColors.length)];
}

class Particle {
    constructor(x, y, targetX, targetY, color, size, isTextParticle = false) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.color = color;
        this.size = size;
        this.isTextParticle = isTextParticle;
        this.lifespan = this.isTextParticle ? Infinity : (Math.random() * 60 + 60);
        this.initialLifespan = this.lifespan;
        this.reachedTarget = false;
        this.timeAtTarget = 0;

        if (this.isTextParticle) {
            const angle = Math.atan2(targetY - y, targetX - x);
            this.vx = Math.cos(angle) * TEXT_PARTICLE_SPEED;
            this.vy = Math.sin(angle) * TEXT_PARTICLE_SPEED;
        } else {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 3 + 1;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            // MODIFICAR: La fuerza de gravedad que afecta a las partículas de la explosión.
            this.gravity = 0.05;
            this.alpha = 1;
        }
    }
    update() {
        if (this.isTextParticle) {
            if (!this.reachedTarget) {
                const dx = this.targetX - this.x;
                const dy = this.targetY - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < TEXT_PARTICLE_SPEED) {
                    this.x = this.targetX;
                    this.y = this.targetY;
                    this.reachedTarget = true;
                } else {
                    this.x += this.vx;
                    this.y += this.vy;
                }
            } else {
                this.timeAtTarget++;
                if (this.timeAtTarget > TEXT_PARTICLE_LIFESPAN_AT_TARGET) {
                    this.lifespan = 0;
                }
            }
        } else {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += this.gravity;
            this.lifespan--;
            this.alpha = Math.max(0, this.lifespan / this.initialLifespan);
        }
    }
    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        if (!this.isTextParticle) {
            ctx.globalAlpha = this.alpha;
        }
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        if (!this.isTextParticle) {
            ctx.globalAlpha = 1;
        }
    }
}

class Firework {
    constructor() {
        this.x = Math.random() * canvasWidth;
        this.y = canvasHeight;
        this.targetY = Math.random() * (canvasHeight * 0.35) + (canvasHeight * 0.05);
        this.color = getRandomColor();
        this.speed = Math.random() * 3 + 4;
        this.exploded = false;
        this.particles = [];
        this.size = 3;
    }
    update() {
        if (!this.exploded) {
            this.y -= this.speed;
            this.speed *= 0.98;
            if (this.y <= this.targetY || this.speed < 0.5) {
                this.explode();
            }
        } else {
            this.particles.forEach(p => p.update());
            this.particles = this.particles.filter(p => p.lifespan > 0);
        }
    }
    explode() {
        this.exploded = true;
        // MODIFICAR: Cantidad de partículas por explosión. '50' es la base, '* 50' es el rango.
        const numParticles = 50 + Math.random() * 50;
        for (let i = 0; i < numParticles; i++) {
            this.particles.push(new Particle(this.x, this.y, null, null, this.color, Math.random() * 2 + 1));
        }
    }
    draw() {
        if (!this.exploded) {
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        } else {
            this.particles.forEach(p => p.draw());
        }
    }
}

function getTextPoints() {
    let TEXT_FONT_SIZE = Math.min(100, canvasWidth / (TEXT_TO_FORM.length * 0.8));
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvasWidth;
    tempCanvas.height = canvasHeight;
    tempCtx.fillStyle = "white";
    tempCtx.font = `${TEXT_FONT_SIZE}px Arial`;
    tempCtx.textAlign = "center";
    tempCtx.textBaseline = "middle";
    tempCtx.fillText(TEXT_TO_FORM, canvasWidth / 2, canvasHeight / 2);
    const imageData = tempCtx.getImageData(0, 0, canvasWidth, canvasHeight);
    const data = imageData.data;
    const points = [];
    // MODIFICAR: Densidad de las partículas del texto. Un número más bajo (ej: 1) crea un texto más denso y nítido.
    const sampling = Math.max(2, Math.floor(TEXT_FONT_SIZE / 20));
    for (let y = 0; y < canvasHeight; y += sampling) {
        for (let x = 0; x < canvasWidth; x += sampling) {
            const index = (y * canvasWidth + x) * 4;
            if (data[index + 3] > 128) {
                points.push({ x: x, y: y, color: getRandomColor() });
            }
        }
    }
    return points;
}

function initTextParticles() {
    textTargetPoints = getTextPoints();
    if (textTargetPoints.length === 0) return;
    textTargetPoints.forEach(point => {
        let startX, startY;
        const side = Math.floor(Math.random() * 4);
        switch (side) {
            case 0: startX = Math.random() * canvasWidth; startY = -20; break;
            case 1: startX = canvasWidth + 20; startY = Math.random() * canvasHeight; break;
            case 2: startX = Math.random() * canvasWidth; startY = canvasHeight + 20; break;
            case 3: startX = -20; startY = Math.random() * canvasHeight; break;
        }
        textParticles.push(new Particle(startX, startY, point.x, point.y, point.color, 2.5, true));
    });
}

function launchRandomFirework() {
    if (randomFireworksLaunched < NUM_RANDOM_FIREWORKS) {
        randomFireworks.push(new Firework());
        randomFireworksLaunched++;
        fireworkLaunchTimeout = setTimeout(launchRandomFirework, RANDOM_FIREWORK_LAUNCH_INTERVAL);
    }
}

function animate() {
    // MODIFICAR: El efecto de estela. Un valor más bajo (ej: 0.05) deja estelas más largas.
    ctx.fillStyle = 'rgba(10, 10, 26, 0.1)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    if (textFormationStarted) {
        textParticles.forEach(p => { p.update(); p.draw(); });
        textParticles = textParticles.filter(p => p.lifespan > 0);
    }

    if (randomFireworksStarted) {
        randomFireworks.forEach(fw => { fw.update(); fw.draw(); });
        randomFireworks = randomFireworks.filter(fw => !fw.exploded || fw.particles.length > 0);
    }

    requestAnimationFrame(animate);
}

function resetAndStartAnimation() {
    clearTimeout(fireworkLaunchTimeout);
    textFormationStarted = false;
    randomFireworksStarted = false;
    textParticles = [];
    randomFireworks = [];
    randomFireworksLaunched = 0;

    setTimeout(() => {
        initTextParticles();
        textFormationStarted = true;
    }, TEXT_FORMATION_DELAY);

    setTimeout(() => {
        randomFireworksStarted = true;
        launchRandomFirework();
    }, TEXT_FORMATION_DELAY + RANDOM_FIREWORKS_DELAY);
}

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        resetAndStartAnimation();
    }, 250);
});

restartButton.addEventListener('click', resetAndStartAnimation);

resetAndStartAnimation();
animate();
                            