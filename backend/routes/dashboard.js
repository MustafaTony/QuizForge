'use strict';

const express  = require('express');
const router   = express.Router();
const Question = require('../models/Question');
const { VALID_SUBJECTS } = require('../middleware/validate');

// ─────────────────────────────────────────────────────────────
// GET /api/dashboard/stats
// Returns aggregate statistics about the question bank
// ─────────────────────────────────────────────────────────────
router.get('/stats', async (req, res, next) => {
  try {
    const [perSubject, totalAll, totalActive] = await Promise.all([
      // Count active questions grouped by subject
      Question.aggregate([
        { $group: {
          _id:    '$subject',
          total:  { $sum: 1 },
          active: { $sum: { $cond: ['$active', 1, 0] } }
        }},
        { $sort: { _id: 1 } }
      ]),

      // Total questions (including inactive)
      Question.countDocuments({}),

      // Active questions only
      Question.countDocuments({ active: true })
    ]);

    // Build per-subject map with zero-fill for subjects with no questions
    const bySubject = {};
    VALID_SUBJECTS.forEach(s => {
      bySubject[s] = { total: 0, active: 0 };
    });
    perSubject.forEach(row => {
      bySubject[row._id] = { total: row.total, active: row.active };
    });

    res.json({
      success: true,
      stats: {
        totalQuestions:   totalAll,
        activeQuestions:  totalActive,
        inactiveQuestions: totalAll - totalActive,
        totalSubjects:    VALID_SUBJECTS.length,
        subjects:         VALID_SUBJECTS,
        bySubject
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
