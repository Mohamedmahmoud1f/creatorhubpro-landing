"use client";

import React, { useState } from 'react';
import './analyzer.css';
import Link from 'next/link';

const DICTIONARY = {
  en: {
    badge: "Social Media Analyzer",
    title: "Analyze Any ",
    titleGradient: "Social Account",
    subtitle: "Get instant insights into any creator's profile — followers, engagement, and more.",
    categoryLabel: "Content Category",
    categories: {
      Education: "Education",
      Business: "Business",
      Entertainment: "Entertainment",
      Personal: "Personal Brand",
      Other: "Other"
    },
    placeholder: "Enter Channel URL or @handle...",
    analyze: "Analyze",
    hint: "Enter a handle (e.g. @mrbeast) or paste a channel URL.",
    scanning: "Scanning Account...",
    connecting: "Connecting to API...",
    ready: "Report is Ready!",
    unlockDesc: "We've analyzed this channel's strengths and weaknesses. Enter your details to unlock the full report.",
    unlockBtn: "Unlock Full Report",
    consistency: "Consistency",
    engagement: "Engagement",
    strategy: "Strategy Score",
    expertTitle: "Expert Analysis",
    bookBtn: "Book Free Strategy Session",
    rank: "Rank",
    subs: "Subscribers"
  },
  ar: {
    badge: "أداة تحليل الحسابات",
    title: "حلل حسابك ",
    titleGradient: "مجاناً",
    subtitle: "احصل على تحليل فوري لأي حساب — متابعين، تفاعل، جودة محتوى وأكثر.",
    categoryLabel: "فئة المحتوى",
    categories: {
      Education: "تعليم",
      Business: "أعمال",
      Entertainment: "ترفيه",
      Personal: "علامة تجارية شخصية",
      Other: "أخرى"
    },
    placeholder: "أدخل رابط القناة أو اسم المستخدم...",
    analyze: "تحليل",
    hint: "أدخل معرف الحساب (مثل @mrbeast) أو رابط القناة",
    scanning: "جاري فحص الحساب...",
    connecting: "جاري الاتصال...",
    ready: "اكتمل التقرير!",
    unlockDesc: "قمنا بتحليل نقاط القوة والضعف للقناة. أدخل بياناتك أدناه لفتح التقرير الكامل.",
    unlockBtn: "فتح التقرير الكامل",
    consistency: "الاستمرارية",
    engagement: "جودة التفاعل",
    strategy: "تقييم الاستراتيجية",
    expertTitle: "تحليل البروفيسور",
    bookBtn: "احجز جلسة استشارة مجانية",
    rank: "التصنيف",
    subs: "مشترك"
  }
};

export default function AnalyzerPage() {
  const [lang, setLang] = useState<'en' | 'ar'>('ar');
  const [step, setStep] = useState(1);
  const [platform, setPlatform] = useState('youtube');
  const [category, setCategory] = useState('Education');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const t = DICTIONARY[lang];

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(null), 4000);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, username, category }),
      });
      const result = await res.json();
      if (result.success) {
        setData(result.data);
        setTimeout(() => {
          setStep(3);
          setLoading(false);
        }, 1500);
      } else {
        showError(result.error || "Something went wrong.");
        setStep(1);
        setLoading(false);
      }
    } catch (err) {
      showError("Failed to connect to the server.");
      setStep(1);
      setLoading(false);
    }
  };

  return (
    <div className={`analyzer-body ${lang === 'ar' ? 'rtl' : 'ltr'}`}>

      {errorMsg && (
        <div className="modern-toast fade-in-up">
          ⚠️ {errorMsg}
        </div>
      )}

      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>

      <nav className="navbar">
        <div className="container nav-inner">
          {/* Replaced with a text logo just in case the image is missing, swap back to your img if needed */}
          <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}><img src="./brand/cropped.png" style={{ height: "40px" }} /></div>
          <button className="lang-toggle" onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}>
            {lang === 'en' ? 'العربية' : 'EN'}
          </button>
        </div>
      </nav>

      <main className="analyzer-wrap">
        {/* STEP 1: INPUT */}
        {step === 1 && (
          <div className="step active fade-in">
            <div className="ah-badge">✨ {t.badge}</div>
            <h1 className="ah-title">{t.title}<span className="ah-gradient">{t.titleGradient}</span></h1>
            <p className="ah-subtitle">{t.subtitle}</p>

            <div className="platform-toggles">
              {['instagram', 'tiktok', 'youtube'].map((p) => (
                <div
                  key={p}
                  className={`pt-btn ${platform === p ? `active ${p}` : ''}`}
                  onClick={() => setPlatform(p)}
                >
                  <i className={`fab fa-${p}`}></i> {p.charAt(0).toUpperCase() + p.slice(1)}
                </div>
              ))}
            </div>

            <form onSubmit={handleAnalyze}>
              <div className="input-group">
                <label className="input-label">{t.categoryLabel}</label>
                <select
                  className="category-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Education">{t.categories.Education}</option>
                  <option value="Business">{t.categories.Business}</option>
                  <option value="Entertainment">{t.categories.Entertainment}</option>
                  <option value="Personal">{t.categories.Personal}</option>
                  <option value="Other">{t.categories.Other}</option>
                </select>
              </div>

              <div className="search-box-wrap">
                <input
                  type="text"
                  className="search-input"
                  placeholder={t.placeholder}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <button type="submit" className="search-btn">{t.analyze}</button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: LOADING */}
        {step === 2 && (
          <div className="res-card loading-card fade-in">
            <div className="loader"></div>
            <h2>{t.scanning}</h2>
            <p className="muted">{t.connecting}</p>
          </div>
        )}

        {/* STEP 3: TEASER / GATE */}
        {step === 3 && data && (
          <div className="res-card text-center fade-in">
            <div className="profile-header">
              <img
                src={data.avatar || 'https://ui-avatars.com/api/?name=' + data.username + '&background=random'}
                className="profile-avatar"
                alt="avatar"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="profile-name">{data.username}</div>
                <div className="profile-meta">{data.followers.toLocaleString()} {t.subs}</div>
              </div>
            </div>

            <div className="score-circle-wrap">
              <div className="score-circle">
                <div className="score-big">{data.scores.overall}</div>
              </div>
              <div className="score-label">Growth Score</div>
            </div>

            <h3 className="ready-title">{t.ready}</h3>
            <p className="gate-desc">{t.unlockDesc}</p>

            <form className="gate-form" onSubmit={(e) => { e.preventDefault(); setStep(4); }}>
              <input type="text" placeholder="Name" className="gate-input" required />
              <input type="email" placeholder="Email" className="gate-input" required />
              <button className="gate-btn search-btn">🚀 {t.unlockBtn}</button>
            </form>
          </div>
        )}

        {/* STEP 4: FULL REPORT */}
        {step === 4 && data && (
          <div className="res-card fade-in">
            <div className="profile-header inline-header">
              <img
                src={data.avatar || 'https://ui-avatars.com/api/?name=' + data.username + '&background=random'}
                className="profile-avatar-small"
                alt="avatar"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="profile-name">{data.username}</div>
              </div>
            </div>

            <div className="score-grid">
              <div className="score-card">
                <div className="sc-label">{t.consistency}</div>
                <div className="sc-value">{data.scores.consistency}%</div>
              </div>
              <div className="score-card">
                <div className="sc-label">{t.engagement}</div>
                <div className="sc-value">{data.scores.engagement}%</div>
              </div>
              <div className="score-card wide">
                <div className="sc-label">{t.strategy}</div>
                <div className="sc-value accent">{data.scores.strategy}%</div>
              </div>
            </div>

            <div className="insight-box">
              <h4>💡 {t.expertTitle}</h4>
              <p>{lang === 'en' ? data.insights.en : data.insights.ar}</p>
            </div>

            <Link href="/#form-section" className="cta-final">
              {t.bookBtn}
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}