const yesButton = document.getElementById('yesButton');
const noButton = document.getElementById('noButton');
const proposalCard = document.getElementById('proposalCard');
const confettiContainer = document.getElementById('confettiContainer');
const typedTextElement = document.getElementById('typedText');
const letterContainer = document.getElementById('letterContainer');
const closeLetterButton = document.getElementById('closeLetterButton');
const sobre = document.querySelector('.sobre');
const triangulo = document.querySelector('.triangulo');
const heart = document.querySelector('.heart');

// MODIFICAR: El texto principal que se escribe letra por letra.
const textToType = "¿Quieres ser mi novia?";
let currentTextIndex = 0;
// MODIFICAR: Velocidad de la escritura (en milisegundos). Número más bajo = más rápido.
const typingDelay = 150;

// MODIFICAR: Los mensajes que aparecen en el botón "No" cada vez que se mueve.
const noButtonMessages = ["No", "¿En Serio?", "¡Mi corazoncito!", "¡Te daré chocolates!", "¡Última oportunidad!", "¿De verdad de verdad?"];
let noMessageIndex = 0;

function typewriterEffect() {
    if (currentTextIndex < textToType.length) {
        typedTextElement.textContent += textToType.charAt(currentTextIndex);
        currentTextIndex++;
        setTimeout(typewriterEffect, typingDelay);
    }
}

function moveNoButton() {
    const cardRect = proposalCard.getBoundingClientRect();
    const buttonRect = noButton.getBoundingClientRect();
    const maxX = cardRect.width - buttonRect.width - 20;
    const maxY = cardRect.height - buttonRect.height - 20;

    noButton.style.left = `${Math.random() * maxX}px`;
    noButton.style.top = `${Math.random() * maxY}px`;

    noMessageIndex = (noMessageIndex + 1) % noButtonMessages.length;
    noButton.textContent = noButtonMessages[noMessageIndex];
}

function createConfetti() {
    // MODIFICAR: Paleta de colores para el confeti.
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff', '#ffa500', '#800080'];
    // MODIFICAR: Cantidad de confeti que cae.
    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.animationDelay = `${Math.random() * 0.5}s`;
        // MODIFICAR: Duración de la caída del confeti (base de 2s + hasta 3s adicionales).
        confetti.style.animationDuration = `${2 + Math.random() * 3}s`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.transform = `scale(${0.8 + Math.random() * 1.5})`;
        confettiContainer.appendChild(confetti);

        confetti.addEventListener('animationend', () => confetti.remove());
    }
}

function openLetter() {
    triangulo.classList.add('abrir');
    // MODIFICAR: Tiempo de espera (en milisegundos) antes de que el corazón suba.
    setTimeout(() => {
        heart.style.top = '-90px';
        heart.style.opacity = '1';
        heart.style.zIndex = '10';
    }, 500);
}

function closeLetter() {
    triangulo.classList.remove('abrir');
    heart.style.top = '75px';
    heart.style.opacity = '0';
    heart.style.zIndex = '-1';
}

yesButton.addEventListener('click', () => {
    proposalCard.style.display = 'none';
    createConfetti();
    letterContainer.classList.remove('hidden');
    setTimeout(() => {
        openLetter();
    }, 100);
});

noButton.addEventListener('mouseover', moveNoButton);
noButton.addEventListener('click', moveNoButton);

closeLetterButton.addEventListener('click', () => {
    letterContainer.classList.add('hidden');
    proposalCard.style.display = 'block';
    closeLetter();
});

window.addEventListener('load', () => {
    noButton.style.position = 'absolute';
    const yesRect = yesButton.getBoundingClientRect();
    const cardRect = proposalCard.getBoundingClientRect();
    noButton.style.left = `${yesRect.right - cardRect.left + 20}px`;
    noButton.style.top = `${yesRect.top - cardRect.top}px`;
    typewriterEffect();
});

document.addEventListener('click', (event) => {
    if (event.target.closest('#proposalCard') || event.target.closest('#letterContainer')) {
        return;
    }
    const heart = document.createElement('i');
    heart.classList.add('fas', 'fa-heart', 'floating-heart');
    heart.style.left = `${event.clientX}px`;
    heart.style.top = `${event.clientY}px`;
    document.body.appendChild(heart);
    heart.addEventListener('animationend', () => {
        heart.remove();
    });
});