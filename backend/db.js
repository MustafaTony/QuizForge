'use strict';

const mongoose = require('mongoose');

/**
 * Opens the Mongoose connection to MongoDB.
 * Reads MONGO_URI from environment (loaded by dotenv in server.js / seed.js).
 * Exits the process on failure — no point running without a DB.
 */
async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('[DB] ❌  MONGO_URI is not defined in your .env file');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      // These are the recommended options for Mongoose 8+
      serverSelectionTimeoutMS: 5000,
    });

    const host = mongoose.connection.host;
    const name = mongoose.connection.name;
    console.log(`[DB] ✅  MongoDB connected → ${host} / ${name}`);
  } catch (err) {
    console.error('[DB] ❌  Connection failed:', err.message);
    process.exit(1);
  }
}

/**
 * Gracefully closes the Mongoose connection.
 * Called during shutdown signals.
 */
async function disconnectDB() {
  await mongoose.connection.close();
  console.log('[DB] 🔌  MongoDB connection closed');
}

module.exports = { connectDB, disconnectDB };
