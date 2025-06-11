const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
let textToDisplay = "Amor";

const mouse = {
    x: null,
    y: null,
    radius: 100
};

const colorSelect = document.getElementById('color-select');
const particleSizeSlider = document.getElementById('particle-size');
const numParticlesSlider = document.getElementById('num-particles');
const speedSlider = document.getElementById('speed');
const mouseFollowSlider = document.getElementById('mouse-follow');
const trailAlphaSlider = document.getElementById('trail-alpha');

const particleSizeValueSpan = document.getElementById('particle-size-value');
const numParticlesValueSpan = document.getElementById('num-particles-value');
const speedValueSpan = document.getElementById('speed-value');
const mouseFollowValueSpan = document.getElementById('mouse-follow-value');
const trailAlphaValueSpan = document.getElementById('trail-alpha-value');

const nameInput = document.getElementById('name-input');
const textColorSelect = document.getElementById('text-color-select');
const fontSizeSlider = document.getElementById('font-size');
const pulseAmplitudeSlider = document.getElementById('pulse-amplitude');
const pulseSpeedSlider = document.getElementById('pulse-speed');

const fontSizeValueSpan = document.getElementById('font-size-value');
const pulseAmplitudeValueSpan = document.getElementById('pulse-amplitude-value');
const pulseSpeedValueSpan = document.getElementById('pulse-speed-value');

/* Inicio de cambios para el menú ocultable */
const menuToggle = document.getElementById('menuToggle');
const controlsMenu = document.getElementById('controlsMenu');

menuToggle.addEventListener('click', () => {
    controlsMenu.classList.toggle('show');
    menuToggle.classList.toggle('hide');
});
/* Fin de cambios para el menú ocultable */

let config = {
    particleColor: colorSelect.value,
    particleSize: parseInt(particleSizeSlider.value),
    numParticles: parseInt(numParticlesSlider.value),
    returnSpeed: parseFloat(speedSlider.value),
    mouseInfluence: parseInt(mouseFollowSlider.value),
    trailAlpha: parseFloat(trailAlphaSlider.value),
    textContent: nameInput.value,
    textColor: textColorSelect.value,
    baseFontSize: parseInt(fontSizeSlider.value),
    pulseAmplitude: parseInt(pulseAmplitudeSlider.value),
    pulseSpeed: parseFloat(pulseSpeedSlider.value),
    textFont: 'Arial, sans-serif',
    textNeonBlur: 15
};

function updateSpans() {
    particleSizeValueSpan.textContent = config.particleSize;
    numParticlesValueSpan.textContent = config.numParticles;
    speedValueSpan.textContent = config.returnSpeed.toFixed(2);
    mouseFollowValueSpan.textContent = config.mouseInfluence;
    trailAlphaValueSpan.textContent = config.trailAlpha.toFixed(2);

    fontSizeValueSpan.textContent = config.baseFontSize;
    pulseAmplitudeValueSpan.textContent = config.pulseAmplitude;
    pulseSpeedValueSpan.textContent = config.pulseSpeed.toFixed(3);
}
updateSpans();

colorSelect.addEventListener('change', (e) => {
    config.particleColor = e.target.value;
});
particleSizeSlider.addEventListener('input', (e) => {
    config.particleSize = parseInt(e.target.value);
    particleSizeValueSpan.textContent = config.particleSize;
});
numParticlesSlider.addEventListener('input', (e) => {
    config.numParticles = parseInt(e.target.value);
    numParticlesValueSpan.textContent = config.numParticles;
    init();
});
speedSlider.addEventListener('input', (e) => {
    config.returnSpeed = parseFloat(e.target.value);
    speedValueSpan.textContent = config.returnSpeed.toFixed(2);
});
mouseFollowSlider.addEventListener('input', (e) => {
    config.mouseInfluence = parseInt(e.target.value);
    mouseFollowValueSpan.textContent = config.mouseInfluence;
});
trailAlphaSlider.addEventListener('input', (e) => {
    config.trailAlpha = parseFloat(e.target.value);
    trailAlphaValueSpan.textContent = config.trailAlpha.toFixed(2);
});

nameInput.addEventListener('input', (e) => {
    config.textContent = e.target.value;
});
textColorSelect.addEventListener('change', (e) => {
    config.textColor = e.target.value;
});
fontSizeSlider.addEventListener('input', (e) => {
    config.baseFontSize = parseInt(e.target.value);
    fontSizeValueSpan.textContent = config.baseFontSize;
});
pulseAmplitudeSlider.addEventListener('input', (e) => {
    config.pulseAmplitude = parseInt(e.target.value);
    pulseAmplitudeValueSpan.textContent = config.pulseAmplitude;
});
pulseSpeedSlider.addEventListener('input', (e) => {
    config.pulseSpeed = parseFloat(e.target.value);
    pulseSpeedValueSpan.textContent = config.pulseSpeed.toFixed(3);
});


window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

/* Inicio de cambios para touch en la pantalla */
canvas.addEventListener('touchstart', (event) => {
    event.preventDefault();
    mouse.x = event.touches[0].clientX;
    mouse.y = event.touches[0].clientY;
});

canvas.addEventListener('touchmove', (event) => {
    event.preventDefault();
    mouse.x = event.touches[0].clientX;
    mouse.y = event.touches[0].clientY;
});

canvas.addEventListener('touchend', () => {
    mouse.x = null;
    mouse.y = null;
});
/* Fin de cambios para touch en la pantalla */

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

function getHeartPoint(t, scale) {
    const x = scale * 16 * Math.pow(Math.sin(t), 3);
    const y = -scale * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return { x, y };
}

class Particle {
    constructor(targetX, targetY) {
        this.targetX = targetX + canvas.width / 2;
        this.targetY = targetY + canvas.height / 2;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = config.particleSize;
        this.color = config.particleColor;
    }

    draw() {
        ctx.shadowBlur = 5;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    update() {
        this.size = config.particleSize;
        this.color = config.particleColor;

        let dxMouse = 0;
        let dyMouse = 0;
        let distanceMouse = Infinity;

        if (mouse.x !== null && mouse.y !== null) {
            dxMouse = this.x - mouse.x;
            dyMouse = this.y - mouse.y;
            distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        }

        if (distanceMouse < mouse.radius + this.size) {
            const forceDirectionX = dxMouse / distanceMouse;
            const forceDirectionY = dyMouse / distanceMouse;
            const force = (mouse.radius - distanceMouse) / mouse.radius * (config.mouseInfluence / 10);
            this.x += forceDirectionX * force * 1.5;
            this.y += forceDirectionY * force * 1.5;
        } else {
            const dxTarget = this.targetX - this.x;
            const dyTarget = this.targetY - this.y;
            this.x += dxTarget * config.returnSpeed;
            this.y += dyTarget * config.returnSpeed;
        }
    }
}

function init() {
    particlesArray = [];
    const heartScale = Math.min(canvas.width, canvas.height) / 40;

    for (let i = 0; i < config.numParticles; i++) {
        const t = (Math.PI * 2 / config.numParticles) * i;
        const point = getHeartPoint(t, heartScale);
        particlesArray.push(new Particle(point.x, point.y));
    }
}

function drawText() {
    if (config.textContent.trim() === '') return;

    const time = Date.now();
    const pulseFactor = Math.sin(time * config.pulseSpeed) * config.pulseAmplitude;
    const currentFontSize = config.baseFontSize + pulseFactor;

    ctx.font = `bold ${currentFontSize}px ${config.textFont}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    /* Inicio de cambios para mejorar el contorno de las letras */
    ctx.shadowColor = config.textColor;
    ctx.shadowBlur = config.textNeonBlur;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.strokeStyle = config.textColor; /* Nuevo: Color del contorno */
    ctx.lineWidth = 2; /* Nuevo: Ancho del contorno */
    /* Fin de cambios para mejorar el contorno de las letras */

    ctx.fillStyle = (config.textColor === "#ffffff" || config.textColor.toLowerCase() === "white") ? "#dddddd" : "#ffffff";

    ctx.fillText(config.textContent, canvas.width / 2, canvas.height / 2);
    ctx.strokeText(config.textContent, canvas.width / 2, canvas.height / 2); /* Nuevo: Dibuja el contorno */

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
}

function animate() {
    ctx.fillStyle = `rgba(0, 0, 0, ${config.trailAlpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }

    drawText();

    requestAnimationFrame(animate);
}

updateSpans();
init();
animate();