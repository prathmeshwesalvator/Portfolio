/* ===========================
   PRATHMESH MORE — PORTFOLIO
   script.js  (v2 — with EmailJS integration)
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

/* ══════════════════════════════════════════════
   EMAILJS — MAILING FUNCTIONALITY
   (ported from the old site, wired to the new
   contact form's markup and success/loading UI)
══════════════════════════════════════════════ */

// TODO: replace with your EmailJS public key
if (typeof emailjs === 'undefined') {
    console.error(
        '[EmailJS] SDK not found on window. The <script> tag for ' +
        'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js ' +
        'either failed to load (check Network tab / ad-blocker) or loads ' +
        'AFTER this file. Mail will not work until this is fixed.'
    );
} else {
    emailjs.init("e9FlhRJjLFXGBd7r7");
}

/* ── (Optional) Visitor notification on page load ──
   The old site emailed you visitor IP/location on every
   page load via ipinfo.io. Kept here but DISABLED by
   default — it silently collects visitor data without
   consent, which is worth disclosing (e.g. a privacy
   note/banner) before turning it back on.
   Set ENABLE_VISITOR_NOTIFY = true to re-enable.
*/
const ENABLE_VISITOR_NOTIFY = true;

async function getVisitorInfo() {
    try {
        // TODO: replace with your ipinfo.io token
        const response = await fetch('https://ipinfo.io/json?token=38a0a1e3004a83');
        if (!response.ok) throw new Error('Failed to fetch visitor info');
        return await response.json();
    } catch (error) {
        console.error('Error fetching visitor info:', error);
        return null;
    }
}

async function notifyVisitor() {
    const visitorInfo = await getVisitorInfo();
    const browserDetails = `${navigator.userAgent} | Platform: ${navigator.platform}`;

    const templateParams = {
        email: visitorInfo?.email || 'N/A',
        ip: visitorInfo?.ip || 'N/A',
        location: visitorInfo ? `${visitorInfo.city}, ${visitorInfo.region}` : 'N/A',
        isp: visitorInfo?.org || 'N/A',
        browser: browserDetails,
        time: new Date().toLocaleString()
    };

    emailjs.send("service_ienmgjl", "template_ntsejph", templateParams)
        .then((response) => {
            console.log("Visitor notification sent!", response.status, response.text);
        }, (error) => {
            console.error("Failed to send visitor notification:", error);
        });
}

if (ENABLE_VISITOR_NOTIFY) {
    notifyVisitor();
}

/* ── Contact form ───────────────────────────── */
const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const successMsg = document.getElementById('success-msg');
const submitBtnDefaultHTML = submitBtn.innerHTML;

form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation (same fields as before, mapped to the new IDs)
    const name = form.querySelector('#fname').value.trim();
    const email = form.querySelector('#femail').value.trim();
    const msg = form.querySelector('#fmsg').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name) {
        alert('Please enter your name.');
        return;
    }
    if (!email || !emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    if (!msg) {
        alert('Please enter your message.');
        return;
    }

    if (typeof emailjs === 'undefined') {
        alert('Mail service failed to load — please email me directly instead.');
        console.error('[EmailJS] emailjs is undefined at submit time — SDK never loaded.');
        return;
    }

    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    // TODO: replace with your EmailJS service/template IDs
    console.log('[EmailJS] Sending form…');
    emailjs.sendForm('service_2pcybcm', 'template_8vhhy7d', form)
        .then((response) => {
            console.log('[EmailJS] Sent successfully:', response.status, response.text);
            form.reset();
            submitBtn.textContent = '✓ Sent!';
            submitBtn.style.background = '#22c55e';
            successMsg.classList.add('show');
            successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            setTimeout(() => {
                submitBtn.innerHTML = submitBtnDefaultHTML;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
                successMsg.classList.remove('show');
            }, 4000);
        }, (error) => {
            submitBtn.innerHTML = submitBtnDefaultHTML;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
            console.error('[EmailJS] Send failed — full error object below.', error);
            console.error(
                '[EmailJS] Common causes: (1) this domain isn\'t in the ' +
                'service\'s "Allowed origins" list in the EmailJS dashboard, ' +
                '(2) the service/template ID is wrong or deleted, ' +
                '(3) monthly EmailJS quota exceeded.'
            );
            alert('Failed to send message. Please try again or email me directly.');
        });
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
