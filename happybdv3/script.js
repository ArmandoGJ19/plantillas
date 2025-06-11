const fireworksContainer = document.querySelector('.fireworks-container');
const messageContainer = document.querySelector('.message-container');
const fullMessage = "Feliz Cumpleaños!";
const letters = [];
let currentLetterIndex = 0;

const fireworkColors = [
    '#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE',
    '#448AFF', '#40C4FF', '#18FFFF', '#64FFDA', '#69F0AE',
    '#B2FF59', '#EEFF41', '#FFFF00', '#FFD740', '#FFAB40'
];

function createMessageLetters() {
    messageContainer.innerHTML = ''; // Clear previous letters if called multiple times (e.g., on resize)
    fullMessage.split('').forEach(char => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char; // Non-breaking space
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

        // Pequeña animación de "pop"
        letterSpan.style.transform = 'translateY(-5px) scale(1.1)'; // Menos desplazamiento, más rápido
        setTimeout(() => {
            letterSpan.style.transform = 'translateY(0) scale(1)';
        }, 100); // Duración más corta para el pop

        currentLetterIndex++;
    }
}

function createParticle(x, y, color) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.backgroundColor = color;

    const size = Math.random() * 5 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    // Position relative to fireworksContainer
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;

    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 80 + 50;
    const deltaX = Math.cos(angle) * speed;
    const deltaY = Math.sin(angle) * speed;

    let currentX = x;
    let currentY = y;
    let vx = deltaX / 20;
    let vy = deltaY / 20;
    const gravity = 0.1;
    let opacity = 1;
    const fadeSpeed = 0.04; // Acelera el desvanecimiento de las partículas

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

        // We're using `left` and `top` for initial position, then `transform` for movement
        // So, `translate` values are relative to the initial `left`/`top`
        particle.style.transform = `translate(${currentX - x}px, ${currentY - y}px)`;
        particle.style.opacity = opacity;
        requestAnimationFrame(updateParticle);
    }
    requestAnimationFrame(updateParticle);
}

function createExplosion(x, y) {
    const particleCount = 50 + Math.floor(Math.random() * 50);
    const baseColor = fireworkColors[Math.floor(Math.random() * fireworkColors.length)];

    for (let i = 0; i < particleCount; i++) {
        const colorVariation = Math.random() < 0.7 ? baseColor : fireworkColors[Math.floor(Math.random() * fireworkColors.length)];
        createParticle(x, y, colorVariation);
    }
    // Only reveal a letter if there are still letters to reveal
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

    const launchDuration = 1000; // Acelera la duración de lanzamiento a 1 segundo
    rocket.style.animationDuration = `${launchDuration / 1000}s`;

    setTimeout(() => {
        rocket.remove();
        // Calculate explosionY based on a percentage of viewport height, e.g., 20-30% from top
        const explosionY = window.innerHeight * (0.2 + Math.random() * 0.1); // Explosión entre 20% y 30% desde arriba
        createExplosion(startX, explosionY);
    }, launchDuration * 0.95);

    // Programar el siguiente lanzamiento
    if (currentLetterIndex < letters.length) {
        setTimeout(launchFirework, Math.random() * 400 + 300); // Lanza fuegos artificiales más rápido: cada 0.3-0.7 segundos
    } else {
        // Opcional: lanzar algunos fuegos más después de que el mensaje esté completo
        setTimeout(() => launchFireworkSeries(5, 400), 1000); // Lanza 5 más cada 0.4s después de 1s
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

function createStars(numStars = 150) {
    const body = document.body;
    // Remove existing stars to prevent accumulation on resize
    document.querySelectorAll('.star').forEach(star => star.remove());

    for (let i = 0; i < numStars; i++) {
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

// Iniciar
document.addEventListener('DOMContentLoaded', () => {
    createStars();
    createMessageLetters();
    setTimeout(launchFirework, 300); // Primer lanzamiento después de un retraso muy breve
});

window.addEventListener('resize', () => {
    // Re-initialize for responsiveness
    currentLetterIndex = 0; // Reset letter index
    createMessageLetters(); // Re-create letters for new layout
    createStars(); // Re-create stars to fit new dimensions
    // No need to restart fireworks launch on resize if it's continuous
    // If you want fireworks to stop and restart, you'd need to clear intervals
});