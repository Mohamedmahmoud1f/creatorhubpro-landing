import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

app.use('/static/*', serveStatic({ root: './public' }))

app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="حوّل محتواك إلى آلة تجذب العملاء - خدمة مونتاج احترافي + نظام نمو + جلسات توجيه مع البروفيسورة" />
  <meta name="keywords" content="مونتاج فيديو, تعديل فيديو, صانع محتوى, نمو محتوى, كريتور, ريلز, يوتيوب" />
  <meta property="og:title" content="CreatorPro | حوّل محتواك إلى آلة تجذب العملاء" />
  <meta property="og:description" content="مش مجرد مونتاج فيديو… نظام متكامل يساعدك تنشر محتوى احترافي وتحوّل المشاهدين إلى عملاء" />
  <meta property="og:type" content="website" />
  <title>CreatorPro | حوّل محتواك إلى آلة تجذب العملاء</title>
  <link rel="icon" type="image/svg+xml" href="/static/favicon.svg" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css" />
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="/static/styles.css" />
</head>
<body class="font-cairo overflow-x-hidden">

  <!-- ============================
       STICKY TOP BAR
  ============================= -->
  <div class="sticky-urgency-bar">
    <span class="ar-text">⚡ الأماكن محدودة هذا الشهر — سارع بالحجز الآن!</span>
    <span class="en-text" style="display:none">⚡ Limited slots this month — Book before it's full!</span>
  </div>

  <!-- ============================
       NAVBAR
  ============================= -->
  <nav class="navbar" id="navbar">
    <div class="container nav-inner">
      <div class="logo">
        <span class="logo-icon"><i class="fas fa-film"></i></span>
        <span class="logo-text">Creator<span class="accent">Pro</span></span>
      </div>
      <div class="nav-actions">
        <button class="lang-toggle" id="langToggle" onclick="toggleLang()">EN</button>
        <a href="#form-section" class="btn btn-nav ar-text">احجز مجاناً</a>
        <a href="#form-section" class="btn btn-nav en-text" style="display:none">Book Free</a>
      </div>
    </div>
  </nav>

  <!-- ============================
       HERO SECTION
  ============================= -->
  <section class="hero-section" id="hero">
    <div class="hero-bg-overlay"></div>
    <div class="hero-particles" id="particles"></div>
    <div class="container hero-inner">
      <div class="hero-content animate-fade-up">
        <div class="hero-badge ar-text">
          <i class="fas fa-star"></i> نظام المحتوى الاحترافي
        </div>
        <div class="hero-badge en-text" style="display:none">
          <i class="fas fa-star"></i> Professional Content System
        </div>

        <h1 class="hero-headline ar-text">
          حوّل محتواك إلى<br/>
          <span class="gradient-text">آلة تجذب العملاء</span>
        </h1>
        <h1 class="hero-headline en-text" style="display:none">
          Turn Your Content Into a<br/>
          <span class="gradient-text">Client-Generating Machine</span>
        </h1>

        <p class="hero-sub ar-text">
          مش مجرد مونتاج فيديو… نظام متكامل يساعدك تنشر محتوى احترافي
          <br/>وتحوّل المشاهدين إلى عملاء حقيقيين
        </p>
        <p class="hero-sub en-text" style="display:none">
          Not just video editing… a complete system that helps you publish professional content
          <br/>and turn viewers into real paying clients
        </p>

        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-num">+200</span>
            <span class="stat-label ar-text">كريتور استفاد</span>
            <span class="stat-label en-text" style="display:none">Creators Served</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num">98%</span>
            <span class="stat-label ar-text">نسبة الرضا</span>
            <span class="stat-label en-text" style="display:none">Satisfaction Rate</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num">48h</span>
            <span class="stat-label ar-text">وقت التسليم</span>
            <span class="stat-label en-text" style="display:none">Delivery Time</span>
          </div>
        </div>

        <div class="hero-cta">
          <a href="#form-section" class="btn btn-primary ar-text">
            <i class="fas fa-rocket"></i> ابدأ الآن
          </a>
          <a href="#form-section" class="btn btn-primary en-text" style="display:none">
            <i class="fas fa-rocket"></i> Start Now
          </a>
          <a href="#coaching" class="btn btn-secondary ar-text">
            <i class="fas fa-calendar-check"></i> احجز جلسة مجانية
          </a>
          <a href="#coaching" class="btn btn-secondary en-text" style="display:none">
            <i class="fas fa-calendar-check"></i> Book Free Session
          </a>
        </div>
      </div>

      <div class="hero-visual animate-fade-left">
        <div class="phone-mockup">
          <div class="phone-frame">
            <div class="phone-notch"></div>
            <div class="phone-screen">
              <div class="video-placeholder">
                <div class="video-inner">
                  <div class="before-after-badge ar-text">قبل / بعد</div>
                  <div class="before-after-badge en-text" style="display:none">Before / After</div>
                  <div class="play-pulse">
                    <div class="play-ring ring-1"></div>
                    <div class="play-ring ring-2"></div>
                    <div class="play-btn"><i class="fas fa-play"></i></div>
                  </div>
                  <div class="video-label">
                    <i class="fas fa-film"></i>
                    <span class="ar-text">ريلز احترافي</span>
                    <span class="en-text" style="display:none">Pro Reels</span>
                  </div>
                </div>
              </div>
              <div class="reel-stats">
                <span><i class="fas fa-heart"></i> 24.5K</span>
                <span><i class="fas fa-eye"></i> 180K</span>
                <span><i class="fas fa-share"></i> 3.2K</span>
              </div>
            </div>
          </div>
          <div class="phone-glow"></div>
        </div>
        <div class="floating-card card-1 animate-float">
          <i class="fas fa-chart-line"></i>
          <span class="ar-text">+340% وصول</span>
          <span class="en-text" style="display:none">+340% Reach</span>
        </div>
        <div class="floating-card card-2 animate-float-delay">
          <i class="fas fa-users"></i>
          <span class="ar-text">+120 عميل جديد</span>
          <span class="en-text" style="display:none">+120 New Clients</span>
        </div>
      </div>
    </div>
    <div class="hero-scroll-indicator">
      <div class="scroll-dot"></div>
    </div>
  </section>

  <!-- ============================
       PROBLEM SECTION
  ============================= -->
  <section class="problem-section section-padding" id="problem">
    <div class="container">
      <div class="section-tag ar-text">المشكلة</div>
      <div class="section-tag en-text" style="display:none">THE PROBLEM</div>

      <h2 class="section-title ar-text">
        ليه محتواك <span class="highlight-red">مش بيحقق نتائج؟</span>
      </h2>
      <h2 class="section-title en-text" style="display:none">
        Why Your Content <span class="highlight-red">Isn't Performing?</span>
      </h2>

      <div class="problems-grid">
        <div class="problem-card animate-on-scroll">
          <div class="problem-icon"><i class="fas fa-random"></i></div>
          <h3 class="ar-text">بتصور بدون خطة</h3>
          <h3 class="en-text" style="display:none">No Strategy</h3>
          <p class="ar-text">محتوى عشوائي بدون هدف = مشاهدات بدون عملاء</p>
          <p class="en-text" style="display:none">Random content with no goal = views without clients</p>
        </div>
        <div class="problem-card animate-on-scroll">
          <div class="problem-icon"><i class="fas fa-film"></i></div>
          <h3 class="ar-text">المونتاج مش جذاب</h3>
          <h3 class="en-text" style="display:none">Weak Editing</h3>
          <p class="ar-text">فيديو ضعيف = الناس تسحب وتمشي في الثواني الأولى</p>
          <p class="en-text" style="display:none">Poor editing = people scroll away in the first seconds</p>
        </div>
        <div class="problem-card animate-on-scroll">
          <div class="problem-icon"><i class="fas fa-compass"></i></div>
          <h3 class="ar-text">مفيش توجيه</h3>
          <h3 class="en-text" style="display:none">No Guidance</h3>
          <p class="ar-text">بتشتغل لوحدك وملقيش حد يقولك الطريق الصح</p>
          <p class="en-text" style="display:none">Working alone with no one guiding you in the right direction</p>
        </div>
        <div class="problem-card animate-on-scroll">
          <div class="problem-icon"><i class="fas fa-chart-bar"></i></div>
          <h3 class="ar-text">مفيش نتائج</h3>
          <h3 class="en-text" style="display:none">No Results</h3>
          <p class="ar-text">وقت وجهد كتير… والأرقام واقفة في مكانها</p>
          <p class="en-text" style="display:none">Lots of time and effort… and the numbers just don't grow</p>
        </div>
      </div>

      <div class="problem-arrow">
        <i class="fas fa-arrow-down"></i>
      </div>
    </div>
  </section>

  <!-- ============================
       SOLUTION SECTION
  ============================= -->
  <section class="solution-section section-padding" id="solution">
    <div class="container">
      <div class="section-tag ar-text">الحل</div>
      <div class="section-tag en-text" style="display:none">THE SOLUTION</div>

      <h2 class="section-title ar-text">
        الحل مش فيديو…<br/><span class="gradient-text">الحل نظام</span>
      </h2>
      <h2 class="section-title en-text" style="display:none">
        It's Not About a Video…<br/><span class="gradient-text">It's About a System</span>
      </h2>

      <p class="section-subtitle ar-text">
        نحن لا نعدل فيديوهاتك فقط — نبني معك منظومة متكاملة لصناعة محتوى يحقق نتائج
      </p>
      <p class="section-subtitle en-text" style="display:none">
        We don't just edit your videos — we build a complete system for creating content that converts
      </p>

      <div class="solutions-grid">
        <div class="solution-card animate-on-scroll">
          <div class="sol-num">01</div>
          <div class="sol-icon"><i class="fas fa-cut"></i></div>
          <h3 class="ar-text">مونتاج احترافي</h3>
          <h3 class="en-text" style="display:none">Professional Editing</h3>
          <p class="ar-text">مونتاج يشد الانتباه من الثانية الأولى ويخلي الناس تكمل المشاهدة</p>
          <p class="en-text" style="display:none">Editing that hooks from the first second and keeps people watching</p>
          <ul class="sol-list ar-text">
            <li><i class="fas fa-check"></i> كابشن وترجمة</li>
            <li><i class="fas fa-check"></i> موسيقى وإضاءة</li>
            <li><i class="fas fa-check"></i> تأثيرات بصرية</li>
          </ul>
          <ul class="sol-list en-text" style="display:none">
            <li><i class="fas fa-check"></i> Captions & Subtitles</li>
            <li><i class="fas fa-check"></i> Music & Color Grading</li>
            <li><i class="fas fa-check"></i> Visual Effects</li>
          </ul>
        </div>
        <div class="solution-card solution-card-featured animate-on-scroll">
          <div class="featured-badge ar-text">⭐ الأهم</div>
          <div class="featured-badge en-text" style="display:none">⭐ Key Feature</div>
          <div class="sol-num">02</div>
          <div class="sol-icon"><i class="fas fa-brain"></i></div>
          <h3 class="ar-text">توجيه استراتيجي</h3>
          <h3 class="en-text" style="display:none">Strategic Direction</h3>
          <p class="ar-text">مع البروفيسورة نحلل محتواك ونبني خطة نمو واضحة ومخصصة ليك</p>
          <p class="en-text" style="display:none">With the Professor, we analyze your content and build a clear, personalized growth plan</p>
          <ul class="sol-list ar-text">
            <li><i class="fas fa-check"></i> تحليل حساباتك</li>
            <li><i class="fas fa-check"></i> تحسين الـ Hook</li>
            <li><i class="fas fa-check"></i> أفكار محتوى</li>
          </ul>
          <ul class="sol-list en-text" style="display:none">
            <li><i class="fas fa-check"></i> Account Analysis</li>
            <li><i class="fas fa-check"></i> Hook Improvement</li>
            <li><i class="fas fa-check"></i> Content Ideas</li>
          </ul>
        </div>
        <div class="solution-card animate-on-scroll">
          <div class="sol-num">03</div>
          <div class="sol-icon"><i class="fas fa-chart-line"></i></div>
          <h3 class="ar-text">تطوير مستمر</h3>
          <h3 class="en-text" style="display:none">Continuous Growth</h3>
          <p class="ar-text">مش شغلة مرة وخلاص — نتابع معك ونطور الأداء باستمرار</p>
          <p class="en-text" style="display:none">Not a one-time thing — we track and continuously improve your performance</p>
          <ul class="sol-list ar-text">
            <li><i class="fas fa-check"></i> تحليل الأرقام</li>
            <li><i class="fas fa-check"></i> تحسين الاستراتيجية</li>
            <li><i class="fas fa-check"></i> نمو مستدام</li>
          </ul>
          <ul class="sol-list en-text" style="display:none">
            <li><i class="fas fa-check"></i> Analytics Review</li>
            <li><i class="fas fa-check"></i> Strategy Optimization</li>
            <li><i class="fas fa-check"></i> Sustainable Growth</li>
          </ul>
        </div>
      </div>

      <div class="cta-center">
        <a href="#form-section" class="btn btn-primary ar-text">
          <i class="fas fa-rocket"></i> ابدأ رحلتك الآن
        </a>
        <a href="#form-section" class="btn btn-primary en-text" style="display:none">
          <i class="fas fa-rocket"></i> Start Your Journey
        </a>
      </div>
    </div>
  </section>

  <!-- ============================
       HOW IT WORKS
  ============================= -->
  <section class="how-section section-padding" id="how">
    <div class="container">
      <div class="section-tag ar-text">العملية</div>
      <div class="section-tag en-text" style="display:none">THE PROCESS</div>

      <h2 class="section-title ar-text">كيف بيشتغل النظام؟</h2>
      <h2 class="section-title en-text" style="display:none">How Does It Work?</h2>

      <div class="steps-container">
        <div class="step-item animate-on-scroll">
          <div class="step-number">1</div>
          <div class="step-icon-wrap">
            <div class="step-icon"><i class="fab fa-google-drive"></i></div>
          </div>
          <div class="step-content">
            <h3 class="ar-text">ارفع الفيديو</h3>
            <h3 class="en-text" style="display:none">Upload Your Video</h3>
            <p class="ar-text">ارفع المحتوى الخام على Google Drive بضغطة زر</p>
            <p class="en-text" style="display:none">Upload your raw footage to Google Drive with one click</p>
          </div>
        </div>

        <div class="step-connector"><i class="fas fa-arrow-left ar-text"></i><i class="fas fa-arrow-right en-text" style="display:none"></i></div>

        <div class="step-item animate-on-scroll">
          <div class="step-number">2</div>
          <div class="step-icon-wrap">
            <div class="step-icon"><i class="fas fa-magic"></i></div>
          </div>
          <div class="step-content">
            <h3 class="ar-text">نحلل ونعدّل</h3>
            <h3 class="en-text" style="display:none">We Analyze & Edit</h3>
            <p class="ar-text">فريقنا يحلل المحتوى ويعدله باحترافية خلال 48 ساعة</p>
            <p class="en-text" style="display:none">Our team analyzes and edits your content professionally within 48 hours</p>
          </div>
        </div>

        <div class="step-connector"><i class="fas fa-arrow-left ar-text"></i><i class="fas fa-arrow-right en-text" style="display:none"></i></div>

        <div class="step-item animate-on-scroll">
          <div class="step-number">3</div>
          <div class="step-icon-wrap">
            <div class="step-icon"><i class="fas fa-award"></i></div>
          </div>
          <div class="step-content">
            <h3 class="ar-text">استلم وانشر</h3>
            <h3 class="en-text" style="display:none">Receive & Publish</h3>
            <p class="ar-text">تستلم الفيديو النهائي وتنشره — نحن نطور باستمرار معك</p>
            <p class="en-text" style="display:none">Receive the final video and publish it — we keep improving with you</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============================
       COACHING / PROFESSOR SECTION
  ============================= -->
  <section class="coaching-section section-padding" id="coaching">
    <div class="coaching-bg-pattern"></div>
    <div class="container">
      <div class="coaching-inner animate-on-scroll">
        <div class="coaching-badge">
          <i class="fas fa-gift"></i>
          <span class="ar-text">مجاناً تماماً</span>
          <span class="en-text" style="display:none">Completely Free</span>
        </div>

        <h2 class="coaching-title ar-text">
          🎓 احجز جلسة مجانية مع<br/>
          <span class="professor-name">البروفيسورة</span>
        </h2>
        <h2 class="coaching-title en-text" style="display:none">
          🎓 Book Your Free Session with<br/>
          <span class="professor-name">The Professor</span>
        </h2>

        <p class="coaching-sub ar-text">
          نحلل محتواك ونقولك تعمل إيه بالظبط — جلسة واحدة تغيّر مسارك بالكامل
        </p>
        <p class="coaching-sub en-text" style="display:none">
          We analyze your content and tell you exactly what to do — one session that changes everything
        </p>

        <div class="coaching-benefits">
          <div class="benefit-item">
            <div class="benefit-icon"><i class="fas fa-search-plus"></i></div>
            <div class="benefit-text">
              <strong class="ar-text">تحليل حسابك</strong>
              <strong class="en-text" style="display:none">Account Audit</strong>
              <p class="ar-text">مراجعة شاملة لكل محتواك</p>
              <p class="en-text" style="display:none">Full review of your content</p>
            </div>
          </div>
          <div class="benefit-item">
            <div class="benefit-icon"><i class="fas fa-bolt"></i></div>
            <div class="benefit-text">
              <strong class="ar-text">تحسين الـ Hook</strong>
              <strong class="en-text" style="display:none">Hook Improvement</strong>
              <p class="ar-text">افتتاحيات تشد الانتباه فوراً</p>
              <p class="en-text" style="display:none">Openings that grab attention instantly</p>
            </div>
          </div>
          <div class="benefit-item">
            <div class="benefit-icon"><i class="fas fa-lightbulb"></i></div>
            <div class="benefit-text">
              <strong class="ar-text">أفكار محتوى</strong>
              <strong class="en-text" style="display:none">Content Ideas</strong>
              <p class="ar-text">أفكار مخصصة لمجالك</p>
              <p class="en-text" style="display:none">Ideas tailored to your niche</p>
            </div>
          </div>
          <div class="benefit-item">
            <div class="benefit-icon"><i class="fas fa-road"></i></div>
            <div class="benefit-text">
              <strong class="ar-text">اتجاه النمو</strong>
              <strong class="en-text" style="display:none">Growth Direction</strong>
              <p class="ar-text">خطة واضحة للخطوات القادمة</p>
              <p class="en-text" style="display:none">Clear plan for your next steps</p>
            </div>
          </div>
        </div>

        <div class="coaching-urgency ar-text">
          <i class="fas fa-clock"></i> تبقى <strong>7 أماكن</strong> فقط هذا الأسبوع
        </div>
        <div class="coaching-urgency en-text" style="display:none">
          <i class="fas fa-clock"></i> Only <strong>7 spots</strong> left this week
        </div>

        <a href="#form-section" class="btn btn-coaching ar-text">
          <i class="fas fa-calendar-plus"></i> احجز الآن — مجاناً
        </a>
        <a href="#form-section" class="btn btn-coaching en-text" style="display:none">
          <i class="fas fa-calendar-plus"></i> Book Now — It's Free
        </a>
      </div>
    </div>
  </section>

  <!-- ============================
       WHY US — COMPARISON
  ============================= -->
  <section class="comparison-section section-padding" id="why">
    <div class="container">
      <div class="section-tag ar-text">المقارنة</div>
      <div class="section-tag en-text" style="display:none">COMPARISON</div>

      <h2 class="section-title ar-text">ليه <span class="gradient-text">CreatorPro</span> ومش غيرنا؟</h2>
      <h2 class="section-title en-text" style="display:none">Why <span class="gradient-text">CreatorPro</span> and Not Others?</h2>

      <div class="comparison-grid">
        <div class="compare-card compare-others animate-on-scroll">
          <div class="compare-header">
            <i class="fas fa-times-circle"></i>
            <span class="ar-text">الآخرون</span>
            <span class="en-text" style="display:none">Others</span>
          </div>
          <ul class="compare-list">
            <li class="ar-text"><i class="fas fa-times"></i> مونتاج فقط بدون استراتيجية</li>
            <li class="en-text" style="display:none"><i class="fas fa-times"></i> Just editing with no strategy</li>
            <li class="ar-text"><i class="fas fa-times"></i> لا توجيه ولا دعم</li>
            <li class="en-text" style="display:none"><i class="fas fa-times"></i> No guidance or support</li>
            <li class="ar-text"><i class="fas fa-times"></i> محتوى عشوائي</li>
            <li class="en-text" style="display:none"><i class="fas fa-times"></i> Random content</li>
            <li class="ar-text"><i class="fas fa-times"></i> نتائج غير مضمونة</li>
            <li class="en-text" style="display:none"><i class="fas fa-times"></i> No guaranteed results</li>
            <li class="ar-text"><i class="fas fa-times"></i> لا تواصل بعد التسليم</li>
            <li class="en-text" style="display:none"><i class="fas fa-times"></i> No follow-up after delivery</li>
          </ul>
        </div>

        <div class="compare-vs">VS</div>

        <div class="compare-card compare-us animate-on-scroll">
          <div class="compare-header">
            <i class="fas fa-check-circle"></i>
            <span>CreatorPro</span>
          </div>
          <ul class="compare-list">
            <li class="ar-text"><i class="fas fa-check"></i> نظام متكامل من الاستراتيجية للمونتاج</li>
            <li class="en-text" style="display:none"><i class="fas fa-check"></i> Full system from strategy to editing</li>
            <li class="ar-text"><i class="fas fa-check"></i> جلسات توجيه مع البروفيسورة</li>
            <li class="en-text" style="display:none"><i class="fas fa-check"></i> Coaching sessions with the Professor</li>
            <li class="ar-text"><i class="fas fa-check"></i> محتوى موجّه لتحقيق أهداف</li>
            <li class="en-text" style="display:none"><i class="fas fa-check"></i> Goal-driven content</li>
            <li class="ar-text"><i class="fas fa-check"></i> نتائج قابلة للقياس</li>
            <li class="en-text" style="display:none"><i class="fas fa-check"></i> Measurable results</li>
            <li class="ar-text"><i class="fas fa-check"></i> متابعة ودعم مستمر</li>
            <li class="en-text" style="display:none"><i class="fas fa-check"></i> Ongoing support & follow-up</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- ============================
       PACKAGES SECTION
  ============================= -->
  <section class="packages-section section-padding" id="packages">
    <div class="container">
      <div class="section-tag ar-text">الباقات</div>
      <div class="section-tag en-text" style="display:none">PACKAGES</div>

      <h2 class="section-title ar-text">اختار الباقة <span class="gradient-text">المناسبة</span> ليك</h2>
      <h2 class="section-title en-text" style="display:none">Choose the Package <span class="gradient-text">That Fits</span> You</h2>

      <p class="section-subtitle ar-text">كل باقة مصممة لمرحلة مختلفة من رحلتك — ابدأ من أي مكان وارتقِ متى تريد</p>
      <p class="section-subtitle en-text" style="display:none">Each plan is designed for a different stage of your journey — start anywhere and upgrade when ready</p>

      <div class="packages-grid">

        <!-- ══════ START ══════ -->
        <div class="package-card animate-on-scroll">

          <div class="pkg-plan-label ar-text">باقة الانطلاقة</div>
          <div class="pkg-plan-label en-text" style="display:none">Starter Plan</div>

          <div class="pkg-header">
            <div class="pkg-icon"><i class="fas fa-seedling"></i></div>
            <h3>START</h3>
            <p class="pkg-en-subtitle">Content Engine</p>
          </div>

          <div class="pkg-price-wrap">
            <div class="pkg-price">
              <span class="price-num">3,990</span>
              <span class="price-currency ar-text">جنيه</span>
              <span class="price-currency en-text" style="display:none">EGP</span>
            </div>
            <span class="price-period ar-text">/ شهريًا</span>
            <span class="price-period en-text" style="display:none">/ month</span>
          </div>

          <p class="pkg-position ar-text">بداية قوية لمحتوى احترافي</p>
          <p class="pkg-position en-text" style="display:none">A strong start for professional content</p>

          <div class="pkg-divider"></div>

          <ul class="pkg-features ar-text">
            <li><i class="fas fa-check"></i> <span>10 فيديوهات قصيرة (Reels / Shorts) بمونتاج احترافي</span></li>
            <li><i class="fas fa-check"></i> <span>10 بوسترات سوشيال ميديا بتصميم جذاب</span></li>
            <li><i class="fas fa-check"></i> <span>تحسين جودة الصوت والصورة</span></li>
            <li><i class="fas fa-check"></i> <span>تسليم سريع ومنظم</span></li>
            <li><i class="fas fa-check"></i> <span>تعديل واحد لكل فيديو</span></li>
            <li class="disabled"><i class="fas fa-times"></i> <span>جلسات مع البروفيسور</span></li>
            <li class="disabled"><i class="fas fa-times"></i> <span>استراتيجية محتوى</span></li>
          </ul>
          <ul class="pkg-features en-text" style="display:none">
            <li><i class="fas fa-check"></i> <span>10 Short Videos (Reels / Shorts) — Pro Editing</span></li>
            <li><i class="fas fa-check"></i> <span>10 Social Media Posters — Creative Design</span></li>
            <li><i class="fas fa-check"></i> <span>Audio & Visual Quality Enhancement</span></li>
            <li><i class="fas fa-check"></i> <span>Fast & Organized Delivery</span></li>
            <li><i class="fas fa-check"></i> <span>1 Revision per Video</span></li>
            <li class="disabled"><i class="fas fa-times"></i> <span>Professor Sessions</span></li>
            <li class="disabled"><i class="fas fa-times"></i> <span>Content Strategy</span></li>
          </ul>

          <div class="pkg-value-line ar-text">
            <i class="fas fa-quote-right"></i> كل ما تحتاجه للانطلاق بمحتوى منظم واحترافي
          </div>
          <div class="pkg-value-line en-text" style="display:none">
            <i class="fas fa-quote-left"></i> Everything you need to launch with organised, professional content
          </div>

          <a href="#form-section" class="btn btn-pkg ar-text"><i class="fas fa-rocket"></i> ابدأ الآن</a>
          <a href="#form-section" class="btn btn-pkg en-text" style="display:none"><i class="fas fa-rocket"></i> Start Now</a>
        </div>

        <!-- ══════ GROWTH (FEATURED) ══════ -->
        <div class="package-card package-featured animate-on-scroll">

          <div class="pkg-popular ar-text">⭐ الأكثر اختيارًا</div>
          <div class="pkg-popular en-text" style="display:none">⭐ Most Popular</div>

          <div class="pkg-plan-label pkg-plan-label-gold ar-text">باقة النمو</div>
          <div class="pkg-plan-label pkg-plan-label-gold en-text" style="display:none">Growth Plan</div>

          <div class="pkg-header">
            <div class="pkg-icon pkg-icon-gold"><i class="fas fa-rocket"></i></div>
            <h3>GROWTH</h3>
            <p class="pkg-en-subtitle">Creator Growth System</p>
          </div>

          <div class="pkg-price-wrap">
            <div class="pkg-price pkg-price-gold">
              <span class="price-num">7,990</span>
              <span class="price-currency ar-text">جنيه</span>
              <span class="price-currency en-text" style="display:none">EGP</span>
            </div>
            <span class="price-period ar-text">/ شهريًا</span>
            <span class="price-period en-text" style="display:none">/ month</span>
          </div>

          <p class="pkg-position ar-text">أفضل توازن بين الجودة والنتائج</p>
          <p class="pkg-position en-text" style="display:none">The best balance between quality and results</p>

          <div class="pkg-divider pkg-divider-gold"></div>

          <!-- Content Block -->
          <div class="pkg-block-title ar-text"><i class="fas fa-film"></i> المحتوى والتصميم</div>
          <div class="pkg-block-title en-text" style="display:none"><i class="fas fa-film"></i> Content & Design</div>
          <ul class="pkg-features ar-text">
            <li><i class="fas fa-check"></i> <span>25 فيديو قصير بمونتاج احترافي متقدم</span></li>
            <li><i class="fas fa-check"></i> <span>25 بوستر سوشيال ميديا بتصميم احترافي</span></li>
            <li><i class="fas fa-check"></i> <span>25 غلاف فيديو (Thumbnail) احترافي</span></li>
            <li><i class="fas fa-check"></i> <span>تحسين الهوك ورفع معدل المشاهدة</span></li>
            <li><i class="fas fa-check"></i> <span>تعديلان لكل فيديو</span></li>
          </ul>
          <ul class="pkg-features en-text" style="display:none">
            <li><i class="fas fa-check"></i> <span>25 Short Videos — Advanced Pro Editing</span></li>
            <li><i class="fas fa-check"></i> <span>25 Social Media Posters — Pro Design</span></li>
            <li><i class="fas fa-check"></i> <span>25 Professional Video Thumbnails</span></li>
            <li><i class="fas fa-check"></i> <span>Hook Optimisation & Watch-Rate Boost</span></li>
            <li><i class="fas fa-check"></i> <span>2 Revisions per Video</span></li>
          </ul>

          <!-- Professor USP Block -->
          <div class="pkg-usp-block">
            <div class="pkg-block-title ar-text"><i class="fas fa-graduation-cap"></i> مع البروفيسور — USP حصري</div>
            <div class="pkg-block-title en-text" style="display:none"><i class="fas fa-graduation-cap"></i> With the Professor — Exclusive USP</div>
            <ul class="pkg-features pkg-features-usp ar-text">
              <li><i class="fas fa-star"></i> <span>بثوث تعليمية مباشرة مع البروفيسور</span></li>
              <li><i class="fas fa-star"></i> <span>جلسات استشارية منتظمة لتطوير المحتوى</span></li>
              <li><i class="fas fa-star"></i> <span>رد مستمر على الاستفسارات والأسئلة</span></li>
              <li><i class="fas fa-star"></i> <span>توجيه مباشر لزيادة المبيعات والنمو</span></li>
            </ul>
            <ul class="pkg-features pkg-features-usp en-text" style="display:none">
              <li><i class="fas fa-star"></i> <span>Live Educational Sessions with the Professor</span></li>
              <li><i class="fas fa-star"></i> <span>Regular Consulting Sessions for Content Growth</span></li>
              <li><i class="fas fa-star"></i> <span>Ongoing Q&amp;A and Continuous Support</span></li>
              <li><i class="fas fa-star"></i> <span>Direct Guidance to Boost Sales &amp; Reach</span></li>
            </ul>
          </div>

          <div class="pkg-value-line pkg-value-line-gold ar-text">
            <i class="fas fa-quote-right"></i> ليست مجرد خدمة… بل نظام يساعدك على النمو الحقيقي
          </div>
          <div class="pkg-value-line pkg-value-line-gold en-text" style="display:none">
            <i class="fas fa-quote-left"></i> Not just a service… a system built for real growth
          </div>

          <a href="#form-section" class="btn btn-pkg-featured ar-text">
            <i class="fas fa-star"></i> اختار الأفضل — ابدأ الآن
          </a>
          <a href="#form-section" class="btn btn-pkg-featured en-text" style="display:none">
            <i class="fas fa-star"></i> Choose the Best — Start Now
          </a>
        </div>

        <!-- ══════ SCALE ══════ -->
        <div class="package-card package-scale animate-on-scroll">

          <div class="pkg-plan-label pkg-plan-label-red ar-text">باقة الاحتراف</div>
          <div class="pkg-plan-label pkg-plan-label-red en-text" style="display:none">Pro Plan</div>

          <div class="pkg-header">
            <div class="pkg-icon pkg-icon-red"><i class="fas fa-crown"></i></div>
            <h3>SCALE</h3>
            <p class="pkg-en-subtitle">Content + Strategy Machine</p>
          </div>

          <div class="pkg-price-wrap">
            <div class="pkg-price">
              <span class="price-num">16,990</span>
              <span class="price-currency ar-text">جنيه</span>
              <span class="price-currency en-text" style="display:none">EGP</span>
            </div>
            <span class="price-period ar-text">/ شهريًا</span>
            <span class="price-period en-text" style="display:none">/ month</span>
          </div>

          <p class="pkg-position ar-text">لصناع المحتوى الجادين والبراندات</p>
          <p class="pkg-position en-text" style="display:none">For serious content creators &amp; brands</p>

          <div class="pkg-divider pkg-divider-red"></div>

          <!-- Content Block -->
          <div class="pkg-block-title ar-text"><i class="fas fa-infinity"></i> إنتاج بلا حدود</div>
          <div class="pkg-block-title en-text" style="display:none"><i class="fas fa-infinity"></i> Unlimited Production</div>
          <ul class="pkg-features ar-text">
            <li><i class="fas fa-check"></i> <span>عدد غير محدود من الفيديوهات بمونتاج احترافي عالٍ</span></li>
            <li><i class="fas fa-check"></i> <span>عدد غير محدود من البوسترات الاحترافية</span></li>
            <li><i class="fas fa-check"></i> <span>عدد غير محدود من أغلفة الفيديو (Thumbnails)</span></li>
            <li><i class="fas fa-check"></i> <span>تعديلات مرنة بدون قيود</span></li>
            <li><i class="fas fa-check"></i> <span>أولوية تنفيذ وتسليم فائق السرعة</span></li>
          </ul>
          <ul class="pkg-features en-text" style="display:none">
            <li><i class="fas fa-check"></i> <span>Unlimited Videos — High-End Pro Editing</span></li>
            <li><i class="fas fa-check"></i> <span>Unlimited Professional Posters</span></li>
            <li><i class="fas fa-check"></i> <span>Unlimited Video Thumbnails</span></li>
            <li><i class="fas fa-check"></i> <span>Flexible Revisions — No Limits</span></li>
            <li><i class="fas fa-check"></i> <span>Priority Execution &amp; Ultra-Fast Delivery</span></li>
          </ul>

          <!-- Strategy USP Block -->
          <div class="pkg-usp-block pkg-usp-block-red">
            <div class="pkg-block-title ar-text"><i class="fas fa-chess"></i> استراتيجية متقدمة مع البروفيسور</div>
            <div class="pkg-block-title en-text" style="display:none"><i class="fas fa-chess"></i> Advanced Strategy with the Professor</div>
            <ul class="pkg-features pkg-features-usp-red ar-text">
              <li><i class="fas fa-star"></i> <span>جلسات استراتيجية متقدمة مع البروفيسور</span></li>
              <li><i class="fas fa-star"></i> <span>بناء نظام محتوى متكامل ومخصص</span></li>
              <li><i class="fas fa-star"></i> <span>تحليل الأداء وتحسين مستمر للنتائج</span></li>
              <li><i class="fas fa-star"></i> <span>أفكار محتوى مخصصة لمجالك وجمهورك</span></li>
            </ul>
            <ul class="pkg-features pkg-features-usp-red en-text" style="display:none">
              <li><i class="fas fa-star"></i> <span>Advanced Strategy Sessions with the Professor</span></li>
              <li><i class="fas fa-star"></i> <span>Full Custom Content System Built for You</span></li>
              <li><i class="fas fa-star"></i> <span>Performance Analysis &amp; Continuous Optimisation</span></li>
              <li><i class="fas fa-star"></i> <span>Custom Content Ideas for Your Niche &amp; Audience</span></li>
            </ul>
          </div>

          <div class="pkg-value-line pkg-value-line-red ar-text">
            <i class="fas fa-quote-right"></i> نحوّل محتواك إلى نظام تسويق كامل
          </div>
          <div class="pkg-value-line pkg-value-line-red en-text" style="display:none">
            <i class="fas fa-quote-left"></i> We turn your content into a complete marketing machine
          </div>

          <a href="#form-section" class="btn btn-pkg-scale ar-text"><i class="fas fa-crown"></i> ابدأ التوسع</a>
          <a href="#form-section" class="btn btn-pkg-scale en-text" style="display:none"><i class="fas fa-crown"></i> Scale Now</a>
        </div>

      </div>

      <!-- URGENCY BAR -->
      <div class="packages-urgency animate-on-scroll">
        <div class="urgency-inner">
          <span class="urgency-icon">⚠️</span>
          <p class="ar-text">نعمل مع <strong>عدد محدود</strong> من العملاء شهريًا للحفاظ على أعلى مستوى من الجودة</p>
          <p class="en-text" style="display:none">We only accept a <strong>limited number</strong> of clients each month to maintain the highest quality</p>
        </div>
      </div>

      <!-- SINGLE VIDEO OPTION -->
      <div class="single-video-section animate-on-scroll">
        <div class="single-video-inner">
          <i class="fas fa-film single-video-icon"></i>
          <div>
            <h3 class="ar-text">يمكنك أيضًا طلب فيديو واحد حسب احتياجك</h3>
            <h3 class="en-text" style="display:none">You can also order a single video based on your needs</h3>
            <p class="ar-text">جرّب الفرق بنفسك قبل الالتزام بأي باقة</p>
            <p class="en-text" style="display:none">Experience the difference yourself before committing to a plan</p>
          </div>
          <a href="#form-section" class="btn btn-single ar-text">اطلب الآن</a>
          <a href="#form-section" class="btn btn-single en-text" style="display:none">Order Now</a>
        </div>
      </div>
    </div>
  </section>

  <!-- ============================
       SOCIAL PROOF / TESTIMONIALS
  ============================= -->
  <section class="testimonials-section section-padding" id="testimonials">
    <div class="container">
      <div class="section-tag ar-text">آراء العملاء</div>
      <div class="section-tag en-text" style="display:none">CLIENT REVIEWS</div>

      <h2 class="section-title ar-text">ماذا قالوا <span class="gradient-text">عن التجربة؟</span></h2>
      <h2 class="section-title en-text" style="display:none">What Did They <span class="gradient-text">Say About It?</span></h2>

      <div class="testimonials-grid">
        <div class="testimonial-card animate-on-scroll">
          <div class="stars">★★★★★</div>
          <p class="ar-text">"قبل CreatorPro كنت بنشر فيديوهات ومعنديش أي نتيجة. بعد أول شهر معاهم وصلت لـ 50K متابع جديد!"</p>
          <p class="en-text" style="display:none">"Before CreatorPro I was posting with zero results. After the first month with them I gained 50K new followers!"</p>
          <div class="testimonial-author">
            <div class="author-avatar">م</div>
            <div>
              <strong class="ar-text">محمد علي</strong>
              <strong class="en-text" style="display:none">Mohamed Ali</strong>
              <span class="ar-text">كريتور — لايف ستايل</span>
              <span class="en-text" style="display:none">Creator — Lifestyle</span>
            </div>
          </div>
        </div>
        <div class="testimonial-card animate-on-scroll">
          <div class="stars">★★★★★</div>
          <p class="ar-text">"جلسة البروفيسورة غيّرت طريقة تفكيري في المحتوى. المونتاج احترافي جداً والتسليم في الوقت دايماً."</p>
          <p class="en-text" style="display:none">"The Professor's session completely changed how I think about content. The editing is super professional and always on time."</p>
          <div class="testimonial-author">
            <div class="author-avatar" style="background: linear-gradient(135deg, #f093fb, #f5576c);">ن</div>
            <div>
              <strong class="ar-text">نورا إبراهيم</strong>
              <strong class="en-text" style="display:none">Nora Ibrahim</strong>
              <span class="ar-text">صاحبة بيزنس — أزياء</span>
              <span class="en-text" style="display:none">Business Owner — Fashion</span>
            </div>
          </div>
        </div>
        <div class="testimonial-card animate-on-scroll">
          <div class="stars">★★★★★</div>
          <p class="ar-text">"زادت مبيعاتي 3 أضعاف بعد ما غيّروا طريقة تقديم محتوى الشركة. الاستراتيجية دي بتشتغل فعلاً!"</p>
          <p class="en-text" style="display:none">"My sales tripled after they changed how my business presents content. This strategy actually works!"</p>
          <div class="testimonial-author">
            <div class="author-avatar" style="background: linear-gradient(135deg, #4facfe, #00f2fe);">أ</div>
            <div>
              <strong class="ar-text">أحمد سامي</strong>
              <strong class="en-text" style="display:none">Ahmed Sami</strong>
              <span class="ar-text">مؤسس شركة — تك</span>
              <span class="en-text" style="display:none">Startup Founder — Tech</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============================
       SMART FORM
  ============================= -->
  <section class="form-section section-padding" id="form-section">
    <div class="form-bg-pattern"></div>
    <div class="container">
      <div class="section-tag ar-text">ابدأ الآن</div>
      <div class="section-tag en-text" style="display:none">GET STARTED</div>

      <h2 class="section-title ar-text">ابدأ <span class="gradient-text">رحلتك</span> الآن</h2>
      <h2 class="section-title en-text" style="display:none">Start Your <span class="gradient-text">Journey</span> Now</h2>

      <p class="section-subtitle ar-text">
        أكمل البيانات وسيتواصل معك فريقنا خلال 24 ساعة عبر واتساب
      </p>
      <p class="section-subtitle en-text" style="display:none">
        Complete the form and our team will contact you within 24 hours via WhatsApp
      </p>

      <div class="form-wrapper animate-on-scroll">
        <!-- Success message (hidden by default) -->
        <div class="form-success" id="formSuccess" style="display:none">
          <div class="success-icon"><i class="fas fa-check-circle"></i></div>
          <h3 class="ar-text">تم إرسال بياناتك بنجاح! 🎉</h3>
          <h3 class="en-text" style="display:none">Your data was sent successfully! 🎉</h3>
          <p class="ar-text">جارٍ تحويلك لواتساب للتواصل معنا…</p>
          <p class="en-text" style="display:none">Redirecting you to WhatsApp to connect with us…</p>
          <div class="success-dots">
            <span></span><span></span><span></span>
          </div>
        </div>

        <form id="leadForm" novalidate>
          <div class="form-grid">
            <div class="form-group">
              <label class="ar-text" for="name"><i class="fas fa-user"></i> الاسم الكامل *</label>
              <label class="en-text" for="name" style="display:none"><i class="fas fa-user"></i> Full Name *</label>
              <input type="text" id="name" name="name" placeholder="اكتب اسمك هنا..." class="ar-text" required />
              <input type="text" id="name_en" name="name" placeholder="Write your name here..." class="en-text" style="display:none" required />
              <span class="field-error" id="nameError"></span>
            </div>

            <div class="form-group">
              <label class="ar-text" for="whatsapp"><i class="fab fa-whatsapp"></i> رقم الواتساب *</label>
              <label class="en-text" for="whatsapp" style="display:none"><i class="fab fa-whatsapp"></i> WhatsApp Number *</label>
              <input type="tel" id="whatsapp" name="whatsapp" placeholder="+201XXXXXXXXX" required />
              <span class="field-error" id="whatsappError"></span>
            </div>

            <div class="form-group">
              <label class="ar-text" for="business"><i class="fas fa-briefcase"></i> نوع النشاط *</label>
              <label class="en-text" for="business" style="display:none"><i class="fas fa-briefcase"></i> Business Type *</label>
              <select id="business" name="business" required>
                <option value="" class="ar-text">اختار نوع نشاطك</option>
                <option value="" class="en-text" style="display:none">Select your business type</option>
                <option value="creator_personal" class="ar-text">كريتور - محتوى شخصي</option>
                <option value="creator_personal" class="en-text" style="display:none">Creator - Personal Content</option>
                <option value="business_owner" class="ar-text">صاحب بيزنس / شركة</option>
                <option value="business_owner" class="en-text" style="display:none">Business / Company Owner</option>
                <option value="coach" class="ar-text">كوتش / مدرب</option>
                <option value="coach" class="en-text" style="display:none">Coach / Trainer</option>
                <option value="ecommerce" class="ar-text">متجر إلكتروني</option>
                <option value="ecommerce" class="en-text" style="display:none">E-commerce Store</option>
                <option value="other" class="ar-text">أخرى</option>
                <option value="other" class="en-text" style="display:none">Other</option>
              </select>
              <span class="field-error" id="businessError"></span>
            </div>

            <div class="form-group">
              <label class="ar-text" for="platform"><i class="fas fa-mobile-alt"></i> المنصة الرئيسية *</label>
              <label class="en-text" for="platform" style="display:none"><i class="fas fa-mobile-alt"></i> Main Platform *</label>
              <select id="platform" name="platform" required>
                <option value="" class="ar-text">اختار المنصة</option>
                <option value="" class="en-text" style="display:none">Select platform</option>
                <option value="instagram">Instagram / Reels</option>
                <option value="tiktok">TikTok</option>
                <option value="youtube">YouTube</option>
                <option value="facebook">Facebook</option>
                <option value="multi" class="ar-text">متعدد المنصات</option>
                <option value="multi" class="en-text" style="display:none">Multi-platform</option>
              </select>
              <span class="field-error" id="platformError"></span>
            </div>

            <div class="form-group form-group-full">
              <label class="ar-text" for="goal"><i class="fas fa-bullseye"></i> هدفك الرئيسي *</label>
              <label class="en-text" for="goal" style="display:none"><i class="fas fa-bullseye"></i> Your Main Goal *</label>
              <select id="goal" name="goal" required>
                <option value="" class="ar-text">إيه هدفك من المحتوى؟</option>
                <option value="" class="en-text" style="display:none">What's your content goal?</option>
                <option value="followers" class="ar-text">زيادة المتابعين</option>
                <option value="followers" class="en-text" style="display:none">Grow Followers</option>
                <option value="clients" class="ar-text">جذب عملاء</option>
                <option value="clients" class="en-text" style="display:none">Attract Clients</option>
                <option value="brand" class="ar-text">بناء البراند الشخصي</option>
                <option value="brand" class="en-text" style="display:none">Build Personal Brand</option>
                <option value="sales" class="ar-text">زيادة المبيعات</option>
                <option value="sales" class="en-text" style="display:none">Increase Sales</option>
                <option value="views" class="ar-text">زيادة المشاهدات</option>
                <option value="views" class="en-text" style="display:none">Increase Views</option>
              </select>
              <span class="field-error" id="goalError"></span>
            </div>

            <div class="form-group form-group-full">
              <label class="ar-text"><i class="fas fa-signal"></i> مستوى الخبرة *</label>
              <label class="en-text" style="display:none"><i class="fas fa-signal"></i> Experience Level *</label>
              <div class="radio-group">
                <label class="radio-option ar-text">
                  <input type="radio" name="experience" value="beginner" required />
                  <span class="radio-custom"></span>
                  مبتدئ — بازور في صناعة المحتوى
                </label>
                <label class="radio-option ar-text">
                  <input type="radio" name="experience" value="intermediate" required />
                  <span class="radio-custom"></span>
                  متوسط — عندي محتوى بس محتاج تطوير
                </label>
                <label class="radio-option ar-text">
                  <input type="radio" name="experience" value="advanced" required />
                  <span class="radio-custom"></span>
                  متقدم — محتاج سكيل أعلى وتوسع
                </label>
              </div>
              <div class="radio-group en-text" style="display:none">
                <label class="radio-option">
                  <input type="radio" name="experience" value="beginner" required />
                  <span class="radio-custom"></span>
                  Beginner — Just starting out
                </label>
                <label class="radio-option">
                  <input type="radio" name="experience" value="intermediate" required />
                  <span class="radio-custom"></span>
                  Intermediate — Have content but need improvement
                </label>
                <label class="radio-option">
                  <input type="radio" name="experience" value="advanced" required />
                  <span class="radio-custom"></span>
                  Advanced — Need higher skills and scaling
                </label>
              </div>
              <span class="field-error" id="experienceError"></span>
            </div>
          </div>

          <button type="submit" class="btn btn-form-submit ar-text" id="submitBtn">
            <i class="fas fa-paper-plane"></i>
            <span>أرسل بياناتي وابدأ الآن</span>
            <div class="btn-loader" id="btnLoader" style="display:none">
              <i class="fas fa-spinner fa-spin"></i>
            </div>
          </button>
          <button type="submit" class="btn btn-form-submit en-text" id="submitBtnEn" style="display:none">
            <i class="fas fa-paper-plane"></i>
            <span>Send My Info & Start Now</span>
          </button>

          <p class="form-privacy ar-text">
            <i class="fas fa-lock"></i> بياناتك محمية تماماً ولن تُشارك مع أي طرف ثالث
          </p>
          <p class="form-privacy en-text" style="display:none">
            <i class="fas fa-lock"></i> Your data is fully protected and will never be shared with third parties
          </p>
        </form>
      </div>
    </div>
  </section>

  <!-- ============================
       WHATSAPP SECTION
  ============================= -->
  <section class="whatsapp-section section-padding" id="whatsapp-sec">
    <div class="container">
      <div class="whatsapp-inner animate-on-scroll">
        <div class="wa-icon-wrap">
          <i class="fab fa-whatsapp"></i>
        </div>
        <h2 class="ar-text">أو تواصل معنا مباشرة</h2>
        <h2 class="en-text" style="display:none">Or Contact Us Directly</h2>
        <p class="ar-text">فريقنا متاح لمساعدتك والإجابة على كل أسئلتك</p>
        <p class="en-text" style="display:none">Our team is ready to help and answer all your questions</p>
        <a href="https://wa.me/201068400789?text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%D8%8C%20%D8%A3%D8%B1%D8%B3%D9%84%D8%AA%20%D8%A8%D9%8A%D8%A7%D9%86%D8%A7%D8%AA%D9%8A%20%D8%B9%D8%A8%D8%B1%20%D8%A7%D9%84%D9%85%D9%88%D9%82%D8%B9%20%D9%88%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%A8%D8%AF%D8%A1"
           target="_blank" rel="noopener" class="btn btn-whatsapp ar-text">
          <i class="fab fa-whatsapp"></i> تواصل عبر واتساب
        </a>
        <a href="https://wa.me/201068400789?text=Hello%2C%20I%20submitted%20my%20information%20through%20the%20website%20and%20would%20like%20to%20start"
           target="_blank" rel="noopener" class="btn btn-whatsapp en-text" style="display:none">
          <i class="fab fa-whatsapp"></i> Chat on WhatsApp
        </a>
      </div>
    </div>
  </section>

  <!-- ============================
       FINAL CTA SECTION
  ============================= -->
  <section class="final-cta-section section-padding" id="final-cta">
    <div class="final-cta-bg"></div>
    <div class="container">
      <div class="final-cta-inner animate-on-scroll">
        <h2 class="final-cta-title ar-text">
          مستني إيه؟ <br/>
          <span class="gradient-text">ابدأ الآن</span> قبل ما تملى الأماكن
        </h2>
        <h2 class="final-cta-title en-text" style="display:none">
          What Are You Waiting For? <br/>
          <span class="gradient-text">Get Started Now</span> Before Spots Fill Up
        </h2>
        <p class="ar-text final-cta-sub">كل يوم بيعدي بدون استراتيجية = وقت ضايع + فرص فاتتك</p>
        <p class="en-text final-cta-sub" style="display:none">Every day without strategy = wasted time + missed opportunities</p>

        <div class="final-cta-buttons">
          <a href="#form-section" class="btn btn-primary btn-xl ar-text">
            <i class="fas fa-rocket"></i> ابدأ رحلتك الآن
          </a>
          <a href="#form-section" class="btn btn-primary btn-xl en-text" style="display:none">
            <i class="fas fa-rocket"></i> Start Your Journey Now
          </a>
          <a href="https://wa.me/201068400789?text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%D8%8C%20%D8%A3%D8%B1%D8%B3%D9%84%D8%AA%20%D8%A8%D9%8A%D8%A7%D9%86%D8%A7%D8%AA%D9%8A%20%D8%B9%D8%A8%D8%B1%20%D8%A7%D9%84%D9%85%D9%88%D9%82%D8%B9%20%D9%88%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%A8%D8%AF%D8%A1"
             target="_blank" rel="noopener" class="btn btn-outline-white ar-text">
            <i class="fab fa-whatsapp"></i> تحدث معنا مباشرة
          </a>
          <a href="https://wa.me/201068400789?text=Hello%2C%20I%20want%20to%20get%20started"
             target="_blank" rel="noopener" class="btn btn-outline-white en-text" style="display:none">
            <i class="fab fa-whatsapp"></i> Talk to Us Directly
          </a>
        </div>

        <div class="trust-badges">
          <span><i class="fas fa-shield-alt"></i> <span class="ar-text">ضمان الجودة</span><span class="en-text" style="display:none">Quality Guarantee</span></span>
          <span><i class="fas fa-undo"></i> <span class="ar-text">مراجعات مجانية</span><span class="en-text" style="display:none">Free Revisions</span></span>
          <span><i class="fas fa-headset"></i> <span class="ar-text">دعم 24/7</span><span class="en-text" style="display:none">24/7 Support</span></span>
          <span><i class="fas fa-lock"></i> <span class="ar-text">بيانات آمنة</span><span class="en-text" style="display:none">Secure Data</span></span>
        </div>
      </div>
    </div>
  </section>

  <!-- ============================
       FOOTER
  ============================= -->
  <footer class="footer">
    <div class="container">
      <div class="footer-inner">
        <div class="footer-logo">
          <span class="logo-icon"><i class="fas fa-film"></i></span>
          <span class="logo-text">Creator<span class="accent">Pro</span></span>
        </div>
        <p class="ar-text">© 2025 CreatorPro — جميع الحقوق محفوظة</p>
        <p class="en-text" style="display:none">© 2025 CreatorPro — All Rights Reserved</p>
        <div class="footer-socials">
          <a href="https://wa.me/201068400789" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i></a>
          <a href="#"><i class="fab fa-instagram"></i></a>
          <a href="#"><i class="fab fa-tiktok"></i></a>
          <a href="#"><i class="fab fa-youtube"></i></a>
        </div>
      </div>
    </div>
  </footer>

  <!-- ============================
       STICKY BOTTOM CTA (MOBILE)
  ============================= -->
  <div class="sticky-cta" id="stickyCta">
    <a href="#form-section" class="sticky-cta-btn ar-text">
      <i class="fas fa-rocket"></i> ابدأ الآن — مجاناً
    </a>
    <a href="#form-section" class="sticky-cta-btn en-text" style="display:none">
      <i class="fas fa-rocket"></i> Start Now — Free
    </a>
    <a href="https://wa.me/201068400789?text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%A8%D8%AF%D8%A1" 
       target="_blank" rel="noopener" class="sticky-wa-btn">
      <i class="fab fa-whatsapp"></i>
    </a>
  </div>

  <script src="/static/app.js"></script>
</body>
</html>`)
})

export default app
