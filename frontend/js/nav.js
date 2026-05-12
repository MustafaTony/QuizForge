/* nav.js — prepends navbar as first child of body */
'use strict';

(function () {
  const LINKS = [
    { href: 'index.html',        label: '🏠 الرئيسية' },
    { href: 'dashboard.html',    label: '📊 Dashboard',   adminOnly: true },
    { href: 'search.html',       label: '🔍 البحث' },
    { href: 'leaderboard.html',  label: '🏆 المتصدرون' },
    { href: 'admin.html',        label: '⚙️ الأدمن',     adminOnly: true },
  ];

  function render() {
    const isAdmin = API.isAdmin();
    const user    = API.getUser();

    // Detect current page filename (works on both Live Server and Express)
    const current = window.location.pathname.split('/').pop() || 'index.html';

    const links = LINKS
      .filter(l => !l.adminOnly || isAdmin)
      .map(l => {
        const active = current === l.href ? 'active' : '';
        return `<a class="nav-link ${active}" href="${l.href}">${l.label}</a>`;
      }).join('');

    const userArea = user
      ? `<span style="font-size:.8rem;color:var(--text2);font-weight:600;white-space:nowrap">${user.username}</span>
         <button class="btn btn-ghost btn-sm" id="logoutBtn">خروج</button>`
      : `<a class="btn btn-ghost btn-sm" href="login.html">دخول</a>
         <a class="btn btn-primary btn-sm" href="register.html">تسجيل</a>`;

    // Build navbar element
    const nav = document.createElement('nav');
    nav.className   = 'navbar';
    nav.innerHTML = `
      <div class="container">
        <a class="navbar-brand" href="index.html">⚡ QuizForge</a>
        <div class="navbar-links">${links}</div>
        <div class="navbar-actions">
          <button class="theme-btn" id="themeBtn" title="تبديل المظهر">🌙</button>
          ${userArea}
        </div>
      </div>`;

    // Build background orbs element
    const bgCanvas = document.createElement('div');
    bgCanvas.className = 'bg-canvas';
    bgCanvas.innerHTML = '<div class="orb"></div><div class="orb"></div><div class="orb"></div>';

    // Prepend BOTH as the very first children of body
    // bg-canvas first (it's fixed so order doesn't matter visually),
    // navbar second so it's the first in-flow element
    document.body.prepend(nav);
    document.body.prepend(bgCanvas);

    // ── Theme ────────────────────────────────────────────────
    const root    = document.documentElement;
    const saved   = localStorage.getItem('qf-theme') || 'dark';
    root.setAttribute('data-theme', saved);
    const themeBtn = document.getElementById('themeBtn');
    themeBtn.textContent = saved === 'dark' ? '🌙' : '☀️';
    themeBtn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('qf-theme', next);
      themeBtn.textContent = next === 'dark' ? '🌙' : '☀️';
    });

    // ── Logout ───────────────────────────────────────────────
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        try { await API.post('/api/auth/logout'); } catch (_) {}
        API.clearAuth();
        window.location.href = 'login.html';
      });
    }
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
