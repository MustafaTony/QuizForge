'use strict';

const express  = require('express');
const router   = express.Router();
const Question = require('../models/Question');
const { validateSubject, validateQuestionBody, VALID_SUBJECTS } = require('../middleware/validate');
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.get('/', async (req, res, next) => {
  try {
    const counts = await Question.aggregate([
      { $match: { active: true } },
      { $group: { _id: '$subject', count: { $sum: 1 } } },
      { $sort:  { _id: 1 } }
    ]);
    const result = Object.fromEntries(counts.map(c => [c._id, c.count]));
    res.json({ success: true, subjects: VALID_SUBJECTS, counts: result });
  } catch (err) { next(err); }
});

router.get('/search', async (req, res, next) => {
  try {
    const q       = (req.query.q       || '').trim();
    const subject = (req.query.subject || '').toLowerCase().trim();
    const limit   = Math.min(parseInt(req.query.limit, 10) || 20, 50);
    if (!q) return res.status(400).json({ success: false, error: 'Query param "q" is required' });
    const filter = { active: true, $text: { $search: q } };
    if (subject && VALID_SUBJECTS.includes(subject)) filter.subject = subject;
    const questions = await Question
      .find(filter, { score: { $meta: 'textScore' }, question: 1, options: 1, correct: 1, subject: 1, _id: 1 })
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit).lean();
    res.json({ success: true, query: q, total: questions.length, questions });
  } catch (err) { next(err); }
});

router.get('/all', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const subject = (req.query.subject || '').toLowerCase();
    const filter  = subject && VALID_SUBJECTS.includes(subject) ? { subject } : {};
    const questions = await Question.find(filter).sort({ subject: 1, createdAt: -1 }).lean();
    res.json({ success: true, total: questions.length, questions });
  } catch (err) { next(err); }
});

router.get('/:subject', validateSubject, async (req, res, next) => {
  try {
    const questions = await Question
      .find({ subject: req.subject, active: true })
      .select('question options correct -_id').lean();
    res.json({ success: true, subject: req.subject, total: questions.length, questions });
  } catch (err) { next(err); }
});

router.post('/', requireAuth, requireAdmin, validateQuestionBody, async (req, res, next) => {
  try {
    const { subject, question, options, correct } = req.body;
    const created = await Question.create({
      subject: subject.toLowerCase().trim(),
      question: question.trim(),
      options: options.map(o => String(o).trim()),
      correct: Number(correct)
    });
    res.status(201).json({ success: true, message: 'Question created',
      question: { id: created._id, subject: created.subject, question: created.question, options: created.options, correct: created.correct }
    });
  } catch (err) { next(err); }
});

router.put('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { subject, question, options, correct, active } = req.body;
    const update = {};
    if (subject  !== undefined) { if (!VALID_SUBJECTS.includes(subject.toLowerCase())) return res.status(400).json({ success: false, error: 'Invalid subject' }); update.subject = subject.toLowerCase().trim(); }
    if (question !== undefined) update.question = String(question).trim();
    if (options  !== undefined) { if (!Array.isArray(options) || options.length !== 4) return res.status(400).json({ success: false, error: 'options must be array of 4 strings' }); update.options = options.map(o => String(o).trim()); }
    if (correct  !== undefined) { const n = Number(correct); if (!Number.isInteger(n) || n < 0 || n > 3) return res.status(400).json({ success: false, error: 'correct must be 0-3' }); update.correct = n; }
    if (active   !== undefined) update.active = Boolean(active);
    const doc = await Question.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!doc) { const e = new Error('Question not found'); e.status = 404; return next(e); }
    res.json({ success: true, message: 'Question updated', question: doc });
  } catch (err) { next(err); }
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const doc = await Question.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
    if (!doc) { const e = new Error('Question not found'); e.status = 404; return next(e); }
    res.json({ success: true, message: 'Question deactivated', id: doc._id });
  } catch (err) { next(err); }
});

module.exports = router;
