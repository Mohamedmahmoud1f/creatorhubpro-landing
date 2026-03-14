/* =============================================
   CreatorHubPro Landing Page — Main JavaScript
   ============================================= */

'use strict';

// ─── 1. CONFIGURATION ────────────────────────────────
const CONFIG = {
    whatsappNumber: '201105449828',
    makeWebhookUrl: 'https://hook.us2.make.com/r443xroidvnvn1fvnljpk7n8vy7eyne5',
    redirectDelay: 2200
};

const LABEL_MAPS = {
    business: {
        creator_personal: 'كريتور - محتوى شخصي',
        business_owner: 'صاحب بيزنس / شركة',
        coach: 'كوتش / مدرب',
        ecommerce: 'متجر إلكتروني',
        other: 'أخرى'
    },
    goal: {
        followers: 'زيادة المتابعين',
        clients: 'جذب عملاء',
        brand: 'بناء البراند الشخصي',
        sales: 'زيادة المبيعات',
        views: 'زيادة المشاهدات'
    },
    experience: {
        no_consistency: 'لا، بعاني أصلاً في الاستمرارية',
        quality_or_schedule: 'ممكن، لكن الجودة أو الانتظام بيقعوا',
        costly_effort: 'نعم، لكن بياخد وقت ومجهود كبير مني'
    }
};

// ─── 2. STATE & UTMS ─────────────────────────────────
let currentLang = document.documentElement.lang || 'ar';
let isSubmitting = false;

function saveUtmParams() {
    try {
        const params = new URLSearchParams(window.location.search);
        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(key => {
            const val = params.get(key);
            if (val) sessionStorage.setItem(key, val);
        });
    } catch (e) { console.warn('[UTM] Error:', e.message); }
}

// ─── 3. LANGUAGE TOGGLE (Next.js Global Bridge) ──────
window.toggleLang = function() {
    currentLang = (currentLang === 'ar') ? 'en' : 'ar';
    const isEn = (currentLang === 'en');

    // Update Root Attributes
    document.documentElement.lang = currentLang;
    document.documentElement.dir = isEn ? 'ltr' : 'rtl';
    document.body.classList.toggle('en-active', isEn);

    // Update Toggle Button Text
    const langBtn = document.getElementById('langToggle');
    if (langBtn) langBtn.textContent = isEn ? 'AR' : 'EN';

    // Toggle Visibility of all marked elements
    document.querySelectorAll('.ar-text').forEach(el => el.style.display = isEn ? 'none' : '');
    document.querySelectorAll('.en-text').forEach(el => el.style.display = isEn ? '' : 'none');

    // Fix specific input/select overlaps
    document.querySelectorAll('input.ar-text, input.en-text, select.ar-text, select.en-text').forEach(inp => {
        if (inp.classList.contains('ar-text')) inp.style.display = isEn ? 'none' : '';
        if (inp.classList.contains('en-text')) inp.style.display = isEn ? '' : 'none';
    });
};

// ─── 4. FORM & WEBHOOK LOGIC ─────────────────────────
async function handleFormSubmit(e) {
    e.preventDefault();
    if (isSubmitting) return;

    const fields = ['name', 'whatsapp', 'business', 'platform', 'goal'];
    const results = fields.map(f => validateField(f));
    const expValid = validateExperience();

    if (results.some(r => !r) || !expValid) {
        document.querySelector('.error, .field-error.visible')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    isSubmitting = true;
    
    // UI Loading State
    const btnAr = document.getElementById('submitBtn');
    const btnEn = document.getElementById('submitBtnEn');
    const loader = document.getElementById('btnLoader');
    
    [btnAr, btnEn].forEach(btn => {
        if (btn) {
            btn.disabled = true;
            const span = btn.querySelector('span');
            if (span) span.textContent = (currentLang === 'ar' ? 'جارٍ الإرسال...' : 'Sending...');
        }
    });
    if (loader) loader.style.display = 'inline-block';

    const formData = collectFormData();
    
    // Send to Webhook
    const payload = {
        timestamp: new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' }),
        name: formData.name,
        whatsapp: String(formData.whatsapp),
        business: LABEL_MAPS.business[formData.business] || formData.business,
        platform: formData.platform,
        goal: LABEL_MAPS.goal[formData.goal] || formData.goal,
        experience: LABEL_MAPS.experience[formData.experience] || formData.experience,
        source: sessionStorage.getItem('utm_source') || 'CreatorHubPro Landing Page',
        lang: (currentLang === 'en' ? 'English' : 'عربي')
    };

    try {
        await fetch(CONFIG.makeWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            keepalive: true
        });
    } catch (err) {
        console.error('Webhook failed, saving locally:', err);
    }

    // Save for WhatsApp redirect & Success UI
    saveLeadToLocal(formData);
    showSuccessMessage();
    isSubmitting = false;
}

function validateField(id) {
    // Check for language-specific IDs (name vs name_en)
    const input = document.getElementById(id) || document.getElementById(id + '_en');
    const error = document.getElementById(id + 'Error');
    if (!input || input.offsetParent === null) return true; // Skip if hidden

    const val = input.value.trim();
    let msg = '';
    const isAr = (currentLang === 'ar');

    if (!val) msg = isAr ? 'هذا الحقل مطلوب' : 'Required';
    else if (id === 'whatsapp' && !/^[\+]?[0-9\s\-]{8,17}$/.test(val)) msg = isAr ? 'رقم غير صحيح' : 'Invalid number';

    if (msg) {
        input.classList.add('error');
        if (error) { error.textContent = msg; error.classList.add('visible'); }
        return false;
    }
    return true;
}

function validateExperience() {
    const checked = !!document.querySelector('input[name="experience"]:checked');
    const error = document.getElementById('experienceError');
    if (!checked && error) {
        error.classList.add('visible');
        error.textContent = (currentLang === 'ar' ? 'الرجاء اختيار مستوى الخبرة' : 'Please select experience');
    }
    return checked;
}

function collectFormData() {
    const nameEn = document.getElementById('name_en');
    const nameAr = document.getElementById('name');
    const name = (nameEn && nameEn.offsetParent !== null && nameEn.value) ? nameEn.value : nameAr?.value;

    return {
        name: name?.trim() || '',
        whatsapp: document.getElementById('whatsapp')?.value.trim() || '',
        business: document.getElementById('business')?.value || '',
        platform: document.getElementById('platform')?.value || '',
        goal: document.getElementById('goal')?.value || '',
        experience: document.querySelector('input[name="experience"]:checked')?.value || ''
    };
}

function showSuccessMessage() {
    const form = document.getElementById('leadForm');
    const success = document.getElementById('formSuccess');
    if (form) form.style.display = 'none';
    if (success) {
        success.style.display = 'block';
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// ─── 5. WHATSAPP PERSISTENCE ─────────────────────────
function saveLeadToLocal(data) {
    const lead = {
        ...data,
        businessLabel: LABEL_MAPS.business[data.business] || data.business,
        goalLabel: LABEL_MAPS.goal[data.goal] || data.goal,
        expLabel: LABEL_MAPS.experience[data.experience] || data.experience,
        lang: currentLang
    };
    localStorage.setItem('chp_submitted_lead', JSON.stringify(lead));
}

function initWhatsAppIntercept() {
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href*="wa.me"]');
        if (!link) return;

        const raw = localStorage.getItem('chp_submitted_lead');
        if (!raw) return;

        e.preventDefault();
        const lead = JSON.parse(raw);
        const isAr = (lead.lang === 'ar');
        const msg = isAr 
            ? `مرحبًا، أرسلت بياناتي عبر الموقع وأرغب في البدء.\n\nالاسم: ${lead.name}\nالنشاط: ${lead.businessLabel}\nالهدف: ${lead.goalLabel}`
            : `Hello, I submitted my info via the website and want to start.\n\nName: ${lead.name}\nBusiness: ${lead.businessLabel}\nGoal: ${lead.goalLabel}`;

        window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    });
}

// ─── 6. UI ANIMATIONS (Scarcity, Typewriter, Scroll) ──
function initScarcityModule() {
    const SCR_CONFIG = { current: 16, max: 20 };
    const module = document.getElementById('scr-module');
    if (!module) return;

    const pct = Math.round((SCR_CONFIG.current / SCR_CONFIG.max) * 100);
    const fill = document.getElementById('scr-bar-fill');
    if (fill) setTimeout(() => fill.style.width = pct + '%', 800);
    
    document.querySelectorAll('#scr-current, #scr-current-en').forEach(el => { el.textContent = SCR_CONFIG.current; });
    document.querySelectorAll('#scr-pct, #scr-pct-en').forEach(el => { el.textContent = pct + '%'; });
}

function initHeroVisuals() {
    // Typewriter
    const typewriter = document.getElementById('lsv2Text');
    if (typewriter && window.innerWidth > 768) {
        const words = (currentLang === 'ar' ? ['محتواك', 'عملاءك', 'علامتك', 'نتائجك'] : ['Content', 'Clients', 'Brand', 'Results']);
        let i = 0;
        setInterval(() => {
            typewriter.style.opacity = '0';
            setTimeout(() => {
                typewriter.textContent = words[i];
                typewriter.style.opacity = '1';
                i = (i + 1) % words.length;
            }, 500);
        }, 3000);
    }

    // Phone Tilt
    const hero = document.getElementById('hero');
    const phone = document.getElementById('pmPhone');
    if (hero && phone && window.innerWidth > 768) {
        hero.addEventListener('mousemove', (e) => {
            const r = hero.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            phone.style.transform = `rotateX(${-y * 10}deg) rotateY(${x * 10}deg) translateY(-5px)`;
        }, { passive: true });
    }
}

// ─── 7. INITIALIZATION ───────────────────────────────
function boot() {
    saveUtmParams();
    initWhatsAppIntercept();
    initHeroVisuals();
    
    // Navbar Scroll Shadow
    const navbar = document.getElementById('navbar');
    const urgencyBar = document.querySelector('.sticky-urgency-bar');
    window.addEventListener('scroll', () => {
        const sy = window.scrollY;
        if (navbar) navbar.classList.toggle('scrolled', sy > 40);
        if (urgencyBar) urgencyBar.classList.toggle('bar-hidden', sy > 80);
    }, { passive: true });

    // Global Scroll Observer for Entrance Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.id === 'scr-module') initScarcityModule();
                // Trust counters
                if (entry.target.classList.contains('trust-badge')) {
                    const num = entry.target.querySelector('.trust-num');
                    if (num) {
                        const target = parseInt(num.dataset.target);
                        let cur = 0;
                        const inv = setInterval(() => {
                            cur += Math.ceil(target/20);
                            if (cur >= target) { cur = target; clearInterval(inv); }
                            num.textContent = cur;
                        }, 50);
                    }
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll, .trust-badge, #scr-module').forEach(el => observer.observe(el));

    // Form Listener
    const form = document.getElementById('leadForm');
    if (form) form.addEventListener('submit', handleFormSubmit);
}

// Support both standard load and Next.js Script strategy
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}

console.log('%c CreatorHubPro 🚀 System Online ', 'background: #7c3aed; color: white; padding: 8px 16px; border-radius: 4px; font-weight: bold;');