
const canvas = document.getElementById('spiderWebCanvas');
const ctx = canvas.getContext('2d');
const textContainer = document.getElementById('textContainer');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// --- ZONA DE MODIFICACIÓN PRINCIPAL ---
// Estos valores definen el estado inicial de la animación.
// También se pueden cambiar en vivo con el menú de configuración.
let config = {
    // MODIFICAR: Color inicial de las partículas (puntos).
    particleColor: '#FFFFFF',
    // MODIFICAR: Color inicial de las líneas que conectan las partículas.
    lineColor: '#FFFFFF',
    // MODIFICAR: Color inicial del fondo de la animación.
    backgroundColor: '#1a1a1a',
    // MODIFICAR: Cantidad máxima de partículas en pantalla. Más partículas pueden afectar el rendimiento.
    maxParticles: 150,
    // MODIFICAR: Distancia máxima (en píxeles) a la que las partículas se conectarán con una línea.
    connectDistance: 100,
    // MODIFICAR: Radio MÁXIMO de las partículas. El tamaño real será aleatorio entre 1 y este valor.
    particleRadius: 2,
    // MODIFICAR: Velocidad general de movimiento de las partículas. Valores más altos = más rápido.
    particleSpeedFactor: 0.3,
    // MODIFICAR: El área alrededor del ratón (en píxeles) que afecta a las partículas.
    mouseInteractionRadius: 100,
    // MODIFICAR: Fuerza con la que el ratón empuja a las partículas. Un valor negativo las atraerá.
    mouseRepulsionStrength: 0.8,
};
// --- FIN DE LA ZONA DE MODIFICACIÓN ---

const particleColorPicker = document.getElementById('particleColor');
const lineColorPicker = document.getElementById('lineColor');
const bgColorPicker = document.getElementById('bgColor');
const maxParticlesInput = document.getElementById('maxParticles');
const connectDistanceInput = document.getElementById('connectDistance');
const particleRadiusInput = document.getElementById('particleRadius');
const resetParticlesButton = document.getElementById('resetParticles');
const toggleControlsButton = document.getElementById('toggleControls');
const controlsMenu = document.getElementById('controls');


function initializeControls() {
    particleColorPicker.value = config.particleColor;
    lineColorPicker.value = config.lineColor;
    bgColorPicker.value = config.backgroundColor;
    maxParticlesInput.value = config.maxParticles;
    connectDistanceInput.value = config.connectDistance;
    particleRadiusInput.value = config.particleRadius;
    document.body.style.backgroundColor = config.backgroundColor;
    updateTextColor(config.backgroundColor);
}

particleColorPicker.addEventListener('input', (e) => config.particleColor = e.target.value);
lineColorPicker.addEventListener('input', (e) => config.lineColor = e.target.value);
bgColorPicker.addEventListener('input', (e) => {
    config.backgroundColor = e.target.value;
    document.body.style.backgroundColor = config.backgroundColor;
    updateTextColor(config.backgroundColor);
});
maxParticlesInput.addEventListener('change', (e) => {
    let value = parseInt(e.target.value);
    value = Math.max(50, Math.min(1000, value));
    e.target.value = value;
    config.maxParticles = value;
});
connectDistanceInput.addEventListener('change', (e) => {
    let value = parseInt(e.target.value);
    value = Math.max(20, Math.min(100, value));
    e.target.value = value;
    config.connectDistance = value;
});
particleRadiusInput.addEventListener('change', (e) => {
    let value = parseFloat(e.target.value);
    value = Math.max(1, Math.min(10, value));
    e.target.value = value;
    config.particleRadius = value;
});
resetParticlesButton.addEventListener('click', () => init());
toggleControlsButton.addEventListener('click', () => {
    controlsMenu.classList.toggle('controls-hidden');
    toggleControlsButton.classList.toggle('active');
});

let particlesArray = [];
const mouse = { x: null, y: null };

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});
window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });
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
canvas.addEventListener('touchend', () => { mouse.x = null; mouse.y = null; });

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
}

function getLuminance(hexColor) {
    const rgb = hexToRgb(hexColor);
    if (!rgb) return 0;
    const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function updateTextColor(bgColor) {
    const luminance = getLuminance(bgColor);
    textContainer.style.color = (luminance > 0.5) ? '#333333' : '#FFFFFF';
    textContainer.querySelector('p').style.color = (luminance > 0.5) ? '#555555' : '#CCCCCC';
}

class Particle {
    constructor(x, y) {
        this.x = x || Math.random() * canvas.width;
        this.y = y || Math.random() * canvas.height;
        // MODIFICAR: El '1' al final establece el tamaño MÍNIMO de las partículas.
        this.size = Math.random() * config.particleRadius + 1;
        this.speedX = (Math.random() - 0.5) * config.particleSpeedFactor * 2;
        this.speedY = (Math.random() - 0.5) * config.particleSpeedFactor * 2;
    }

    draw() {
        ctx.fillStyle = config.particleColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (mouse.x !== null && mouse.y !== null) {
            const dxMouse = this.x - mouse.x;
            const dyMouse = this.y - mouse.y;
            const distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

            if (distanceMouse < config.mouseInteractionRadius) {
                const forceDirectionX = dxMouse / distanceMouse;
                const forceDirectionY = dyMouse / distanceMouse;
                const force = (config.mouseInteractionRadius - distanceMouse) / config.mouseInteractionRadius * config.mouseRepulsionStrength;
                this.speedX += forceDirectionX * force * 0.1;
                this.speedY += forceDirectionY * force * 0.1;
            }
        }
        if (this.x + this.size > canvas.width || this.x - this.size < 0) { this.speedX *= -1; }
        if (this.y + this.size > canvas.height || this.y - this.size < 0) { this.speedY *= -1; }
    }
}

function init() {
    particlesArray = [];
}

function connect() {
    let opacityValue = 1;
    const rgbLineColor = hexToRgb(config.lineColor);
    if (!rgbLineColor) return;

    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) {
            const dx = particlesArray[a].x - particlesArray[b].x;
            const dy = particlesArray[a].y - particlesArray[b].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < config.connectDistance) {
                opacityValue = 1 - (distance / config.connectDistance);
                ctx.strokeStyle = `rgba(${rgbLineColor.r}, ${rgbLineColor.g}, ${rgbLineColor.b}, ${opacityValue})`;
                // MODIFICAR: Grosor de las líneas que conectan las partículas.
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (mouse.x !== null && mouse.y !== null && particlesArray.length < config.maxParticles) {
        particlesArray.push(new Particle(mouse.x, mouse.y));
    }
    if (particlesArray.length > config.maxParticles) {
        particlesArray.splice(0, particlesArray.length - config.maxParticles);
    }

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    connect();

    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

initializeControls();
init();
animate();
                            