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
  const path = location.pathname;
  const current = path.split('/').pop() || 'index.html';
  const isPaymentFlow = path.includes('/payment/');

  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (isPaymentFlow && href === 'payment.html') {
      a.classList.add('active');
      return;
    }
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

/* ---- Payment helpers (payment page) ---- */
const PAYSTACK_BASE_URL = 'https://paystacktest-production.up.railway.app';
const SERVICE_FEE = 0;

const amountInput = document.getElementById('amount');
const summaryAmount = document.getElementById('summaryAmount');
const summaryTotal = document.getElementById('summaryTotal');
const paymentStatus = document.getElementById('paymentStatus');

function formatUsd(value) {
  return `USD ${Number(value).toFixed(2)}`;
}

function setSummary(amount) {
  const total = Number(amount || 0) + SERVICE_FEE;
  if (summaryAmount) summaryAmount.textContent = formatUsd(amount || 0);
  if (summaryTotal) summaryTotal.textContent = formatUsd(total || 0);
}

function setPaymentStatus(message, type) {
  if (!paymentStatus) return;
  paymentStatus.textContent = message;
  paymentStatus.classList.remove('error', 'success');
  if (type) paymentStatus.classList.add(type);
}

function buildReference() {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `AQP-${Date.now()}-${random}`;
}

if (amountInput) {
  setSummary(0);
  amountInput.addEventListener('input', function () {
    const val = parseFloat(this.value) || 0;
    setSummary(val);
  });
}

/* ---- Payment form validation ---- */
const paymentForm = document.getElementById('paymentForm');
const successOverlay = document.getElementById('successOverlay');
const closeSuccess   = document.getElementById('closeSuccess');
const payRef = document.getElementById('payRef');
const payButton = paymentForm ? paymentForm.querySelector('.btn-pay') : null;

if (paymentForm) {
  paymentForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    let valid = true;

    // validate fields
    const fields = [
      { id: 'fullName',   rule: v => v.trim().length >= 3,        msg: 'Enter your full name (min 3 chars).' },
      { id: 'accountNo',  rule: v => v.trim() === '' || /^\d{6,12}$/.test(v.trim()), msg: 'Account number must be 6-12 digits if provided.' },
      { id: 'email',      rule: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: 'Enter a valid email.' },
      { id: 'phone',      rule: v => v.trim() === '' || /^\+?[\d\s\-]{8,15}$/.test(v.trim()), msg: 'Enter a valid phone number or leave it blank.' },
      { id: 'amount',     rule: v => parseFloat(v) >= 1,          msg: 'Enter a valid amount.' },
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
      setPaymentStatus('Please fix the highlighted fields.', 'error');
      return;
    }

    const email = document.getElementById('email').value.trim();
    const fullName = document.getElementById('fullName').value.trim();
    const accountNo = document.getElementById('accountNo').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const reference = buildReference();
    const amountUsd = Number(document.getElementById('amount').value || 0).toFixed(2);
    const metadata = { customer_name: fullName };
    if (accountNo) metadata.order_id = accountNo;
    if (phone) metadata.phone = phone;

    if (payButton) {
      payButton.disabled = true;
      payButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Redirecting…';
    }
    setPaymentStatus('Redirecting to secure Paystack checkout…');

    try {
      const res = await fetch(`${PAYSTACK_BASE_URL}/api/payments/paystack/initialize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          amount_usd: amountUsd,
          reference,
          metadata,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.authorization_url) {
        throw new Error(data.message || 'Payment initialization failed.');
      }

      window.location.href = data.authorization_url;
    } catch (err) {
      setPaymentStatus(err.message || 'Payment initialization failed. Please try again.', 'error');
      if (payButton) {
        payButton.disabled = false;
        payButton.innerHTML = '<i class="fas fa-lock"></i> Pay Securely';
      }
    }
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
    if (amountInput) amountInput.value = '';
    setSummary(0);
    setPaymentStatus('');
    if (window.location.search.includes('reference=')) {
      history.replaceState(null, '', window.location.pathname);
    }
  });
}

async function verifyPayment(reference) {
  if (!reference) return;
  if (payButton) {
    payButton.disabled = true;
    payButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying…';
  }
  setPaymentStatus('Verifying payment…');

  try {
    const res = await fetch(`${PAYSTACK_BASE_URL}/api/payments/paystack/verify?reference=${encodeURIComponent(reference)}`);
    const data = await res.json().catch(() => ({}));
    const status = data && data.data && data.data.status;

    if (status === 'success') {
      if (payRef) payRef.textContent = reference;
      if (successOverlay) successOverlay.classList.add('show');
      setPaymentStatus('Payment verified.', 'success');
      return;
    }

    setPaymentStatus('Payment not completed. Please try again.', 'error');
  } catch (err) {
    setPaymentStatus('Verification failed. Please contact support.', 'error');
  } finally {
    if (payButton) {
      payButton.disabled = false;
      payButton.innerHTML = '<i class="fas fa-lock"></i> Pay Securely';
    }
  }
}

if (paymentForm) {
  const params = new URLSearchParams(window.location.search);
  const reference = params.get('reference');
  if (reference) verifyPayment(reference);
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
