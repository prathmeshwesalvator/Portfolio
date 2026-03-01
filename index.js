/* ===========================
   PRATHMESH MORE — PORTFOLIO
   script.js  (v2)
   =========================== */

/* ── Nav scroll shrink ──────────────────────── */
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 50);
window.addEventListener('scroll', onScroll, { passive: true });

/* ── Mobile menu ────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileClose = document.getElementById('mobile-close');

function openMobileMenu() {
    mobileMenu.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
    mobileMenu.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
});
mobileClose.addEventListener('click', closeMobileMenu);

// Close on outside tap
mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) closeMobileMenu();
});

// Close on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMobileMenu();
});

/* ── Scroll reveal ──────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObs.unobserve(entry.target); // fire once only
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObs.observe(el));

/* ── Active nav link highlighting ───────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === '#' + id);
            });
        }
    });
}, { threshold: 0.35 });
sections.forEach(s => sectionObs.observe(s));

/* ── Contact form ───────────────────────────── */
const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const successMsg = document.getElementById('success-msg');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const name = form.querySelector('#fname').value.trim();
    const email = form.querySelector('#femail').value.trim();
    const msg = form.querySelector('#fmsg').value.trim();
    if (!name || !email || !msg) return;

    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    // Simulate async send — replace with EmailJS / Formspree in production
    setTimeout(() => {
        form.reset();
        submitBtn.textContent = '✓ Sent!';
        submitBtn.style.background = '#22c55e';
        successMsg.classList.add('show');
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        setTimeout(() => {
            submitBtn.textContent = 'Send Message';
            submitBtn.style.background = '';
            submitBtn.disabled = false;
            successMsg.classList.remove('show');
        }, 4000);
    }, 1200);
});

/* ── Subtle cursor glow (desktop pointer only) ── */
if (window.matchMedia('(pointer:fine) and (min-width:860px)').matches) {
    const glow = document.createElement('div');
    glow.style.cssText = [
        'position:fixed', 'width:320px', 'height:320px', 'border-radius:50%',
        'background:radial-gradient(circle,rgba(0,230,140,.04) 0%,transparent 70%)',
        'pointer-events:none', 'transform:translate(-50%,-50%)',
        'transition:left .15s ease,top .15s ease', 'z-index:9998',
        'will-change:left,top'
    ].join(';');
    document.body.appendChild(glow);
    document.addEventListener('mousemove', e => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    }, { passive: true });
}

/* ── Smooth scroll polyfill fallback ───────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});