// =============================================
//  AquaPay Water Billing System — script.js
// =============================================

/* ---- Loader ---- */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 700);
  }
});

/* ---- Sticky Nav + scroll class ---- */
const nav = document.querySelector('.nav');
const backTop = document.getElementById('back-top');

window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 30);
  if (backTop) backTop.classList.toggle('visible', window.scrollY > 400);
});

/* ---- Back-to-top ---- */
if (backTop) {
  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---- Active nav link ---- */
function setActiveNav() {
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}
setActiveNav();

/* ---- Mobile menu ---- */
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  // close on link click
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
}

/* ---- Theme toggle ---- */
const themeToggle = document.querySelectorAll('.theme-toggle');
const savedTheme = localStorage.getItem('aquapay-theme') || 'dark';
if (savedTheme === 'light') document.body.classList.add('light');
updateThemeIcons();

themeToggle.forEach(btn => {
  btn.addEventListener('click', () => {
    document.body.classList.toggle('light');
    const theme = document.body.classList.contains('light') ? 'light' : 'dark';
    localStorage.setItem('aquapay-theme', theme);
    updateThemeIcons();
  });
});

function updateThemeIcons() {
  const isLight = document.body.classList.contains('light');
  document.querySelectorAll('.theme-toggle i').forEach(icon => {
    icon.className = isLight ? 'fas fa-moon' : 'fas fa-sun';
  });
}

/* ---- Scroll reveal ---- */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  observer.observe(el);
});

/* ---- Animated counters ---- */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString() + (el.dataset.suffix || '');
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

/* ---- Hero particles (index only) ---- */
const particleContainer = document.querySelector('.hero-particles');
if (particleContainer) {
  for (let i = 0; i < 18; i++) {
    const span = document.createElement('span');
    const size = Math.random() * 14 + 4;
    span.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      animation-duration: ${Math.random() * 12 + 8}s;
      animation-delay: ${Math.random() * -15}s;
    `;
    particleContainer.appendChild(span);
  }
}

/* ---- Live card display (payment page) ---- */
const cardNumberInput   = document.getElementById('cardNumber');
const cardHolderInput   = document.getElementById('cardHolder');
const cardExpiryInput   = document.getElementById('expiry');
const cardNumberDisplay = document.getElementById('cardNumberDisplay');
const cardHolderDisplay = document.getElementById('cardHolderDisplay');
const cardExpiryDisplay = document.getElementById('cardExpiryDisplay');
const cardNetworkIcon   = document.getElementById('cardNetworkIcon');

if (cardNumberInput) {
  cardNumberInput.addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '').substring(0, 16);
    this.value = v.replace(/(.{4})/g, '$1 ').trim();
    const display = v.padEnd(16, '•').replace(/(.{4})/g, '$1 ').trim();
    if (cardNumberDisplay) cardNumberDisplay.textContent = display;
    // detect network
    if (cardNetworkIcon) {
      if (/^4/.test(v))      cardNetworkIcon.innerHTML = '<i class="fab fa-cc-visa"></i>';
      else if (/^5/.test(v)) cardNetworkIcon.innerHTML = '<i class="fab fa-cc-mastercard"></i>';
      else if (/^3[47]/.test(v)) cardNetworkIcon.innerHTML = '<i class="fab fa-cc-amex"></i>';
      else cardNetworkIcon.innerHTML = '<i class="fas fa-credit-card"></i>';
    }
  });
}
if (cardHolderInput) {
  cardHolderInput.addEventListener('input', function () {
    if (cardHolderDisplay) cardHolderDisplay.textContent = this.value || 'FULL NAME';
  });
}
if (cardExpiryInput) {
  cardExpiryInput.addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '').substring(0, 4);
    if (v.length >= 3) v = v.slice(0,2) + '/' + v.slice(2);
    this.value = v;
    if (cardExpiryDisplay) cardExpiryDisplay.textContent = this.value || 'MM/YY';
  });
}

// Live amount update in summary
const amountInput = document.getElementById('amount');
const summaryAmount = document.getElementById('summaryAmount');
const summaryTotal  = document.getElementById('summaryTotal');

if (amountInput) {
  amountInput.addEventListener('input', function () {
    const val = parseFloat(this.value) || 0;
    const fee = 2.50;
    if (summaryAmount) summaryAmount.textContent = `KSh ${val.toFixed(2)}`;
    if (summaryTotal)  summaryTotal.textContent  = `KSh ${(val + fee).toFixed(2)}`;
  });
}

/* ---- Payment form validation ---- */
const paymentForm = document.getElementById('paymentForm');
const successOverlay = document.getElementById('successOverlay');
const closeSuccess   = document.getElementById('closeSuccess');
const payRef = document.getElementById('payRef');

if (paymentForm) {
  paymentForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;

    // validate fields
    const fields = [
      { id: 'fullName',   rule: v => v.trim().length >= 3,       msg: 'Enter your full name (min 3 chars).' },
      { id: 'accountNo',  rule: v => /^\d{6,12}$/.test(v.trim()), msg: 'Account number: 6-12 digits.' },
      { id: 'email',      rule: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: 'Enter a valid email.' },
      { id: 'phone',      rule: v => /^\+?[\d\s\-]{8,15}$/.test(v), msg: 'Enter a valid phone number.' },
      { id: 'amount',     rule: v => parseFloat(v) >= 1,          msg: 'Enter a valid amount.' },
      { id: 'cardHolder', rule: v => v.trim().length >= 3,       msg: 'Enter cardholder name.' },
      { id: 'cardNumber', rule: v => v.replace(/\s/g,'').length === 16, msg: 'Card number must be 16 digits.' },
      { id: 'expiry',     rule: v => /^\d{2}\/\d{2}$/.test(v),   msg: 'Format: MM/YY' },
      { id: 'cvv',        rule: v => /^\d{3,4}$/.test(v),         msg: '3 or 4 digit CVV.' },
    ];

    fields.forEach(({ id, rule, msg }) => {
      const input = document.getElementById(id);
      if (!input) return;
      const group = input.closest('.form-group');
      const errEl = group.querySelector('.error-msg');
      if (!rule(input.value)) {
        group.classList.add('invalid');
        if (errEl) errEl.textContent = msg;
        valid = false;
      } else {
        group.classList.remove('invalid');
      }
    });

    if (!valid) {
      // scroll to first invalid
      const firstInvalid = paymentForm.querySelector('.form-group.invalid input');
      if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // simulate processing
    const btn = paymentForm.querySelector('.btn-pay');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing…';

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-lock"></i> Pay Securely';
      if (payRef) payRef.textContent = 'REF-' + Math.random().toString(36).substring(2,10).toUpperCase();
      if (successOverlay) successOverlay.classList.add('show');
    }, 2200);
  });

  // live remove invalid class on input
  paymentForm.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
      input.closest('.form-group').classList.remove('invalid');
    });
  });
}

if (closeSuccess && successOverlay) {
  closeSuccess.addEventListener('click', () => {
    successOverlay.classList.remove('show');
    paymentForm.reset();
    if (cardNumberDisplay) cardNumberDisplay.textContent = '•••• •••• •••• ••••';
    if (cardHolderDisplay) cardHolderDisplay.textContent = 'FULL NAME';
    if (cardExpiryDisplay) cardExpiryDisplay.textContent = 'MM/YY';
    if (cardNetworkIcon)   cardNetworkIcon.innerHTML = '<i class="fas fa-credit-card"></i>';
    if (summaryAmount) summaryAmount.textContent = 'KSh 0.00';
    if (summaryTotal)  summaryTotal.textContent  = 'KSh 2.50';
  });
}

/* ---- Contact form ---- */
const contactForm = document.getElementById('contactForm');
const contactSuccess = document.getElementById('contactSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const fields = [
      { id: 'cName',  rule: v => v.trim().length >= 2, msg: 'Name must be at least 2 characters.' },
      { id: 'cEmail', rule: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: 'Enter a valid email.' },
      { id: 'cMsg',   rule: v => v.trim().length >= 10, msg: 'Message must be at least 10 characters.' },
    ];

    let valid = true;
    fields.forEach(({ id, rule, msg }) => {
      const input = document.getElementById(id);
      if (!input) return;
      const group = input.closest('.form-group');
      const errEl = group.querySelector('.error-msg');
      if (!rule(input.value)) {
        group.classList.add('invalid');
        if (errEl) errEl.textContent = msg;
        valid = false;
      } else {
        group.classList.remove('invalid');
      }
    });

    if (!valid) return;

    const btn = contactForm.querySelector('.btn-contact');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      contactForm.reset();
      if (contactSuccess) contactSuccess.classList.add('show');
      setTimeout(() => contactSuccess && contactSuccess.classList.remove('show'), 5000);
    }, 1800);
  });

  contactForm.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', () => el.closest('.form-group').classList.remove('invalid'));
  });
}

/* ---- Smooth reveal delay on stagger items ---- */
document.querySelectorAll('.features-grid .feature-card, .values-grid .value-card, .team-grid .team-card, .testimonials-grid .testi-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.08}s`;
  card.classList.add('reveal');
  observer.observe(card);
});
