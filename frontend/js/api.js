/* api.js — shared fetch wrapper, works from Live Server OR localhost:3000 */
'use strict';

const API = (() => {
  // Auto-detect: if opened from Live Server, point to backend explicitly.
  // If served from localhost:3000 (the Express server), use relative paths.
  const isLiveServer = window.location.port === '5500' || window.location.port === '5501';
  const BASE = isLiveServer ? 'http://localhost:3000' : '';

  function getToken() { return localStorage.getItem('qf-token') || ''; }

  function authHeaders() {
    const t = getToken();
    return t
      ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${t}` }
      : { 'Content-Type': 'application/json' };
  }

  async function request(method, path, body) {
    const opts = { method, headers: authHeaders() };
    if (body !== undefined) opts.body = JSON.stringify(body);
    const res  = await fetch(BASE + path, opts);
    const data = await res.json();
    if (!data.success) throw Object.assign(
      new Error(data.error || 'Request failed'),
      { status: res.status, data }
    );
    return data;
  }

  return {
    get:    (path)       => request('GET',    path),
    post:   (path, body) => request('POST',   path, body),
    put:    (path, body) => request('PUT',    path, body),
    delete: (path)       => request('DELETE', path),

    getUser()    { try { return JSON.parse(localStorage.getItem('qf-user') || 'null'); } catch { return null; } },
    getToken,
    isLoggedIn() { return !!getToken(); },
    isAdmin()    { const u = this.getUser(); return u && u.role === 'admin'; },
    saveAuth(token, user) {
      localStorage.setItem('qf-token', token);
      localStorage.setItem('qf-user',  JSON.stringify(user));
    },
    clearAuth() {
      localStorage.removeItem('qf-token');
      localStorage.removeItem('qf-user');
    }
  };
})();
