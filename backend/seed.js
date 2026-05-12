'use strict';

require('dotenv').config();

const { connectDB, disconnectDB } = require('./db');
const Question = require('./models/Question');
const User     = require('./models/User');
const seedData = require('./data/questions');

async function seed() {
  console.log('\n🌱  QuizForge — Database Seeder v3');
  console.log('─'.repeat(42));

  await connectDB();

  // ── Questions ───────────────────────────────────────────────
  const deleted = await Question.deleteMany({});
  console.log(`[Seed] 🗑   Cleared ${deleted.deletedCount} question(s)`);

  const inserted = await Question.insertMany(seedData, { ordered: false });
  console.log(`[Seed] ✅  Inserted ${inserted.length} question(s)`);

  const subjects = [...new Set(seedData.map(q => q.subject))];
  subjects.forEach(s => {
    const n = inserted.filter(q => q.subject === s).length;
    console.log(`         • ${s.padEnd(12)} ${n} questions`);
  });

  // ── Admin user ──────────────────────────────────────────────
  const ADMIN_EMAIL    = 'admin@quizforge.com';
  const ADMIN_PASSWORD = 'admin123';
  const ADMIN_USERNAME = 'admin';

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    console.log('[Seed] ℹ️   Admin user already exists — skipping');
  } else {
    await User.create({
      username: ADMIN_USERNAME,
      email:    ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role:     'admin'
    });
    console.log('[Seed] 👤  Admin user created:');
    console.log(`         • email:    ${ADMIN_EMAIL}`);
    console.log(`         • password: ${ADMIN_PASSWORD}`);
    console.log('         ⚠️  Change the password after first login!');
  }

  await disconnectDB();
  console.log('\n✔  Seeding complete.\n');
  process.exit(0);
}

seed().catch(err => {
  console.error('[Seed] ❌ Fatal error:', err.message);
  process.exit(1);
});
