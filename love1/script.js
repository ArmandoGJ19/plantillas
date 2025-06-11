document.addEventListener('DOMContentLoaded', () => {
    const chasers = document.querySelectorAll('.neon-chaser');
    // MODIFICAR: Longitud del trozo de neón visible (número más grande = trazo más largo)
    const neonSegmentLength = 100;

    chasers.forEach(chaserPath => {
        const pathLength = chaserPath.getTotalLength();
        chaserPath.style.setProperty('--path-length', pathLength);
        chaserPath.style.setProperty('--path-length-negative', -pathLength);
        const gapLength = pathLength - neonSegmentLength;
        chaserPath.style.strokeDasharray = `${neonSegmentLength} ${gapLength}`;
    });
});