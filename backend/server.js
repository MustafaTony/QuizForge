'use strict';

require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const express      = require('express');
const cors         = require('cors');
const path         = require('path');
const { connectDB, disconnectDB } = require('./db');
const logger       = require('./middleware/logger');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const authRouter      = require('./routes/auth');
const questionsRouter = require('./routes/questions');
const scoresRouter    = require('./routes/scores');
const dashboardRouter = require('./routes/dashboard');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── CORS ──────────────────────────────────────────────────────
const corsOptions = {
  origin: (origin, cb) => {
    const ok = !origin
      || origin.startsWith('http://localhost')
      || origin.startsWith('http://127.0.0.1')
      || origin === 'null';
    ok ? cb(null, true) : cb(new Error(`CORS blocked: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization']
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ── Body parsers ──────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger);

// ── Static frontend ───────────────────────────────────────────
// path.resolve(__dirname, '../frontend') works regardless of the
// working directory the user runs `node server.js` from.
const FRONTEND = path.resolve(__dirname, '..', 'frontend');
app.use(express.static(FRONTEND));

// ── Health ────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  const mongoose = require('mongoose');
  const states   = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({
    status:    'ok',
    timestamp: new Date().toISOString(),
    uptime:    `${Math.floor(process.uptime())}s`,
    database:  states[mongoose.connection.readyState] || 'unknown',
    frontend:  FRONTEND
  });
});

// ── API overview ──────────────────────────────────────────────
app.get('/api', (req, res) => {
  res.json({
    name: 'QuizForge API', version: '3.0.0',
    endpoints: {
      auth:      ['POST /api/auth/register', 'POST /api/auth/login', 'GET /api/auth/me', 'POST /api/auth/logout'],
      questions: ['GET /api/questions', 'GET /api/questions/:subject', 'GET /api/questions/search?q=', 'GET /api/questions/all (admin)', 'POST /api/questions (admin)', 'PUT /api/questions/:id (admin)', 'DELETE /api/questions/:id (admin)'],
      scores:    ['POST /api/scores', 'GET /api/scores', 'GET /api/scores/leaderboard'],
      dashboard: ['GET /api/dashboard/stats (admin)']
    }
  });
});

// ── API routes ────────────────────────────────────────────────
app.use('/api/auth',      authRouter);
app.use('/api/questions', questionsRouter);
app.use('/api/scores',    scoresRouter);
app.use('/api/dashboard', dashboardRouter);

// ── SPA catch-all ─────────────────────────────────────────────
// Any non-API, non-static route returns index.html so that
// direct URL access (e.g. /dashboard.html) always resolves.
app.get('*', (req, res) => {
  res.sendFile(path.join(FRONTEND, 'index.html'));
});

// ── 404 + error handler ───────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Boot ─────────────────────────────────────────────────────
(async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log('\x1b[36m');
    console.log('  ╔═══════════════════════════════════════╗');
    console.log('  ║    QuizForge Full-Stack v3.0.0        ║');
    console.log('  ╚═══════════════════════════════════════╝');
    console.log('\x1b[0m');
    console.log(`  🌐 App        →  \x1b[32mhttp://localhost:${PORT}\x1b[0m`);
    console.log(`  🔑 Admin      →  \x1b[32mhttp://localhost:${PORT}/admin.html\x1b[0m`);
    console.log(`  📊 Dashboard  →  \x1b[32mhttp://localhost:${PORT}/dashboard.html\x1b[0m`);
    console.log(`  📖 API docs   →  \x1b[32mhttp://localhost:${PORT}/api\x1b[0m`);
    console.log(`  📁 Frontend   →  \x1b[32m${FRONTEND}\x1b[0m`);
    console.log();
  });

  const shutdown = async (sig) => {
    console.log(`\n[Server] ${sig} — shutting down...`);
    server.close(async () => { await disconnectDB(); process.exit(0); });
  };
  process.on('SIGINT',  () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
})();

module.exports = app;
