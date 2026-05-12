'use strict';

const { Schema, model } = require('mongoose');

/**
 * Question Schema
 *
 * TEXT SAFETY NOTE:
 *   `question` and `options` are stored as plain strings.
 *   They may contain characters like < > & (e.g. HTML tag names written
 *   as text). Mongoose / MongoDB stores them as-is. JSON.stringify() does
 *   NOT interpret them as HTML. The frontend must render with textContent.
 */
const questionSchema = new Schema(
  {
    subject: {
      type:      String,
      required:  [true, 'subject is required'],
      lowercase: true,
      trim:      true,
      enum: {
        values:  ['html', 'css', 'javascript'],
        message: 'subject must be one of: html, css, javascript'
      },
      index: true
    },

    question: {
      type:     String,
      required: [true, 'question text is required'],
      trim:     true,
      minlength: [5, 'question must be at least 5 characters']
    },

    options: {
      type:     [String],
      required: [true, 'options are required'],
      validate: {
        validator: (arr) => arr.length === 4,
        message:   'options must contain exactly 4 items'
      }
    },

    correct: {
      type:     Number,
      required: [true, 'correct index is required'],
      min:      [0, 'correct must be 0–3'],
      max:      [3, 'correct must be 0–3']
    },

    // Optional: soft-delete / hide a question without removing it
    active: {
      type:    Boolean,
      default: true,
      index:   true
    }
  },
  {
    timestamps: true,   // createdAt + updatedAt
    versionKey: false
  }
);

// Compound text index for full-text search across question & options
questionSchema.index(
  { question: 'text', options: 'text' },
  { name: 'question_text_search', weights: { question: 10, options: 3 } }
);

module.exports = model('Question', questionSchema);
