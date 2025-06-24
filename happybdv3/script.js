
const fireworksContainer = document.querySelector('.fireworks-container');
const messageContainer = document.querySelector('.message-container');
let currentLetterIndex = 0;
const letters = [];

// --- ZONA DE MODIFICACIÓN PRINCIPAL ---

// MODIFICAR: El mensaje que se mostrará letra por letra.
const fullMessage = "¡Feliz Cumpleaños!";

// MODIFICAR: Paleta de colores para las explosiones de los fuegos artificiales.
const fireworkColors = [
    '#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE',
    '#448AFF', '#40C4FF', '#18FFFF', '#64FFDA', '#69F0AE',
    '#B2FF59', '#EEFF41', '#FFFF00', '#FFD740', '#FFAB40'
];

// MODIFICAR: Cantidad de estrellas en el fondo.
const STAR_COUNT = 150;

// --- FIN DE LA ZONA DE MODIFICACIÓN ---


function createMessageLetters() {
    messageContainer.innerHTML = '';
    fullMessage.split('').forEach(char => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? ' ' : char; // Espacio no rompible
        span.classList.add('initial');
        messageContainer.appendChild(span);
        letters.push(span);
    });
}

function revealNextLetter() {
    if (currentLetterIndex < letters.length) {
        const letterSpan = letters[currentLetterIndex];
        letterSpan.classList.add('visible');
        letterSpan.classList.remove('initial');

        // Efecto de "pop" al aparecer la letra
        letterSpan.style.transform = 'translateY(-5px) scale(1.1)';
        setTimeout(() => {
            letterSpan.style.transform = 'translateY(0) scale(1)';
        }, 100);

        currentLetterIndex++;
    }
}

function createParticle(x, y, color) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.backgroundColor = color;

    // MODIFICAR: Tamaño de las partículas de la explosión. `* 5` es el rango, `+ 2` es el tamaño mínimo.
    const size = Math.random() * 5 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;

    const angle = Math.random() * Math.PI * 2;
    // MODIFICAR: Velocidad de la explosión. `* 80` es el rango, `+ 50` es la velocidad base.
    const speed = Math.random() * 80 + 50;
    const deltaX = Math.cos(angle) * speed;
    const deltaY = Math.sin(angle) * speed;

    let currentX = x;
    let currentY = y;
    let vx = deltaX / 20;
    let vy = deltaY / 20;
    // MODIFICAR: Gravedad que afecta a las partículas (cómo caen).
    const gravity = 0.1;
    let opacity = 1;
    // MODIFICAR: Velocidad a la que las partículas se desvanecen. Un número más alto las hace desaparecer más rápido.
    const fadeSpeed = 0.04;

    fireworksContainer.appendChild(particle);

    function updateParticle() {
        currentX += vx;
        currentY += vy;
        vy += gravity;
        opacity -= fadeSpeed;

        if (opacity <= 0) {
            particle.remove();
            return;
        }

        particle.style.transform = `translate(${currentX - x}px, ${currentY - y}px)`;
        particle.style.opacity = opacity;
        requestAnimationFrame(updateParticle);
    }
    requestAnimationFrame(updateParticle);
}

function createExplosion(x, y) {
    // MODIFICAR: Cantidad de partículas por explosión. `* 50` es el rango, `+ 50` es la cantidad base.
    const particleCount = 50 + Math.floor(Math.random() * 50);
    const baseColor = fireworkColors[Math.floor(Math.random() * fireworkColors.length)];

    for (let i = 0; i < particleCount; i++) {
        // El 0.7 significa que el 70% de las partículas tendrán el color base.
        const colorVariation = Math.random() < 0.7 ? baseColor : fireworkColors[Math.floor(Math.random() * fireworkColors.length)];
        createParticle(x, y, colorVariation);
    }

    if (currentLetterIndex < fullMessage.length) {
        revealNextLetter();
    }
}

function launchFirework() {
    const rocket = document.createElement('div');
    rocket.classList.add('rocket');

    const startX = Math.random() * (window.innerWidth * 0.6) + (window.innerWidth * 0.2);
    rocket.style.left = `${startX}px`;

    fireworksContainer.appendChild(rocket);

    // MODIFICAR: Duración (en milisegundos) del ascenso del cohete.
    const launchDuration = 1000;
    rocket.style.animationDuration = `${launchDuration / 1000}s`;

    setTimeout(() => {
        rocket.remove();
        const explosionY = window.innerHeight * (0.2 + Math.random() * 0.1);
        createExplosion(startX, explosionY);
    }, launchDuration * 0.95);

    if (currentLetterIndex < letters.length) {
        // MODIFICAR: Frecuencia de lanzamiento (en milisegundos). `* 400` es rango, `+ 300` es base.
        setTimeout(launchFirework, Math.random() * 400 + 300);
    } else {
        // MODIFICAR: Gran final. Lanza `5` fuegos artificiales más, cada `400`ms.
        setTimeout(() => launchFireworkSeries(5, 400), 1000);
    }
}

function launchFireworkSeries(count, interval) {
    if (count <= 0) return;

    const rocket = document.createElement('div');
    rocket.classList.add('rocket');
    const startX = Math.random() * (window.innerWidth * 0.6) + (window.innerWidth * 0.2);
    rocket.style.left = `${startX}px`;
    fireworksContainer.appendChild(rocket);

    const launchDuration = 1000;
    rocket.style.animationDuration = `${launchDuration / 1000}s`;
    setTimeout(() => {
        rocket.remove();
        const explosionY = window.innerHeight * (0.2 + Math.random() * 0.1);
        createExplosion(startX, explosionY);
    }, launchDuration * 0.95);

    setTimeout(() => launchFireworkSeries(count - 1, interval), interval);
}

function createStars() {
    const body = document.body;
    document.querySelectorAll('.star').forEach(star => star.remove());

    for (let i = 0; i < STAR_COUNT; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 2}s`;
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        body.insertBefore(star, body.firstChild);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    createStars();
    createMessageLetters();
    // MODIFICAR: Retraso inicial (en milisegundos) antes de que se lance el primer fuego artificial.
    setTimeout(launchFirework, 300);
});

window.addEventListener('resize', () => {
    currentLetterIndex = 0;
    createMessageLetters();
    createStars(STAR_COUNT);
});
                            