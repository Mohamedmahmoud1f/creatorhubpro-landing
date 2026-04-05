"use client";
import Script from 'next/script';
import { useEffect } from 'react';

export default function Home() {

  useEffect(() => {
     /* ═══════════════════════════════════════════════════
       SCARCITY MODULE — Capacity-based urgency engine
       Config: edit SCR_CONFIG to update capacity numbers
       ═══════════════════════════════════════════════════ */
    (function () {
      'use strict';

      /* ─────────────────────────────────────────────
         ★ EDITABLE CONFIG — update these values manually
           or connect to your backend/CMS later
         ─────────────────────────────────────────────
         status: 'green' | 'yellow' | 'red' | 'full'
           green  → 0–60%   fill  (متاح)
           yellow → 61–85%  fill  (أماكن محدودة)
           red    → 86–99%  fill  (متبقي قليل)
           full   → 100%    fill  (مكتمل — waitlist mode)
      */
      var SCR_CONFIG = {
        current: 16,   /* current enrolled clients */
        max: 20,   /* max capacity             */
        spotsLeft: 4    /* remaining spots          */
      };
      /* ─────────────────────────────────────────────── */

      var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var hasRun = false;

      /* ── Derive state from config ── */
      function getState(current: number, max: number) {
        var pct = current / max;
        if (current >= max) return 'full';
        if (pct >= 0.86) return 'red';
        if (pct >= 0.61) return 'yellow';
        return 'green';
      }

      /* ── Smooth count-up ── */
      function countUp(el, target, duration) {
        if (!el) return;
        if (reduced) { el.textContent = target; return; }
        var start = performance.now();
        var startVal = 0;
        function step(now) {
          var elapsed = now - start;
          var progress = Math.min(elapsed / duration, 1);
          /* ease-out cubic */
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(startVal + (target - startVal) * eased);
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      }

      /* ── Apply state classes & copy ── */
      function applyState(state, pct, spotsLeft) {
        var pills = document.querySelectorAll('.scr-live-pill');
        var badge = document.getElementById('scr-spots-badge');
        var fill = document.getElementById('scr-bar-fill');
        var pctEls = document.querySelectorAll('#scr-pct, #scr-pct-en');
        var normalCTA = document.getElementById('scr-cta-normal');
        var waitlistCTA = document.getElementById('scr-cta-waitlist');

        /* Progress bar colour */
        if (fill) {
          fill.classList.remove('scr-fill-red', 'scr-fill-yellow');
          if (state === 'full' || state === 'red') fill.classList.add('scr-fill-red');
          else if (state === 'yellow') fill.classList.add('scr-fill-yellow');
        }

        /* Percentage text */
        pctEls.forEach(function (el) { el.textContent = pct + '%'; });

        /* Pill status */
        pills.forEach(function (pill) {
          pill.classList.remove('scr-status-red', 'scr-status-yellow');
        });

        /* Spots badge */
        if (badge) {
          badge.classList.remove('scr-badge-red', 'scr-badge-yellow');
        }

        var labelAr = document.getElementById('scr-live-label-ar');
        var labelEn = document.getElementById('scr-live-label-en');
        var spotsAr = document.getElementById('scr-spots-text-ar');
        var spotsEn = document.getElementById('scr-spots-text-en');

        if (state === 'green') {
          if (labelAr) labelAr.textContent = 'متاح الانضمام حاليًا';
          if (labelEn) labelEn.textContent = 'Open for enrollment';
          if (spotsAr) spotsAr.textContent = 'أماكن متاحة — انضم الآن';
          if (spotsEn) spotsEn.textContent = 'Spots available — join now';
        } else if (state === 'yellow') {
          pills.forEach(function (p) { p.classList.add('scr-status-yellow'); });
          if (badge) badge.classList.add('scr-badge-yellow');
          if (labelAr) labelAr.textContent = 'أماكن محدودة متبقية';
          if (labelEn) labelEn.textContent = 'Limited spots remaining';
          if (spotsAr) spotsAr.textContent = 'أماكن محدودة — سارع بالحجز';
          if (spotsEn) spotsEn.textContent = 'Limited spots — book soon';
        } else if (state === 'red') {
          pills.forEach(function (p) { p.classList.add('scr-status-red'); });
          if (badge) badge.classList.add('scr-badge-red');
          if (labelAr) labelAr.textContent = 'متبقي ' + spotsLeft + ' أماكن فقط';
          if (labelEn) labelEn.textContent = 'Only ' + spotsLeft + ' spots left';
          if (spotsAr) spotsAr.textContent = 'متبقي ' + spotsLeft + ' أماكن فقط';
          if (spotsEn) spotsEn.textContent = 'Only ' + spotsLeft + ' spots left';
        } else if (state === 'full') {
          pills.forEach(function (p) { p.classList.add('scr-status-red'); });
          if (badge) badge.classList.add('scr-badge-red');
          if (labelAr) labelAr.textContent = 'تم اكتمال العدد';
          if (labelEn) labelEn.textContent = 'Batch is full';
          if (spotsAr) spotsAr.textContent = 'تم اكتمال الأماكن';
          if (spotsEn) spotsEn.textContent = 'All spots filled';
          /* Swap CTA rows */
          if (normalCTA) normalCTA.style.display = 'none';
          if (waitlistCTA) waitlistCTA.style.display = 'flex';
        }
      }

      /* ── Main init (runs once on IntersectionObserver trigger) ── */
      function initScarcity() {
        var cfg = SCR_CONFIG;
        var pct = Math.round((cfg.current / cfg.max) * 100);
        var state = getState(cfg.current, cfg.max);

        /* Entrance animation */
        var module = document.getElementById('scr-module');
        if (module && !reduced) {
          module.classList.add('scr-entered');
        }

        /* Count-up: current number */
        var elCur = document.getElementById('scr-current');
        var elCurEn = document.getElementById('scr-current-en');
        countUp(elCur, cfg.current, 800);
        countUp(elCurEn, cfg.current, 800);

        /* Progress bar fill — slight delay after count-up starts */
        var fill = document.getElementById('scr-bar-fill');
        if (fill) {
          setTimeout(function () {
            fill.style.width = pct + '%';
          }, reduced ? 0 : 120);
        }

        /* Apply dynamic state */
        applyState(state, pct, cfg.spotsLeft);
      }

      /* ── IntersectionObserver — fire once on first view ── */
      function observeModule() {
        var module = document.getElementById('scr-module');
        if (!module) return;

        if (!window.IntersectionObserver) {
          /* Fallback: just run immediately */
          initScarcity();
          return;
        }

        var observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting && !hasRun) {
              hasRun = true;
              initScarcity();
              observer.disconnect();
            }
          });
        }, { threshold: 0.25 });

        observer.observe(module);
      }

      /* ── Boot ── */
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', observeModule);
      } else {
        observeModule();
      }

    })();




     (function () {
      'use strict';

      /* ── Reduced motion check ── */
      var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      /* ====================================================
         1. PARTICLE CANVAS — lightweight canvas particles
      ==================================================== */
      function initHeroCanvas() {
        var canvas = document.getElementById('heroCanvas') as HTMLCanvasElement;
        /* Skip canvas on mobile — saves battery and prevents lag on mid-range phones */
        if (!canvas || reduced || window.innerWidth < 768) return;

        var ctx = canvas.getContext('2d');
        var W, H, particles = [];

        function resize() {
          W = canvas.width = canvas.offsetWidth;
          H = canvas.height = canvas.offsetHeight;
        }

        window.addEventListener('resize', resize);
        resize();

        /* Particle constructor */
        function Particle() {
          this.reset();
        }

        Particle.prototype.reset = function () {
          this.x = Math.random() * W;
          this.y = Math.random() * H + H;
          this.r = Math.random() * 2.5 + 0.5;
          this.vx = (Math.random() - 0.5) * 0.4;
          this.vy = -(Math.random() * 0.8 + 0.3);
          this.alpha = 0;
          this.maxAlpha = Math.random() * 0.5 + 0.15;
          this.phase = 'fadein';
          this.life = 0;
          this.maxLife = Math.random() * 200 + 150;
          /* colour: purple or gold accent */
          this.hue = Math.random() > 0.75 ? 45 : 270;
          this.sat = Math.random() > 0.75 ? 90 : 70;
        };

        Particle.prototype.update = function () {
          this.life++;
          this.x += this.vx;
          this.y += this.vy;

          var progress = this.life / this.maxLife;
          if (progress < 0.15) {
            this.alpha = (progress / 0.15) * this.maxAlpha;
          } else if (progress < 0.8) {
            this.alpha = this.maxAlpha;
          } else {
            this.alpha = ((1 - progress) / 0.2) * this.maxAlpha;
          }

          if (this.life >= this.maxLife || this.y < -20) this.reset();
        };

        Particle.prototype.draw = function () {
          ctx.save();
          ctx.globalAlpha = Math.max(0, this.alpha);
          ctx.fillStyle = 'hsl(' + this.hue + ',' + this.sat + '%,65%)';
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        };

        /* Create 60 particles with staggered start */
        for (var i = 0; i < 60; i++) {
          var p = new Particle();
          p.y = Math.random() * H; /* spread vertically on load */
          p.life = Math.floor(Math.random() * p.maxLife);
          particles.push(p);
        }

        /* RAF loop */
        var raf;
        function loop() {
          ctx.clearRect(0, 0, W, H);
          for (var j = 0; j < particles.length; j++) {
            particles[j].update();
            particles[j].draw();
          }
          raf = requestAnimationFrame(loop);
        }

        /* Only run when visible */
        if (window.IntersectionObserver) {
          var heroSec = document.getElementById('hero');
          var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
              if (e.isIntersecting) {
                if (!raf) loop();
              } else {
                if (raf) { cancelAnimationFrame(raf); raf = null; }
              }
            });
          }, { threshold: 0.05 });
          if (heroSec) obs.observe(heroSec);
          else loop();
        } else {
          loop();
        }
      }

      /* ====================================================
         2. MOUSE PARALLAX — device + floating cards
      ==================================================== */
      function initParallax() {
        if (reduced) return;
        var device = document.getElementById('heroVisual');
        if (!device) return;

        var heroSection = document.getElementById('hero');
        var mouseX = 0, mouseY = 0;
        var curX = 0, curY = 0;
        var active = false;
        var raf;

        heroSection && heroSection.addEventListener('mousemove', function (e) {
          var rect = heroSection.getBoundingClientRect();
          mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
          mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
          active = true;
          if (!raf) rafLoop();
        });

        heroSection && heroSection.addEventListener('mouseleave', function () {
          active = false;
          /* smoothly return to center */
          function returnToCenter() {
            curX += (0 - curX) * 0.06;
            curY += (0 - curY) * 0.06;
            applyTransform();
            if (Math.abs(curX) > 0.001 || Math.abs(curY) > 0.001) {
              requestAnimationFrame(returnToCenter);
            } else {
              curX = 0; curY = 0;
              applyTransform();
            }
          }
          cancelAnimationFrame(raf);
          raf = null;
          returnToCenter();
        });

        function applyTransform() {
          var tiltX = curY * 8;
          var tiltY = curX * -8;
          var moveX = curX * 12;
          var moveY = curY * 8;
          device.style.transform =
            'translateY(' + moveY + 'px) translateX(' + moveX + 'px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg)';
        }

        function rafLoop() {
          raf = requestAnimationFrame(function () {
            curX += (mouseX - curX) * 0.08;
            curY += (mouseY - curY) * 0.08;
            applyTransform();
            if (active) rafLoop();
            else raf = null;
          });
        }
      }

      /* ====================================================
         3. COUNT-UP — trust badges + screen stats
      ==================================================== */
      function countUp(el, target, duration) {
        if (!el || reduced) {
          if (el) {
            var fmt = (el as HTMLElement).dataset.format;
            if (fmt === 'k') { (el as HTMLElement).textContent = (target >= 1000 ? (target / 1000).toFixed(1) : target) + 'K'; }
            else { (el as HTMLElement).textContent = target.toString(); }
          }
          return;
        }
        var start = 0;
        var startTime = null;
        var fmt = (el as HTMLElement).dataset.format;

        function step(ts) {
          if (!startTime) startTime = ts;
          var elapsed = ts - startTime;
          var progress = Math.min(elapsed / duration, 1);
          /* easeOutQuart */
          var ease = 1 - Math.pow(1 - progress, 4);
          var val = Math.floor(start + (target - start) * ease);

          if (fmt === 'k') {
            (el as HTMLElement).textContent = val >= 1000 ? (val / 1000).toFixed(1) + 'K' : val + '';
          } else {
            (el as HTMLElement).textContent = val.toString();
          }

          if (progress < 1) requestAnimationFrame(step);
          else {
            if (fmt === 'k') {
              (el as HTMLElement).textContent = target >= 1000 ? (target / 1000).toFixed(1) + 'K' : target + '';
            } else {
              (el as HTMLElement).textContent = target.toString();
            }
          }
        }
        requestAnimationFrame(step);
      }

      function initCounters() {
        /* Trust badges — trigger immediately (hero visible on load) */
        var delay = reduced ? 0 : 1500; /* after entrance anims */
        setTimeout(function () {
          document.querySelectorAll('.trust-num').forEach(function (el) {
            var t = parseInt((el as HTMLElement).dataset.target, 10);
            if (!isNaN(t)) countUp(el, t, 900);
          });
        }, delay);

        /* Screen stats — trigger on scroll into view */
        var screenStats = document.querySelectorAll('.sstat-num');
        if (screenStats.length === 0) return;

        function runScreenStats() {
          screenStats.forEach(function (el) {
            var t = parseInt((el as HTMLElement).dataset.target, 10);
            var fmt = (el as HTMLElement).dataset.format;
            if (!isNaN(t)) {
              /* For +340% we wrap countUp result manually */
              if (fmt === 'pct') {
                var orig = countUp;
                /* inline: count then append % */
                var start = 0, st = null;
                function stepPct(ts) {
                  if (!st) st = ts;
                  var p = Math.min((ts - st) / 1200, 1);
                  var ease = 1 - Math.pow(1 - p, 4);
                  (el as HTMLElement).textContent = '+' + Math.floor(t * ease) + '%';
                  if (p < 1) requestAnimationFrame(stepPct);
                  else (el as HTMLElement).textContent = '+' + t + '%';
                }
                requestAnimationFrame(stepPct);
              } else {
                countUp(el, t, 1200);
              }
            }
          });
        }

        if (window.IntersectionObserver) {
          var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
              if (e.isIntersecting) {
                runScreenStats();
                obs.disconnect();
              }
            });
          }, { threshold: 0.3 });
          var device = document.getElementById('heroVisual');
          if (device) obs.observe(device);
          else runScreenStats();
        } else {
          runScreenStats();
        }
      }

      /* ====================================================
         4. BOOT
      ==================================================== */
      function boot() {
        initHeroCanvas();
        initParallax();
        initCounters();
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
      } else {
        boot();
      }

    })();




     (function () {
      'use strict';
      /* No complex animation. Phone content is fully static and visible instantly.
         Only light effects: glow pulse via CSS, chip hover via CSS.
         This block handles: navbar scroll, smooth scroll, optional navbar active. */

      /* ── Navbar scroll shadow + urgency bar auto-hide ── */
      var navbar = document.getElementById('navbar');
      var urgencyBar = document.querySelector('.sticky-urgency-bar');
      var lastScrollY = 0;
      if (navbar) {
        window.addEventListener('scroll', function () {
          var sy = window.scrollY;
          /* Navbar shadow */
          if (sy > 20) navbar.classList.add('scrolled');
          else navbar.classList.remove('scrolled');
          /* Hide urgency bar after scrolling 80px down, show again near top */
          if (urgencyBar) {
            if (sy > 80) urgencyBar.classList.add('bar-hidden');
            else urgencyBar.classList.remove('bar-hidden');
          }
          lastScrollY = sy;
        }, { passive: true });
      }

      /* ── Smooth scroll for all anchor links ── */
      document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
          var target = document.querySelector(this.getAttribute('href'));
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });

      /* ── Subtle phone tilt on hero mousemove (desktop only) ── */
      var phone = document.getElementById('pmPhone');
      var hero = document.getElementById('hero');
      if (phone && hero && window.innerWidth >= 768) {
        var tiltActive = false, tiltRaf = null;
        var tx = 0, ty = 0, cx = 0, cy = 0;

        hero.addEventListener('mousemove', function (e) {
          var r = hero.getBoundingClientRect();
          tx = ((e.clientX - r.left) / r.width - 0.5) * 10;
          ty = ((e.clientY - r.top) / r.height - 0.5) * 8;
          tiltActive = true;
          if (!tiltRaf) tiltLoop();
        }, { passive: true });

        hero.addEventListener('mouseleave', function () {
          tiltActive = false;
          tx = 0; ty = 0;
          tiltLoop();
        }, { passive: true });

        function tiltLoop() {
          tiltRaf = requestAnimationFrame(function () {
            cx += (tx - cx) * 0.1;
            cy += (ty - cy) * 0.1;
            phone.style.transform =
              'rotateX(' + (-cy * 0.5) + 'deg) rotateY(' + (cx * 0.5) + 'deg) translateY(-4px)';
            if (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05 || tiltActive) {
              tiltLoop();
            } else {
              phone.style.transform = 'translateY(-4px)';
              tiltRaf = null;
            }
          });
        }
      }

    })();


     (function () {
      var el = document.getElementById('lsv2Text');
      if (!el) return;

      /* Skip animation on very small screens — no typewriter on mobile navbar */
      if (window.innerWidth < 768) { el.textContent = ''; return; }

      var arWords = ['محتواك', 'عملاءك', 'علامتك', 'نتائجك'];
      var enWords = ['Content', 'Clients', 'Brand', 'Results'];

      function isAr() { return document.documentElement.lang !== 'en'; }

      var idx = 0;
      var activeTimer = null; /* track active timers to prevent overlap */
      var isRunning = false;

      function getWords() { return isAr() ? arWords : enWords; }

      function clearActive() {
        if (activeTimer) { clearInterval(activeTimer); clearTimeout(activeTimer); activeTimer = null; }
      }

      function erase(cb) {
        var txt = el.textContent || '';
        if (txt.length === 0) { cb(); return; }
        el.style.opacity = '0.7';
        activeTimer = setInterval(function () {
          txt = txt.slice(0, -1);
          el.textContent = txt;
          if (txt.length === 0) { clearActive(); el.style.opacity = '1'; cb(); }
        }, 55);
      }

      function type(word, cb) {
        var i = 0;
        el.textContent = '';
        el.style.opacity = '1';
        activeTimer = setInterval(function () {
          el.textContent += word[i];
          i++;
          if (i >= word.length) { clearActive(); cb(); }
        }, 80);
      }

      function cycle() {
        if (isRunning) return; /* prevent double-start on tab focus */
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          el.textContent = getWords()[0];
          return;
        }
        isRunning = true;
        var words = getWords();
        activeTimer = setTimeout(function () {
          erase(function () {
            idx = (idx + 1) % words.length;
            type(words[idx], function () {
              isRunning = false;
              activeTimer = setTimeout(cycle, 2400);
            });
          });
        }, 2800);
      }

      /* Pause when tab is hidden, resume cleanly when visible again */
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
          clearActive();
          isRunning = false;
        } else {
          /* Small delay to let page repaint first */
          setTimeout(function () { if (!isRunning) cycle(); }, 400);
        }
      });

      /* Start after logo is visible */
      setTimeout(cycle, 1600);
    })();
  }, []);

  const landingHtml = `
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
    <div class="logo" style="flex-direction:column;align-items:flex-start;gap:2px;">
    <a href="#hero">
    <img src="/brand/cropped.png" alt="CreatorHubPro" class="logo-img" style="width:100px;" />
    </a>
    <div class="logo-slogan-v2" style="height: 20px;">
          <span class="lsv2-prefix ar-text">نظام ينمّي</span>
          <span class="lsv2-prefix en-text" style="display:none">Grow Your</span>
          <span class="lsv2-pill" id="lsv2Pill">
            <span class="lsv2-cursor"></span>
            <span class="lsv2-text" id="lsv2Text">محتواك</span>
          </span>
        </div>
      </div>
      <div class="nav-actions">
        <button class="lang-toggle" id="langToggle" onclick="toggleLang()">EN</button>
        <a href="#form-section" class="btn btn-nav ar-text">احجز مجاناً</a>
        <a href="#form-section" class="btn btn-nav en-text" style="display:none">Book Free</a>
      </div>
    </div>
  </nav>

  <!-- SVG gradient defs for engagement ring -->
  <svg width="0" height="0" style="position:absolute">
    <defs>
      <linearGradient id="engGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#a78bfa"/>
        <stop offset="50%" stop-color="#7c3aed"/>
        <stop offset="100%" stop-color="#f59e0b"/>
      </linearGradient>
    </defs>
  </svg>

  <!-- ============================
       HERO SECTION — CINEMATIC REDESIGN
  ============================= -->
  <section class="hero-section hero-v2" id="hero">
    <!-- Multi-layer cinematic background -->
    <div class="hero-bg-v2">
      <div class="hero-grad-layer-1"></div>
      <div class="hero-grad-layer-2"></div>
      <div class="hero-grain"></div>
      <div class="hero-light-rays">
        <div class="light-ray ray-1"></div>
        <div class="light-ray ray-2"></div>
        <div class="light-ray ray-3"></div>
      </div>
    </div>
    <!-- Animated Particles Canvas -->
    <canvas class="hero-canvas" id="heroCanvas"></canvas>

    <div class="container hero-v2-inner">

      <!-- ===== RIGHT SIDE: Content ===== -->
      <div class="hero-v2-content" id="heroContent">

        <!-- Live badge -->
        <div class="hero-live-badge">
          <span class="live-dot"></span>
          <span class="ar-text">نظام نمو المحتوى الاحترافي</span>
          <span class="en-text" style="display:none">Professional Content Growth System</span>
        </div>

        <!-- Main Headline -->
        <h1 class="hero-v2-headline ar-text">
          <span class="hero-line-top">حوّل محتواك إلى</span>
          <span class="hero-line-gradient">آلة تجذب العملاء</span>
        </h1>
        <h1 class="hero-v2-headline en-text" style="display:none">
          <span class="hero-line-top">Turn Your Content Into a</span>
          <span class="hero-line-gradient">Client-Generating Machine</span>
        </h1>

        <!-- System tagline -->
        <div class="hero-tagline ar-text">
          <i class="fas fa-infinity"></i>
          مش مجرد مونتاج… هذا نظام نمو كامل
        </div>
        <div class="hero-tagline en-text" style="display:none">
          <i class="fas fa-infinity"></i>
          Not just editing… this is a complete growth system
        </div>

        <!-- Sub description -->
        <p class="hero-v2-sub ar-text">
          نظام متكامل يجمع بين <strong>المونتاج الاحترافي</strong> و<strong>التوجيه الاستراتيجي</strong>
          <br/>ليحوّل مشاهديك إلى عملاء حقيقيين — كل شهر أحسن من اللي قبله
        </p>
        <p class="hero-v2-sub en-text" style="display:none">
          A complete system combining <strong>professional editing</strong> and <strong>strategic coaching</strong>
          <br/>to turn your viewers into real paying clients — growing every single month
        </p>

        <!-- Trust badges (staggered animation) -->
        <div class="hero-trust-row">
          <div class="trust-badge trust-badge-1">
            <i class="fas fa-users"></i>
            <div>
              <span class="trust-num" data-target="200">0</span><span class="trust-plus">+</span>
              <span class="ar-text trust-desc">صانع محتوى استفاد</span>
              <span class="en-text trust-desc" style="display:none">Creators Served</span>
            </div>
          </div>
          <div class="trust-badge trust-badge-2">
            <i class="fas fa-star"></i>
            <div>
              <span class="trust-num" data-target="98">0</span><span class="trust-plus">%</span>
              <span class="ar-text trust-desc">نسبة الرضا</span>
              <span class="en-text trust-desc" style="display:none">Satisfaction</span>
            </div>
          </div>
          <div class="trust-badge trust-badge-3">
            <i class="fas fa-bolt"></i>
            <div>
              <span class="trust-num" data-target="48">0</span><span class="trust-plus">h</span>
              <span class="ar-text trust-desc">وقت التسليم</span>
              <span class="en-text trust-desc" style="display:none">Delivery Time</span>
            </div>
          </div>
        </div>

        <!-- CTA Buttons -->
        <div class="hero-v2-cta">
          <a href="#form-section" class="btn btn-hero-primary ar-text" id="heroCta">
            <span class="btn-glow-ring"></span>
            <i class="fas fa-rocket"></i>
            <span>ابدأ الآن</span>
            <span class="btn-arrow">←</span>
          </a>
          <a href="#form-section" class="btn btn-hero-primary en-text" id="heroCtaEn" style="display:none">
            <span class="btn-glow-ring"></span>
            <i class="fas fa-rocket"></i>
            <span>Start Now</span>
            <span class="btn-arrow">→</span>
          </a>
          <a href="#coaching" class="btn btn-hero-secondary ar-text">
            <i class="fas fa-graduation-cap"></i>
            احجز جلسة مجانية مع البروفيسور
          </a>
          <a href="#coaching" class="btn btn-hero-secondary en-text" style="display:none">
            <i class="fas fa-graduation-cap"></i>
            Book Free Session with Prof
          </a>
        </div>

        <!-- Sub CTA note -->
        <p class="hero-cta-note ar-text">
          <i class="fas fa-shield-alt"></i> بدون التزام — جلستك الأولى مجانية تماماً
        </p>
        <p class="hero-cta-note en-text" style="display:none">
          <i class="fas fa-shield-alt"></i> No commitment — your first session is completely free
        </p>
      </div>

      <!-- ===== LEFT SIDE: Static Performance Dashboard ===== -->
      <div class="pm-wrap" id="heroVisual">

        <!-- Soft background glow — single layer, no animation complexity -->
        <div class="pm-glow-bg"></div>

        <!-- ══════════════════════════════════
             PHONE FRAME
        ══════════════════════════════════ -->
        <div class="pm-phone" id="pmPhone">

          <!-- Dynamic Island -->
          <div class="pm-island">
            <div class="pm-island-cam"></div>
            <div class="pm-island-dot"></div>
          </div>

          <!-- ── SCREEN CONTENT ── -->
          <div class="pm-screen">

            <!-- ▸ SCREEN HEADER -->
            <div class="pm-screen-header">
              <div class="pm-app-icon"><i class="fas fa-chart-bar"></i></div>
              <div class="pm-header-text">
                <span class="pm-app-name ar-text">CreatorHubPro</span>
                <span class="pm-app-name en-text" style="display:none">CreatorHubPro</span>
                <span class="pm-sub ar-text">لوحة الأداء</span>
                <span class="pm-sub en-text" style="display:none">Dashboard</span>
              </div>
              <div class="pm-live-dot-wrap">
                <span class="pm-live-dot-pulse"></span>
                <span class="pm-live-text">LIVE</span>
              </div>
            </div>

            <!-- ▸ TOP LABEL: "نتائج حسابك بعد التطوير" -->
            <div class="pm-result-label">
              <i class="fas fa-trophy pm-trophy-ico"></i>
              <span class="ar-text">نتائج حسابك بعد التطوير</span>
              <span class="en-text" style="display:none">Your account results after development</span>
            </div>

            <!-- ▸ MAIN STATS ROW -->
            <div class="pm-stats-grid">
              <!-- Views -->
              <div class="pm-stat-card pm-stat-views">
                <div class="pm-stat-icon pm-si-blue"><i class="fas fa-eye"></i></div>
                <div class="pm-stat-info">
                  <span class="pm-stat-num sstat-num" data-target="180000" data-format="k">180K</span>
                  <span class="pm-stat-lbl ar-text">مشاهدة</span>
                  <span class="pm-stat-lbl en-text" style="display:none">Views</span>
                </div>
                <div class="pm-stat-badge pm-badge-up">▲ 12x</div>
              </div>
              <!-- Likes -->
              <div class="pm-stat-card pm-stat-likes">
                <div class="pm-stat-icon pm-si-red"><i class="fas fa-heart"></i></div>
                <div class="pm-stat-info">
                  <span class="pm-stat-num sstat-num" data-target="22800" data-format="k">22.8K</span>
                  <span class="pm-stat-lbl ar-text">إعجاب</span>
                  <span class="pm-stat-lbl en-text" style="display:none">Likes</span>
                </div>
                <div class="pm-stat-badge pm-badge-up">▲ 8x</div>
              </div>
              <!-- Growth -->
              <div class="pm-stat-card pm-stat-growth">
                <div class="pm-stat-icon pm-si-gold"><i class="fas fa-arrow-trend-up"></i></div>
                <div class="pm-stat-info">
                  <span class="pm-stat-num sstat-num" data-target="340" data-format="pct">+340%</span>
                  <span class="pm-stat-lbl ar-text">نمو الوصول</span>
                  <span class="pm-stat-lbl en-text" style="display:none">Reach Growth</span>
                </div>
                <div class="pm-bar-wrap">
                  <div class="pm-bar-fill" style="width:85%"></div>
                </div>
              </div>
            </div>

            <!-- ▸ CONTENT PREVIEW BLOCK (mock post) -->
            <div class="pm-post-preview">
              <!-- Thumbnail -->
              <div class="pm-thumb">
                <div class="pm-thumb-grad"></div>
                <div class="pm-thumb-play"><i class="fas fa-play"></i></div>
                <div class="pm-thumb-badge ar-text">مميز ✨</div>
                <div class="pm-thumb-badge en-text" style="display:none">Featured ✨</div>
              </div>
              <!-- Post meta -->
              <div class="pm-post-meta">
                <p class="pm-post-title ar-text">سر النجاح في المحتوى</p>
                <p class="pm-post-title en-text" style="display:none">The Secret to Content Success</p>
                <p class="pm-post-caption ar-text">ده مثال لفيديو تم تطويره ضمن النظام</p>
                <p class="pm-post-caption en-text" style="display:none">Example video developed inside the system</p>
                <!-- mini stats row -->
                <div class="pm-post-stats">
                  <span><i class="fas fa-eye"></i> 180K</span>
                  <span><i class="fas fa-heart"></i> 22.8K</span>
                  <span><i class="fas fa-share-nodes"></i> 3.2K</span>
                </div>
              </div>
            </div>

            <!-- ▸ PROOF STRIP: "دي نتائج حقيقية خلال أول 30 يوم" -->
            <div class="pm-proof-strip">
              <i class="fas fa-shield-halved pm-shield-ico"></i>
              <span class="ar-text">دي نتائج حقيقية خلال أول 30 يوم</span>
              <span class="en-text" style="display:none">Real results in the first 30 days</span>
            </div>

            <!-- ▸ CTA INSIDE MOBILE -->
            <div class="pm-screen-cta">
              <a href="#form-section" class="pm-cta-btn">
                <i class="fas fa-bolt pm-cta-ico"></i>
                <span class="ar-text">ابدأ تطوير محتواك</span>
                <span class="en-text" style="display:none">Start Developing Your Content</span>
              </a>
            </div>

          </div><!-- /pm-screen -->

          <!-- Physical side buttons -->
          <div class="pm-side-btn pm-vol-up"></div>
          <div class="pm-side-btn pm-vol-dn"></div>
          <div class="pm-side-btn pm-power"></div>

        </div><!-- /pm-phone -->

        <!-- ══════════════════════════════════════
             ONLY 2 FLOATING CHIPS — Clean & Focused
        ══════════════════════════════════════ -->

        <!-- RIGHT TOP: +340% نمو الوصول -->
        <div class="pm-chip pm-chip-rt">
          <div class="pm-chip-icon pm-ci-purple"><i class="fas fa-chart-line"></i></div>
          <div class="pm-chip-body">
            <span class="pm-chip-val">340%+</span>
            <span class="pm-chip-lbl ar-text">نمو الوصول</span>
            <span class="pm-chip-lbl en-text" style="display:none">Reach Growth</span>
          </div>
          <span class="pm-chip-arrow">↑</span>
        </div>

        <!-- RIGHT BOTTOM: 2.4M مشاهدة / شهر -->
        <div class="pm-chip pm-chip-rb">
          <div class="pm-chip-icon pm-ci-gold"><i class="fas fa-fire-flame-curved"></i></div>
          <div class="pm-chip-body">
            <span class="pm-chip-val">2.4M</span>
            <span class="pm-chip-lbl ar-text">مشاهدة / شهر</span>
            <span class="pm-chip-lbl en-text" style="display:none">Views / month</span>
          </div>
        </div>

      </div><!-- /pm-wrap -->
    </div>

    <!-- Scroll indicator -->
    <div class="hero-scroll-v2">
      <div class="scroll-track">
        <div class="scroll-ball"></div>
      </div>
      <span class="ar-text scroll-hint-text">اكتشف النظام</span>
      <span class="en-text scroll-hint-text" style="display:none">Discover the System</span>
    </div>
  </section>

  <!-- ============================
       ABOUT V2 — Pre-frame "من نحن"
       Positioned BEFORE problem section
  ============================= -->
  <section class="ab2-section" id="about">
    <div class="container">
      <div class="ab2-wrap animate-on-scroll">

        <!-- ① Label -->
        <div class="ab2-label-row">
          <span class="ab2-label ar-text">من نحن</span>
          <span class="ab2-label en-text" style="display:none">About Us</span>
        </div>

        <!-- ② Headline -->
        <div class="ab2-headline-block">
          <h2 class="ab2-headline ar-text">
            مشكلتك مش في المحتوى…
            <span class="ab2-headline-accent">مشكلتك إنك مش بتكسب منه.</span>
          </h2>
          <h2 class="ab2-headline en-text" style="display:none">
            Your problem isn't the content…
            <span class="ab2-headline-accent">Your problem is — nobody's watching it.</span>
          </h2>
        </div>

        <!-- ③ Two short paragraphs -->
        <div class="ab2-paras ar-text">
          <p class="ab2-para">
            فيديوهات كتير بتتنشر…<br/>
            <span class="ab2-para-soft">بس قليل اللي بيوقف الناس.</span>
          </p>
          <p class="ab2-para">
            صناع محتوى بيشتغلوا بدون نمو،<br/>
            <span class="ab2-para-soft">وأصحاب بيزنس بينزلوا فيديوهات بدون عملاء.</span>
          </p>
        </div>
        <div class="ab2-paras en-text" style="display:none">
          <p class="ab2-para">
            Tons of videos are posted every day…<br/>
            <span class="ab2-para-soft">but very few make people stop scrolling.</span>
          </p>
          <p class="ab2-para">
            Creators grind without growth,<br/>
            <span class="ab2-para-soft">businesses post without getting clients.</span>
          </p>
        </div>

        <!-- ④ Transition line -->
        <div class="ab2-transition">
          <span class="ab2-transition-line"></span>
          <p class="ab2-transition-text ar-text">
            علشان كده عملنا <strong class="ab2-brand">CreatorHub<span class="accent">Pro</span></strong>
          </p>
          <p class="ab2-transition-text en-text" style="display:none">
            That's exactly why we built <strong class="ab2-brand">CreatorHub<span class="accent">Pro</span></strong>
          </p>
          <span class="ab2-transition-line"></span>
        </div>

        <!-- ⑤ Service clarification -->
        <div class="ab2-service">
          <p class="ab2-service-text ar-text">
            نحن بنقدّم <span class="ab2-service-hl">مونتاج فيديو احترافي</span>…
            <br class="ab2-br-mobile"/>
            لكن بهدف واحد: <strong>تكسب عميل</strong>
          </p>
          <p class="ab2-service-text en-text" style="display:none">
            We provide <span class="ab2-service-hl">professional video editing</span>…
            <br class="ab2-br-mobile"/>
            but with one goal only: <strong>results.</strong>
          </p>
        </div>

        <!-- ⑥ Bullet grid (3 cards) -->
        <div class="ab2-bullets">

          <div class="ab2-bullet ab2-blt-gold animate-on-scroll">
            <span class="ab2-blt-icon">⚡</span>
            <span class="ab2-blt-text ar-text">يجذب الانتباه<br/><span class="ab2-blt-sub">من أول ثانية</span></span>
            <span class="ab2-blt-text en-text" style="display:none">Hooks attention<br/><span class="ab2-blt-sub">in the first second</span></span>
          </div>

          <div class="ab2-bullet ab2-blt-violet animate-on-scroll">
            <span class="ab2-blt-icon">👁</span>
            <span class="ab2-blt-text ar-text">يخلي المشاهد<br/><span class="ab2-blt-sub">يكمل لآخره</span></span>
            <span class="ab2-blt-text en-text" style="display:none">Keeps viewers<br/><span class="ab2-blt-sub">watching till the end</span></span>
          </div>

          <div class="ab2-bullet ab2-blt-green animate-on-scroll">
            <span class="ab2-blt-icon">🎯</span>
            <span class="ab2-blt-text ar-text">يوصل لقرار<br/><span class="ab2-blt-sub">تفاعل أو شراء</span></span>
            <span class="ab2-blt-text en-text" style="display:none">Drives a decision<br/><span class="ab2-blt-sub">engagement or purchase</span></span>
          </div>

        </div>

        <!-- ⑦ Closing quote -->
        <div class="ab2-closing animate-on-scroll">
          <div class="ab2-closing-inner">
            <span class="ab2-quote-mark">"</span>
            <div class="ab2-closing-content">
              <p class="ab2-closing-line1 ar-text">مش فيديو شكله حلو…</p>
              <p class="ab2-closing-line1 en-text" style="display:none">Not a video that looks good…</p>
              <p class="ab2-closing-line2 ar-text">فيديو بيشتغل لصالحك.</p>
              <p class="ab2-closing-line2 en-text" style="display:none">A video that works for you.</p>
            </div>
            <span class="ab2-quote-mark ab2-quote-close">"</span>
          </div>
        </div>

        <!-- ⑧ Subtle CTA -->
        <div class="ab2-cta-row">
          <a href="#form-section" class="ab2-cta ar-text">
            ابدأ الآن وجرّب الفرق بنفسك
            <span class="ab2-cta-arrow">←</span>
          </a>
          <a href="#form-section" class="ab2-cta en-text" style="display:none">
            Start now and feel the difference
            <span class="ab2-cta-arrow">→</span>
          </a>
        </div>

      </div>
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

  <!-- MOBILE MID-CTA #1 — after problem, before solution -->
  <div class="mobile-cta-strip">
    <a href="#form-section" class="ar-text">
      <i class="fas fa-rocket"></i> ابدأ الآن — الجلسة الأولى مجانية
    </a>
    <a href="#form-section" class="en-text" style="display:none">
      <i class="fas fa-rocket"></i> Start Now — First Session Free
    </a>
  </div>

  <!-- ============================
       SOLUTION SECTION
  ============================= -->
  <section class="solution-section section-padding" id="solution">
    <div class="container">

      <!-- ── Shock stat banner ── -->
      <div class="sol-shock-bar animate-on-scroll">
        <div class="sol-shock-inner">
          <span class="sol-shock-bolt"><i class="fas fa-bolt"></i></span>
          <p class="ar-text">
            ⚡ <strong>90%</strong> من صناع المحتوى بيفشلوا… مش بسبب الجودة فقط، لكن بسبب <strong>غياب النظام</strong>
          </p>
          <p class="en-text" style="display:none">
            ⚡ <strong>90%</strong> of content creators fail… not just because of quality, but because of <strong>the absence of a system</strong>
          </p>
        </div>
      </div>

      <!-- ── Section header ── -->
      <div class="section-tag ar-text">النظام</div>
      <div class="section-tag en-text" style="display:none">THE SOLUTION</div>

      <div class="sol-micro-copy ar-text">
        <i class="fas fa-quote-right" style="font-size:0.75em;opacity:0.6;margin-left:6px;"></i>
        ليه معظم المحتوى بيفشل؟ لأن مفيش نظام
        <i class="fas fa-quote-left" style="font-size:0.75em;opacity:0.6;margin-right:6px;"></i>
      </div>
      <div class="sol-micro-copy en-text" style="display:none">
        <i class="fas fa-quote-left" style="font-size:0.75em;opacity:0.6;margin-right:6px;"></i>
        Most content fails because there's no system
        <i class="fas fa-quote-right" style="font-size:0.75em;opacity:0.6;margin-left:6px;"></i>
      </div>

      <h2 class="section-title ar-text">
         مش خدمة مونتاج فقط…<br/><span class="gradient-text">ده نظام كامل لنمو محتواك</span>
      </h2>
      <h2 class="section-title en-text" style="display:none">
        Not a Service…<br/><span class="gradient-text">A Complete System for Your Content Growth</span>
      </h2>

      <p class="section-subtitle ar-text">
        احنا مش بنمنتج فيديوهات بس — نبني معاك نظام متكامل يحوّل محتواك إلى أداة بيع وتأثير حقيقي
      </p>
      <p class="section-subtitle en-text" style="display:none">
        We don't just make videos — we build a complete system that turns your content into a real sales and influence machine
      </p>

      <!-- ── 3 Cards ── -->
      <div class="solutions-grid">

        <!-- ════ CARD 1 — VIDEO EDITING ════ -->
        <div class="solution-card sol-card-v2 sol-card-editing animate-on-scroll">
          <div class="sol-outcome-tag ar-text">📈 النتيجة: تفاعل أعلى وظهور أكثر</div>
          <div class="sol-outcome-tag en-text" style="display:none">📈 Outcome: Higher Engagement & More Reach</div>

          <div class="sol-step-tag ar-text">الركيزة الأولى</div>
          <div class="sol-step-tag en-text" style="display:none">Pillar One</div>
          <div class="sol-num">01</div>
          <div class="sol-icon sol-icon-v2 sol-icon-pulse"><i class="fas fa-film"></i></div>

          <h3 class="ar-text">مونتاج يوقّف التمرير ويجبر الناس تكمّل</h3>
          <h3 class="en-text" style="display:none">Editing That Stops the Scroll & Forces People to Keep Watching</h3>

          <p class="sol-desc ar-text">
            الناس بتقرر في <strong style="color:#a78bfa">0.3 ثانية</strong> هتكمل ولا لأ —<br/>
            إحنا بنضمن إن فيديوهاتك تعدي هذا الاختبار وتوصل لأكبر عدد ممكن
          </p>
          <p class="sol-desc en-text" style="display:none">
            People decide in <strong style="color:#a78bfa">0.3 seconds</strong> whether to keep watching —<br/>
            we make sure your videos pass that test and reach the maximum audience
          </p>

          <ul class="sol-list sol-list-v2 ar-text">
            <li><i class="fas fa-check"></i> Hook مقنع في أول 3 ثواني يشد من أول لحظة</li>
            <li><i class="fas fa-check"></i> إيقاع مونتاج ديناميكي يمنع الملل ويزيد المشاهدة</li>
            <li><i class="fas fa-check"></i> تحسين لوني وبصري يخلي المحتوى يبان احترافي</li>
            <li><i class="fas fa-check"></i> موسيقى وmood يتناسب مع جمهورك ومحتواك</li>
            <li><i class="fas fa-check"></i> تحسين الصوت بحيث يكون واضح وجذاب</li>
          </ul>
          <ul class="sol-list sol-list-v2 en-text" style="display:none">
            <li><i class="fas fa-check"></i> Compelling hook in the first 3 seconds</li>
            <li><i class="fas fa-check"></i> Dynamic editing rhythm that prevents boredom</li>
            <li><i class="fas fa-check"></i> Color grading that makes content look cinematic</li>
            <li><i class="fas fa-check"></i> Music & mood that matches your brand and audience</li>
            <li><i class="fas fa-check"></i> Crystal clear audio enhancement</li>
          </ul>

          <div class="sol-benefit-line ar-text">
            <i class="fas fa-fire"></i> محتواك يستحق إنه يتشاف — خلينا نخليه يتشاف فعلاً
          </div>
          <div class="sol-benefit-line en-text" style="display:none">
            <i class="fas fa-fire"></i> Your content deserves to be seen — let us make it actually seen
          </div>

          <div class="sol-trigger ar-text">
            <i class="fas fa-eye"></i> المشاهد يتوقف… ويكمل… ويتفاعل
          </div>
          <div class="sol-trigger en-text" style="display:none">
            <i class="fas fa-eye"></i> Viewer stops… watches… engages
          </div>
        </div>

        <!-- ════ CARD 2 — STRATEGY / FEATURED ════ -->
        <div class="solution-card solution-card-featured sol-card-v2 sol-card-center sol-card-strategy animate-on-scroll">
          <div class="sol-star-glow"></div>
          <div class="featured-badge ar-text">🎓 الميزة الحصرية — مع البروفيسور</div>
          <div class="featured-badge en-text" style="display:none">🎓 Exclusive USP — With the Professor</div>

          <div class="sol-outcome-tag sol-outcome-gold ar-text">💡 النتيجة: محتوى هادف يحقق نتائج قابلة للقياس</div>
          <div class="sol-outcome-tag sol-outcome-gold en-text" style="display:none">💡 Outcome: Purposeful Content That Drives Measurable Results</div>

          <div class="sol-step-tag sol-step-tag-gold ar-text">الركيزة الثانية — الأهم</div>
          <div class="sol-step-tag sol-step-tag-gold en-text" style="display:none">Pillar Two — The Key</div>
          <div class="sol-num sol-num-gold">02</div>
          <div class="sol-icon sol-icon-v2 sol-icon-gold sol-icon-glow"><i class="fas fa-graduation-cap"></i></div>

          <h3 class="ar-text">التوجيه الاستراتيجي — أعرف تعمل إيه، وليه، وإمتى</h3>
          <h3 class="en-text" style="display:none">Strategic Guidance — Know What, Why & When to Create</h3>

          <p class="sol-desc ar-text sol-desc-gold">
            الفيديو الكويس لوحده <strong>مش بيكفي</strong> —<br/>
            اللي بيصنع الفرق هو الاستراتيجية اللي وراه.<br/>
            مع البروفيسور، <strong>مش هتشتغل عشوائي تاني أبداً</strong>
          </p>
          <p class="sol-desc en-text sol-desc-gold" style="display:none">
            A good video alone <strong>isn't enough</strong> —<br/>
            what makes the difference is the strategy behind it.<br/>
            With the Professor, <strong>you'll never work randomly again</strong>
          </p>

          <ul class="sol-list sol-list-v2 sol-list-gold ar-text">
            <li><i class="fas fa-check"></i> تحليل كامل لحسابك، جمهورك، ومنافسيك</li>
            <li><i class="fas fa-check"></i> تحديد الـ niche والرسالة اللي بتتميز بيها</li>
            <li><i class="fas fa-check"></i> أفكار محتوى مخصصة لك وجاهزة للتنفيذ فوراً</li>
            <li><i class="fas fa-check"></i> تحسين الـ hooks والعناوين لتحقيق أعلى reach</li>
            <li><i class="fas fa-check"></i> خطة محتوى شهرية واضحة ومنظمة</li>
          </ul>
          <ul class="sol-list sol-list-v2 sol-list-gold en-text" style="display:none">
            <li><i class="fas fa-check"></i> Full audit of your account, audience & competitors</li>
            <li><i class="fas fa-check"></i> Define your niche and unique message</li>
            <li><i class="fas fa-check"></i> Custom content ideas ready to execute immediately</li>
            <li><i class="fas fa-check"></i> Hook & title optimization for maximum reach</li>
            <li><i class="fas fa-check"></i> Clear organized monthly content calendar</li>
          </ul>

          <!-- Professor box -->
          <div class="sol-prof-box ar-text">
            <div class="sol-prof-avatar"><i class="fas fa-user-tie"></i></div>
            <div class="sol-prof-text">
              <strong>البروفيسور معاك مباشرة</strong>
              <span>جلسات تعليمية حية + استشارات منتظمة + توجيه مستمر = تغيير حقيقي في طريقة تفكيرك</span>
            </div>
          </div>
          <div class="sol-prof-box en-text" style="display:none">
            <div class="sol-prof-avatar"><i class="fas fa-user-tie"></i></div>
            <div class="sol-prof-text">
              <strong>The Professor is with you directly</strong>
              <span>Live sessions + regular consulting + ongoing guidance = real shift in how you think about content</span>
            </div>
          </div>

          <div class="sol-benefit-line sol-benefit-gold ar-text">
            <i class="fas fa-brain"></i> مش بس خدمة — ده تغيير في طريقة تفكيرك في المحتوى
          </div>
          <div class="sol-benefit-line sol-benefit-gold en-text" style="display:none">
            <i class="fas fa-brain"></i> Not just a service — it's a mindset shift in how you create
          </div>

          <div class="sol-trigger sol-trigger-gold ar-text">
            <i class="fas fa-ban"></i> مش هتبقى تشتغل عشوائي تاني
          </div>
          <div class="sol-trigger sol-trigger-gold en-text" style="display:none">
            <i class="fas fa-ban"></i> You'll never work randomly again
          </div>
        </div>

        <!-- ════ CARD 3 — CONTINUOUS GROWTH ════ -->
        <div class="solution-card sol-card-v2 sol-card-growth animate-on-scroll">
          <div class="sol-outcome-tag sol-outcome-green ar-text">🚀 النتيجة: نمو متراكم ومستدام لا يتوقف</div>
          <div class="sol-outcome-tag sol-outcome-green en-text" style="display:none">🚀 Outcome: Compounding, Sustainable Growth That Never Stops</div>

          <div class="sol-step-tag ar-text">الركيزة الثالثة</div>
          <div class="sol-step-tag en-text" style="display:none">Pillar Three</div>
          <div class="sol-num">03</div>
          <div class="sol-icon sol-icon-v2 sol-icon-green sol-icon-pulse-green"><i class="fas fa-chart-line"></i></div>

          <h3 class="ar-text">نمو حقيقي يتراكم — مش مجرد بوست وانتهى</h3>
          <h3 class="en-text" style="display:none">Real Compounding Growth — Not Just Post & Forget</h3>

          <p class="sol-desc ar-text">
            معظم الناس بتنشر وتنسى —<br/>
            إحنا بنتابع كل فيديو، بنحلل النتائج، و<strong style="color:#34d399">بنطور الاستراتيجية باستمرار</strong> علشان كل شهر أحسن من اللي قبله
          </p>
          <p class="sol-desc en-text" style="display:none">
            Most people post and forget —<br/>
            we follow every video, analyze results, and <strong style="color:#34d399">continuously evolve the strategy</strong> so every month outperforms the last
          </p>

          <ul class="sol-list sol-list-v2 ar-text">
            <li><i class="fas fa-check"></i> تحليل أداء مفصّل لكل فيديو ومحتوى</li>
            <li><i class="fas fa-check"></i> تعديل وتطوير الاستراتيجية بناءً على البيانات الحقيقية</li>
            <li><i class="fas fa-check"></i> اكتشاف الـ content patterns اللي بتشتغل مع جمهورك</li>
            <li><i class="fas fa-check"></i> تنمية المجتمع والتفاعل مع الجمهور المستهدف</li>
            <li><i class="fas fa-check"></i> نمو حقيقي في المتابعين والعملاء المحتملين</li>
          </ul>
          <ul class="sol-list sol-list-v2 en-text" style="display:none">
            <li><i class="fas fa-check"></i> Detailed performance analysis for every piece of content</li>
            <li><i class="fas fa-check"></i> Strategy adjustment based on real data</li>
            <li><i class="fas fa-check"></i> Discover content patterns that work for your audience</li>
            <li><i class="fas fa-check"></i> Community growth and targeted audience engagement</li>
            <li><i class="fas fa-check"></i> Real growth in followers and potential clients</li>
          </ul>

          <div class="sol-benefit-line sol-benefit-green ar-text">
            <i class="fas fa-infinity"></i> مش وقفة — ده نظام بيتحسن كل يوم
          </div>
          <div class="sol-benefit-line sol-benefit-green en-text" style="display:none">
            <i class="fas fa-infinity"></i> Not a one-time thing — a system that improves every day
          </div>

          <div class="sol-trigger sol-trigger-green ar-text">
            <i class="fas fa-arrow-trend-up"></i> كل شهر أقوى من اللي قبله — مضمون
          </div>
          <div class="sol-trigger sol-trigger-green en-text" style="display:none">
            <i class="fas fa-arrow-trend-up"></i> Every month stronger than the last — guaranteed
          </div>
        </div>

      </div>

      <!-- ── Journey connector ── -->
      <div class="sol-journey-bar ar-text animate-on-scroll">
        <span class="sol-j-step"><i class="fas fa-film" style="margin-left:6px"></i> إنتاج احترافي</span>
        <span class="sol-j-arrow"><i class="fas fa-arrow-left"></i></span>
        <span class="sol-j-step sol-j-step-gold"><i class="fas fa-graduation-cap" style="margin-left:6px"></i> توجيه استراتيجي</span>
        <span class="sol-j-arrow"><i class="fas fa-arrow-left"></i></span>
        <span class="sol-j-step sol-j-step-green"><i class="fas fa-rocket" style="margin-left:6px"></i> نمو مستمر 🚀</span>
      </div>
      <div class="sol-journey-bar en-text animate-on-scroll" style="display:none">
        <span class="sol-j-step"><i class="fas fa-film" style="margin-right:6px"></i> Pro Production</span>
        <span class="sol-j-arrow"><i class="fas fa-arrow-right"></i></span>
        <span class="sol-j-step sol-j-step-gold"><i class="fas fa-graduation-cap" style="margin-right:6px"></i> Strategic Guidance</span>
        <span class="sol-j-arrow"><i class="fas fa-arrow-right"></i></span>
        <span class="sol-j-step sol-j-step-green"><i class="fas fa-rocket" style="margin-right:6px"></i> Continuous Growth 🚀</span>
      </div>

      <!-- ── Bottom CTA ── -->
      <div class="sol-bottom-cta animate-on-scroll">
        <p class="sol-cta-promise ar-text">
          <i class="fas fa-shield-halved"></i> إحنا ما بنبيعكش خدمة — إحنا بنبني معاك مستقبل محتواك
        </p>
        <p class="sol-cta-promise en-text" style="display:none">
          <i class="fas fa-shield-halved"></i> We don't sell you a service — we build the future of your content together
        </p>
        <div class="sol-cta-btns">
          <a href="#form-section" class="btn btn-primary ar-text">
            <i class="fas fa-rocket"></i> ابدأ نظامك الآن
          </a>
          <a href="#form-section" class="btn btn-primary en-text" style="display:none">
            <i class="fas fa-rocket"></i> Start Your System Now
          </a>
          <a href="https://wa.me/201105449828?text=مرحبًا%2C%20أرسلت%20بياناتي%20عبر%20الموقع%20وأرغب%20في%20البدء" target="_blank" class="btn btn-wa-outline ar-text">
            <i class="fab fa-whatsapp"></i> اسأل البروفيسور الآن
          </a>
          <a href="https://wa.me/201105449828?text=Hello%2C%20I%20want%20to%20learn%20more%20about%20the%20system" target="_blank" class="btn btn-wa-outline en-text" style="display:none">
            <i class="fab fa-whatsapp"></i> Ask the Professor Now
          </a>
        </div>
      </div>

    </div>
  </section>

  <!-- ============================
       HOW IT WORKS
  ============================= -->
  <!-- ============================
       BRIDGE SECTION — SYSTEM → VALUE → DECISION
  ============================= -->
  <section class="bridge-section section-padding" id="how">
    <div class="container">

      <!-- ══════════════════════════════════
           HEADER
      ══════════════════════════════════ -->
      <div class="section-tag ar-text">النظام</div>
      <div class="section-tag en-text" style="display:none">THE SYSTEM</div>

      <h2 class="section-title ar-text">
        كيف نحوّل محتواك إلى <span class="gradient-text">نتائج فعلية؟</span>
      </h2>
      <h2 class="section-title en-text" style="display:none">
        How We Turn Your Content Into <span class="gradient-text">Real Results?</span>
      </h2>

      <p class="section-subtitle brd-subtitle ar-text">
        هذا ليس مونتاج… هذا <strong>نظام نمو متكامل</strong>
      </p>
      <p class="section-subtitle brd-subtitle en-text" style="display:none">
        This is not editing… this is a <strong>complete growth system</strong>
      </p>

      <!-- ══════════════════════════════════
           PART 1 — 3 TRANSFORMATION STAGES
      ══════════════════════════════════ -->
      <div class="brd-stages-grid">

        <!-- ─── STAGE 1 ─── -->
        <div class="brd-stage-card animate-on-scroll">
          <div class="brd-stage-num">01</div>
          <div class="brd-stage-icon brd-icon-purple">
            <i class="fas fa-crosshairs"></i>
          </div>
          <div class="brd-stage-connector brd-conn-right ar-text"><i class="fas fa-arrow-left"></i></div>
          <div class="brd-stage-connector brd-conn-right en-text" style="display:none"><i class="fas fa-arrow-right"></i></div>

          <h3 class="ar-text">وضوح البداية</h3>
          <h3 class="en-text" style="display:none">Clarity First</h3>

          <p class="brd-stage-desc ar-text">
            نحلل المحتوى أو الفكرة ونحدد الاتجاه الصحيح بدل التخمين
          </p>
          <p class="brd-stage-desc en-text" style="display:none">
            We analyze your content or idea and define the right direction — no more guessing
          </p>

          <ul class="brd-stage-list ar-text">
            <li><i class="fas fa-check"></i> تحليل سريع وعميق</li>
            <li><i class="fas fa-check"></i> تحديد الهدف بدقة</li>
            <li><i class="fas fa-check"></i> وضوح الرسالة الكاملة</li>
          </ul>
          <ul class="brd-stage-list en-text" style="display:none">
            <li><i class="fas fa-check"></i> Fast & deep analysis</li>
            <li><i class="fas fa-check"></i> Precise goal definition</li>
            <li><i class="fas fa-check"></i> Full message clarity</li>
          </ul>

          <div class="brd-stage-trigger ar-text">
            <i class="fas fa-quote-right brd-q-icon"></i>
            أول مرة تعرف بالضبط ماذا تنشر ولماذا
          </div>
          <div class="brd-stage-trigger en-text" style="display:none">
            <i class="fas fa-quote-left brd-q-icon"></i>
            For the first time — you know exactly what to post and why
          </div>
        </div>

        <!-- ─── STAGE 2 ─── -->
        <div class="brd-stage-card brd-stage-featured animate-on-scroll">
          <div class="brd-stage-num brd-num-gold">02</div>
          <div class="brd-stage-icon brd-icon-gold">
            <i class="fas fa-film"></i>
          </div>
          <div class="brd-stage-connector brd-conn-right ar-text"><i class="fas fa-arrow-left"></i></div>
          <div class="brd-stage-connector brd-conn-right en-text" style="display:none"><i class="fas fa-arrow-right"></i></div>

          <h3 class="ar-text">تنفيذ يخدم الهدف</h3>
          <h3 class="en-text" style="display:none">Execution That Serves the Goal</h3>

          <p class="brd-stage-desc ar-text">
            نحوّل الفكرة إلى فيديو احترافي مبني على استراتيجية وليس عشوائية
          </p>
          <p class="brd-stage-desc en-text" style="display:none">
            We turn the idea into a pro video built on strategy — not random trial and error
          </p>

          <ul class="brd-stage-list brd-list-gold ar-text">
            <li><i class="fas fa-check"></i> تحسين الـ Hook من الثانية الأولى</li>
            <li><i class="fas fa-check"></i> مونتاج احترافي موجّه بالهدف</li>
            <li><i class="fas fa-check"></i> توجيه مباشر من البروفيسور</li>
          </ul>
          <ul class="brd-stage-list brd-list-gold en-text" style="display:none">
            <li><i class="fas fa-check"></i> Hook improvement from second one</li>
            <li><i class="fas fa-check"></i> Goal-driven professional editing</li>
            <li><i class="fas fa-check"></i> Direct guidance from the Professor</li>
          </ul>

          <div class="brd-stage-trigger brd-trigger-gold ar-text">
            <i class="fas fa-quote-right brd-q-icon"></i>
            كل فيديو له دور واضح في نموك
          </div>
          <div class="brd-stage-trigger brd-trigger-gold en-text" style="display:none">
            <i class="fas fa-quote-left brd-q-icon"></i>
            Every video plays a clear role in your growth
          </div>
        </div>

        <!-- ─── STAGE 3 ─── -->
        <div class="brd-stage-card animate-on-scroll">
          <div class="brd-stage-num">03</div>
          <div class="brd-stage-icon brd-icon-green">
            <i class="fas fa-chart-line"></i>
          </div>

          <h3 class="ar-text">نمو مستمر لا يتوقف</h3>
          <h3 class="en-text" style="display:none">Continuous Growth That Never Stops</h3>

          <p class="brd-stage-desc ar-text">
            نراقب الأداء ونطور المحتوى باستمرار للوصول لنتائج حقيقية وقابلة للقياس
          </p>
          <p class="brd-stage-desc en-text" style="display:none">
            We monitor performance and evolve content continuously to reach real, measurable results
          </p>

          <ul class="brd-stage-list brd-list-green ar-text">
            <li><i class="fas fa-check"></i> تحليل أداء مفصّل بعد كل فيديو</li>
            <li><i class="fas fa-check"></i> تحسين مستمر بناءً على البيانات</li>
            <li><i class="fas fa-check"></i> تطوير الاستراتيجية كل شهر</li>
          </ul>
          <ul class="brd-stage-list brd-list-green en-text" style="display:none">
            <li><i class="fas fa-check"></i> Detailed performance analysis per video</li>
            <li><i class="fas fa-check"></i> Continuous data-driven improvement</li>
            <li><i class="fas fa-check"></i> Monthly strategy evolution</li>
          </ul>

          <div class="brd-stage-trigger brd-trigger-green ar-text">
            <i class="fas fa-quote-right brd-q-icon"></i>
            مش فيديو… هذا نظام نمو كامل
          </div>
          <div class="brd-stage-trigger brd-trigger-green en-text" style="display:none">
            <i class="fas fa-quote-left brd-q-icon"></i>
            Not a video… this is a complete growth system
          </div>
        </div>

      </div>
      <!-- /brd-stages-grid -->

      <!-- ══════════════════════════════════
           PART 2 — DIFFERENTIATION STRIP
      ══════════════════════════════════ -->
      <div class="brd-diff-strip animate-on-scroll">
        <div class="brd-diff-headline ar-text">
          الفرق بين محتوى <span class="brd-diff-hl-bad">ينشر</span>…
          ومحتوى <span class="brd-diff-hl-good">ينمو</span>
        </div>
        <div class="brd-diff-headline en-text" style="display:none">
          The difference between content that <span class="brd-diff-hl-bad">posts</span>…
          and content that <span class="brd-diff-hl-good">grows</span>
        </div>

        <div class="brd-diff-cols">

          <!-- CreatorHubPro side -->
          <div class="brd-diff-col brd-diff-win">
            <div class="brd-diff-col-header">
              <div class="brd-diff-dot brd-dot-green"></div>
              <span>CreatorHubPro</span>
            </div>
            <ul class="brd-diff-list ar-text">
              <li><i class="fas fa-check brd-ic-green"></i> نظام متكامل من A إلى Z</li>
              <li><i class="fas fa-check brd-ic-green"></i> استراتيجية + تنفيذ في آن واحد</li>
              <li><i class="fas fa-check brd-ic-green"></i> متابعة مستمرة حتى النتيجة</li>
              <li><i class="fas fa-check brd-ic-green"></i> نتائج قابلة للقياس والتطوير</li>
            </ul>
            <ul class="brd-diff-list en-text" style="display:none">
              <li><i class="fas fa-check brd-ic-green"></i> Complete system from A to Z</li>
              <li><i class="fas fa-check brd-ic-green"></i> Strategy + execution combined</li>
              <li><i class="fas fa-check brd-ic-green"></i> Ongoing follow-up until results</li>
              <li><i class="fas fa-check brd-ic-green"></i> Measurable and scalable results</li>
            </ul>
          </div>

          <!-- VS divider -->
          <div class="brd-diff-vs">
            <span>VS</span>
          </div>

          <!-- Others side -->
          <div class="brd-diff-col brd-diff-pain">
            <div class="brd-diff-col-header brd-header-red">
              <div class="brd-diff-dot brd-dot-red"></div>
              <span class="ar-text">الآخرون</span>
              <span class="en-text" style="display:none">Others</span>
            </div>
            <ul class="brd-diff-list ar-text">
              <li><i class="fas fa-xmark brd-ic-red"></i> مونتاج فقط — بدون أي استراتيجية</li>
              <li><i class="fas fa-xmark brd-ic-red"></i> بدون توجيه أو تحليل</li>
              <li><i class="fas fa-xmark brd-ic-red"></i> بدون متابعة بعد التسليم</li>
              <li><i class="fas fa-xmark brd-ic-red"></i> نتائج عشوائية غير مضمونة</li>
            </ul>
            <ul class="brd-diff-list en-text" style="display:none">
              <li><i class="fas fa-xmark brd-ic-red"></i> Editing only — zero strategy</li>
              <li><i class="fas fa-xmark brd-ic-red"></i> No guidance or analysis</li>
              <li><i class="fas fa-xmark brd-ic-red"></i> No follow-up after delivery</li>
              <li><i class="fas fa-xmark brd-ic-red"></i> Random, unguaranteed results</li>
            </ul>
          </div>

        </div>
      </div>
      <!-- /brd-diff-strip -->

      <!-- ══════════════════════════════════
           PART 3 — PROFESSOR HOOK (USP)
      ══════════════════════════════════ -->
      <div class="brd-prof-box animate-on-scroll">
        <div class="brd-prof-glow"></div>

        <div class="brd-prof-top">
          <div class="brd-prof-avatar">
            <i class="fas fa-graduation-cap"></i>
          </div>
          <div>
            <h3 class="ar-text">🎓 البروفيسور — سر النمو الحقيقي</h3>
            <h3 class="en-text" style="display:none">🎓 The Professor — The Secret to Real Growth</h3>
            <p class="brd-prof-tagline ar-text">هنا يبدأ الفرق الحقيقي</p>
            <p class="brd-prof-tagline en-text" style="display:none">This is where the real difference begins</p>
          </div>
        </div>

        <p class="brd-prof-desc ar-text">
          أنت لا تحصل على مونتاج فقط… بل على <strong>توجيه احترافي</strong> يساعدك على
          فهم المحتوى وبناء استراتيجية واضحة تجعل كل فيديو خطوة نحو نمو حقيقي
        </p>
        <p class="brd-prof-desc en-text" style="display:none">
          You don't just get editing… you get <strong>professional guidance</strong> that helps you
          understand content and build a clear strategy — making every video a step toward real growth
        </p>

        <div class="brd-prof-features">
          <div class="brd-prof-feat">
            <i class="fas fa-comments"></i>
            <div>
              <strong class="ar-text">جلسات استشارية حية</strong>
              <strong class="en-text" style="display:none">Live Consulting Sessions</strong>
              <span class="ar-text">تحدث مباشرة مع البروفيسور</span>
              <span class="en-text" style="display:none">Direct access to the Professor</span>
            </div>
          </div>
          <div class="brd-prof-feat">
            <i class="fas fa-magnifying-glass-chart"></i>
            <div>
              <strong class="ar-text">تحليل المحتوى المتعمق</strong>
              <strong class="en-text" style="display:none">Deep Content Analysis</strong>
              <span class="ar-text">نكتشف ما يعيق نموك فعلاً</span>
              <span class="en-text" style="display:none">We uncover what's really blocking your growth</span>
            </div>
          </div>
          <div class="brd-prof-feat">
            <i class="fas fa-wand-magic-sparkles"></i>
            <div>
              <strong class="ar-text">أفكار جاهزة للتنفيذ الفوري</strong>
              <strong class="en-text" style="display:none">Ready-to-Execute Content Ideas</strong>
              <span class="ar-text">مش أفكار نظرية — أفكار تُنفَّذ غداً</span>
              <span class="en-text" style="display:none">Not theory — ideas you execute tomorrow</span>
            </div>
          </div>
        </div>

        <div class="brd-prof-cta">
          <a href="#form-section" class="btn btn-coaching ar-text">
            <i class="fas fa-calendar-plus"></i> احجز جلستك المجانية مع البروفيسور
          </a>
          <a href="#form-section" class="btn btn-coaching en-text" style="display:none">
            <i class="fas fa-calendar-plus"></i> Book Your Free Session with the Professor
          </a>
          <div class="brd-prof-trust ar-text">
            <i class="fas fa-shield-halved"></i> مجانية تماماً — بدون أي التزام
          </div>
          <div class="brd-prof-trust en-text" style="display:none">
            <i class="fas fa-shield-halved"></i> Completely free — zero commitment
          </div>
        </div>
      </div>
      <!-- /brd-prof-box -->
<!-- cta to account-analysis tool -->
   <section class="tool-redirect-section" style="padding: 100px 0; position: relative; overflow: hidden;">
  
  <div class="tool-bg-glow" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 600px; height: 300px; background: radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, transparent 70%); z-index: 0; pointer-events: none;"></div>

  <div class="container" style="position: relative; z-index: 1; text-align: center;">
    
    <div class="tool-glass-card" style="background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 24px; padding: 60px 30px; box-shadow: 0 20px 50px rgba(0,0,0,0.3);">
      
      <div class="hero-live-badge" style="margin: 0 auto 25px; background: rgba(167, 139, 250, 0.1); border: 1px solid rgba(167, 139, 250, 0.2);">
        <span class="live-dot"></span>
        <span class="ar-text">أداة تحليل مجانية</span>
        <span class="en-text" style="display:none">Free Analysis Tool</span>
      </div>

      <h2 class="hero-v2-headline ar-text" style="font-size: clamp(1.8rem, 5vw, 2.8rem); margin-bottom: 20px; line-height: 1.2;">
        اختبر محتواك <span class="hero-line-gradient">بمعايير عالمية</span>
      </h2>
      <h2 class="hero-v2-headline en-text" style="display:none; font-size: clamp(1.8rem, 5vw, 2.8rem); margin-bottom: 20px; line-height: 1.2;">
        Test Your Content <span class="hero-line-gradient">Against Global Standards</span>
      </h2>

      <p class="hero-v2-sub ar-text" style="max-width: 650px; margin: 0 auto 40px; color: rgba(255,255,255,0.7); font-size: 1.1rem;">
       لا تترك نموك للصدفة. استخدم نظام تقييم خبراء Creatorhubpro المبني على مقاييس صناعة المحتوى المعتمدة للحصول على تقرير مفصل عن أداء حسابك وكيفية تحويل المشاهدات إلى أرباح.
      </p>
      <p class="hero-v2-sub en-text" style="display:none; max-width: 650px; margin: 0 auto 40px; color: rgba(255,255,255,0.7); font-size: 1.1rem;">
        Don't grow by accident. Leverage Creatorhubpro’s industry-backed expert audit to analyze your performance and transform your views into revenue.
      </p>

      <div class="hero-v2-cta" style="justify-content: center; gap: 15px;">
        <a href="/account-analysis" class="btn btn-hero-primary ar-text" style="padding: 18px 40px; font-size: 1.1rem;">
          <span class="btn-glow-ring"></span>
          <i class="fas fa-bolt"></i>
          <span>ابدأ الفحص المجاني الآن</span>
        </a>
        <a href="/account-analysis" class="btn btn-hero-primary en-text" style="display:none; padding: 18px 40px; font-size: 1.1rem;">
          <span class="btn-glow-ring"></span>
          <i class="fas fa-bolt"></i>
          <span>Start Free Scan Now</span>
        </a>
      </div>

      <div style="margin-top: 30px; display: flex; align-items: center; justify-content: center; gap: 15px; opacity: 0.6;">
         <span style="height: 1px; width: 40px; background: linear-gradient(to right, transparent, white);"></span>
         <p class="hero-cta-note ar-text" style="margin: 0;">
           <i class="fas fa-check-circle" style="color: #10b981;"></i> بدون تسجيل دخول
         </p>
         <p class="hero-cta-note en-text" style="display:none; margin: 0;">
           <i class="fas fa-check-circle" style="color: #10b981;"></i> No Login Required
         </p>
         <span style="height: 1px; width: 40px; background: linear-gradient(to left, transparent, white);"></span>
      </div>
    </div>
    
  </div>
</section>


      <!-- ══════════════════════════════════
           PART 4 — PACKAGE BRIDGE
      ══════════════════════════════════ -->
      <div class="brd-pkg-bridge animate-on-scroll">

        <p class="brd-pkg-bridge-intro ar-text">
          بناءً على احتياجك… اختر النظام المناسب لك
        </p>
        <p class="brd-pkg-bridge-intro en-text" style="display:none">
          Based on your need… choose the right system for you
        </p>

        <div class="brd-pkg-previews">

          <!-- START -->
          <a href="#packages" class="brd-pkg-preview brd-pkg-start">
            <div class="brd-pkg-prev-icon"><i class="fas fa-seedling"></i></div>
            <div>
              <strong>START</strong>
              <span class="brd-pkg-prev-sub ar-text">بداية منظمة لصناعة محتوى احترافي</span>
              <span class="brd-pkg-prev-sub en-text" style="display:none">An organized start for professional content</span>
            </div>
            <i class="fas fa-arrow-left brd-pkg-arr ar-text"></i>
            <i class="fas fa-arrow-right brd-pkg-arr en-text" style="display:none"></i>
          </a>

          <!-- GROWTH — featured -->
          <a href="#packages" class="brd-pkg-preview brd-pkg-growth brd-pkg-featured">
            <div class="brd-pkg-featured-badge ar-text">🔥 الأكثر طلبًا</div>
            <div class="brd-pkg-featured-badge en-text" style="display:none">🔥 Most Popular</div>
            <div class="brd-pkg-prev-icon brd-icon-fire"><i class="fas fa-rocket"></i></div>
            <div>
              <strong>GROWTH</strong>
              <span class="brd-pkg-prev-sub ar-text">النظام الأكثر طلبًا لبناء نمو فعلي</span>
              <span class="brd-pkg-prev-sub en-text" style="display:none">The most-requested system for real growth</span>
            </div>
            <i class="fas fa-arrow-left brd-pkg-arr ar-text"></i>
            <i class="fas fa-arrow-right brd-pkg-arr en-text" style="display:none"></i>
          </a>

          <!-- SCALE -->
          <a href="#packages" class="brd-pkg-preview brd-pkg-scale">
            <div class="brd-pkg-prev-icon brd-icon-crown"><i class="fas fa-crown"></i></div>
            <div>
              <strong>SCALE</strong>
              <span class="brd-pkg-prev-sub ar-text">نظام كامل بدون حدود للنمو</span>
              <span class="brd-pkg-prev-sub en-text" style="display:none">Full unlimited growth system</span>
            </div>
            <i class="fas fa-arrow-left brd-pkg-arr ar-text"></i>
            <i class="fas fa-arrow-right brd-pkg-arr en-text" style="display:none"></i>
          </a>

        </div>
      </div>
      <!-- /brd-pkg-bridge -->

      <!-- ══════════════════════════════════
           PART 5 — FINAL PUSH CTA
      ══════════════════════════════════ -->
      <div class="brd-final-push animate-on-scroll">
        <div class="brd-final-push-inner">
          <div class="brd-final-bg-glow"></div>

          <p class="brd-fomo-line ar-text">
            ابدأ الآن… أو استمر في التخمين
          </p>
          <p class="brd-fomo-line en-text" style="display:none">
            Start now… or keep guessing
          </p>

          <h3 class="brd-final-title ar-text">
            احجز مكالمتك الاستكشافية الآن
          </h3>
          <h3 class="brd-final-title en-text" style="display:none">
            Book Your Discovery Call Now
          </h3>

          <p class="brd-final-sub ar-text">
            جلسة مجانية مع البروفيسور لتحديد اتجاهك الصحيح
          </p>
          <p class="brd-final-sub en-text" style="display:none">
            A free session with the Professor to define your right direction
          </p>

          <div class="brd-final-btns">
            <a href="#form-section" class="btn btn-primary brd-final-cta ar-text">
              <i class="fas fa-rocket"></i> احجز مكالمتك الاستكشافية — مجاناً
            </a>
            <a href="#form-section" class="btn btn-primary brd-final-cta en-text" style="display:none">
              <i class="fas fa-rocket"></i> Book Your Discovery Call — Free
            </a>
            <a href="#packages" class="btn brd-btn-packages ar-text">
              <i class="fas fa-layer-group"></i> شوف الباقات أولاً
            </a>
            <a href="#packages" class="btn brd-btn-packages en-text" style="display:none">
              <i class="fas fa-layer-group"></i> View Packages First
            </a>
          </div>

          <div class="brd-final-trust-row ar-text">
            <span><i class="fas fa-shield-halved"></i> جلسة مجانية بالكامل</span>
            <span><i class="fas fa-clock"></i> مدتها 30 دقيقة فقط</span>
            <span><i class="fas fa-ban"></i> بدون أي التزام</span>
          </div>
          <div class="brd-final-trust-row en-text" style="display:none">
            <span><i class="fas fa-shield-halved"></i> 100% Free</span>
            <span><i class="fas fa-clock"></i> Only 30 minutes</span>
            <span><i class="fas fa-ban"></i> Zero commitment</span>
          </div>

        </div>
      </div>
      <!-- /brd-final-push -->

    </div>
  </section>
  <!-- /bridge-section -->

  <!-- MOBILE MID-CTA #2 — after how it works, before comparison -->
  <div class="mobile-cta-strip">
    <a href="https://wa.me/201105449828?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D8%8C+%D8%A3%D8%B1%D9%8A%D8%AF+%D9%85%D8%B9%D8%B1%D9%81%D8%A9+%D8%A7%D9%84%D9%85%D8%B2%D9%8A%D8%AF" target="_blank" rel="noopener" class="wa-strip ar-text">
      <i class="fab fa-whatsapp"></i> اسألنا على واتساب الآن
    </a>
    <a href="https://wa.me/201105449828" target="_blank" rel="noopener" class="wa-strip en-text" style="display:none">
      <i class="fab fa-whatsapp"></i> Ask us on WhatsApp
    </a>
  </div>

  <!-- ============================
       WHY US — COMPARISON
  ============================= -->
  <section class="comparison-section section-padding" id="why">
    <div class="container">

      <!-- ── Urgency label ── -->
      <div class="section-tag cmp-tag-danger ar-text">القرار الفاصل</div>
      <div class="section-tag cmp-tag-danger en-text" style="display:none">THE DECISIVE CHOICE</div>

      <!-- ── Main header ── -->
      <h2 class="section-title ar-text">
        أنت بتختار <span class="gradient-text">إيه</span> فعلاً؟
      </h2>
      <h2 class="section-title en-text" style="display:none">
        What Are You <span class="gradient-text">Really</span> Choosing?
      </h2>

      <!-- ── Subtext ── -->
      <p class="section-subtitle cmp-subtext ar-text">
        مش كل مونتاج واحد… <strong>الفرق هنا بيحدد نتيجتك</strong>
      </p>
      <p class="section-subtitle cmp-subtext en-text" style="display:none">
        Not all editing is equal… <strong>this difference defines your outcome</strong>
      </p>

      <!-- ── Reality pill ── -->
      <div class="cmp-reality-bar animate-on-scroll">
        <span class="cmp-reality-dot"></span>
        <p class="ar-text">الواقع: معظم الناس بتختار الأرخص… وبتدفع تمن ده من وقتها ونتايجها</p>
        <p class="en-text" style="display:none">Reality: most people choose the cheapest… and pay the price with their time and results</p>
      </div>

      <!-- ── Cards grid ── -->
      <div class="comparison-grid cmp-grid-v2">

        <!-- ═══ RED SIDE — OTHERS ═══ -->
        <div class="compare-card compare-others cmp-card-v2 cmp-card-pain animate-on-scroll">

          <!-- Danger ribbon -->
          <div class="cmp-ribbon cmp-ribbon-danger ar-text">
            <i class="fas fa-triangle-exclamation"></i> الخطر
          </div>
          <div class="cmp-ribbon cmp-ribbon-danger en-text" style="display:none">
            <i class="fas fa-triangle-exclamation"></i> Danger
          </div>

          <div class="compare-header cmp-header-pain">
            <div class="cmp-header-icon cmp-icon-danger">
              <i class="fas fa-scissors"></i>
            </div>
            <div>
              <h3 class="cmp-title-pain ar-text">مونتاج بدون نظام</h3>
              <h3 class="cmp-title-pain en-text" style="display:none">Editing Without a System</h3>
              <p class="cmp-pos-line cmp-pos-danger ar-text">شكل حلو… بدون نتيجة</p>
              <p class="cmp-pos-line cmp-pos-danger en-text" style="display:none">Looks good… delivers nothing</p>
            </div>
          </div>

          <ul class="compare-list cmp-list-v2 ar-text">
            <li>
              <span class="cmp-x-icon"><i class="fas fa-xmark"></i></span>
              <div>
                <strong>فيديوهات شكلها كويس… بس بدون هدف</strong>
                <span>بتتعب في المحتوى ومفيش حد بيوصله</span>
              </div>
            </li>
            <li>
              <span class="cmp-x-icon"><i class="fas fa-xmark"></i></span>
              <div>
                <strong>بتنزل محتوى ومفيش تفاعل حقيقي</strong>
                <span>الخوارزمية مش بتكافئك لأن المحتوى مش محسوب</span>
              </div>
            </li>
            <li>
              <span class="cmp-x-icon"><i class="fas fa-xmark"></i></span>
              <div>
                <strong>مفيش حد يقولك تعمل إيه</strong>
                <span>بتجرب وبتغلط وبتخسر وقت بدون توجيه</span>
              </div>
            </li>
            <li>
              <span class="cmp-x-icon"><i class="fas fa-xmark"></i></span>
              <div>
                <strong>بتضيع وقت ومجهود بدون نتيجة واضحة</strong>
                <span>شهور من الشغل ومفيش عملاء ولا نمو</span>
              </div>
            </li>
            <li>
              <span class="cmp-x-icon"><i class="fas fa-xmark"></i></span>
              <div>
                <strong>كل فيديو منفصل… بدون خطة</strong>
                <span>مفيش بناء تراكمي — كل مرة من الأول</span>
              </div>
            </li>
          </ul>
          <ul class="compare-list cmp-list-v2 en-text" style="display:none">
            <li>
              <span class="cmp-x-icon"><i class="fas fa-xmark"></i></span>
              <div>
                <strong>Videos look nice… but have no goal</strong>
                <span>You work hard on content but no one sees it</span>
              </div>
            </li>
            <li>
              <span class="cmp-x-icon"><i class="fas fa-xmark"></i></span>
              <div>
                <strong>You post content but get no real engagement</strong>
                <span>The algorithm doesn't reward unstrategic content</span>
              </div>
            </li>
            <li>
              <span class="cmp-x-icon"><i class="fas fa-xmark"></i></span>
              <div>
                <strong>No one tells you what to do</strong>
                <span>You try, fail, and waste time without guidance</span>
              </div>
            </li>
            <li>
              <span class="cmp-x-icon"><i class="fas fa-xmark"></i></span>
              <div>
                <strong>Wasting time and effort with no clear result</strong>
                <span>Months of work — no clients, no growth</span>
              </div>
            </li>
            <li>
              <span class="cmp-x-icon"><i class="fas fa-xmark"></i></span>
              <div>
                <strong>Every video is separate… no plan</strong>
                <span>No compounding — you restart every time</span>
              </div>
            </li>
          </ul>

          <!-- Emotional closer -->
          <div class="cmp-closer cmp-closer-pain ar-text">
            <i class="fas fa-hourglass-half"></i>
            بتشتغل كتير… بدون ما توصل
          </div>
          <div class="cmp-closer cmp-closer-pain en-text" style="display:none">
            <i class="fas fa-hourglass-half"></i>
            Working hard… never arriving
          </div>

        </div>

        <!-- ═══ CENTER VS ═══ -->
        <div class="compare-vs cmp-vs-v2">
          <div class="cmp-vs-inner">
            <span class="cmp-vs-text">VS</span>
            <p class="ar-text">الفرق مش في الفيديو…<br/><strong>الفرق في النتيجة</strong></p>
            <p class="en-text" style="display:none">The difference isn't in the video…<br/><strong>it's in the result</strong></p>
          </div>
        </div>

        <!-- ═══ GREEN SIDE — CREATORPRO ═══ -->
        <div class="compare-card compare-us cmp-card-v2 cmp-card-win animate-on-scroll">

          <!-- Winner ribbon -->
          <div class="cmp-ribbon cmp-ribbon-win ar-text">
            <i class="fas fa-crown"></i> الاختيار الذكي
          </div>
          <div class="cmp-ribbon cmp-ribbon-win en-text" style="display:none">
            <i class="fas fa-crown"></i> The Smart Choice
          </div>

          <div class="compare-header cmp-header-win">
            <div class="cmp-header-icon cmp-icon-win">
              <i class="fas fa-rocket"></i>
            </div>
            <div>
              <h3 class="cmp-title-win">CreatorHubPro System</h3>
              <p class="cmp-pos-line cmp-pos-win ar-text">مش خدمة مونتاج فقط… ده نظام بيشتغل معاك</p>
              <p class="cmp-pos-line cmp-pos-win en-text" style="display:none">Not a service… a system that works with you</p>
            </div>
          </div>

          <ul class="compare-list cmp-list-v2 ar-text">
            <li>
              <span class="cmp-check-icon"><i class="fas fa-check"></i></span>
              <div>
                <strong>محتوى مبني على هدف واضح (مش عشوائي)</strong>
                <span>كل فيديو بيتعمل عشان نتيجة محددة مش عشان الحجم</span>
              </div>
            </li>
            <li>
              <span class="cmp-check-icon"><i class="fas fa-check"></i></span>
              <div>
                <strong>كل فيديو ليه دور في زيادة التفاعل أو المبيعات</strong>
                <span>مش بنعمل محتوى — بنبني مسار بيوصّل للعميل</span>
              </div>
            </li>
            <li>
              <span class="cmp-check-icon"><i class="fas fa-check"></i></span>
              <div>
                <strong>جلسات توجيه تخليك عارف تعمل إيه كل مرة</strong>
                <span>مع البروفيسور مباشرة — مش بتخمّن ومش بتجرب لوحدك</span>
              </div>
            </li>
            <li>
              <span class="cmp-check-icon"><i class="fas fa-check"></i></span>
              <div>
                <strong>متابعة مستمرة لحد ما تشوف نتيجة فعلية</strong>
                <span>إحنا معاك في كل خطوة — مش بنسلّم وبنمشي</span>
              </div>
            </li>
            <li>
              <span class="cmp-check-icon"><i class="fas fa-check"></i></span>
              <div>
                <strong>نظام قابل للقياس والتطوير</strong>
                <span>بنحلل الأداء ونطور الاستراتيجية مع كل فيديو</span>
              </div>
            </li>
          </ul>
          <ul class="compare-list cmp-list-v2 en-text" style="display:none">
            <li>
              <span class="cmp-check-icon"><i class="fas fa-check"></i></span>
              <div>
                <strong>Content built on a clear goal (not random)</strong>
                <span>Every video is made for a specific result, not just volume</span>
              </div>
            </li>
            <li>
              <span class="cmp-check-icon"><i class="fas fa-check"></i></span>
              <div>
                <strong>Every video plays a role in growing engagement or sales</strong>
                <span>We don't make content — we build a path to your client</span>
              </div>
            </li>
            <li>
              <span class="cmp-check-icon"><i class="fas fa-check"></i></span>
              <div>
                <strong>Coaching sessions so you know exactly what to do every time</strong>
                <span>Directly with the Professor — no guessing, no going it alone</span>
              </div>
            </li>
            <li>
              <span class="cmp-check-icon"><i class="fas fa-check"></i></span>
              <div>
                <strong>Continuous follow-up until you see real results</strong>
                <span>We're with you at every step — we don't deliver and disappear</span>
              </div>
            </li>
            <li>
              <span class="cmp-check-icon"><i class="fas fa-check"></i></span>
              <div>
                <strong>A measurable, scalable system</strong>
                <span>We analyse performance and evolve strategy with every video</span>
              </div>
            </li>
          </ul>

          <!-- Emotional closer -->
          <div class="cmp-closer cmp-closer-win ar-text">
            <i class="fas fa-lightbulb"></i>
            بتشتغل وأنت فاهم… مش بتجرب
          </div>
          <div class="cmp-closer cmp-closer-win en-text" style="display:none">
            <i class="fas fa-lightbulb"></i>
            You work knowing exactly why… not just trying
          </div>

          <!-- CTA inside card -->
          <a href="#form-section" class="btn btn-primary cmp-card-cta ar-text">
            <i class="fas fa-arrow-left"></i> ابدأ مع CreatorHubPro
          </a>
          <a href="#form-section" class="btn btn-primary cmp-card-cta en-text" style="display:none">
            <i class="fas fa-arrow-right"></i> Start with CreatorHubPro
          </a>

        </div>
      </div>

      <!-- ── Micro urgency bar ── -->
      <div class="cmp-urgency-bar animate-on-scroll">
        <i class="fas fa-bolt cmp-urgency-icon"></i>
        <p class="ar-text">
          الاختيار ده هو الفرق بين محتوى <strong>بيضيع وقتك</strong>…
          ومحتوى <strong>بيجيب لك عملاء</strong>
        </p>
        <p class="en-text" style="display:none">
          This choice is the difference between content that <strong>wastes your time</strong>…
          and content that <strong>brings you clients</strong>
        </p>
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

        <!-- ══════ START PLAN V2 — CONVERSION OPTIMISED ══════ -->
        <div class="package-card pkg-start-v2 animate-on-scroll">

          <!-- Speed Badge -->
          <div class="pkg-speed-badge ar-text">
            <i class="fas fa-bolt"></i> أسرع طريق للبداية الصحيحة
          </div>
          <div class="pkg-speed-badge en-text" style="display:none">
            <i class="fas fa-bolt"></i> Fastest Way to Start Without Confusion
          </div>

          <!-- Plan Label -->
          <div class="pkg-plan-label pkg-plan-label-blue ar-text">باقة الانطلاقة</div>
          <div class="pkg-plan-label pkg-plan-label-blue en-text" style="display:none">Start Plan</div>

          <!-- Header -->
          <div class="pkg-header">
            <div class="pkg-icon pkg-icon-blue"><i class="fas fa-seedling"></i></div>
            <h3>START</h3>
            <p class="pkg-en-subtitle ar-text">ابدأ بثقة. أنتج بذكاء.</p>
            <p class="pkg-en-subtitle en-text" style="display:none">Start Smart. Create with Confidence.</p>
          </div>

          <!-- Price -->
          <div class="pkg-price-wrap">
            <div class="pkg-price">
              <span class="price-num">3,990 لفترة محدودة</span>
              <span class="price-currency ar-text">جنيه</span>
              <span class="price-currency en-text" style="display:none">EGP</span>
            </div>
            <span class="price-period ar-text">/ شهريًا</span>
            <span class="price-period en-text" style="display:none">/ month</span>
          </div>

          <!-- Sub Description -->
          <p class="pkg-position pkg-start-desc ar-text">
            مش محتاج تبدأ من الصفر — كل اللي تحتاجه جاهز قدامك
          </p>
          <p class="pkg-position pkg-start-desc en-text" style="display:none">
            No more guessing. Everything you need to go from zero to content that works — fast.
          </p>

          <div class="pkg-divider pkg-divider-blue"></div>

          <!-- Features — Arabic only -->
          <ul class="pkg-features ar-text">
            <li><i class="fas fa-check"></i> <span>10 فيديوهات قصيرة (Reels / Shorts) بمونتاج احترافي</span></li>
            <li><i class="fas fa-check"></i> <span>10 بوسترات سوشيال ميديا بهويتك البصرية</span></li>
            <li><i class="fas fa-check"></i> <span>تحسين جودة الصوت والصورة</span></li>
            <li><i class="fas fa-check"></i> <span>تسليم سريع ومنظم</span></li>
            <li><i class="fas fa-check"></i> <span>مراجعة احترافية بعد كل فيديو </span></li>
            <li><i class="fas fa-check"></i> <span>نظام متابعة وتواصل متكامل</span></li>
            <li><i class="fas fa-check"></i> <span>خطة المحتوى الأساسية (Excel + خطة محتوى الشهر الأول)</span></li>
            <li><i class="fas fa-check"></i> <span>كتيب 100 Hook جاهز مجرّب تقدر تستخدمه فورا حسب نوع محتواك</span></li>
            <li><i class="fas fa-check"></i> <span>كابشن جاهزة لمدة شهر تقدر تستخدمها وتعدّل عليها بسهولة</span></li>
            <li><i class="fas fa-check"></i> <span>نموذج فيديو جاهز يخلّيك عارف تقول إيه في أول 3 ثواني، تكمل بإيه، وتختم إزاي (مقدمة / جسم / CTA)</span></li>
            <li><i class="fas fa-check"></i> <span>جدول نشر جاهز ومنظم</span></li>
          </ul>
          <ul class="pkg-features en-text" style="display:none">
            <li><i class="fas fa-check"></i> <span>10 Short Videos (Reels / Shorts) — Pro Editing</span></li>
            <li><i class="fas fa-check"></i> <span>10 Social Media Posters — Creative Design</span></li>
            <li><i class="fas fa-check"></i> <span>Audio & Visual Quality Enhancement</span></li>
            <li><i class="fas fa-check"></i> <span>Fast & Organized Delivery</span></li>
            <li><i class="fas fa-check"></i> <span>Professional review for each video</span></li>
            <li><i class="fas fa-check"></i> <span>Full communication and follow-up system</span></li>
            <li><i class="fas fa-check"></i> <span>Content Starter Blueprint (PDF + Month 1 Plan)</span></li>
            <li><i class="fas fa-check"></i> <span>20 Ready-to-Use Hook Templates</span></li>
            <li><i class="fas fa-check"></i> <span>Caption Framework</span></li>
            <li><i class="fas fa-check"></i> <span>Ready Video Structure (Intro / Body / CTA)</span></li>
            <li><i class="fas fa-check"></i> <span>Monthly Content Calendar (Ready to Use)</span></li>
          </ul>

          <!-- Value line -->
          <div class="pkg-value-line pkg-value-line-blue ar-text">
            <i class="fas fa-quote-right"></i> بدون تجربة مسبقة — بدون تشتت — فقط ابدأ
          </div>
          <div class="pkg-value-line pkg-value-line-blue en-text" style="display:none">
            <i class="fas fa-quote-left"></i> No Experience Needed — No Confusion — Just Start
          </div>

          <!-- CTA — Arabic only -->
          <a href="#form-section" class="btn btn-pkg-start ar-text">
            <i class="fas fa-bolt"></i> ابدأ رحلتك — كل الأدوات جاهزة
          </a>
          <a href="#form-section" class="btn btn-pkg-start en-text" style="display:none">
            <i class="fas fa-bolt"></i> Get Started — Everything is Ready
          </a>

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
              <span class="price-num">7,990 لفترة محدودة</span>
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
            <li><i class="fas fa-check"></i> <span>توصيات احترافية مضمونة للتطور</span></li>
            <li><i class="fas fa-check"></i> <span>تحديثات لأحدث تطورات الخوارزميات</span></li>
          </ul>
          <ul class="pkg-features en-text" style="display:none">
            <li><i class="fas fa-check"></i> <span>25 Short Videos — Advanced Pro Editing</span></li>
            <li><i class="fas fa-check"></i> <span>25 Social Media Posters — Pro Design</span></li>
            <li><i class="fas fa-check"></i> <span>25 Professional Video Thumbnails</span></li>
            <li><i class="fas fa-check"></i> <span>Hook Optimisation & Watch-Rate Boost</span></li>
            <li><i class="fas fa-check"></i> <span>Professional Guaranteed Growth Tips</span></li>
            <li><i class="fas fa-check"></i> <span>Latest Algorithm Updates & Insights</span></li>
          </ul>

          <!-- Professor USP Block -->
          <div class="pkg-usp-block">
            <div class="pkg-block-title ar-text"><i class="fas fa-graduation-cap"></i> مع البروفيسور</div>
            <div class="pkg-block-title en-text" style="display:none"><i class="fas fa-graduation-cap"></i> With the Professor — Exclusive USP</div>
            <ul class="pkg-features pkg-features-usp ar-text">
              <li><i class="fas fa-star"></i> <span>بثوث تعليمية مباشرة مع البروفيسور</span></li>
              <li><i class="fas fa-star"></i> <span>جلسات استشارية منتظمة لتطوير المحتوى</span></li>
              <li><i class="fas fa-star"></i> <span>رد مستمر على الاستفسارات والأسئلة</span></li>
              <li><i class="fas fa-star"></i> <span>توجيه مباشر لزيادة المبيعات والنمو</span></li>
              <li><i class="fas fa-star"></i> <span>Content Strategy Call مع البروفيسور</span></li>
              <li><i class="fas fa-star"></i> <span>تحليل حساب العميل (Audit)</span></li>
              <li><i class="fas fa-star"></i> <span>Competitor Breakdown</span></li>
              <li><i class="fas fa-star"></i> <span>Hook Optimization System</span></li>
              <li><i class="fas fa-star"></i> <span>Caption Writing + CTA Optimization</span></li>
              <li><i class="fas fa-star"></i> <span>A/B Testing للأفكار</span></li>
              <li><i class="fas fa-star"></i> <span>Weekly Performance Insights</span></li>
            </ul>
            <ul class="pkg-features pkg-features-usp en-text" style="display:none">
              <li><i class="fas fa-star"></i> <span>Live Educational Sessions with the Professor</span></li>
              <li><i class="fas fa-star"></i> <span>Regular Consulting Sessions for Content Growth</span></li>
              <li><i class="fas fa-star"></i> <span>Ongoing Q&amp;A and Continuous Support</span></li>
              <li><i class="fas fa-star"></i> <span>Direct Guidance to Boost Sales &amp; Reach</span></li>
              <li><i class="fas fa-star"></i> <span>Content Strategy Call with the Professor</span></li>
              <li><i class="fas fa-star"></i> <span>Account Audit &amp; Deep Analysis</span></li>
              <li><i class="fas fa-star"></i> <span>Competitor Breakdown</span></li>
              <li><i class="fas fa-star"></i> <span>Hook Optimization System</span></li>
              <li><i class="fas fa-star"></i> <span>Caption Writing + CTA Optimization</span></li>
              <li><i class="fas fa-star"></i> <span>A/B Testing for Content Ideas</span></li>
              <li><i class="fas fa-star"></i> <span>Weekly Performance Insights</span></li>
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

          <div class="pkg-includes-badge ar-text">
            <i class="fas fa-layer-group"></i> جميع مميزات باقة النمو وأكثر
          </div>
          <div class="pkg-includes-badge en-text" style="display:none">
            <i class="fas fa-layer-group"></i> All Growth Plan features &amp; more
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
            <li><i class="fas fa-check"></i> <span>مونتاج مقاطع يوتيوب</span></li>
            <li><i class="fas fa-check"></i> <span>عدد غير محدود من البوسترات الاحترافية</span></li>
            <li><i class="fas fa-check"></i> <span>عدد غير محدود من أغلفة الفيديو (Thumbnails)</span></li>
            <li><i class="fas fa-check"></i> <span>تعديلات مرنة بدون قيود</span></li>
            <li><i class="fas fa-check"></i> <span>أولوية تنفيذ وتسليم فائق السرعة</span></li>
          </ul>
          <ul class="pkg-features en-text" style="display:none">
            <li><i class="fas fa-check"></i> <span>Unlimited Videos — High-End Pro Editing</span></li>
            <li><i class="fas fa-check"></i> <span>YouTube Long-Form Video Editing</span></li>
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
              <li><i class="fas fa-star"></i> <span>سكربتات تناسب محتواك</span></li>
              <li><i class="fas fa-star"></i> <span>أفكار إبداعية لمقاطعك</span></li>
              <li><i class="fas fa-star"></i> <span>أولوية للانضمام لمجتمع UGC Creators</span></li>
              <li><i class="fas fa-star"></i> <span>Content Direction كامل (مش بس مونتاج)</span></li>
              <li><i class="fas fa-star"></i> <span>Viral Content Playbook</span></li>
              <li><i class="fas fa-star"></i> <span>Priority Editing Queue (سرعة أعلى)</span></li>
              <li><i class="fas fa-star"></i> <span>Trend Tracking System</span></li>
              <li><i class="fas fa-star"></i> <span>Performance Optimization مستمر</span></li>
              <li><i class="fas fa-star"></i> <span>Ideas Pipeline جاهزة أسبوعياً</span></li>
            </ul>
            <ul class="pkg-features pkg-features-usp-red en-text" style="display:none">
              <li><i class="fas fa-star"></i> <span>Advanced Strategy Sessions with the Professor</span></li>
              <li><i class="fas fa-star"></i> <span>Full Custom Content System Built for You</span></li>
              <li><i class="fas fa-star"></i> <span>Performance Analysis &amp; Continuous Optimisation</span></li>
              <li><i class="fas fa-star"></i> <span>Custom Scripts Tailored to Your Content</span></li>
              <li><i class="fas fa-star"></i> <span>Custom Content Ideas for Your Niche &amp; Audience</span></li>
              <li><i class="fas fa-star"></i> <span>Priority for UGC Creators Community</span></li>
              <li><i class="fas fa-star"></i> <span>Full Content Direction (not just editing)</span></li>
              <li><i class="fas fa-star"></i> <span>Viral Content Playbook</span></li>
              <li><i class="fas fa-star"></i> <span>Priority Editing Queue (faster turnaround)</span></li>
              <li><i class="fas fa-star"></i> <span>Trend Tracking System</span></li>
              <li><i class="fas fa-star"></i> <span>Continuous Performance Optimization</span></li>
              <li><i class="fas fa-star"></i> <span>Weekly Ready Ideas Pipeline</span></li>
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
    <div class="container" style="text-align: center; padding-top: 40px;">
      <p class="ar-text" style="color: rgba(255,255,255,0.6)">
          غير متأكد من الباقة المناسبة؟ 
          <a href="/account-analysis" style="color: #a78bfa; text-decoration: underline; margin-right: 8px;">جرب أداة التحليل أولاً</a>
      </p>
      <p class="en-text" style="display:none; color: rgba(255,255,255,0.6)">
          Not sure which package fits? 
          <a href="/account-analysis" style="color: #a78bfa; text-decoration: underline; margin-left: 8px;">Try the analysis tool first</a>
      </p>
  </div>
  </section>

  <!-- MOBILE MID-CTA #3 — after packages, before scarcity -->
  <div class="mobile-cta-strip">
    <a href="#form-section" class="ar-text">
      <i class="fas fa-calendar-check"></i> احجز مكالمتك المجانية الآن
    </a>
    <a href="#form-section" class="en-text" style="display:none">
      <i class="fas fa-calendar-check"></i> Book Your Free Call Now
    </a>
  </div>

  <!-- ============================
       SCARCITY / CAPACITY MODULE
  ============================= -->
  <section class="scarcity-section section-padding" id="scarcity">
    <div class="container">

      <!-- ── Module wrapper (entrance animation target) ── -->
      <div class="scr-module animate-on-scroll" id="scr-module">

        <!-- ══ TOP: label + live dot ══ -->
        <div class="scr-top-bar">
          <div class="scr-live-pill ar-text">
            <span class="scr-live-dot" id="scr-live-dot"></span>
            <span id="scr-live-label-ar">متاح الانضمام حاليًا</span>
          </div>
          <div class="scr-live-pill en-text" style="display:none">
            <span class="scr-live-dot" id="scr-live-dot-en"></span>
            <span id="scr-live-label-en">Open for enrollment</span>
          </div>
          <div class="scr-week-label ar-text">هذا الأسبوع</div>
          <div class="scr-week-label en-text" style="display:none">This week</div>
        </div>

        <!-- ══ MAIN BODY ══ -->
        <div class="scr-body">

          <!-- Left: numbers + text -->
          <div class="scr-left">
            <div class="scr-count-wrap ar-text">
              <span class="scr-num-current" id="scr-current">0</span>
              <span class="scr-num-sep">/</span>
              <span class="scr-num-max" id="scr-max">20</span>
              <span class="scr-num-unit">عميل</span>
            </div>
            <div class="scr-count-wrap en-text" style="display:none">
              <span class="scr-num-current" id="scr-current-en">0</span>
              <span class="scr-num-sep">/</span>
              <span class="scr-num-max">20</span>
              <span class="scr-num-unit">clients</span>
            </div>
            <p class="scr-sub ar-text">عدد العملاء الحاليين هذا الأسبوع</p>
            <p class="scr-sub en-text" style="display:none">Current clients enrolled this week</p>

            <!-- Spots remaining badge -->
            <div class="scr-spots-badge" id="scr-spots-badge">
              <i class="fas fa-circle-dot scr-badge-icon" id="scr-badge-icon"></i>
              <span id="scr-spots-text-ar" class="ar-text">متبقي 4 أماكن فقط</span>
              <span id="scr-spots-text-en" class="en-text" style="display:none">Only 4 spots remaining</span>
            </div>
          </div>

          <!-- Right: progress bar -->
          <div class="scr-right">
            <div class="scr-bar-label ar-text">
              <span>نسبة الامتلاء الحالية</span>
              <span class="scr-pct-text" id="scr-pct">0%</span>
            </div>
            <div class="scr-bar-label en-text" style="display:none">
              <span>Current capacity</span>
              <span class="scr-pct-text" id="scr-pct-en">0%</span>
            </div>
            <div class="scr-bar-track">
              <div class="scr-bar-fill" id="scr-bar-fill"></div>
              <!-- Threshold markers -->
              <div class="scr-marker" style="right:25%"><span>25%</span></div>
              <div class="scr-marker" style="right:50%"><span>50%</span></div>
              <div class="scr-marker" style="right:75%"><span>75%</span></div>
            </div>
            <p class="scr-quality-note ar-text">
              <i class="fas fa-shield-halved"></i>
              نحدد عدد العملاء للحفاظ على جودة التنفيذ والمتابعة
            </p>
            <p class="scr-quality-note en-text" style="display:none">
              <i class="fas fa-shield-halved"></i>
              We limit client slots to protect quality and follow-up standards
            </p>
          </div>

        </div>

        <!-- ══ PROFESSOR NOTE ══ -->
        <div class="scr-prof-note ar-text">
          <i class="fas fa-graduation-cap"></i>
          جلسات البروفيسور محدودة أسبوعيًا لضمان الجودة
        </div>
        <div class="scr-prof-note en-text" style="display:none">
          <i class="fas fa-graduation-cap"></i>
          Professor sessions are limited weekly to ensure quality
        </div>

        <!-- ══ CTA ROW ══ -->
        <div class="scr-cta-row" id="scr-cta-normal">
          <a href="#form-section" class="btn btn-primary scr-cta-btn ar-text">
            <i class="fas fa-lock-open"></i> احجز مكانك الآن
          </a>
          <a href="#form-section" class="btn btn-primary scr-cta-btn en-text" style="display:none">
            <i class="fas fa-lock-open"></i> Reserve Your Spot Now
          </a>
          <p class="scr-cta-micro ar-text">قبل ما تمتلئ الأماكن — لا تضيع الفرصة</p>
          <p class="scr-cta-micro en-text" style="display:none">Before spots fill up — don't miss your chance</p>
        </div>

        <!-- ══ WAITLIST ROW (shown when full) ══ -->
        <div class="scr-cta-row scr-waitlist-row" id="scr-cta-waitlist" style="display:none">
          <div class="scr-full-badge ar-text">
            <i class="fas fa-hourglass-end"></i>
            تم اكتمال العدد الحالي
          </div>
          <div class="scr-full-badge en-text" style="display:none">
            <i class="fas fa-hourglass-end"></i>
            Current batch is full
          </div>
          <p class="scr-full-sub ar-text">يمكنك الانضمام لقائمة الانتظار أو الحجز للدفعة القادمة</p>
          <p class="scr-full-sub en-text" style="display:none">You can join the waitlist or book for the next batch</p>
          <a href="https://wa.me/201105449828?text=مرحبًا%2C%20أريد%20الانضمام%20لقائمة%20الانتظار%20للدفعة%20القادمة"
             target="_blank" class="btn btn-primary scr-cta-btn ar-text">
            <i class="fas fa-clock"></i> احجز مكانك في الدفعة القادمة
          </a>
          <a href="https://wa.me/201105449828?text=Hello%2C%20I%20want%20to%20join%20the%20waitlist%20for%20the%20next%20batch"
             target="_blank" class="btn btn-primary scr-cta-btn en-text" style="display:none">
            <i class="fas fa-clock"></i> Join Next Batch Waitlist
          </a>
        </div>

      </div>
      <!-- /scr-module -->

    </div>
  </section>

  <!-- ============================
       SOCIAL PROOF / TESTIMONIALS
  ============================= -->
  <section class="testimonials-section section-padding" id="testimonials">
    <div class="container">

      <div class="section-tag ar-text">آراء حقيقية</div>
      <div class="section-tag en-text" style="display:none">REAL REVIEWS</div>

      <!-- Trust counter -->
      <div class="testi-trust-bar animate-on-scroll">
        <div class="testi-trust-inner">
          <span class="testi-trust-icon"><i class="fas fa-shield-alt"></i></span>
          <p class="ar-text">أكثر من <strong>250+</strong> صانع محتوى وبيزنس وثقوا بنا وحققوا نتائج حقيقية</p>
          <p class="en-text" style="display:none">Over <strong>250+</strong> content creators and businesses trusted us and got real results</p>
        </div>
      </div>

      <h2 class="section-title ar-text">ماذا قالوا عن <span class="gradient-text">التجربة؟</span></h2>
      <h2 class="section-title en-text" style="display:none">What People Are <span class="gradient-text">Saying</span></h2>

      <!-- ── TIER 1: مبتدئين ── -->
      <div class="testi-tier-label ar-text"><i class="fas fa-seedling"></i> المبتدئون — بداية الرحلة</div>
      <div class="testi-tier-label en-text" style="display:none"><i class="fas fa-seedling"></i> Beginners — Starting the Journey</div>

      <div class="testimonials-grid">

        <!-- T1 -->
        <div class="testimonial-card animate-on-scroll">
          <div class="testi-stars">★★★★★</div>
          <p class="ar-text testi-quote">"كنت بصور فيديوهات من موبايلي ومحدش بيشوفها… بعد ما بدأت معاهم بقى عندي ناس بتتواصل معايا وتسأل عن شغلي. الفيديو اتغيّر تماماً."</p>
          <p class="en-text testi-quote" style="display:none">"I was recording videos on my phone and nobody watched them… after starting with them people started reaching out asking about my work. The video quality changed completely."</p>
          <div class="testimonial-author">
            <div class="author-avatar av-purple">م</div>
            <div class="author-info">
              <strong>مريم</strong>
              <span class="ar-text">ببيع منتجات يدوية من البيت</span>
              <span class="en-text" style="display:none">Sells handmade products from home</span>
            </div>
          </div>
        </div>

        <!-- T2 -->
        <div class="testimonial-card animate-on-scroll">
          <div class="testi-stars">★★★★★</div>
          <p class="ar-text testi-quote">"كنت مش عارف أبدأ منين خالص… دخلت الجلسة مع البروفيسور وطلعت بخطة واضحة خطوة خطوة. ده أول مرة أحس إن عندي اتجاه صح."</p>
          <p class="en-text testi-quote" style="display:none">"I had no idea where to start at all… I went into the Professor's session and came out with a clear step-by-step plan. First time I felt like I had the right direction."</p>
          <div class="testimonial-author">
            <div class="author-avatar av-blue">ع</div>
            <div class="author-info">
              <strong>عمر</strong>
              <span class="ar-text">عنده صفحة صغيرة على إنستجرام ولسه بيبدأ</span>
              <span class="en-text" style="display:none">Has a small Instagram page and just starting out</span>
            </div>
          </div>
        </div>

        <!-- T3 -->
        <div class="testimonial-card animate-on-scroll">
          <div class="testi-stars">★★★★★</div>
          <p class="ar-text testi-quote">"كنت خايف أبدأ لأني مش متأكد إن المحتوى بتاعي كويس… لكن بعد أول فيديو معاهم شفت إن الناس بدأت تتفاعل فعلاً. الفيديوهات بقت بتشد."</p>
          <p class="en-text testi-quote" style="display:none">"I was scared to start because I wasn't sure my content was good enough… but after the first video with them I saw people actually engaging. The videos started hooking people."</p>
          <div class="testimonial-author">
            <div class="author-avatar av-green">س</div>
            <div class="author-info">
              <strong>سارة</strong>
              <span class="ar-text">بتقدم خدمات أونلاين وعايزة تبني حضور</span>
              <span class="en-text" style="display:none">Offers online services and wants to build a presence</span>
            </div>
          </div>
        </div>

        <!-- T4 -->
        <div class="testimonial-card animate-on-scroll">
          <div class="testi-stars">★★★★★</div>
          <p class="ar-text testi-quote">"كنت بضيع ساعات في المونتاج ومش طالع حاجة تنفع… دلوقتي بوفر وقتي كله وبتفرغ للشغل الأساسي. التسليم سريع وبيشتغل بجد."</p>
          <p class="en-text testi-quote" style="display:none">"I used to waste hours editing and nothing good came out… now I save all that time and focus on my core work. Delivery is fast and they really deliver."</p>
          <div class="testimonial-author">
            <div class="author-avatar av-orange">ك</div>
            <div class="author-info">
              <strong>كريم</strong>
              <span class="ar-text">عنده براند بسيط ولسه بيبدأ على السوشيال</span>
              <span class="en-text" style="display:none">Has a small brand and just getting started on social media</span>
            </div>
          </div>
        </div>

        <!-- T5 -->
        <div class="testimonial-card animate-on-scroll">
          <div class="testi-stars">★★★★★</div>
          <p class="ar-text testi-quote">"أنا مش خبير في التصوير ومش عارف المونتاج… بس معاهم حسيت إن عندي فريق بيشتغل معايا. أول ريلز عمله وصل لـ 8 آلاف مشاهدة."</p>
          <p class="en-text testi-quote" style="display:none">"I'm no expert in filming or editing… but with them I felt like I had a team working with me. The first reel we made reached 8,000 views."</p>
          <div class="testimonial-author">
            <div class="author-avatar av-pink">ر</div>
            <div class="author-info">
              <strong>ريم</strong>
              <span class="ar-text">بتبيع كورسات أونلاين صغيرة</span>
              <span class="en-text" style="display:none">Sells small online courses</span>
            </div>
          </div>
        </div>

      </div>

      <!-- ── TIER 2: متوسطين ── -->
      <div class="testi-tier-label testi-tier-mid ar-text"><i class="fas fa-chart-line"></i> المتوسطون — في طريق النمو</div>
      <div class="testi-tier-label testi-tier-mid en-text" style="display:none"><i class="fas fa-chart-line"></i> Intermediate — On the Growth Path</div>

      <div class="testimonials-grid">

        <!-- T6 -->
        <div class="testimonial-card animate-on-scroll">
          <div class="testi-stars">★★★★★</div>
          <p class="ar-text testi-quote">"كنت بنزل محتوى بانتظام بس التفاعل واقف… جلسة واحدة مع البروفيسور غيّرت طريقة تفكيري في الهوك والأول ثواني. التفاعل زاد 3 مرات في شهر."</p>
          <p class="en-text testi-quote" style="display:none">"I was posting consistently but engagement was flat… one session with the Professor changed how I think about hooks and the first seconds. Engagement tripled in a month."</p>
          <div class="testimonial-author">
            <div class="author-avatar av-teal">ي</div>
            <div class="author-info">
              <strong>ياسمين</strong>
              <span class="ar-text">بتعمل فيديوهات تعليمية وعايزة تكبّر</span>
              <span class="en-text" style="display:none">Creates educational videos and wants to grow</span>
            </div>
          </div>
        </div>

        <!-- T7 -->
        <div class="testimonial-card animate-on-scroll">
          <div class="testi-stars">★★★★★</div>
          <p class="ar-text testi-quote">"كنت شايل كل حاجة لوحدي — التصوير والمونتاج والبوستات… بقيت بسلّم الخام وأستلم المحتوى جاهز. بقى عندي وقت أفكر في النمو بدل ما أتعب في التنفيذ."</p>
          <p class="en-text testi-quote" style="display:none">"I was doing everything alone — filming, editing, posting… now I hand over the raw footage and receive ready content. I have time to think about growth instead of getting exhausted in execution."</p>
          <div class="testimonial-author">
            <div class="author-avatar av-indigo">ط</div>
            <div class="author-info">
              <strong>طارق</strong>
              <span class="ar-text">بقدم استشارات أونلاين ومحتاج حضور قوي</span>
              <span class="en-text" style="display:none">Offers online consulting and needs a strong presence</span>
            </div>
          </div>
        </div>

        <!-- T8 -->
        <div class="testimonial-card animate-on-scroll">
          <div class="testi-stars">★★★★★</div>
          <p class="ar-text testi-quote">"عندي بيزنس صغير وكنت بجرب السوشيال بدون خطة… البروفيسور فهّمني إزاي أحوّل المشاهدات لعملاء فعليين. دلوقتي بيجيلي استفسارات كل يوم من الريلز."</p>
          <p class="en-text testi-quote" style="display:none">"I have a small business and was trying social media with no plan… the Professor showed me how to turn views into actual clients. Now I get inquiries every day from reels."</p>
          <div class="testimonial-author">
            <div class="author-avatar av-amber">ن</div>
            <div class="author-info">
              <strong>نادر</strong>
              <span class="ar-text">عنده بيزنس صغير وبيجرب السوشيال ميديا</span>
              <span class="en-text" style="display:none">Has a small business and trying social media</span>
            </div>
          </div>
        </div>

        <!-- T9 -->
        <div class="testimonial-card animate-on-scroll">
          <div class="testi-stars">★★★★★</div>
          <p class="ar-text testi-quote">"كنت بعمل محتوى على تيك توك وعايز أكبر بس مش عارف كيف… لأول مرة حسيت إن في حد بيوجهني صح. وصلت لـ 20 ألف متابع في شهرين بس."</p>
          <p class="en-text testi-quote" style="display:none">"I was making TikTok content and wanted to grow but didn't know how… for the first time I felt like someone was guiding me right. Reached 20K followers in just two months."</p>
          <div class="testimonial-author">
            <div class="author-avatar av-rose">ل</div>
            <div class="author-info">
              <strong>لينا</strong>
              <span class="ar-text">بتشتغل على TikTok وعايزة تكبر</span>
              <span class="en-text" style="display:none">Works on TikTok and wants to grow</span>
            </div>
          </div>
        </div>

        <!-- T10 -->
        <div class="testimonial-card animate-on-scroll">
          <div class="testi-stars">★★★★★</div>
          <p class="ar-text testi-quote">"التوجيه مش بس في المونتاج — ده في طريقة تفكيري في المحتوى بالكامل. كنت بفكر في الفيديو كـ 'محتوى'… دلوقتي بفكر فيه كـ 'أداة بيع'. الفرق ضخم."</p>
          <p class="en-text testi-quote" style="display:none">"The guidance isn't just about editing — it changed my entire way of thinking about content. I used to think of video as 'content'… now I think of it as a 'sales tool'. The difference is huge."</p>
          <div class="testimonial-author">
            <div class="author-avatar av-cyan">ح</div>
            <div class="author-info">
              <strong>حسن</strong>
              <span class="ar-text">بيصور محتوى لنفسه ولعملاء أونلاين</span>
              <span class="en-text" style="display:none">Creates content for himself and online clients</span>
            </div>
          </div>
        </div>

      </div>

      <!-- ── TIER 3: متقدمين ── -->
      <div class="testi-tier-label testi-tier-adv ar-text"><i class="fas fa-crown"></i> المتقدمون — نتائج حقيقية</div>
      <div class="testi-tier-label testi-tier-adv en-text" style="display:none"><i class="fas fa-crown"></i> Advanced — Real Results</div>

      <div class="testimonials-grid">

        <!-- T11 -->
        <div class="testimonial-card testimonial-featured animate-on-scroll">
          <div class="testi-stars">★★★★★</div>
          <p class="ar-text testi-quote">"كنت ببيع منتجاتي من البيت والمبيعات كانت بطيئة جداً… بعد 3 شهور مع CreatorHubPro زادت مبيعاتي 4 أضعاف. الفيديوهات بقت هي أقوى أداة تسويق عندي."</p>
          <p class="en-text testi-quote" style="display:none">"I was selling products from home and sales were very slow… after 3 months with CreatorHubPro my sales quadrupled. Videos became my strongest marketing tool."</p>
          <div class="testimonial-author">
            <div class="author-avatar av-gold">د</div>
            <div class="author-info">
              <strong>داليا</strong>
              <span class="ar-text">ببيع منتجاتها من البيت على إنستجرام</span>
              <span class="en-text" style="display:none">Sells her products from home on Instagram</span>
            </div>
          </div>
        </div>

        <!-- T12 -->
        <div class="testimonial-card testimonial-featured animate-on-scroll">
          <div class="testi-stars">★★★★★</div>
          <p class="ar-text testi-quote">"جلسات البروفيسور غيّرت تفكيري بالكامل في المحتوى. مكنتش بعرف الفرق بين محتوى بيتفرج عليه ومحتوى بيبيع. دلوقتي بجيبلي عملاء من كل فيديو تقريباً."</p>
          <p class="en-text testi-quote" style="display:none">"The Professor's sessions completely changed my thinking about content. I didn't know the difference between content people watch and content that sells. Now almost every video brings me clients."</p>
          <div class="testimonial-author">
            <div class="author-avatar av-violet">ش</div>
            <div class="author-info">
              <strong>شيماء</strong>
              <span class="ar-text">بتقدم خدمات تصميم أونلاين</span>
              <span class="en-text" style="display:none">Offers online design services</span>
            </div>
          </div>
        </div>

        <!-- T13 -->
        <div class="testimonial-card testimonial-featured animate-on-scroll">
          <div class="testi-stars">★★★★★</div>
          <p class="ar-text testi-quote">"أنا ببيع كورسات أونلاين وكانت المبيعات متوقفة تقريباً… بعد ما غيّرنا شكل الفيديوهات والاستراتيجية، في شهر واحد باعت دورتي أكتر من 3 مرات قبل."</p>
          <p class="en-text testi-quote" style="display:none">"I sell online courses and sales were almost at a standstill… after we changed the video style and strategy, in just one month my course sold more than 3x the previous rate."</p>
          <div class="testimonial-author">
            <div class="author-avatar av-emerald">م</div>
            <div class="author-info">
              <strong>محمود</strong>
              <span class="ar-text">ببيع كورسات تعليمية أونلاين</span>
              <span class="en-text" style="display:none">Sells educational courses online</span>
            </div>
          </div>
        </div>

        <!-- T14 -->
        <div class="testimonial-card testimonial-featured animate-on-scroll">
          <div class="testi-stars">★★★★★</div>
          <p class="ar-text testi-quote">"البروفيسور مش بس بيعلّمك المونتاج — بيعلّمك كيف تفكر كـ براند. بعد الجلسات دي بقيت أفهم جمهوري أكتر وبقدر أعمل محتوى يلمسهم فعلاً. المتابعين زادوا 12 ألف في شهرين."</p>
          <p class="en-text testi-quote" style="display:none">"The Professor doesn't just teach editing — he teaches you how to think like a brand. After those sessions I understood my audience more and could create content that truly resonates. Followers grew by 12K in two months."</p>
          <div class="testimonial-author">
            <div class="author-avatar av-fuchsia">أ</div>
            <div class="author-info">
              <strong>أميرة</strong>
              <span class="ar-text">عندها براند شخصي وبتبني جمهورها</span>
              <span class="en-text" style="display:none">Has a personal brand and building her audience</span>
            </div>
          </div>
        </div>

        <!-- T15 -->
        <div class="testimonial-card testimonial-featured animate-on-scroll">
          <div class="testi-stars">★★★★★</div>
          <p class="ar-text testi-quote">"كنت بشتغل على يوتيوب لوحدي وتعبت… المنظومة دي خفّفت عني 80٪ من الشغل. البوسترات والتامبنيلز والمونتاج — كل ده بيتعمل وأنا مركّز على المحتوى بس. القناة كبرت بجد."</p>
          <p class="en-text testi-quote" style="display:none">"I was working on YouTube alone and was exhausted… this system took 80% of the work off my plate. Posters, thumbnails, editing — all done while I focus only on content. The channel genuinely grew."</p>
          <div class="testimonial-author">
            <div class="author-avatar av-sky">ز</div>
            <div class="author-info">
              <strong>زياد</strong>
              <span class="ar-text">يوتيوبر بيعمل محتوى تقني</span>
              <span class="en-text" style="display:none">YouTuber creating tech content</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Bottom CTA -->
      <div class="testi-bottom-cta animate-on-scroll">
        <p class="ar-text">أنت التالي — انضم لأكثر من 250 شخص حققوا نتائج حقيقية</p>
        <p class="en-text" style="display:none">You're next — join 250+ people who got real results</p>
        <a href="#form-section" class="btn btn-primary ar-text"><i class="fas fa-rocket"></i> ابدأ الآن</a>
        <a href="#form-section" class="btn btn-primary en-text" style="display:none"><i class="fas fa-rocket"></i> Start Now</a>
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
          <h3 class="ar-text">تم استلام بياناتك بنجاح! 🎉</h3>
          <h3 class="en-text" style="display:none">Your data was received successfully! 🎉</h3>
          <p class="ar-text">سيتواصل معك فريقنا خلال 24 ساعة عبر واتساب ✅</p>
          <p class="en-text" style="display:none">Our team will contact you within 24 hours via WhatsApp ✅</p>
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
              <label class="ar-text"><i class="fas fa-sync-alt"></i> تقدر تحافظ على نفس جودة محتواك مع النشر المنتظم كل شهر؟ *</label>
              <label class="en-text" style="display:none"><i class="fas fa-sync-alt"></i> Can you maintain content quality with consistent monthly publishing? *</label>
              <div class="radio-group">
                <label class="radio-option ar-text">
                  <input type="radio" name="experience" value="no_consistency" required />
                  <span class="radio-custom"></span>
                  لا، بعاني أصلاً في الاستمرارية
                </label>
                <label class="radio-option ar-text">
                  <input type="radio" name="experience" value="quality_or_schedule" required />
                  <span class="radio-custom"></span>
                  ممكن، لكن الجودة أو الانتظام بيقعوا
                </label>
                <label class="radio-option ar-text">
                  <input type="radio" name="experience" value="costly_effort" required />
                  <span class="radio-custom"></span>
                  نعم، لكن بياخد وقت ومجهود كبير مني
                </label>
              </div>
              <div class="radio-group en-text" style="display:none">
                <label class="radio-option">
                  <input type="radio" name="experience" value="no_consistency" required />
                  <span class="radio-custom"></span>
                  No, I already struggle with consistency
                </label>
                <label class="radio-option">
                  <input type="radio" name="experience" value="quality_or_schedule" required />
                  <span class="radio-custom"></span>
                  Maybe, but quality or schedule tend to drop
                </label>
                <label class="radio-option">
                  <input type="radio" name="experience" value="costly_effort" required />
                  <span class="radio-custom"></span>
                  Yes, but it takes a lot of time and effort
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
        <a href="https://wa.me/201105449828?text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%D8%8C%20%D8%A3%D8%B1%D8%B3%D9%84%D8%AA%20%D8%A8%D9%8A%D8%A7%D9%86%D8%A7%D8%AA%D9%8A%20%D8%B9%D8%A8%D8%B1%20%D8%A7%D9%84%D9%85%D9%88%D9%82%D8%B9%20%D9%88%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%A8%D8%AF%D8%A1"
           target="_blank" rel="noopener" class="btn btn-whatsapp ar-text">
          <i class="fab fa-whatsapp"></i> تواصل عبر واتساب
        </a>
        <a href="https://wa.me/201105449828?text=Hello%2C%20I%20submitted%20my%20information%20through%20the%20website%20and%20would%20like%20to%20start"
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
          <span class="gradient-text">ابدأ الآن</span> قبل اكتمال العدد
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
          <a href="https://wa.me/201105449828?text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%D8%8C%20%D8%A3%D8%B1%D8%B3%D9%84%D8%AA%20%D8%A8%D9%8A%D8%A7%D9%86%D8%A7%D8%AA%D9%8A%20%D8%B9%D8%A8%D8%B1%20%D8%A7%D9%84%D9%85%D9%88%D9%82%D8%B9%20%D9%88%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%A8%D8%AF%D8%A1"
             target="_blank" rel="noopener" class="btn btn-outline-white ar-text">
            <i class="fab fa-whatsapp"></i> تحدث معنا مباشرة
          </a>
          <a href="https://wa.me/201105449828?text=Hello%2C%20I%20want%20to%20get%20started"
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

      <!-- TOP ROW: brand + nav columns -->
      <div class="footer-top">

        <!-- Brand column -->
        <div class="footer-brand-col">
          <div class="footer-logo-wrap">
            <img src="/brand/cropped.png" alt="CreatorHubPro" class="footer-logo-img" style="height:60px;width:auto;" />
          </div>
          <p class="footer-tagline ar-text">نحوّل محتواك إلى آلة تجذب العملاء —<br/>تحرير احترافي + استراتيجية نمو في نظام واحد</p>
          <p class="footer-tagline en-text" style="display:none">We turn your content into a client-attracting machine —<br/>Pro editing + growth strategy in one system</p>

          <!-- Social icons -->
          <div class="footer-socials">
            <a href="https://wa.me/201105449828" target="_blank" rel="noopener" class="fsoc-wa" aria-label="WhatsApp">
              <i class="fab fa-whatsapp"></i>
            </a>
            <a href="https://www.instagram.com/creatorhubpro/" target="_blank" rel="noopener" class="fsoc-ig" aria-label="Instagram">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="#" class="fsoc-tk" aria-label="TikTok">
              <i class="fab fa-tiktok"></i>
            </a>
            <a href="#" class="fsoc-yt" aria-label="YouTube">
              <i class="fab fa-youtube"></i>
            </a>
          </div>
        </div>

        <!-- Quick links column -->
        <div class="footer-links-col ar-text">
          <h4>روابط سريعة</h4>
          <ul>
            <li><a href="#hero"><i class="fas fa-chevron-left"></i> الرئيسية</a></li>
            <li><a href="#solution"><i class="fas fa-chevron-left"></i> النظام</a></li>
            <li><a href="#packages"><i class="fas fa-chevron-left"></i> الباقات</a></li>
            <li><a href="#testimonials"><i class="fas fa-chevron-left"></i> آراء العملاء</a></li>
            <li><a href="#about"><i class="fas fa-chevron-left"></i> من نحن</a></li>
            <li><a href="#form-section"><i class="fas fa-chevron-left"></i> ابدأ الآن</a></li>
          </ul>
        </div>
        <div class="footer-links-col en-text" style="display:none">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#hero"><i class="fas fa-chevron-right"></i> Home</a></li>
            <li><a href="#solution"><i class="fas fa-chevron-right"></i> The System</a></li>
            <li><a href="#packages"><i class="fas fa-chevron-right"></i> Packages</a></li>
            <li><a href="#testimonials"><i class="fas fa-chevron-right"></i> Reviews</a></li>
            <li><a href="#about"><i class="fas fa-chevron-right"></i> About Us</a></li>
            <li><a href="#form-section"><i class="fas fa-chevron-right"></i> Get Started</a></li>
          </ul>
        </div>

        <!-- Contact column -->
        <div class="footer-contact-col">
          <h4 class="ar-text">تواصل معنا</h4>
          <h4 class="en-text" style="display:none">Contact Us</h4>
          <div class="footer-contact-items">
            <a href="https://wa.me/201105449828" target="_blank" rel="noopener" class="footer-contact-item">
              <span class="fci-icon fci-green"><i class="fab fa-whatsapp"></i></span>
              <div>
                <span class="fci-label ar-text">تواصل معنا</span>
                <span class="fci-label en-text" style="display:none">Contact Us</span>
                <span class="fci-val" dir="ltr">+20 110 544 9828</span>
              </div>
            </a>
            <a href="mailto:info@creatorhubpro.com" class="footer-contact-item">
              <span class="fci-icon fci-purple"><i class="fas fa-envelope"></i></span>
              <div>
                <span class="fci-label ar-text">البريد الإلكتروني</span>
                <span class="fci-label en-text" style="display:none">Email</span>
                <span class="fci-val">info@creatorhubpro.com</span>
              </div>
            </a>
          </div>
        </div>

      </div><!-- /footer-top -->

      <!-- DIVIDER -->
      <div class="footer-divider"></div>

      <!-- BOTTOM ROW: copyright + trust badges -->
      <div class="footer-bottom">
        <p class="footer-copy ar-text">© 2025 CreatorHubPro — جميع الحقوق محفوظة</p>
        <p class="footer-copy en-text" style="display:none">© 2025 CreatorHubPro — All Rights Reserved</p>
        <div class="footer-trust">
          <span><i class="fas fa-shield-alt"></i> <span class="ar-text">بيانات آمنة</span><span class="en-text" style="display:none">Secure Data</span></span>
          <span><i class="fas fa-lock"></i> <span class="ar-text">خصوصية تامة</span><span class="en-text" style="display:none">Privacy Protected</span></span>
          <span><i class="fas fa-certificate"></i> <span class="ar-text">جودة مضمونة</span><span class="en-text" style="display:none">Quality Guaranteed</span></span>
        </div>
      </div>

    </div>
  </footer>

  <!-- ============================
       STICKY BOTTOM CTA (MOBILE)
  ============================= -->
  <div class="sticky-cta" id="stickyCta">
    <a href="#form-section" class="sticky-cta-btn ar-text">
      <i class="fas fa-calendar-check"></i> احجز مكالمتك المجانية
    </a>
    <a href="#form-section" class="sticky-cta-btn en-text" style="display:none">
      <i class="fas fa-calendar-check"></i> Book Your Free Call
    </a>
    <a href="https://wa.me/201105449828?text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%A8%D8%AF%D8%A1" 
       target="_blank" rel="noopener" class="sticky-wa-btn" aria-label="WhatsApp">
      <i class="fab fa-whatsapp"></i>
    </a>
  </div> 
`;

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: landingHtml }} suppressHydrationWarning={true}/>
      <Script src="/static/app.js" strategy="afterInteractive" />
    </>
  );
}
