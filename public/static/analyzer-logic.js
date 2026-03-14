/* =============================================
   CreatorHubPro — Analyzer Page Specific Logic
   ============================================= */

let currentPlatform = 'youtube';
let analysisData = null;

// ─── 1. PLATFORM SELECTION ──────────────────────────
window.setPlatform = function (platform) {
    // Prevent switching while scanning
    if (document.getElementById('step-2').classList.contains('active')) return;

    currentPlatform = platform;
    document.querySelectorAll('.pt-btn').forEach(btn => btn.className = 'pt-btn');
    const activeBtn = document.getElementById('btn-' + platform);
    if (activeBtn) {
        activeBtn.classList.add('active', platform);
    }
};

// ─── 2. ANALYSIS SCANNING ───────────────────────────
window.handleAnalyze = async function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;

    // UI: Move to scanning step
    showStep(2);

    try {
        const res = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ platform: currentPlatform, username })
        });

        const json = await res.json();

        if (!res.ok || json.error) {
            alert(json.error || 'Failed to analyze channel.');
            showStep(1);
            return;
        }

        analysisData = json.data;

        // Populate Teaser Data
        document.getElementById('res-username').innerText = analysisData.username;
        document.getElementById('res-followers').innerText = formatFollowers(analysisData.followers);
        if (analysisData.avatar) document.getElementById('res-avatar').src = analysisData.avatar;

        // Show Step 3 (Lead Gate)
        showStep(3);

        // Animate Circle
        animateScore(analysisData.scores.overall);

    } catch (err) {
        alert('An error occurred. Please try again.');
        showStep(1);
    }
};

// ─── 3. UNLOCK REPORT (Lead Capture) ────────────────
window.handleUnlock = async function (e) {
    e.preventDefault();

    // Collect Gate Data
    const gateData = {
        name: document.getElementById('gate-name').value,
        email: document.getElementById('gate-email').value,
        phone: document.getElementById('gate-phone').value,
    };

    // Use Global Logic from app.js to send to Make.com Webhook
    // We pass a custom payload to include the Analysis Score
    const payload = {
        ...gateData,
        source: 'Analyzer Tool',
        platform: currentPlatform,
        target_account: analysisData.username,
        score: analysisData.scores.overall
    };

    // Trigger the Global Webhook function defined in app.js
    if (window.sendLeadToWebhook) {
        window.sendLeadToWebhook(payload);
    }

    // Populate and Show Final Report
    populateFullReport();
    showStep(4);
};

// ─── 4. UI HELPERS ──────────────────────────────────
function showStep(num) {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.getElementById('step-' + num).classList.add('active');
}

function animateScore(score) {
    document.getElementById('teaser-score').innerText = score;
    const circ = document.getElementById('teaser-circ');
    if (circ) {
        const offset = 477 - (score / 100) * 477;
        setTimeout(() => { circ.style.strokeDashoffset = offset; }, 100);
    }
}

function populateFullReport() {
    const d = analysisData;
    document.getElementById('res-username-full').innerText = d.username;
    document.getElementById('res-benchmark').innerText = d.benchmark;
    document.getElementById('sc-consistency').innerText = d.scores.consistency;
    document.getElementById('sc-engagement').innerText = d.scores.engagement;
    document.getElementById('sc-strategy').innerText = d.scores.strategy;

    document.getElementById('rec-en-txt').innerText = d.insights.en;
    document.getElementById('rec-ar-txt').innerText = d.insights.ar;
}

function formatFollowers(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
}

// ─── 5. PLACEHOLDER SYNC (Cross-file Bridge) ────────
window.syncAnalyzerPlaceholders = function () {
    const isEn = document.documentElement.lang === 'en';
    const pairs = [
        ['username', isEn ? "Enter @handle..." : "أدخل اسم الحساب..."],
        ['gate-name', isEn ? "First Name" : "الاسم الأول"],
        ['gate-email', isEn ? "Email" : "البريد الإلكتروني"],
        ['gate-phone', isEn ? "WhatsApp" : "رقم الواتساب"]
    ];
    pairs.forEach(([id, text]) => {
        const el = document.getElementById(id);
        if (el) el.placeholder = text;
    });
};

// Initial sync
document.addEventListener('DOMContentLoaded', window.syncAnalyzerPlaceholders);