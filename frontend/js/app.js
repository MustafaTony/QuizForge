(() => {
  'use strict';

  const API_BASE = 'http://localhost:3000';

  const params  = new URLSearchParams(window.location.search);
  const subject = (params.get('subject') || 'html').toLowerCase();

  let qs       = [];
  let TOTAL    = 0;
  let idx      = 0;
  let score    = 0;
  let done     = false;
  let timerId  = null;
  let timeLeft = 0;

  const TIMER_S = 15;
  const CIRCUM  = 2 * Math.PI * 26;

  const LABELS = { html: 'HTML', css: 'CSS', javascript: 'JavaScript' };

  const subjectPill  = document.getElementById('subjectPill');
  const progressFill = document.getElementById('progressFill');
  const progressLabel= document.getElementById('progressLabel');
  const scoreLabel   = document.getElementById('scoreLabel');
  const timerRing    = document.getElementById('timer-ring');
  const timerNum     = document.getElementById('timerNum');
  const qNumber      = document.getElementById('qNumber');
  const qText        = document.getElementById('qText');
  const optionsGrid  = document.getElementById('optionsGrid');
  const nextBtn      = document.getElementById('nextBtn');
  const nextLabel    = document.getElementById('nextLabel');
  const questionCard = document.getElementById('questionCard');

  subjectPill.textContent          = LABELS[subject] || subject.toUpperCase();
  timerRing.style.strokeDasharray  = CIRCUM;
  timerRing.style.strokeDashoffset = 0;

  function makeSpan(className, text) {
    const el = document.createElement('span');
    el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }

  async function loadQuestions() {
    qText.textContent = 'جاري تحميل الأسئلة...';
    try {
      const res = await fetch(`${API_BASE}/api/questions/${subject}`);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      if (!data.success || !Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error('No questions returned from server');
      }
      qs    = data.questions.map(q => ({ q: q.question, options: q.options, a: q.correct }));
      TOTAL = qs.length;
      render();
    } catch (err) {
      console.error('[QuizForge] Failed to load questions:', err.message);
      qText.textContent = '⚠️ تعذّر تحميل الأسئلة. تأكد من تشغيل السيرفر على localhost:3000 ثم أعد تحميل الصفحة.';
    }
  }

  function render() {
    done = false;
    nextBtn.classList.remove('show');
    clearInterval(timerId);

    const q   = qs[idx];
    const num = String(idx + 1).padStart(2, '0');

    qNumber.textContent   = `السؤال ${num}`;
    qText.textContent     = q.q;

    const pct = (idx / TOTAL) * 100;
    progressFill.style.width  = pct + '%';
    progressLabel.textContent = `السؤال ${idx + 1} من ${TOTAL}`;
    scoreLabel.textContent    = `${score} ✓`;

    const letters = ['أ', 'ب', 'ج', 'د'];
    optionsGrid.innerHTML = '';

    q.options.forEach((opt, i) => {
      const btn        = document.createElement('button');
      btn.className    = 'opt-btn';
      const letterSpan = makeSpan('opt-letter', letters[i]);
      const textSpan   = makeSpan('opt-text', opt);
      const checkSpan  = makeSpan('opt-check');
      textSpan.style.flex = '1';
      btn.appendChild(letterSpan);
      btn.appendChild(textSpan);
      btn.appendChild(checkSpan);
      btn.addEventListener('click', () => pick(i, btn));
      optionsGrid.appendChild(btn);
    });

    startTimer();
  }

  function startTimer() {
    timeLeft = TIMER_S;
    updateRing();
    timerId = setInterval(() => {
      timeLeft--;
      updateRing();
      if (timeLeft <= 0) { clearInterval(timerId); autoExpire(); }
    }, 1000);
  }

  function updateRing() {
    timerNum.textContent = timeLeft;
    const offset = CIRCUM - (timeLeft / TIMER_S) * CIRCUM;
    timerRing.style.strokeDashoffset = offset;
    timerRing.classList.remove('warn', 'danger');
    if      (timeLeft <= 5) timerRing.classList.add('danger');
    else if (timeLeft <= 8) timerRing.classList.add('warn');
  }

  function autoExpire() {
    if (done) return;
    done = true;
    const correct = qs[idx].a;
    const btns    = optionsGrid.querySelectorAll('.opt-btn');
    btns.forEach((b, i) => {
      b.disabled = true;
      if (i === correct) {
        b.classList.add('correct');
        b.querySelector('.opt-check').textContent = '✓';
      }
    });
    showNext();
  }

  function pick(i, clickedBtn) {
    if (done) return;
    done = true;
    clearInterval(timerId);
    const correct = qs[idx].a;
    const btns    = optionsGrid.querySelectorAll('.opt-btn');
    btns.forEach(b => { b.disabled = true; });
    if (i === correct) {
      clickedBtn.classList.add('correct');
      clickedBtn.querySelector('.opt-check').textContent = '✓';
      score++;
    } else {
      clickedBtn.classList.add('incorrect');
      clickedBtn.querySelector('.opt-check').textContent = '✗';
      btns[correct].classList.add('correct');
      btns[correct].querySelector('.opt-check').textContent = '✓';
    }
    scoreLabel.textContent = `${score} ✓`;
    setTimeout(showNext, 400);
  }

  function showNext() {
    const isLast = idx === TOTAL - 1;
    nextLabel.textContent = isLast ? 'عرض النتيجة 🏆' : 'السؤال التالي ←';
    nextBtn.classList.add('show');
  }

  nextBtn.addEventListener('click', () => {
    idx++;
    if (idx >= TOTAL) {
      localStorage.setItem('qf-score',   score);
      localStorage.setItem('qf-total',   TOTAL);
      localStorage.setItem('qf-subject', subject);
      window.location.href = 'result.html';
    } else {
      questionCard.style.animation = 'none';
      void questionCard.offsetWidth;
      questionCard.style.animation = 'fadeUp 0.4s ease both';
      render();
    }
  });

  loadQuestions();
})();
