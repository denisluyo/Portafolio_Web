// --- Hero 3D background (Three.js) ---
const initHero3D = () => {
    const container = document.getElementById('hero-canvas');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const material = new THREE.PointsMaterial({
        size: 0.005,
        color: '#7C3AED',
        transparent: true,
        opacity: 0.8
    });

    const particlesMesh = new THREE.Points(particlesGeometry, material);
    scene.add(particlesMesh);

    camera.position.z = 3;

    // Mouse movement influence
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    function animate() {
        requestAnimationFrame(animate);

        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x += 0.0005;

        if (mouseX > 0) {
            particlesMesh.rotation.y += (mouseX - window.innerWidth / 2) * 0.00001;
            particlesMesh.rotation.x += (mouseY - window.innerHeight / 2) * 0.00001;
        }

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

// --- Reveal Animations ---
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => revealObserver.observe(el));

// --- Skill bars animation ---
const skillBars = document.querySelectorAll('.skill-progress');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bar = entry.target;
            bar.style.width = bar.getAttribute('data-width');
            skillObserver.unobserve(bar);
        }
    });
}, { threshold: 0.5 });

skillBars.forEach(bar => skillObserver.observe(bar));

// --- Project Filtering with Tabs ---
const tabButtons = document.querySelectorAll('.tab-btn');
const tabIndicator = document.querySelector('.tab-indicator');
const projectCards = document.querySelectorAll('.project-card, .outcome-card');

const updateTabIndicator = (btn) => {
    if (!tabIndicator || !btn) return;
    tabIndicator.style.width = `${btn.offsetWidth}px`;
    tabIndicator.style.left = `${btn.offsetLeft}px`;
};

// Initialize indicator position
window.addEventListener('load', () => {
    const activeBtn = document.querySelector('.tab-btn.active');
    if (activeBtn) updateTabIndicator(activeBtn);
});

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Toggle active class
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateTabIndicator(btn);

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            if (filter === 'all' || category === filter) {
                card.classList.remove('hidden');
                // Re-trigger reveal for filtered items
                setTimeout(() => card.classList.add('active'), 50);
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

window.addEventListener('resize', () => {
    const activeBtn = document.querySelector('.tab-btn.active');
    if (activeBtn) updateTabIndicator(activeBtn);
});

// Initialize
initHero3D();
