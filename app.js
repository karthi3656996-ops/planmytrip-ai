/* ============================================================
   PLANMYTRIP AI — APP.JS
   All interactivity: loader, nav, forms, demo, mood, counters, FAQ
============================================================ */

/* ─── EXPLORE SEARCH RESULT ────────────────────────────── */
function showSearchResult() {
  const dest   = document.getElementById('filter-dest')?.value.trim();
  const budget = document.getElementById('filter-budget')?.value;
  const dur    = document.getElementById('filter-duration')?.value;
  const cat    = document.getElementById('filter-category')?.value;

  if (!dest && !budget && !dur && !cat) {
    showToast('🔍 Please enter at least one filter to search!');
    return;
  }
  const parts = [];
  if (dest)   parts.push(dest);
  if (cat)    parts.push(cat.replace(/[^\w\s]/g, '').trim());
  if (budget) parts.push(budget);
  if (dur)    parts.push(dur);

  showToast(`✅ Showing results for: ${parts.join(' · ')}`);
  document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' });
}

/* ─── LOADER ────────────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) { loader.classList.add('hidden'); }
    // Trigger hero animations
    document.querySelectorAll('.animate-in').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 120);
    });
  }, 1800);
});

/* ─── NAVBAR ────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) { navbar.classList.add('scrolled'); }
  else { navbar.classList.remove('scrolled'); }
  updateActiveNav();
  handleScrollReveal();
  handleScrollTopBtn();
  handleStatCounters();
});

hamburger?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.classList.toggle('active', open);
  hamburger.setAttribute('aria-expanded', open);
});

// Close mobile menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', false);
  });
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.id;
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
}

/* ─── SCROLL TO TOP ────────────────────────────────────── */
const scrollTopBtn = document.getElementById('scrollTopBtn');
function handleScrollTopBtn() {
  if (window.scrollY > 400) scrollTopBtn.classList.add('visible');
  else scrollTopBtn.classList.remove('visible');
}
scrollTopBtn?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ─── SCROLL REVEAL ────────────────────────────────────── */
function handleScrollReveal() {
  document.querySelectorAll('.reveal').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) el.classList.add('visible');
  });
}
handleScrollReveal(); // run on load too

/* ─── SEARCH TABS ──────────────────────────────────────── */
document.querySelectorAll('.search-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.search-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.search-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const panelId = 'tab-' + tab.dataset.tab;
    document.getElementById(panelId)?.classList.add('active');
  });
});

/* ─── TRIP FORM SUBMISSION ─────────────────────────────── */
const tripForm = document.getElementById('tripForm');
tripForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const destination = document.getElementById('destination')?.value.trim();
  const budget = document.getElementById('budget')?.value;
  const days = document.getElementById('days')?.value;
  const style = document.getElementById('travelStyle')?.value;

  if (!destination || !budget || !days || !style) {
    showToast('⚠️ Please fill in all fields to generate your trip!');
    return;
  }

  const btn = document.getElementById('generateBtn');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening Planner…';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-magic"></i> Generate My Trip';
    btn.disabled = false;
    // Open planner in a new tab with pre-filled data
    const params = new URLSearchParams({ dest: destination, budget, days, style });
    window.open(`planner.html?${params.toString()}`, '_blank');
  }, 800);
});


/* ─── TRIP MODAL ───────────────────────────────────────── */
function showTripModal(dest, budget, days, style) {
  const modal = document.getElementById('tripModal');
  const modalBody = document.getElementById('modalBody');
  const subtitle = document.getElementById('modal-subtitle');

  subtitle.textContent = `${dest} · ${days} Days · ₹${Number(budget).toLocaleString('en-IN')} Budget · ${capitalise(style)}`;

  const numDays = Math.min(parseInt(days) || 3, 5);
  const perDay = Math.floor(budget / numDays);
  const themes = {
    solo:    ['Arrival & Exploration', 'Culture Day', 'Adventure Activity', 'Local Immersion', 'Shopping & Depart'],
    couple:  ['Romantic Arrival', 'Scenic Exploration', 'Adventure Together', 'Spa & Leisure', 'Farewell Sunset'],
    family:  ['Family Arrival', 'Theme Park Day', 'Beach & Water Fun', 'Cultural Tour', 'Shopping & Depart'],
    friends: ['Group Check-in', 'Party & Beach', 'Adventure Sports', 'Local Food Tour', 'Farewell Bash'],
  };
  const dayNames = themes[style] || themes['solo'];

  let html = `
    <div class="modal-budget-total">
      <strong>Total Budget: ₹${Number(budget).toLocaleString('en-IN')}</strong>
      <span>~₹${perDay.toLocaleString('en-IN')}/day</span>
    </div>`;

  for (let d = 1; d <= numDays; d++) {
    const theme = dayNames[d - 1] || `Day ${d} Exploration`;
    html += `
      <div class="modal-day">
        <div class="modal-day-title">
          <span class="modal-day-badge">Day ${d}</span>
          <strong>${theme}</strong>
          <span style="font-size:0.8rem;color:#FF6B35;font-weight:700;">₹${perDay.toLocaleString('en-IN')}</span>
        </div>
        <p>🌅 <strong>Morning:</strong> Explore the top attractions of ${dest} with your ${style} group. Enjoy a local breakfast and sightseeing.</p>
        <p>☀️ <strong>Afternoon:</strong> Visit ${dest}'s most iconic landmarks. Try local street food and discover hidden gems recommended by AI.</p>
        <p>🌙 <strong>Evening:</strong> Relax at a top-rated restaurant in ${dest}. Enjoy local cuisine and soak in the atmosphere before heading back.</p>
      </div>`;
  }

  modalBody.innerHTML = html;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('tripModal');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.getElementById('modalClose')?.addEventListener('click', closeModal);
document.getElementById('modalOverlay')?.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ─── DESTINATION FILTER BAR ───────────────────────────── */
document.querySelectorAll('.dest-filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.dest-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    document.querySelectorAll('#destGrid .dest-card').forEach(card => {
      const cats = card.dataset.category || '';
      if (filter === 'all' || cats.includes(filter)) {
        card.style.display = '';
        setTimeout(() => card.style.opacity = '1', 10);
      } else {
        card.style.opacity = '0';
        setTimeout(() => card.style.display = 'none', 300);
      }
    });
  });
});

/* ─── DEMO DAY SWITCHER ────────────────────────────────── */
document.querySelectorAll('.demo-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const day = btn.dataset.day;
    document.querySelectorAll('.demo-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.demo-day').forEach(d => d.classList.remove('active'));
    btn.classList.add('active');
    document.querySelector(`.demo-day[data-day="${day}"]`)?.classList.add('active');
  });
});

/* ─── FAQ ACCORDION ────────────────────────────────────── */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const answer = item.querySelector('.faq-answer');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-answer').classList.remove('open');
      i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });

    if (!isOpen) {
      item.classList.add('open');
      answer.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ─── ANIMATED COUNTERS ────────────────────────────────── */
let countersStarted = false;
function handleStatCounters() {
  if (countersStarted) return;
  const statsSection = document.getElementById('stats');
  if (!statsSection) return;
  const rect = statsSection.getBoundingClientRect();
  if (rect.top < window.innerHeight - 100) {
    countersStarted = true;
    animateCounter('stat1', 0, 10000, 2000);
    animateCounter('stat2', 0, 500, 1800);
    animateCounter('stat3', 0, 95, 1600);
    animateCounter('stat4', 0, 1, 1200);
  }
}

function animateCounter(id, start, end, duration) {
  const el = document.getElementById(id);
  if (!el) return;
  const range = end - start;
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(start + range * eased).toLocaleString('en-IN');
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = end.toLocaleString('en-IN');
  }
  requestAnimationFrame(update);
}

/* ─── PRICING TOGGLE ───────────────────────────────────── */
const billingToggle = document.getElementById('billingToggle');
billingToggle?.addEventListener('change', () => {
  const isAnnual = billingToggle.checked;
  document.getElementById('toggle-monthly')?.classList.toggle('active', !isAnnual);
  document.getElementById('toggle-annual')?.classList.toggle('active', isAnnual);

  document.querySelectorAll('.price-amount').forEach(el => {
    el.textContent = isAnnual ? el.dataset.annual : el.dataset.monthly;
  });
});

/* ─── WISHLIST TOGGLE ──────────────────────────────────── */
function toggleWishlist(el) {
  el.classList.toggle('active');
  const icon = el.querySelector('i');
  if (el.classList.contains('active')) {
    icon.classList.replace('far', 'fas');
    showToast('❤️ Added to your wishlist!');
  } else {
    icon.classList.replace('fas', 'far');
    showToast('💔 Removed from wishlist');
  }
}

/* ─── CATEGORY FILTER ──────────────────────────────────── */
function filterCategory(cat) {
  document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => {
    const btn = document.querySelector(`.dest-filter-btn[data-filter="${cat}"]`)
      || document.querySelector('.dest-filter-btn[data-filter="all"]');
    btn?.click();
  }, 600);
  showToast(`🔍 Showing ${capitalise(cat)} destinations`);
}

/* ─── MOOD SELECTOR (AI INSPIRATION) ──────────────────── */
const moodData = {
  relax: {
    tag: '😌 Relax Mode', dest: 'Maldives', img: 'maldives.png',
    desc: 'Crystal-clear lagoons, private overwater villas, world-class spas, and absolute silence — the ultimate relaxation escape.',
    features: ['🏨 Overwater Bungalows', '💆 World-class Spas', '🏖️ Private Beach', '🍽️ Gourmet Dining'],
    budget: '₹80,000', cta: 'Plan a Relaxation Trip'
  },
  adventure: {
    tag: '🧗 Adventure Mode', dest: 'Bali', img: 'adventure.png',
    desc: 'Volcano treks at sunrise, whitewater rafting, cliff diving, and surfing legendary breaks. Your heart will race every day.',
    features: ['🌋 Volcano Trekking', '🏄 Surfing', '🤿 Scuba Diving', '🧗 Rock Climbing'],
    budget: '₹45,000', cta: 'Plan an Adventure Trip'
  },
  romantic: {
    tag: '💑 Romantic Mode', dest: 'Paris', img: 'paris.png',
    desc: 'Candlelit dinners by the Seine, sunset at the Eiffel Tower, boutique hotels with roses — pure romantic magic awaits.',
    features: ['🗼 Eiffel Tower', '🍷 Fine Dining', '🛳️ River Cruise', '💐 Rooftop Views'],
    budget: '₹1,20,000', cta: 'Plan a Romantic Trip'
  },
  nature: {
    tag: '🌿 Nature Mode', dest: 'Switzerland', img: 'switzerland.png',
    desc: 'Alpine meadows, glacier lakes, pine forests and mountain trails that make you feel infinitely small and alive at once.',
    features: ['⛰️ Alpine Hiking', '🌊 Glacier Lakes', '🌲 Forest Walks', '🦅 Wildlife'],
    budget: '₹1,50,000', cta: 'Plan a Nature Trip'
  },
  food: {
    tag: '🍜 Foodie Mode', dest: 'Japan', img: 'japan.png',
    desc: 'From Tokyo ramen alleys to Osaka street markets — Japan is a paradise for food lovers. Every meal is an experience.',
    features: ['🍣 Sushi Tastings', '🍜 Ramen Tours', '🥟 Street Food', '🍵 Tea Ceremonies'],
    budget: '₹90,000', cta: 'Plan a Food Trip'
  },
  culture: {
    tag: '🏛️ Culture Mode', dest: 'Japan', img: 'japan.png',
    desc: 'Ancient temples, traditional tea ceremonies, samurai history, and a culture so deep it leaves you forever changed.',
    features: ['⛩️ Temples', '🎎 Traditions', '🏯 Castles', '🎭 Performing Arts'],
    budget: '₹90,000', cta: 'Plan a Culture Trip'
  },
  solo: {
    tag: '🧍 Solo Mode', dest: 'Bali', img: 'bali.png',
    desc: 'Find yourself amid rice terraces, connect with fellow travelers, explore at your own pace, and rediscover who you are.',
    features: ['🧘 Yoga Retreats', '🤝 Social Hostels', '🗺️ Self-guided Tours', '📖 Digital Nomad Hubs'],
    budget: '₹45,000', cta: 'Plan a Solo Trip'
  },
  luxury: {
    tag: '👑 Luxury Mode', dest: 'Dubai', img: 'dubai.png',
    desc: 'Private jets, 7-star hotels, Michelin-starred dinners, helicopter tours, and shopping at the world\'s most iconic malls.',
    features: ['✈️ Private Transfers', '🏨 7-Star Hotels', '🍾 Fine Dining', '🛍️ Luxury Shopping'],
    budget: '₹3,00,000', cta: 'Plan a Luxury Trip'
  }
};

function selectMood(el) {
  document.querySelectorAll('.mood-card').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  const mood = el.dataset.mood;
  const data = moodData[mood];
  if (!data) return;

  document.getElementById('moodTag').textContent = data.tag;
  document.getElementById('moodDestName').textContent = data.dest;
  document.getElementById('moodDestDesc').textContent = data.desc;
  document.getElementById('moodBudget').textContent = data.budget;

  const imgEl = document.getElementById('moodImg');
  imgEl.style.opacity = '0';
  setTimeout(() => {
    imgEl.src = data.img;
    imgEl.alt = data.dest;
    imgEl.style.opacity = '1';
  }, 200);

  const featsEl = document.getElementById('moodFeatures');
  featsEl.innerHTML = data.features.map(f =>
    `<div class="insp-feature"><i class="fas fa-check-circle" style="color:#FF6B35"></i><span>${f}</span></div>`
  ).join('');

  const planBtn = document.getElementById('moodPlanBtn');
  if (planBtn) planBtn.innerHTML = `<i class="fas fa-magic"></i> ${data.cta}`;
}

/* Hero mood tab pills */
function planByMood(el) {
  document.querySelectorAll('.mood-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  const mood = el.dataset.mood;
  const data = moodData[mood];
  if (data) showToast(`✨ AI found perfect trips for "${capitalise(mood)}" mood!`);
}

/* ─── CONTACT FORM ─────────────────────────────────────── */
document.getElementById('contactForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = document.getElementById('contactSubmitBtn');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    showToast('✅ Your message was sent! We\'ll reply within 24 hours.');
    e.target.reset();
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      btn.style.background = '';
      btn.disabled = false;
    }, 3000);
  }, 1800);
});

/* ─── NEWSLETTER FORMS ─────────────────────────────────── */
function handleNewsletter(formId, inputId) {
  const form = document.getElementById(formId);
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById(inputId)?.value.trim();
    if (!email || !email.includes('@')) {
      showToast('⚠️ Please enter a valid email address!');
      return;
    }
    showToast('🎉 Subscribed! Welcome to the PlanMyTrip AI family!');
    form.reset();
  });
}
handleNewsletter('newsletterForm', 'nl-email');
handleNewsletter('footerNewsletterForm', 'footer-nl-email');

/* ─── TOAST ─────────────────────────────────────────────── */
let toastTimeout;
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 3500);
}

/* ─── PARTICLES ────────────────────────────────────────── */
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 22; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 4 + 2;
    const x = Math.random() * 100;
    const delay = Math.random() * 8;
    const dur = Math.random() * 12 + 8;
    const opacity = Math.random() * 0.5 + 0.1;
    p.style.cssText = `
      position:absolute; left:${x}%; bottom:-10px;
      width:${size}px; height:${size}px; border-radius:50%;
      background:rgba(255,${Math.random() > 0.5 ? '107,53' : '209,102'},${opacity});
      animation: floatUp ${dur}s ${delay}s ease-in infinite;
      pointer-events:none;
    `;
    container.appendChild(p);
  }

  const style = document.createElement('style');
  style.textContent = `
    @keyframes floatUp {
      0%   { transform: translateY(0) scale(1); opacity: 0; }
      10%  { opacity: 1; }
      90%  { opacity: 0.5; }
      100% { transform: translateY(-110vh) scale(0.4) rotate(360deg); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}
createParticles();

/* ─── SMOOTH ANCHOR SCROLL ─────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = navbar ? navbar.offsetHeight + 16 : 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ─── HELPERS ───────────────────────────────────────────── */
function capitalise(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

/* ─── INIT ON DOM READY ────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  handleScrollReveal();
  handleScrollTopBtn();
  handleStatCounters();
});
