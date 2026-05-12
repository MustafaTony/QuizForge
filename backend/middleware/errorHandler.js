'use strict';

function notFound(req, res, next) {
  const err = new Error(`Not Found — ${req.method} ${req.originalUrl}`);
  err.status = 404;
  next(err);
}

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ success: false, error: messages.join('; ') });
  }
  if (err.code === 11000) {
    return res.status(409).json({ success: false, error: 'Duplicate entry' });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, error: 'Invalid ID format' });
  }

  const status  = err.status || 500;
  const message = err.message || 'Internal Server Error';
  if (status >= 500) console.error('[Error]', err);
  res.status(status).json({ success: false, error: message });
}

module.exports = { notFound, errorHandler };
