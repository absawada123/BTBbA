// backend/src/config/db.js
const Database = require('better-sqlite3');
const path     = require('path');
const os       = require('os');
const fs       = require('fs');

const dirPath = path.join(os.homedir(), 'Documents', 'BTBbyA');
const dbPath  = path.join(dirPath, 'btbbya2.db');

if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
  console.log(`📁 Created database directory at: ${dirPath}`);
}

const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.pragma('synchronous = NORMAL');

console.log(`🗄️  Database connected at: ${dbPath}`);

module.exports = db;