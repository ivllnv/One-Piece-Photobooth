// animations.js

const floatingContainer = document.querySelector('.floating-container');

// Array of images to animate
const images = [
    'assets/strawhat.png',
    'assets/sunny.png',
    'assets/devil-fruit.png'
];

// Store floating items
const floaters = [];
const NUM_FLOATERS = 10; // number of animated images

// Initialize floating images
for (let i = 0; i < NUM_FLOATERS; i++) {
    const img = document.createElement('img');
    img.src = images[i % images.length];
    img.classList.add('floating-item');
    img.style.position = 'absolute';
    img.style.width = '30px'; // smaller size
    img.style.top = -50 - Math.random() * 200 + 'px'; // start above viewport
    img.style.left = Math.random() * (window.innerWidth - 30) + 'px'; // avoid going beyond right edge
    img.style.pointerEvents = 'none';
    img.style.userSelect = 'none';
    img.style.transformOrigin = 'center';
    floatingContainer.appendChild(img);

    floaters.push({
        el: img,
        speed: 1 + Math.random() * 2, // vertical speed
        sway: Math.random() * 2,       // sway amplitude
        angle: Math.random() * 360,    // starting rotation
        swaySpeed: 0.02 + Math.random() * 0.02 // rotation speed
    });
}

// Animation loop
function animate() {
    floaters.forEach(f => {
        let currentTop = parseFloat(f.el.style.top);
        currentTop += f.speed;

        // Reset to top if it goes below viewport
        if (currentTop > window.innerHeight) {
            currentTop = -50 - Math.random() * 50;
            f.el.style.left = Math.random() * window.innerWidth + 'px';
        }

        // Update sway rotation
        f.angle += f.swaySpeed * 360;
        f.el.style.transform = `rotate(${Math.sin(f.angle) * f.sway}deg)`;

        f.el.style.top = currentTop + 'px';
    });

    requestAnimationFrame(animate);
}

// Start animation
animate();

// Adjust positions if window is resized
window.addEventListener('resize', () => {
    floaters.forEach(f => {
        f.el.style.left = Math.random() * window.innerWidth + 'px';
    });
});
