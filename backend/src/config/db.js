// backend/src/config/db.js
const Database = require('better-sqlite3');
const path = require('path');
const os = require('os');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

let db;

if (isProduction) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY must be set in production");
  }

  db = createClient(supabaseUrl, supabaseKey);
  console.log("☁️ Connected to Supabase (Production Mode)");
} else {
  const dirPath = path.join(os.homedir(), 'Documents', 'BTBbyA');
  const dbPath = path.join(dirPath, 'btbbya2.db');

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.pragma('synchronous = NORMAL');
  console.log(`🗄️ Connected to SQLite at: ${dbPath}`);
}

module.exports = db;