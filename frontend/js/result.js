(() => {
  'use strict';

  const API_BASE = 'http://localhost:3000';

  const score   = parseInt(localStorage.getItem('qf-score'))   || 0;
  const total   = parseInt(localStorage.getItem('qf-total'))   || 12;
  const subject = localStorage.getItem('qf-subject')           || 'html';
  const pct     = Math.round((score / total) * 100);
  const wrong   = total - score;

  const LABELS = { html: 'HTML', css: 'CSS', javascript: 'JavaScript' };

  // ── Fill static elements ────────────────────────────────────
  document.getElementById('eyebrow').textContent       = `اكتمل الاختبار · ${LABELS[subject] || subject}`;
  document.getElementById('scoreNum').textContent      = `${score}/${total}`;
  document.getElementById('scorePct').textContent      = `${pct}%`;
  document.getElementById('correctCount').textContent  = score;
  document.getElementById('wrongCount').textContent    = wrong;
  document.getElementById('pctStat').textContent       = `${pct}%`;

  // ── Animated score ring ─────────────────────────────────────
  const CIRCUM = 2 * Math.PI * 75;
  const fill   = document.getElementById('sFill');
  fill.style.strokeDasharray  = CIRCUM;
  fill.style.strokeDashoffset = CIRCUM;
  setTimeout(() => {
    fill.style.strokeDashoffset = CIRCUM - (pct / 100) * CIRCUM;
  }, 200);

  // ── Animated progress bar ───────────────────────────────────
  setTimeout(() => {
    document.getElementById('res-bar').style.width = pct + '%';
  }, 300);

  // ── Badge & message ─────────────────────────────────────────
  const badge = document.getElementById('resultBadge');
  const msg   = document.getElementById('resultMsg');

  if (pct >= 90) {
    badge.textContent = '🏆 خبير متميز';
    badge.className   = 'result-badge badge-expert';
    msg.textContent   = 'رائع جداً! أنت تمتلك فهماً عميقاً لهذا الموضوع. استمر في هذا المستوى المتقدم!';
  } else if (pct >= 70) {
    badge.textContent = '⭐ مستوى جيد';
    badge.className   = 'result-badge badge-good';
    msg.textContent   = 'أداء ممتاز! لديك أساس قوي في الموضوع. بعض التمرين الإضافي وستصل للقمة.';
  } else if (pct >= 50) {
    badge.textContent = '📘 في طريق التعلم';
    badge.className   = 'result-badge badge-avg';
    msg.textContent   = 'جهد جيد! أنت على الطريق الصحيح. راجع المفاهيم التي أخطأت فيها وحاول مجدداً.';
  } else {
    badge.textContent = '🔁 يحتاج مراجعة';
    badge.className   = 'result-badge badge-low';
    msg.textContent   = 'لا تستسلم! كل خطأ هو فرصة للتعلم. راجع الأساسيات وستلاحظ تحسناً كبيراً.';
  }

  // ── Submit score to backend ─────────────────────────────────
  async function submitScore() {
    try {
      await fetch(`${API_BASE}/api/scores`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ subject, score, total })
      });
    } catch (err) {
      // Non-fatal — score display still works even if backend is unreachable
      console.warn('[QuizForge] Could not submit score to backend:', err.message);
    }
  }

  submitScore();

  // ── Actions ─────────────────────────────────────────────────
  document.getElementById('retryBtn').addEventListener('click', () => {
    window.location.href = `quiz.html?subject=${subject}`;
  });

  document.getElementById('homeBtn').addEventListener('click', () => {
    window.location.href = 'index.html';
  });
})();
