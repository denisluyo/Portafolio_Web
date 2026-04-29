// --- Hero 3D background (Three.js) ---
const initHero3D = () => {
    if (typeof THREE === 'undefined') return;

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
        size: 0.025,
        color: '#7C3AED',
        transparent: true,
        opacity: 0.85,
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

// --- Comments Initialization ---
const initComments = async () => {
    const commentsTrack = document.getElementById('comments-track');
    if (!commentsTrack) return;

    let commentsData = [];

    try {
        const response = await fetch('./data/comments.json');
        if (!response.ok) throw new Error('Network response was not ok');
        commentsData = await response.json();
    } catch (error) {
        console.error('Error loading comments:', error);
        return;
    }

    const renderComments = () => {
        commentsTrack.innerHTML = '';
        const isMobile = window.innerWidth <= 768;
        const readMoreLabel = document.documentElement.lang === 'en' ? 'Read more' : 'Leer más';

        commentsData.forEach((comment, index) => {
            const card = document.createElement('div');
            card.className = 'comment-card glass reveal active';

            const fullText = comment.public_comment;
            const truncated = fullText.length > 200 ? fullText.substring(0, 200).trim() + '...' : fullText;
            const tags = comment.impact_tag ? comment.impact_tag.split('|').map(tag => `<span class="comment-tag">${tag.trim()}</span>`).join('') : '';

            card.innerHTML = `
                <h4 class="comment-author">${comment.author_name}</h4>
                <p class="comment-role">${comment.author_role}</p>
                <div class="comment-tags">${tags}</div>
                <div class="comment-text">${truncated}</div>
                <span class="comment-read-more">${readMoreLabel} &rarr;</span>
            `;

            if (isMobile) {
                card.addEventListener('click', () => openBottomSheet(comment));
            } else {
                card.addEventListener('click', () => openCommentModal(comment));
            }

            commentsTrack.appendChild(card);
        });
    };

    // Initial render
    renderComments();

    // Re-render on resize to handle text truncation correctly
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(renderComments, 200);
    });
};

// --- Bottom Sheet Logic ---
const openBottomSheet = (comment) => {
    const overlay = document.getElementById('bs-overlay');
    const sheet = document.getElementById('bottom-sheet');
    
    if (!overlay || !sheet) return;

    document.getElementById('bs-author-name').textContent = comment.author_name;
    document.getElementById('bs-author-role').textContent = comment.author_role;
    document.getElementById('bs-public-comment').textContent = comment.public_comment;

    const tagsContainer = document.querySelector('.bs-tags');
    if (comment.impact_tag && tagsContainer) {
        tagsContainer.innerHTML = comment.impact_tag.split('|').map(tag => `<span id="bs-impact-tag">${tag.trim()}</span>`).join(' ');
    }

    overlay.classList.add('active');
    sheet.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling on background
};

const closeBottomSheet = () => {
    const overlay = document.getElementById('bs-overlay');
    const sheet = document.getElementById('bottom-sheet');
    
    if (overlay) overlay.classList.remove('active');
    if (sheet) sheet.classList.remove('active');
    document.body.style.overflow = '';
};

// Setup bottom sheet event listeners
document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.getElementById('bs-close');
    const overlay = document.getElementById('bs-overlay');

    if (closeBtn) closeBtn.addEventListener('click', closeBottomSheet);
    if (overlay) overlay.addEventListener('click', closeBottomSheet);
});

// --- Comment Modal Logic (Desktop) ---
const openCommentModal = (comment) => {
    const overlay = document.getElementById('comment-modal-overlay');
    const modal = document.getElementById('comment-modal');
    if (!overlay || !modal) return;

    document.getElementById('cm-author-name').textContent = comment.author_name;
    document.getElementById('cm-author-role').textContent = comment.author_role;
    document.getElementById('cm-comment-text').textContent = comment.public_comment;

    const tagsContainer = document.getElementById('cm-tags');
    if (tagsContainer) {
        tagsContainer.innerHTML = comment.impact_tag
            ? comment.impact_tag.split('|').map(tag => `<span class="comment-tag">${tag.trim()}</span>`).join('')
            : '';
    }

    overlay.classList.add('active');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

const closeCommentModal = () => {
    const overlay = document.getElementById('comment-modal-overlay');
    const modal = document.getElementById('comment-modal');
    if (overlay) overlay.classList.remove('active');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
};

document.addEventListener('DOMContentLoaded', () => {
    const modalOverlay = document.getElementById('comment-modal-overlay');
    const modalClose = document.getElementById('cm-close');
    if (modalClose) modalClose.addEventListener('click', closeCommentModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeCommentModal);
});

// Initialize Comments
initComments();
