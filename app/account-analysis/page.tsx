import Script from 'next/script';

export default function AnalyzerPage() {
  const analyzerHtml = `
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
    
    `;

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: analyzerHtml }} />

      {/* 1. Load Global Logic (The old file) */}
      <Script src="/static/app.js" strategy="beforeInteractive" />

      {/* 2. Load Analyzer Logic (The new file) */}
      <Script src="/static/analyzer-logic.js" strategy="afterInteractive" />
    </>
  );
}