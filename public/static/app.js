/* =============================================
   CreatorHubPro Landing Page — Main JavaScript
   Form Logic | WhatsApp Redirect | Animations
   ============================================= */

'use strict';

// ─── CONFIG ────────────────────────────────────────
const CONFIG = {
  whatsappNumber: '201105449828',
  whatsappMsgAr: 'مرحبًا، أرسلت بياناتي عبر الموقع وأرغب في البدء',
  whatsappMsgEn: 'Hello, I submitted my information through the website and would like to start',
  redirectDelay: 2200,
  // ── Make (Integromat) Webhook URL ────────────────────────────────────────────
  // لتغيير الـ webhook في المستقبل: فقط عدّل السطر التالي
  makeWebhookUrl: 'PUT_WEBHOOK_URL_HERE'
};

// ─── STATE ────────────────────────────────────────
let currentLang = 'ar';
let isSubmitting = false;

// ─── DOM READY ────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initNavbar();
  initScrollAnimations();
  initStickyCta();
  initForm();
  initSmoothScroll();
  initCounters();
});

// ─── LANGUAGE TOGGLE ──────────────────────────────
function toggleLang() {
  currentLang = currentLang === 'ar' ? 'en' : 'ar';
  const html = document.documentElement;
  const langBtn = document.getElementById('langToggle');
  const arEls = document.querySelectorAll('.ar-text');
  const enEls = document.querySelectorAll('.en-text');

  if (currentLang === 'en') {
    html.setAttribute('lang', 'en');
    html.setAttribute('dir', 'ltr');
    document.body.classList.add('en-active');
    langBtn.textContent = 'AR';
    arEls.forEach(el => el.style.display = 'none');
    enEls.forEach(el => el.style.display = '');
    // Fix inputs visibility (avoid duplicates showing)
    document.querySelectorAll('input.ar-text, input.en-text').forEach(inp => {
      if (inp.classList.contains('ar-text')) inp.style.display = 'none';
      if (inp.classList.contains('en-text')) inp.style.display = '';
    });
  } else {
    html.setAttribute('lang', 'ar');
    html.setAttribute('dir', 'rtl');
    document.body.classList.remove('en-active');
    langBtn.textContent = 'EN';
    arEls.forEach(el => el.style.display = '');
    enEls.forEach(el => el.style.display = 'none');
    document.querySelectorAll('input.ar-text, input.en-text').forEach(inp => {
      if (inp.classList.contains('ar-text')) inp.style.display = '';
      if (inp.classList.contains('en-text')) inp.style.display = 'none';
    });
  }
}

// Expose globally
window.toggleLang = toggleLang;

// ─── PARTICLES ──────────────────────────────────────
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const count = window.innerWidth < 768 ? 18 : 36;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const size = Math.random() * 3 + 2;
    const left = Math.random() * 100;
    const delay = Math.random() * 12;
    const duration = Math.random() * 10 + 8;
    const opacity = Math.random() * 0.3 + 0.1;

    // Alternate between purple and accent colors
    const colors = [
      'rgba(168, 85, 247, 0.6)',
      'rgba(245, 158, 11, 0.4)',
      'rgba(124, 58, 237, 0.5)',
      'rgba(16, 185, 129, 0.3)'
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];

    particle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      background: ${color};
      opacity: ${opacity};
      animation-duration: ${duration}s;
      animation-delay: -${delay}s;
    `;

    container.appendChild(particle);
  }
}

// ─── NAVBAR SCROLL ─────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

// ─── SCROLL ANIMATIONS ─────────────────────────────
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger animations within same section
          const siblings = entry.target.parentElement
            ? Array.from(entry.target.parentElement.querySelectorAll('.animate-on-scroll'))
            : [];
          const siblingIndex = siblings.indexOf(entry.target);
          const delay = siblingIndex * 100;

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

// ─── STICKY CTA ────────────────────────────────────
function initStickyCta() {
  const stickyCta = document.getElementById('stickyCta');
  if (!stickyCta) return;

  let ticking = false;

  const checkVisibility = () => {
    const scrollY = window.scrollY;
    const windowH = window.innerHeight;
    const docH = document.body.scrollHeight;
    const nearBottom = scrollY + windowH > docH - 200;

    // Show after scrolling 400px but hide near footer
    if (scrollY > 400 && !nearBottom) {
      stickyCta.classList.add('visible');
    } else {
      stickyCta.classList.remove('visible');
    }
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(checkVisibility);
      ticking = true;
    }
  }, { passive: true });
}

// ─── SMOOTH SCROLL ─────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const offset = 80; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

// ─── COUNTER ANIMATION ─────────────────────────────
function initCounters() {
  const statNums = document.querySelectorAll('.stat-num');

  const animateCounter = (el) => {
    const text = el.textContent.trim();
    const suffix = text.replace(/[\d.]/g, '');
    const target = parseFloat(text.replace(/[^\d.]/g, ''));

    if (isNaN(target)) return;

    const duration = 1800;
    const start = performance.now();

    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      el.textContent = (current >= 10 ? Math.round(current) : current.toFixed(1)) + suffix;

      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNums.forEach(el => observer.observe(el));
}

// ─── FORM ─────────────────────────────────────────
function initForm() {
  const form = document.getElementById('leadForm');
  if (!form) return;

  // Real-time validation on blur
  const fields = ['name', 'whatsapp', 'business', 'platform', 'goal'];
  fields.forEach(fieldId => {
    const input = document.getElementById(fieldId);
    if (input) {
      input.addEventListener('blur', () => validateField(fieldId));
      input.addEventListener('input', () => clearFieldError(fieldId));
    }
  });

  form.addEventListener('submit', handleFormSubmit);
}

function validateField(fieldId) {
  const input = document.getElementById(fieldId);
  const error = document.getElementById(fieldId + 'Error');
  if (!input) return true;

  const value = input.value.trim();
  let errorMsg = '';

  const isAr = currentLang === 'ar';

  if (!value) {
    errorMsg = isAr ? 'هذا الحقل مطلوب' : 'This field is required';
  } else if (fieldId === 'whatsapp') {
    const phoneRegex = /^[\+]?[0-9\s\-]{8,17}$/;
    if (!phoneRegex.test(value)) {
      errorMsg = isAr ? 'أدخل رقم واتساب صحيح' : 'Enter a valid WhatsApp number';
    }
  } else if (fieldId === 'name' && value.length < 2) {
    errorMsg = isAr ? 'الاسم قصير جداً' : 'Name is too short';
  }

  if (errorMsg) {
    input.classList.add('error');
    if (error) {
      error.textContent = errorMsg;
      error.classList.add('visible');
    }
    return false;
  } else {
    input.classList.remove('error');
    if (error) error.classList.remove('visible');
    return true;
  }
}

function clearFieldError(fieldId) {
  const input = document.getElementById(fieldId);
  const error = document.getElementById(fieldId + 'Error');
  if (input) input.classList.remove('error');
  if (error) error.classList.remove('visible');
}

function validateExperience() {
  const radios = document.querySelectorAll('input[name="experience"]');
  const checked = Array.from(radios).some(r => r.checked);
  const error = document.getElementById('experienceError');
  const isAr = currentLang === 'ar';

  if (!checked) {
    if (error) {
      error.textContent = isAr ? 'الرجاء اختيار مستوى الخبرة' : 'Please select your experience level';
      error.classList.add('visible');
    }
    return false;
  }
  if (error) error.classList.remove('visible');
  return true;
}

async function handleFormSubmit(e) {
  e.preventDefault();
  if (isSubmitting) return;

  console.log('[Form] ▶ handleFormSubmit triggered');

  // ── Validate ──
  const fieldsToValidate = ['name', 'whatsapp', 'business', 'platform', 'goal'];
  const fieldResults = fieldsToValidate.map(f => validateField(f));
  const experienceValid = validateExperience();

  if (fieldResults.some(r => !r) || !experienceValid) {
    const firstError = document.querySelector('.error, .field-error.visible');
    if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  isSubmitting = true;
  clearSheetsError();

  // ── Loading state ──
  const submitBtn    = document.getElementById('submitBtn');
  const submitBtnEn  = document.getElementById('submitBtnEn');
  const btnLoader    = document.getElementById('btnLoader');

  [submitBtn, submitBtnEn].forEach(btn => {
    if (!btn) return;
    btn.disabled = true;
    btn.style.opacity = '0.7';
    const sp = btn.querySelector('span');
    if (sp) sp.textContent = currentLang === 'ar' ? 'جارٍ الإرسال...' : 'Sending...';
  });
  if (btnLoader) btnLoader.style.display = 'inline-block';

  // ── Collect & send ──
  const formData = collectFormData();
  console.log('[Form] 📋 Collected form data:', formData);

  const saved = await sendToMakeWebhook(formData);
  console.log('[Form] 📊 sendToMakeWebhook result:', saved);

  // ── Re-enable button ──
  [submitBtn, submitBtnEn].forEach(btn => {
    if (!btn) return;
    btn.disabled = false;
    btn.style.opacity = '1';
    const sp = btn.querySelector('span');
    if (sp) sp.textContent = currentLang === 'ar' ? 'أرسل بياناتي الآن' : 'Submit Now';
  });
  if (btnLoader) btnLoader.style.display = 'none';

  // ── Show success (always — even if sheets failed, lead is backed up) ──
  showSuccessMessage();

  isSubmitting = false;
  console.log('[Form] ✅ Submission complete. Webhook result:', saved);
}

function collectFormData() {
  // name: there are two inputs (ar: #name, en: #name_en) — pick the visible one
  const nameAr = document.getElementById('name');
  const nameEn = document.getElementById('name_en');
  let name = '';
  if (nameEn && nameEn.offsetParent !== null && nameEn.value.trim()) {
    name = nameEn.value.trim();
  } else if (nameAr) {
    name = nameAr.value.trim();
  }

  const whatsapp  = document.getElementById('whatsapp')?.value.trim() || '';

  // selects: value is the key (creator_personal, etc.) — LABEL_MAPS will translate it
  const business  = document.getElementById('business')?.value  || '';
  const platform  = document.getElementById('platform')?.value  || '';
  const goal      = document.getElementById('goal')?.value      || '';

  // experience: pick the first checked radio (ar or en group — same values)
  const experience = document.querySelector('input[name="experience"]:checked')?.value || '';

  console.log('[Form] collectFormData →', { name, whatsapp, business, platform, goal, experience });
  return { name, whatsapp, business, platform, goal, experience };
}

function buildWhatsAppMessage(data) {
  const isAr = currentLang === 'ar';

  const businessLabels = {
    ar: {
      creator_personal: 'كريتور - محتوى شخصي',
      business_owner: 'صاحب بيزنس / شركة',
      coach: 'كوتش / مدرب',
      ecommerce: 'متجر إلكتروني',
      other: 'أخرى'
    },
    en: {
      creator_personal: 'Creator - Personal Content',
      business_owner: 'Business / Company Owner',
      coach: 'Coach / Trainer',
      ecommerce: 'E-commerce Store',
      other: 'Other'
    }
  };

  const goalLabels = {
    ar: {
      followers: 'زيادة المتابعين',
      clients: 'جذب عملاء',
      brand: 'بناء البراند الشخصي',
      sales: 'زيادة المبيعات',
      views: 'زيادة المشاهدات'
    },
    en: {
      followers: 'Grow Followers',
      clients: 'Attract Clients',
      brand: 'Build Personal Brand',
      sales: 'Increase Sales',
      views: 'Increase Views'
    }
  };

  const expLabels = {
    ar: {
      no_consistency:    'لا، بعاني أصلاً في الاستمرارية',
      quality_or_schedule: 'ممكن، لكن الجودة أو الانتظام بيقعوا',
      costly_effort:     'نعم، لكن بياخد وقت ومجهود كبير مني'
    },
    en: {
      no_consistency:    'No, I already struggle with consistency',
      quality_or_schedule: 'Maybe, but quality or schedule tend to drop',
      costly_effort:     'Yes, but it takes a lot of time and effort'
    }
  };

  const lang = isAr ? 'ar' : 'en';

  if (isAr) {
    return `مرحبًا، أرسلت بياناتي عبر الموقع وأرغب في البدء 🚀

📋 *بياناتي:*
👤 الاسم: ${data.name}
📱 واتساب: ${data.whatsapp}
💼 النشاط: ${businessLabels.ar[data.business] || data.business}
📲 المنصة: ${data.platform}
🎯 الهدف: ${goalLabels.ar[data.goal] || data.goal}
📊 المستوى: ${expLabels.ar[data.experience] || data.experience}

أنتظر التواصل معكم!`;
  } else {
    return `Hello, I submitted my information through the website and I'd like to start 🚀

📋 *My Details:*
👤 Name: ${data.name}
📱 WhatsApp: ${data.whatsapp}
💼 Business: ${businessLabels.en[data.business] || data.business}
📲 Platform: ${data.platform}
🎯 Goal: ${goalLabels.en[data.goal] || data.goal}
📊 Level: ${expLabels.en[data.experience] || data.experience}

Looking forward to hearing from you!`;
  }
}

// ─── MAKE (INTEGROMAT) WEBHOOK INTEGRATION ───────────────────────────────────
//
// الحل الجذري والنهائي:
//   • الفورم يبعت JSON مباشرةً لـ Make webhook
//   • Make يوزّع البيانات على Google Sheets وأي خدمة ثانية
//   • يشتغل من كل جهاز (لابتوب + موبايل) بدون أي مشاكل CORS
//   • لتغيير الـ webhook: CONFIG.makeWebhookUrl في أعلى الملف
// ─────────────────────────────────────────────────────────────────────────────

const LABEL_MAPS = {
  business: {
    creator_personal: 'كريتور - محتوى شخصي',
    business_owner:   'صاحب بيزنس / شركة',
    coach:            'كوتش / مدرب',
    ecommerce:        'متجر إلكتروني',
    other:            'أخرى'
  },
  goal: {
    followers: 'زيادة المتابعين',
    clients:   'جذب عملاء',
    brand:     'بناء البراند الشخصي',
    sales:     'زيادة المبيعات',
    views:     'زيادة المشاهدات'
  },
  experience: {
    no_consistency:      'لا، بعاني أصلاً في الاستمرارية',
    quality_or_schedule: 'ممكن، لكن الجودة أو الانتظام بيقعوا',
    costly_effort:       'نعم، لكن بياخد وقت ومجهود كبير مني'
  }
};

// ── Show / clear inline error below submit button ─────────────────────────────
function showSheetsError(msg) {
  let el = document.getElementById('sheetsErrorMsg');
  if (!el) {
    el = document.createElement('p');
    el.id = 'sheetsErrorMsg';
    el.style.cssText = 'color:#ef4444;text-align:center;margin-top:8px;font-size:14px;';
    const btn = document.getElementById('submitBtn');
    if (btn && btn.parentNode) btn.parentNode.insertBefore(el, btn.nextSibling);
  }
  el.textContent = msg;
}
function clearSheetsError() {
  const el = document.getElementById('sheetsErrorMsg');
  if (el) el.textContent = '';
}

// ── Backup failed leads to localStorage ───────────────────────────────────────
function backupToLocalStorage(payload) {
  try {
    const key    = 'chp_leads_backup';
    const stored = JSON.parse(localStorage.getItem(key) || '[]');
    stored.push({ ...payload, _savedAt: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(stored));
    console.warn('[Webhook] 💾 Backed up to localStorage. Total pending:', stored.length);
  } catch (lsErr) {
    console.warn('[Webhook] localStorage backup failed:', lsErr.message);
  }
}

/**
 * sendToMakeWebhook — الدالة الرئيسية لإرسال بيانات الفورم إلى Make webhook
 *
 * @param {object} data — بيانات الفورم الخام من collectFormData()
 * @returns {Promise<'ok'|'failed-backed-up'>}
 *
 * الـ payload المُرسَل (JSON):
 * {
 *   timestamp:  "24/2/2026, 10:30:00 م",   // توقيت القاهرة
 *   name:       "أحمد محمد",
 *   whatsapp:   "01234567890",              // نص بدون تحويل
 *   business:   "كريتور - محتوى شخصي",      // مترجَم من LABEL_MAPS
 *   platform:   "instagram",
 *   goal:       "جذب عملاء",               // مترجَم من LABEL_MAPS
 *   experience: "لا، بعاني أصلاً في الاستمرارية",
 *   source:     "CreatorHubPro Landing Page",
 *   lang:       "عربي" | "English"
 * }
 */
async function sendToMakeWebhook(data) {
  clearSheetsError();

  // ── webhook URL من CONFIG ─────────────────────────────────────────────────────
  // لتغيير الـ webhook في المستقبل: عدّل CONFIG.makeWebhookUrl في أعلى الملف
  const webhookUrl = CONFIG.makeWebhookUrl;

  if (!webhookUrl || webhookUrl === 'PUT_WEBHOOK_URL_HERE') {
    console.error('[Webhook] ❌ makeWebhookUrl غير محدد في CONFIG');
    showSheetsError('حصل خطأ في الإعداد، جرّب تاني');
    return 'failed-backed-up';
  }

  // ── بناء الـ payload ──────────────────────────────────────────────────────────
  const payload = {
    timestamp:  new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' }),
    name:       data.name       || '',
    whatsapp:   String(data.whatsapp || ''),          // يبقى نص دائماً
    business:   LABEL_MAPS.business[data.business]     || data.business   || '',
    platform:   data.platform   || '',
    goal:       LABEL_MAPS.goal[data.goal]             || data.goal       || '',
    experience: LABEL_MAPS.experience[data.experience] || data.experience || '',
    source:     'CreatorHubPro Landing Page',
    lang:       (typeof currentLang !== 'undefined' && currentLang === 'en') ? 'English' : 'عربي'
  };

  console.log('[Webhook] 🚀 Sending to Make webhook:', webhookUrl);
  console.log('[Webhook] 📋 Payload:', JSON.stringify(payload, null, 2));

  const MAX_RETRIES = 2;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`[Webhook] 🔄 Attempt ${attempt}/${MAX_RETRIES}`);

      // ── AbortController لـ timeout 10 ثواني ────────────────────────────────
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 10000);

      let resp;
      try {
        resp = await fetch(webhookUrl, {
          method:    'POST',
          headers:   { 'Content-Type': 'application/json' },
          body:      JSON.stringify(payload),
          keepalive: true,          // يضمن إرسال الطلب حتى لو المستخدم غادر الصفحة
          signal:    controller.signal
        });
      } finally {
        clearTimeout(timer);
      }

      console.log('[Webhook] 📥 HTTP status:', resp.status);

      if (resp.ok) {
        console.log('[Webhook] ✅ تم الإرسال بنجاح إلى Make');
        clearSheetsError();
        return 'ok';
      } else {
        console.warn(`[Webhook] ⚠️ HTTP ${resp.status} on attempt ${attempt}`);
      }
    } catch (err) {
      console.error(`[Webhook] ❌ Attempt ${attempt} error:`, err.message);
      if (attempt < MAX_RETRIES) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }
  }

  // ── كل المحاولات فشلت ─────────────────────────────────────────────────────────
  backupToLocalStorage(payload);
  showSheetsError('حصل خطأ، جرّب تاني');
  console.error('[Webhook] ❌ All attempts failed. Data backed up to localStorage.');
  return 'failed-backed-up';
}

// ─────────────────────────────────────────────────────────────────────────────

function showSuccessMessage() {
  const form = document.getElementById('leadForm');
  const success = document.getElementById('formSuccess');

  if (form) {
    form.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    form.style.opacity = '0';
    form.style.transform = 'translateY(-20px)';
    setTimeout(() => {
      form.style.display = 'none';
      if (success) {
        success.style.display = 'block';
        success.style.animation = 'fadeUp 0.6s ease both';
      }
    }, 400);
  }
}

// ─── VIDEO PLACEHOLDER INTERACTIONS ────────────────
// (removed: .video-placeholder no longer in DOM)

// ─── PACKAGE CARD HOVER EFFECTS ────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.package-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      if (!card.classList.contains('package-featured')) {
        card.style.borderColor = 'rgba(124, 58, 237, 0.5)';
      }
    });
    card.addEventListener('mouseleave', () => {
      if (!card.classList.contains('package-featured')) {
        card.style.borderColor = '';
      }
    });
  });
});

// ─── PROBLEM CARDS ENTRANCE ─────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const problemCards = document.querySelectorAll('.problem-card');
  problemCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 80}ms`;
  });
});

// ─── PHONE MOCKUP — REEL STATS COUNTER ─────────────
// (removed: .reel-stats no longer in DOM — replaced by .pm-* dashboard)

// ─── FORM FIELD FOCUS EFFECTS ─────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const inputs = document.querySelectorAll('.form-group input, .form-group select');
  inputs.forEach(input => {
    const group = input.closest('.form-group');
    if (!group) return;

    input.addEventListener('focus', () => {
      group.style.transition = 'transform 0.2s ease';
      group.style.transform = 'scale(1.01)';
    });

    input.addEventListener('blur', () => {
      group.style.transform = '';
    });
  });
});

// ─── STICKY CTA PULSE ANIMATION ───────────────────
document.addEventListener('DOMContentLoaded', () => {
  const stickyCta = document.getElementById('stickyCta');
  if (!stickyCta) return;

  // Add pulse to the button periodically
  setInterval(() => {
    const btn = stickyCta.querySelector('.sticky-cta-btn');
    if (btn && stickyCta.classList.contains('visible')) {
      btn.style.animation = 'none';
      requestAnimationFrame(() => {
        btn.style.animation = '';
      });
    }
  }, 8000);
});

// ─── URGENCY COUNTDOWN (SLOTS) ────────────────────
// (removed: .coaching-urgency no longer in DOM — scarcity handled by scr-module)

// ─── COMPARISON SECTION HIGHLIGHT ─────────────────
document.addEventListener('DOMContentLoaded', () => {
  const compareUs = document.querySelector('.compare-us');
  if (!compareUs) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        compareUs.style.animation = 'none';
        compareUs.style.boxShadow = '0 0 60px rgba(124, 58, 237, 0.35)';
      }
    });
  }, { threshold: 0.4 });

  observer.observe(compareUs);
});

// ─── LAZY-LOAD HEAVY ELEMENTS ─────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Defer FontAwesome if it hasn't loaded in time
  const faLink = document.querySelector('link[href*="fontawesome"]');
  if (faLink) {
    faLink.setAttribute('media', 'print');
    faLink.setAttribute('onload', "this.media='all'");
  }
});

// ─── KEYBOARD ACCESSIBILITY ───────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    // Close any modals or overlays if present
  }
});

// ─── PERFORMANCE: REQUESTANIMATIONFRAME SCROLL ───
let scrollTimer = null;
window.addEventListener('scroll', () => {
  if (scrollTimer) return;
  scrollTimer = requestAnimationFrame(() => {
    scrollTimer = null;
    // Handled via individual listeners
  });
}, { passive: true });

console.log('%c CreatorHubPro 🚀 ', 'background: #7c3aed; color: white; font-size: 16px; font-weight: bold; padding: 8px 16px; border-radius: 4px;');
