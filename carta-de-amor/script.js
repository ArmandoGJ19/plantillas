document.addEventListener('DOMContentLoaded', function() {

    const letterContentEl = document.getElementById('letter-content');
    const heartEl = document.querySelector('.heart');
    const heartPath = document.getElementById('heart-path');

    /* MODIFICAR: El mensaje de la carta */
    const text = "Querido amor de mi vida,\n\n" +
        "Cada día que pasa me doy cuenta de lo afortunado que soy de tenerte a mi lado. Tu sonrisa ilumina mis días más oscuros y tu amor me da la fuerza para enfrentar cualquier desafío.\n\n" +
        "Eres mi refugio en las tormentas, mi alegría en los momentos felices y mi compañero en esta hermosa aventura llamada vida.\n\n" +
        "No existen palabras suficientes para expresar todo lo que sientes en mi corazón, pero quiero que sepas que mi amor por ti crece cada día más fuerte.\n\n" +
        "Gracias por ser exactamente quien eres, por amarme tal como soy y por hacer de cada momento algo especial.\n\n" +
        "Con todo mi amor infinito,\n" +
        "Tu eterno enamorado ❤️";

    /* MODIFICAR: Velocidad de escritura */
    const typingSpeed = 30;

    const heartPathLength = heartPath.getTotalLength();
    heartPath.style.strokeDasharray = heartPathLength;
    heartPath.style.strokeDashoffset = heartPathLength;

    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            letterContentEl.innerHTML += text.charAt(i);
            const progress = i / (text.length - 1);
            const newDashoffset = heartPathLength * (1 - progress);
            heartPath.style.strokeDashoffset = newDashoffset;
            i++;
            setTimeout(typeWriter, typingSpeed);
        } else {
            letterContentEl.classList.add('typing-done');
            heartEl.classList.add('finished');
        }
    }

    typeWriter();

    function createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        document.body.appendChild(sparkle);

        const size = Math.random() * 6 + 2;
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;

        sparkle.style.left = `${x - size / 2}px`;
        sparkle.style.top = `${y - size / 2}px`;

        const randomX = Math.random() * 40 - 20;
        const randomY = Math.random() * 40 - 20;

        sparkle.addEventListener('animationend', () => {
            sparkle.remove();
        });
    }

    document.addEventListener('mousemove', (e) => {
        createSparkle(e.clientX, e.clientY);
    });

    document.addEventListener('touchmove', (e) => {

        if (e.touches.length > 0) {
            createSparkle(e.touches[0].clientX, e.touches[0].clientY);
        }
    });
});