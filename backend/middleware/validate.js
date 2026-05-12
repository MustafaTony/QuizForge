'use strict';

const VALID_SUBJECTS = ['html', 'css', 'javascript'];

/**
 * Validates :subject route param.
 * Attaches the cleaned value to req.subject.
 */
function validateSubject(req, res, next) {
  const subject = (req.params.subject || '').toLowerCase().trim();

  if (!VALID_SUBJECTS.includes(subject)) {
    const err = new Error(
      `Unknown subject "${subject}". Valid: ${VALID_SUBJECTS.join(', ')}`
    );
    err.status = 404;
    return next(err);
  }

  req.subject = subject;
  next();
}

/**
 * Validates the body of POST /api/questions.
 */
function validateQuestionBody(req, res, next) {
  const { subject, question, options, correct } = req.body;
  const errors = [];

  if (!subject || !VALID_SUBJECTS.includes(subject.toLowerCase())) {
    errors.push(`subject must be one of: ${VALID_SUBJECTS.join(', ')}`);
  }
  if (!question || typeof question !== 'string' || question.trim().length < 5) {
    errors.push('question must be a string of at least 5 characters');
  }
  if (!Array.isArray(options) || options.length !== 4) {
    errors.push('options must be an array of exactly 4 strings');
  }
  if (!Number.isInteger(correct) || correct < 0 || correct > 3) {
    errors.push('correct must be an integer between 0 and 3');
  }

  if (errors.length) {
    return res.status(400).json({ success: false, errors });
  }

  next();
}

module.exports = { validateSubject, validateQuestionBody, VALID_SUBJECTS };
