// Initialize Lucide Icons
lucide.createIcons();

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// Preloader Logic (Singularity Pull)
document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    const particlesField = document.querySelector('.particles-field');
    const progressText = document.querySelector('.load-progress');
    const singularity = document.querySelector('.singularity');
    const shockwave = document.querySelector('.shockwave');
    const particleCount = 120;
    const particles = [];

    // Create Particles
    for (let i = 0; i < particleCount; i++) {
        const p = document.createElement('div');
        p.className = 'particle';

        const angle = Math.random() * Math.PI * 2;
        const radius = Math.max(window.innerWidth, window.innerHeight) * (0.6 + Math.random() * 0.4);
        const x = Math.cos(angle) * radius + window.innerWidth / 2;
        const y = Math.sin(angle) * radius + window.innerHeight / 2;

        gsap.set(p, { x, y, scale: Math.random() * 2 + 1 });
        particlesField.appendChild(p);
        particles.push(p);
    }

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 5 + 2;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            finishLoading();
        }
        progressText.innerText = Math.floor(progress) + "%";

        const pullFactor = progress / 100;

        // Intensify Singularity
        gsap.to(singularity, {
            scale: 1 + (pullFactor * 4),
            boxShadow: `0 0 ${20 + pullFactor * 60}px ${2 + pullFactor * 8}px #fff`,
            duration: 0.4
        });

        // Pull a subset of particles for performance
        particles.forEach((p, i) => {
            if (Math.random() > 0.7 || progress > 80) {
                gsap.to(p, {
                    x: window.innerWidth / 2,
                    y: window.innerHeight / 2,
                    opacity: 0.1 + (1 - pullFactor),
                    duration: 1.0,
                    ease: "power2.in"
                });
            }
        });
    }, 80);

    function finishLoading() {
        gsap.timeline()
            .to(shockwave, {
                opacity: 1,
                scale: 150,
                duration: 1.5,
                ease: "power4.inOut",
                onStart: () => {
                    singularity.style.opacity = '0';
                    progressText.style.opacity = '0';
                },
                onComplete: () => {
                    preloader.style.display = 'none';
                }
            })
            // Start Hero Animation halfway through the shockwave
            .to(preloader, {
                opacity: 0,
                duration: 0.5,
            }, "-=0.8")
            .add(() => {
                startHeroAnimation();
            }, "-=1.0");
    }

    function startHeroAnimation() {
        const tl = gsap.timeline();

        // Target the hero section for a subtle scale-in effect
        gsap.from('section', {
            scale: 1.1,
            filter: 'blur(10px)',
            duration: 2,
            ease: 'power2.out'
        });

        tl.to('#hero-title', {
            opacity: 1,
            y: 0,
            duration: 1.5,
            ease: 'power4.out',
            stagger: 0.2
        })
            .to('#hero-desc', {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: 'power3.out'
            }, '-=1.2')
            .to('#hero-btns', {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power2.out',
                onComplete: () => {
                    // Show modal 2 seconds after hero loads
                    setTimeout(showOfferModal, 2000);
                }
            }, '-=1.0')
            .from('nav', {
                y: -20,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            }, '-=1.5');
    }
});

const modalOverlay = document.getElementById('modal-overlay');

// Offer Modal Logic
const offerModal = document.getElementById('offer-modal');
const closeModal = document.getElementById('close-modal');
const modalForm = document.getElementById('modal-form');

function showOfferModal() {
    if (!localStorage.getItem('offerDismissed')) {
        offerModal.classList.add('modal-visible');
        document.body.style.overflow = 'hidden';
    }
}

function dismissModal() {
    offerModal.classList.remove('modal-visible');
    document.body.style.overflow = '';
    localStorage.setItem('offerDismissed', 'true');
}

if (closeModal) {
    closeModal.addEventListener('click', dismissModal);
    closeModal.addEventListener('touchstart', (e) => {
        e.preventDefault();
        dismissModal();
    }, { passive: false });
}

if (modalOverlay) {
    modalOverlay.addEventListener('click', dismissModal);
}

if (modalForm) {
    modalForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = modalForm.querySelector('button');
        const originalText = btn.innerHTML;

        const formData = new FormData(modalForm);
        const data = Object.fromEntries(formData.entries());

        btn.innerHTML = 'Securing Access...';
        btn.style.opacity = '0.7';
        btn.disabled = true;

        try {
            const response = await fetch('https://formspree.io/f/mqeddwwr', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                btn.innerHTML = 'Access Secured!';
                btn.style.backgroundColor = '#00f2ff';
                btn.style.color = '#000';
                setTimeout(() => {
                    dismissModal();
                }, 1500);
            } else {
                btn.innerHTML = 'Try Again';
                btn.disabled = false;
            }
        } catch (error) {
            btn.innerHTML = 'Error';
            btn.disabled = false;
        }
    });
}

// Custom Cursor Movement
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;

    // Background Blobs
    const xPosBg = (clientX / window.innerWidth - 0.5) * 40;
    const yPosBg = (clientY / window.innerHeight - 0.5) * 40;

    gsap.to('#blob1', {
        x: xPosBg,
        y: yPosBg,
        duration: 2,
        ease: 'power2.out'
    });

    gsap.to('#blob2', {
        x: -xPosBg,
        y: -yPosBg,
        duration: 2.5,
        ease: 'power2.out'
    });

    // Cursor Tracking
    gsap.to(cursorDot, {
        x: clientX,
        y: clientY,
        duration: 0.1
    });

    gsap.to(cursorOutline, {
        x: clientX - 16,
        y: clientY - 16,
        duration: 0.3
    });
});

// Spotlight Effect Tracking
document.querySelectorAll('.spotlight-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Reveal Animations on Scroll
const reveals = document.querySelectorAll('.reveal');
reveals.forEach((el) => {
    gsap.from(el, {
        scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out'
    });
});

// Horizontal Reveal for About Section
gsap.utils.toArray('.reveal-left').forEach(el => {
    gsap.from(el, {
        scrollTrigger: {
            trigger: el,
            start: 'top 85%',
        },
        opacity: 0,
        x: -50,
        duration: 1.2,
        ease: 'power3.out'
    });
});

gsap.utils.toArray('.reveal-right').forEach(el => {
    gsap.from(el, {
        scrollTrigger: {
            trigger: el,
            start: 'top 85%',
        },
        opacity: 0,
        x: 50,
        duration: 1.2,
        ease: 'power3.out'
    });
});

// Contact Form Handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const originalText = btn.innerHTML;

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        btn.innerHTML = 'Establishing Link...';
        btn.style.opacity = '0.7';
        btn.disabled = true;

        try {
            const response = await fetch('https://formspree.io/f/mqeddwwr', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                btn.innerHTML = 'Signal Received. Welcome to Orbit.';
                btn.style.backgroundColor = '#00f2ff';
                btn.style.color = '#000';
                contactForm.reset();
            } else {
                btn.innerHTML = 'Signal Interrupted. Try Again.';
                btn.style.backgroundColor = '#ff4444';
                btn.disabled = false;
            }
        } catch (error) {
            btn.innerHTML = 'Singularity Error. Refresh Page.';
            btn.style.backgroundColor = '#ff4444';
            btn.disabled = false;
        }

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.opacity = '1';
            btn.disabled = false;
            btn.style.backgroundColor = '';
            btn.style.color = '';
        }, 5000);
    });
}


// Floating Animation for Service Icons
gsap.to('.service-card i', {
    y: -8,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    stagger: {
        amount: 1,
        from: 'random'
    }
});

// Back to Top & Circular Progress
const nav = document.querySelector('nav');
const progressWrap = document.getElementById('progress-wrap');
const progressPath = document.getElementById('progress-path');
const pathLength = progressPath.getTotalLength();

progressPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
progressPath.style.strokeDashoffset = pathLength;

const updateProgress = () => {
    const scroll = window.pageYOffset;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const progress = pathLength - (scroll * pathLength / height);
    progressPath.style.strokeDashoffset = progress;

    if (scroll > 150) {
        progressWrap.classList.add('active-progress');
    } else {
        progressWrap.classList.remove('active-progress');
    }
};

window.addEventListener('scroll', () => {
    // Navbar
    if (window.scrollY > 50) {
        nav.classList.add('py-2');
        nav.classList.remove('py-4');
    } else {
        nav.classList.add('py-4');
        nav.classList.remove('py-2');
    }

    updateProgress();
});

progressWrap.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Mobile Menu Toggle
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.createElement('div');
mobileMenu.className = 'fixed inset-0 bg-[#050505] z-[60] flex flex-col items-center justify-center space-y-8 opacity-0 pointer-events-none transition-all duration-500';
mobileMenu.innerHTML = `
    <button class="absolute top-6 right-6 text-white" id="close-btn">
        <i data-lucide="x"></i>
    </button>
    <a href="#about" class="text-3xl font-bold font-heading hover:text-[#00f2ff] transition-colors">About</a>
    <a href="#services" class="text-3xl font-bold font-heading hover:text-[#00f2ff] transition-colors">Services</a>
    <a href="#features" class="text-3xl font-bold font-heading hover:text-[#00f2ff] transition-colors">Benefits</a>
    <a href="#contact" class="px-8 py-3 bg-[#00f2ff] text-black font-bold rounded-xl">Get Started</a>
`;
document.body.appendChild(mobileMenu);
lucide.createIcons();

const closeBtn = document.getElementById('close-btn');

menuBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
    gsap.from(mobileMenu.querySelectorAll('a'), {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
        ease: 'power2.out'
    });
});

closeBtn.addEventListener('click', () => {
    mobileMenu.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';
});

closeBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    mobileMenu.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';
}, { passive: false });

const mobileLinks = mobileMenu.querySelectorAll('a');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('opacity-0', 'pointer-events-none');
        document.body.style.overflow = '';
    });
});

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Floating Animation for Background Blobs
gsap.to('#blob1', {
    x: '+=100',
    y: '+=50',
    duration: 10,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
});

gsap.to('#blob2', {
    x: '-=120',
    y: '+=80',
    duration: 12,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    delay: 1
});

// Floating Animation for Hero Glow
gsap.to('.hero-glow', {
    scale: 1.2,
    duration: 8,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
});

const orbitIconsList = document.querySelectorAll('.orbit-icon');
const gravityOrbitData = [];
const screenWidth = window.innerWidth;
const isMobile = screenWidth < 768;
const isSmallMobile = screenWidth < 400;
const baseRadius = isSmallMobile ? 65 : (isMobile ? 85 : 110);

orbitIconsList.forEach((icon, index) => {
    gravityOrbitData.push({
        el: icon,
        angle: (index / orbitIconsList.length) * Math.PI * 2,
        radius: baseRadius + (Math.random() * 15), // Slight variation
        speed: 0.005 + (Math.random() * 0.005),
        isPulled: false
    });
});

function updateOrbit() {
    gravityOrbitData.forEach(data => {
        if (!data.isPulled) {
            data.angle += data.speed;
            const x = Math.cos(data.angle) * data.radius;
            const y = Math.sin(data.angle) * data.radius;

            gsap.set(data.el, {
                x: x,
                y: y,
                z: Math.sin(data.angle) * 50 // Subtle 3D depth
            });
        }
    });
    requestAnimationFrame(updateOrbit);
}
updateOrbit();

// Periodic Pulling Effect
function triggerGravityPull() {
    const randomIdx = Math.floor(Math.random() * gravityOrbitData.length);
    const targetData = gravityOrbitData[randomIdx];

    if (targetData.isPulled) return; // Prevent double pulling

    targetData.isPulled = true;

    const tl = gsap.timeline({
        onComplete: () => {
            targetData.isPulled = false;
        }
    });

    tl.to(targetData.el, {
        x: 0,
        y: 0,
        z: 100,
        scale: 0.6,
        duration: 1.5,
        ease: "power2.inOut"
    })
        .to(targetData.el, {
            x: Math.cos(targetData.angle) * targetData.radius,
            y: Math.sin(targetData.angle) * targetData.radius,
            z: 0,
            scale: 1,
            duration: 1.2,
            ease: "elastic.out(1, 0.75)"
        }, "+=0.5");
}

// Trigger pull every 4-7 seconds
setInterval(triggerGravityPull, 5000);

const horizonIcons = document.querySelectorAll('.horizon-orbit');
const horizonData = [];
const horizRadius = isSmallMobile ? 100 : (isMobile ? 130 : 180);

horizonIcons.forEach((icon, index) => {
    horizonData.push({
        el: icon,
        angle: (index / horizonIcons.length) * Math.PI * 2,
        radius: horizRadius,
        speed: 0.003, // Slower for immersive feel
    });
});

function updateHorizonOrbit() {
    horizonData.forEach(data => {
        data.angle += data.speed;
        const x = Math.cos(data.angle) * data.radius;
        const y = Math.sin(data.angle) * (data.radius * 0.4); // Elliptical orbit for 3D feel

        gsap.set(data.el, {
            x: x,
            y: y,
            z: Math.sin(data.angle) * 100,
            scale: 0.8 + (Math.sin(data.angle) + 1) * 0.2
        });
    });
    requestAnimationFrame(updateHorizonOrbit);
}
updateHorizonOrbit();
// Price Disruption Reveal
gsap.utils.toArray('.price-disrupt').forEach(box => {
    ScrollTrigger.create({
        trigger: box,
        start: 'top 75%',
        onEnter: () => box.classList.add('active'),
        once: true
    });
});

// 3D Card Tilt Effect
const card3d = document.querySelector('.floating-3d-card');
const tiltWrapper = document.querySelector('.tilt-wrapper');

if (tiltWrapper && card3d) {
    tiltWrapper.addEventListener('mousemove', (e) => {
        const rect = tiltWrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        gsap.to(card3d, {
            rotateX: rotateX,
            rotateY: rotateY,
            scale: 1.05,
            duration: 0.5,
            ease: 'power2.out'
        });
    });

    tiltWrapper.addEventListener('mouseleave', () => {
        gsap.to(card3d, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.5,
            ease: 'power2.out'
        });
    });
}

// Floating animation for the 3D Card
gsap.to(card3d, {
    y: -20,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
});

// Masterpieces Phone Swap Animation
const masterpieceTL = gsap.timeline({
    scrollTrigger: {
        trigger: "#masterpieces",
        start: "top top",
        end: "+=200%",
        scrub: 1.5,
        pin: true,
        anticipatePin: 1
    }
});

if (window.innerWidth > 1100) {
    // Initial states: Info cards hidden and slightly offset for a "slide-in" reveal
    gsap.set(".fashion-info", { opacity: 0, x: 50 });
    gsap.set(".tech-info", { opacity: 0, x: -50 });

    masterpieceTL.to("#phone-fashion", {
        x: -400, // Move further out
        rotateY: 0,
        rotateX: 0,
        z: 0,
        duration: 3,
        ease: "power2.inOut"
    }, 0)
        .to("#phone-tech", {
            x: 400, // Move further out
            rotateY: 0,
            rotateX: 0,
            z: 0,
            duration: 3,
            ease: "power2.inOut"
        }, 0)
        // Reveal info cards with a smooth slide and fade
        .to(".fashion-info", {
            opacity: 1,
            x: -20, // Final position adjustment
            duration: 1.5,
            pointerEvents: "auto"
        }, 1.2)
        .to(".tech-info", {
            opacity: 1,
            x: 20, // Final position adjustment
            duration: 1.5,
            pointerEvents: "auto"
        }, 1.2);
} else {
    // Mobile specific reveal
    gsap.utils.toArray('.masterpiece-phone').forEach(phone => {
        gsap.from(phone, {
            scrollTrigger: {
                trigger: phone,
                start: "top 85%",
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });
}
