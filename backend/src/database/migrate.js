// backend/src/database/migrate.js

const { initDb } = require('./schema');
const { seed } = require('./seed');

function migrate() {
  console.log('🔧 Running HabibiFunds migration...');

  const db = initDb();

  console.log('✅ Schema initialized.');

  return db;
}

function migrateAndSeed() {
  const db = migrate();

  console.log('🌱 Running seed...');
  seed();

  console.log('✅ Migration and seed complete.');
  return db;
}

module.exports = { migrate, migrateAndSeed };
