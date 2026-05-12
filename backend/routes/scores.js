'use strict';

const express = require('express');
const router  = express.Router();
const { VALID_SUBJECTS } = require('../middleware/validate');

// In-memory store — replace with a Mongoose model for persistence
const scoreStore = [];
let nextId = 1;

// ─────────────────────────────────────────────────────────────
// POST /api/scores
// ─────────────────────────────────────────────────────────────
router.post('/', (req, res, next) => {
  const { subject, score, total, playerName } = req.body;

  if (!subject || score === undefined || total === undefined) {
    const err = new Error('Missing required fields: subject, score, total');
    err.status = 400;
    return next(err);
  }

  if (!VALID_SUBJECTS.includes(subject.toLowerCase())) {
    const err = new Error(`Invalid subject. Must be one of: ${VALID_SUBJECTS.join(', ')}`);
    err.status = 400;
    return next(err);
  }

  if (!Number.isInteger(score) || !Number.isInteger(total) || score < 0 || score > total || total <= 0) {
    const err = new Error('score and total must be valid integers (0 ≤ score ≤ total, total > 0)');
    err.status = 400;
    return next(err);
  }

  const entry = {
    id:          nextId++,
    subject:     subject.toLowerCase(),
    score,
    total,
    percentage:  Math.round((score / total) * 100),
    playerName:  typeof playerName === 'string' ? playerName.trim().slice(0, 50) : 'Anonymous',
    submittedAt: new Date().toISOString()
  };

  scoreStore.push(entry);
  res.status(201).json({ success: true, message: 'Score saved', entry });
});

// ─────────────────────────────────────────────────────────────
// GET /api/scores  — ?subject=html&limit=20
// ─────────────────────────────────────────────────────────────
router.get('/', (req, res, next) => {
  const subject    = (req.query.subject || '').toLowerCase();
  const limit      = Math.min(parseInt(req.query.limit, 10) || 50, 100);

  if (isNaN(limit) || limit <= 0) {
    const err = new Error('limit must be a positive integer');
    err.status = 400;
    return next(err);
  }

  let results = [...scoreStore].reverse();
  if (subject && VALID_SUBJECTS.includes(subject)) {
    results = results.filter(e => e.subject === subject);
  }

  res.json({ success: true, total: results.length, scores: results.slice(0, limit) });
});

// ─────────────────────────────────────────────────────────────
// GET /api/scores/leaderboard
// ─────────────────────────────────────────────────────────────
router.get('/leaderboard', (req, res) => {
  const leaderboard = {};

  VALID_SUBJECTS.forEach(sub => {
    leaderboard[sub] = scoreStore
      .filter(e => e.subject === sub)
      .sort((a, b) => b.percentage - a.percentage || b.score - a.score)
      .slice(0, 10);
  });

  res.json({ success: true, leaderboard });
});

// ─────────────────────────────────────────────────────────────
// DELETE /api/scores  — clear all (dev / testing)
// ─────────────────────────────────────────────────────────────
router.delete('/', (req, res) => {
  scoreStore.length = 0;
  nextId = 1;
  res.json({ success: true, message: 'All scores cleared' });
});

module.exports = router;
// (file already complete — appended no-op to confirm write)
