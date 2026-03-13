import { Hono } from 'hono'

export const analyzePage = new Hono()

analyzePage.get('/account-analysis', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <meta name="theme-color" content="#0a0a0f" />
  <title>CreatorHubPro | Social Media Analyzer</title>
  <link rel="icon" type="image/svg+xml" href="/brand/2-transparent.png" />
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css" />
  <!-- Use main app global styles -->
  <link rel="stylesheet" href="/static/styles.css" />
  
  <style>
    body { overflow-x: hidden; }
    /* Premium Background Orbs */
    .bg-orb { position: absolute; border-radius: 50%; filter: blur(100px); z-index: 0; opacity: 0.35; pointer-events: none; }
    .orb-1 { width: 350px; height: 350px; background: #a78bfa; top: 10%; left: 10%; animation: float 12s ease-in-out infinite alternate; }
    .orb-2 { width: 450px; height: 450px; background: #f472b6; top: 40%; right: 5%; animation: float 15s ease-in-out infinite alternate-reverse; }
    .orb-3 { width: 300px; height: 300px; background: #ef4444; bottom: 5%; left: 25%; animation: float 10s ease-in-out infinite alternate; opacity: 0.15; }
    @keyframes float { 0% { transform: translateY(0) scale(1); } 100% { transform: translateY(-40px) scale(1.05); } }

    /* Analyzer specific styles extending global styles */
    .analyzer-wrap {
      width: 100%;
      max-width: 680px;
      padding: 40px 20px;
      text-align: center;
      margin: 80px auto;
    }

    .ah-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      border-radius: 20px;
      background: rgba(167, 139, 250, 0.1);
      border: 1px solid rgba(167, 139, 250, 0.2);
      color: #c4b5fd;
      font-size: 0.85rem;
      font-weight: 500;
      margin-bottom: 24px;
    }

    .ah-title {
      font-size: clamp(2rem, 5vw, 3rem);
      font-weight: 900;
      letter-spacing: -0.02em;
      margin-bottom: 16px;
      line-height: 1.1;
      color: white;
    }

    html[lang="ar"] .ah-title { font-weight: 900; }

    .ah-gradient {
      background: linear-gradient(to right, #a78bfa, #f472b6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .platform-toggles {
      display: flex;
      justify-content: center;
      gap: 12px;
      margin-bottom: 40px;
      flex-wrap: wrap;
    }
    .pt-btn {
      background: var(--dark-card);
      border: 1px solid var(--border);
      padding: 12px 24px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      cursor: pointer;
      color: #fff;
      transition: all 0.3s ease;
      font-size: 0.95rem;
    }
    .pt-soon {
      background: rgba(255,255,255,0.1);
      font-size: 0.65rem;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 700;
      opacity: 0.8;
      margin-left: 4px;
    }
    html[lang="ar"] .pt-soon { margin-left: 0; margin-right: 4px; }
    
    .pt-btn.active {
      border-color: rgba(255,255,255,0.2);
      cursor: default;
    }
    .pt-btn.active.youtube {
      background: linear-gradient(135deg, #ef4444, #b91c1c);
      box-shadow: 0 4px 20px rgba(239, 68, 68, 0.2);
    }
    .pt-btn.active.instagram {
      background: linear-gradient(135deg, #f58529, #dd2a7b, #8134af);
      box-shadow: 0 4px 20px rgba(221, 42, 123, 0.2);
    }
    .pt-btn.active.tiktok {
      background: linear-gradient(135deg, #000000, #ff0050, #00f2fe);
      box-shadow: 0 4px 20px rgba(255, 0, 80, 0.2);
    }

    .search-box-wrap {
      background: rgba(15, 15, 20, 0.6); backdrop-filter: blur(10px);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 6px;
      display: flex;
      align-items: center;
      max-width: 600px;
      margin: 0 auto;
      transition: border-color 0.3s ease;
    }
    .search-box-wrap:focus-within {
      border-color: rgba(239, 68, 68, 0.5);
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    .search-input {
      flex: 1;
      background: transparent;
      border: none;
      color: #fff;
      padding: 14px 20px;
      font-size: 1rem;
      outline: none;
      font-family: inherit;
    }
    
    .search-btn {
      background: linear-gradient(135deg, #ef4444, #b91c1c);
      border: none;
      color: white;
      padding: 14px 28px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 0.95rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: opacity 0.2s;
    }

    .search-hint {
      color: var(--text-muted);
      font-size: 0.8rem;
      margin-top: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    .step { display: none; animation: fadeIn 0.4s ease-in-out; }
    .step.active { display: block; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    .res-card {
      background: rgba(15, 15, 20, 0.65);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 30px;
      text-align: center;
      backdrop-filter: blur(16px); box-shadow: 0 10px 40px -10px rgba(0,0,0,0.5);
      margin-top: 20px;
    }
    html[lang="ar"] .res-card { text-align: right; }
    #step-2.res-card, #step-3.res-card { text-align: center; }

    .loader {
      border: 3px solid rgba(255,255,255,0.1);
      border-top-color: #ef4444;
      border-radius: 50%;
      width: 40px; height: 40px;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

    .profile-info { display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 25px; }
    html[lang="ar"] .profile-info { justify-content: flex-start; }
    .profile-avatar { width: 70px; height: 70px; border-radius: 50%; object-fit: cover; border: 2px solid #ef4444; }
    .profile-name { font-size: 1.4rem; font-weight: 800; color: white; }
    .profile-meta { font-size: 0.95rem; color: var(--text-secondary); margin-top: 4px; }

    .circ-progress { position: relative; width: 160px; height: 160px; margin: 0 auto 25px; }
    .circ-svg { transform: rotate(-90deg); width: 100%; height: 100%; }
    .circ-bg { fill: none; stroke: rgba(255,255,255,0.05); stroke-width: 8; }
    .circ-val { fill: none; stroke: url(#grad_circ); stroke-width: 8; stroke-linecap: round; stroke-dasharray: 477; stroke-dashoffset: 477; transition: stroke-dashoffset 1.5s ease; }
    .circ-text { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; flex-direction: column; }
    .circ-num { font-size: 2.5rem; font-weight: 900; color: white;}
    .circ-label { font-size: 0.85rem; color: var(--text-secondary); font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; margin-top:-5px;}

    .gate-form-wrap { margin: 0 auto; text-align: left; }
    html[lang="ar"] .gate-form-wrap { text-align: right; margin-right: 0;}
    .gate-input { width: 100%; background: var(--dark-2); border: 1px solid var(--border); color: #fff; padding: 14px; border-radius: 12px; margin-bottom: 12px; font-family: inherit; font-size: 0.95rem; }
    .gate-input:focus { outline: none; border-color: #ef4444; }
    .gate-btn { width: 100%; background: linear-gradient(135deg, #ef4444, #b91c1c); border: none; padding: 16px; border-radius: 12px; color: #fff; font-weight: 700; font-size: 1rem; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 8px; margin-top: 10px; }

    .score-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 25px; }
    .score-card { background: var(--dark-2); padding: 20px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); text-align:center;}
    .sc-title { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-secondary); margin-bottom: 8px; font-weight: 600; }
    .sc-val { font-size: 1.8rem; font-weight: 800; color: #ef4444; }
    .sc-strategy-val { color: var(--primary-light); }

    .rec-box { margin-top: 30px; background: var(--dark-2); border-radius: 16px; padding: 25px; text-align: left; border: 1px solid var(--border); }
    html[lang="ar"] .rec-box { text-align: right; }
    .rec-title { margin-bottom: 15px; color: var(--primary-light); display: flex; align-items: center; gap: 8px; font-size: 1.1rem; }
    
    /* Language Toggle Fix */
    body:not(.en-active) .en-text, html[lang="ar"] .en-text { display: none !important; }
    body:not(.en-active) .ar-text, html[lang="ar"] .ar-text { display: block; }
    body:not(.en-active) span.ar-text, html[lang="ar"] span.ar-text, body:not(.en-active) i.ar-text, html[lang="ar"] i.ar-text { display: inline-block; }
    
    body.en-active .ar-text, html[lang="en"] .ar-text { display: none !important; }
    body.en-active .en-text, html[lang="en"] .en-text { display: block; }
    body.en-active span.en-text, html[lang="en"] span.en-text, body.en-active i.en-text, html[lang="en"] i.en-text { display: inline-block; }

    /* Fix LTR styles for English Report content on RTL page */
    body.en-active .res-card, html[lang="en"] .res-card { text-align: left; }
    body.en-active .res-card#step-2, body.en-active .res-card#step-3, html[lang="en"] .res-card#step-2, html[lang="en"] .res-card#step-3 { text-align: center; }
    body.en-active .gate-form-wrap, html[lang="en"] .gate-form-wrap { text-align: left; margin-left: auto; margin-right: auto; }
    body.en-active .profile-info, html[lang="en"] .profile-info { justify-content: flex-start; }
    body.en-active #step-3 .profile-info, html[lang="en"] #step-3 .profile-info { justify-content: center; }
    body.en-active .rec-box, html[lang="en"] .rec-box { text-align: left; }

    /* Mobile Enhancements */
    @media (max-width: 600px) {
      .analyzer-wrap { padding: 20px 15px; margin: 40px auto; }
      .ah-title { font-size: 2.2rem; }
      .search-box-wrap { flex-direction: column; background: transparent; border: none; padding: 0; box-shadow: none; }
      .search-box-wrap:focus-within { box-shadow: none; border-color: transparent; }
      .search-input { width: 100%; background: var(--dark-card); border: 1px solid var(--border); border-radius: 12px; margin-bottom: 12px; }
      .search-btn { width: 100%; justify-content: center; }
      .score-grid { grid-template-columns: 1fr; }
      .score-card[style*="grid-column"] { grid-column: span 1 !important; }
      .profile-info { flex-direction: column; text-align: center !important; justify-content: center !important; }
      html[lang="ar"] .profile-info { text-align: center !important; justify-content: center !important; }
      .profile-info > div { text-align: center !important; }
    }
  </style>
</head>
<body>
  <div class="bg-orb orb-1"></div>
  <div class="bg-orb orb-2"></div>
  <div class="bg-orb orb-3"></div>

  <!-- NAVBAR (from index.tsx) -->
  <nav class="navbar" id="navbar">
    <div class="container nav-inner">
      <div class="logo" style="flex-direction:column;align-items:flex-start;gap:2px;">
        <a href="/">
            <img src="/brand/cropped.png" alt="CreatorHubPro" class="logo-img" style="width:100px;" />
        </a>
      </div>
      <div class="nav-actions">
        <!-- Reusing standard translation logic from app.js -->
        <button class="lang-toggle" id="langToggle" onclick="toggleLang()">EN</button>
      </div>
    </div>
  </nav>

  <div class="analyzer-wrap">
    
    <!-- STEP 1: INTAKE -->
    <div id="step-1" class="step active">
      <div class="ah-badge">
        <i class="fas fa-chart-pie"></i> 
        <span class="en-text">Social Media Analyzer</span>
        <span class="ar-text">أداة تحليل الحسابات</span>
      </div>
      
      <h1 class="ah-title en-text">Analyze Any <span class="ah-gradient">Social Account</span></h1>
      <h1 class="ah-title ar-text">حلل حسابك <span class="ah-gradient">مجاناً</span></h1>
      
      <p class="ah-subtitle en-text">Get instant insights into any creator's profile — followers, engagement, and more.</p>
      <p class="ah-subtitle ar-text">احصل على تحليل فوري لأي حساب — متابعين، تفاعل، جودة محتوى وأكثر.</p>
      
      <div class="platform-toggles">
        <div class="pt-btn" onclick="setPlatform('instagram')" id="btn-instagram">
          <i class="fab fa-instagram"></i> <span class="en-text">Instagram</span> <span class="ar-text">انستجرام</span>
        </div>
        <div class="pt-btn" onclick="setPlatform('tiktok')" id="btn-tiktok">
          <i class="fab fa-tiktok"></i> <span class="en-text">TikTok</span> <span class="ar-text">تيك توك</span>
        </div>
        <div class="pt-btn active youtube" onclick="setPlatform('youtube')" id="btn-youtube">
          <i class="fab fa-youtube"></i> <span class="en-text">YouTube</span> <span class="ar-text">يوتيوب</span>
        </div>
      </div>

      <form id="intake-form" onsubmit="handleAnalyze(event)">
        <div class="search-box-wrap">
          <input type="text" id="username" class="search-input" placeholder="Enter Channel URL or @handle..." required autocomplete="off" />
          <button type="submit" class="search-btn">
            <i class="fas fa-search"></i> <span class="en-text">Analyze</span><span class="ar-text">تحليل</span>
          </button>
        </div>
        <div class="search-hint">
          <i class="fas fa-info-circle"></i> 
          <span class="en-text">Enter a handle (e.g. @mrbeast) or paste a channel URL.</span>
          <span class="ar-text">أدخل معرف الحساب (مثل @mrbeast) أو رابط القناة</span>
        </div>
      </form>
      
      <div class="analyzer-footer">
        Powered by <span>CreatorHubPro</span>
      </div>
    </div>

    <!-- STEP 2: THE WAIT -->
    <div id="step-2" class="step res-card">
      <div class="loader"></div>
      <h2 style="margin-bottom: 10px;" class="en-text">Scanning Account...</h2>
      <h2 style="margin-bottom: 10px;" class="ar-text">جاري فحص الحساب...</h2>
      <p style="opacity:0.7;" id="scanning-text-en" class="en-text">Connecting to API...</p>
      <p style="opacity:0.7;" id="scanning-text-ar" class="ar-text">جاري الاتصال...</p>
    </div>

    <!-- STEP 3 & 4: TEASER & GATE -->
    <div id="step-3" class="step res-card" style="text-align:center;">
      <div class="profile-info" style="justify-content:center;">
        <img id="res-avatar" src="" class="profile-avatar" style="display:none;" />
        <div style="text-align: left;" dir="ltr">
          <div class="profile-name" id="res-username">@username</div>
          <div class="profile-meta"><i class="fas fa-users"></i> <span id="res-followers">0</span> <span class="en-text" style="margin-left: 4px;">Subscribers</span><span class="ar-text" style="margin-right: 4px;">مشترك</span></div>
        </div>
      </div>
      
      <div class="circ-progress">
        <svg class="circ-svg" viewBox="0 0 160 160">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#ef4444"/>
              <stop offset="100%" stop-color="#b91c1c"/>
            </linearGradient>
          </defs>
          <circle class="circ-bg" cx="80" cy="80" r="76"></circle>
          <circle class="circ-val" id="teaser-circ" cx="80" cy="80" r="76"></circle>
        </svg>
        <div class="circ-text">
          <span class="circ-num"><span id="teaser-score">0</span><span style="font-size:0.5em">/100</span></span>
          <span class="circ-label en-text" style="margin-top:-5px">Growth Score</span>
          <span class="circ-label ar-text" style="margin-top:-5px">نقاط النمو</span>
        </div>
      </div>
      
      <h2 style="margin-bottom: 12px; font-weight: 800;" class="en-text">Report is Ready!</h2>
      <h2 style="margin-bottom: 12px; font-weight: 800;" class="ar-text">اكتمل التقرير!</h2>
      <p style="opacity:0.8; margin-bottom: 30px; font-size: 0.95rem; max-width: 400px; margin-left: auto; margin-right: auto;" class="en-text">
        We've analyzed this channel's strengths and weaknesses. Enter your details to unlock the full report and free strategy recommendations.
      </p>
      <p style="opacity:0.8; margin-bottom: 30px; font-size: 0.95rem; max-width: 400px; margin-left: auto; margin-right: auto;" class="ar-text">
        قمنا بتحليل نقاط القوة والضعف للقناة. أدخل بياناتك أدناه لفتح التقرير الكامل وتحليل معدلات التفاعل الحقيقية الخاصة بك مع توصيات البروفيسور.
      </p>
      
      <form id="gate-form" class="gate-form-wrap" onsubmit="handleUnlock(event)">
        <!-- Language-specific placeholders are now toggled via JS -->
        <input type="text" id="gate-name" class="gate-input" placeholder="الاسم الأول" required />
        <input type="email" id="gate-email" class="gate-input" placeholder="البريد الإلكتروني" required />
        <input type="tel" id="gate-phone" class="gate-input" placeholder="رقم الواتساب" required />
        
        <button type="submit" class="gate-btn">
          <i class="fas fa-unlock"></i> 
          <span class="en-text">Unlock Full Report</span>
          <span class="ar-text">فتح التقرير الكامل</span>
        </button>
      </form>
    </div>

    <!-- STEP 5 & 6: FULL REPORT -->
    <div id="step-4" class="step res-card">
      
      <div class="profile-info">
        <img id="res-avatar-full" src="" class="profile-avatar" style="display:none;" />
        <div style="text-align: left;" dir="ltr">
          <div class="profile-name" id="res-username-full">@username</div>
          <div class="profile-meta"><i class="fas fa-trophy"></i> Rank: <strong id="res-benchmark" style="color:#ef4444;">-</strong></div>
        </div>
      </div>

      <div class="score-grid">
        <div class="score-card">
          <div class="sc-title en-text">Consistency</div>
          <div class="sc-title ar-text">الاستمرارية</div>
          <div class="sc-val"><span id="sc-consistency">0</span>/100</div>
        </div>
        <div class="score-card">
          <div class="sc-title en-text">Engagement</div>
          <div class="sc-title ar-text">جودة التفاعل</div>
          <div class="sc-val"><span id="sc-engagement">0</span>/100</div>
        </div>
        <div class="score-card" style="grid-column: span 2;">
          <div class="sc-title en-text">Content Strategy Score</div>
          <div class="sc-title ar-text">تقييم الاستراتيجية</div>
          <div class="sc-val sc-strategy-val"><span id="sc-strategy">0</span>/100</div>
        </div>
      </div>
      
      <div class="rec-box">
        <h4 class="rec-title">
          <i class="fas fa-lightbulb"></i> 
          <span class="en-text">Expert Analysis</span><span class="ar-text">تحليل البروفيسور</span>
        </h4>
        <p id="rec-en-txt" class="en-text" style="font-size: 0.95rem; line-height: 1.6; color: rgba(255,255,255,0.85);"></p>
        <p id="rec-ar-txt" class="ar-text" style="font-size: 0.95rem; line-height: 1.6; color: rgba(255,255,255,0.85);"></p>
      </div>

      <div style="margin-top: 30px; text-align: center;">
        <a href="/#form-section" class="btn btn-form-submit" style="display: inline-flex; width: auto; font-size:1rem; padding: 14px 28px;">
          <i class="fas fa-rocket" style="margin-right:8px; margin-left:8px;"></i> 
          <span class="en-text">Book Free Strategy Session</span>
          <span class="ar-text">احجز جلسة استشارة مجانية</span>
        </a>
      </div>
    </div>
  </div>

  <script src="/static/app.js"></script>
  <script>
    let globalAnalysisData = null;
    let currentPlatform = 'youtube';

    function setPlatform(platform) {
      if (document.getElementById('step-2').classList.contains('active')) return; // Prevent during scan
      currentPlatform = platform;
      document.querySelectorAll('.pt-btn').forEach(btn => btn.className = 'pt-btn');
      const activeBtn = document.getElementById('btn-' + platform);
      if (activeBtn) {
        activeBtn.classList.add('active', platform);
      }
    }

    // Observe language toggle globally
    const oldToggleLang = window.toggleLang;
    window.toggleLang = function() {
      // Use logic natively from app.js
      if (oldToggleLang) oldToggleLang();
      const isEn = document.documentElement.lang === 'en';
      
      const uInput = document.getElementById('username');
      if (uInput) uInput.placeholder = isEn ? "Enter Channel URL or @handle..." : "أدخل رابط القناة أو @آلمعرف...";
      
      const gName = document.getElementById('gate-name');
      if (gName) gName.placeholder = isEn ? "First Name" : "الاسم الأول";
      
      const gEmail = document.getElementById('gate-email');
      if (gEmail) gEmail.placeholder = isEn ? "Email Address" : "البريد الإلكتروني";
      
      const gPhone = document.getElementById('gate-phone');
      if (gPhone) gPhone.placeholder = isEn ? "WhatsApp Number" : "رقم الواتساب";
    };

    function showStep(stepNum) {
      document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
      document.getElementById('step-' + stepNum).classList.add('active');
    }

    function animateCirc(id, score) {
      const circ = document.getElementById(id);
      if (!circ) return;
      // dasharray is 477 based on r=76 (2*PI*76 =~ 477.5)
      const offset = 477 - (score / 100) * 477;
      setTimeout(() => { circ.style.strokeDashoffset = offset; }, 100);
    }
    
    function animateCount(id, target) {
      const el = document.getElementById(id);
      if(!el) return;
      let start = 0;
      const duration = 1500;
      const startTime = performance.now();
      
      function step(now) {
        const p = Math.min((now - startTime) / duration, 1);
        const val = Math.floor(p * target);
        el.innerText = val;
        if (p < 1) requestAnimationFrame(step);
        else el.innerText = target;
      }
      requestAnimationFrame(step);
    }

    async function handleAnalyze(e) {
      e.preventDefault();
      const username = document.getElementById('username').value;
      
      showStep(2);
      
      const scanTextsEn = ['Evaluating subscriber ratio...', 'Checking content output...', 'Analyzing estimated engagement...', 'Calculating final scores...'];
      const scanTextsAr = ['تقييم نسبة المشتركين...', 'فحص الاستمرارية وعدد الفيديوهات...', 'تحليل متوسط التفاعل...', 'حساب النتائج النهائية...'];
      
      let i = 0;
      const scanInterval = setInterval(() => {
        i = (i + 1) % scanTextsEn.length;
        document.getElementById('scanning-text-en').innerText = scanTextsEn[i];
        document.getElementById('scanning-text-ar').innerText = scanTextsAr[i];
      }, 900);

      try {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ platform: currentPlatform, username })
        });
        
        const json = await res.json();
        clearInterval(scanInterval);
        
        if (!res.ok || json.error) {
          alert(json.error || 'Failed to analyze channel.');
          showStep(1);
          return;
        }

        globalAnalysisData = json.data;

        // Set labels
        document.getElementById('res-username').innerText = globalAnalysisData.username;
        document.getElementById('res-username-full').innerText = globalAnalysisData.username;
        
        if (globalAnalysisData.avatar) {
          document.getElementById('res-avatar').src = globalAnalysisData.avatar;
          document.getElementById('res-avatar').style.display = 'block';
          document.getElementById('res-avatar-full').src = globalAnalysisData.avatar;
          document.getElementById('res-avatar-full').style.display = 'block';
        }
        
        // Formatter for large numbers
        const fraw = globalAnalysisData.followers;
        const formattedFollowers = fraw >= 1000000 ? (fraw/1000000).toFixed(1) + 'M' : fraw >= 1000 ? (fraw/1000).toFixed(1) + 'K' : fraw;
        document.getElementById('res-followers').innerText = formattedFollowers;

        showStep(3);
        animateCount('teaser-score', globalAnalysisData.scores.overall);
        animateCirc('teaser-circ', globalAnalysisData.scores.overall);

      } catch (err) {
        clearInterval(scanInterval);
        alert('An error occurred. Please try again.');
        showStep(1);
      }
    }

    function handleUnlock(e) {
      e.preventDefault();
      const name = document.getElementById('gate-name').value;
      const email = document.getElementById('gate-email').value;
      const phone = document.getElementById('gate-phone').value;

      const webhookUrl = 'https://hook.eu1.make.com/hlmfum67m9lsm07j8rt7iecdm527csk5';
      const payload = {
        name, email, phone,
        source: 'Account Analysis Tool 2026 - YouTube',
        username: globalAnalysisData.username,
        platform: globalAnalysisData.platform,
        scores: globalAnalysisData.scores
      };
      
      console.log('Would normally send to webhook', payload)

      // Removed actual post to webhook out of precaution right now based on user prompt 'do not send any thing to make right now'

      populateReport();
      showStep(4);
    }
    
    function populateReport() {
      const d = globalAnalysisData;
      
      document.getElementById('res-benchmark').innerText = d.benchmark;
      document.getElementById('sc-consistency').innerText = d.scores.consistency;
      document.getElementById('sc-engagement').innerText = d.scores.engagement;
      document.getElementById('sc-strategy').innerText = d.scores.strategy;
      
      let recEn = "";
      let recAr = "";
      
      if (d.scores.consistency < 50) {
          recEn += "You are missing consistency! With only " + d.videos30Days + " videos in the last 30 days, YouTube isn't pushing your channel enough. ";
          recAr += "هناك مشكلة في الاستمرارية! مع وجود " + d.videos30Days + " فيديوهات فقط في آخر 30 يوماً، يوتيوب لا يقترح قناتك بشكل كافٍ. ";
      } else {
          recEn += "Your video output strategy (" + d.videos30Days + " last month) is good. ";
          recAr += "استراتيجية النشر الخاصة بك (" + d.videos30Days + " في الشهر الماضي) ممتازة. ";
      }
      
      if (d.insights && d.insights.en) {
          recEn += d.insights.en;
          recAr += d.insights.ar;
      }
      
      document.getElementById('rec-en-txt').innerText = recEn;
      document.getElementById('rec-ar-txt').innerText = recAr;
    }
  </script>
</body>
</html>`)
})
