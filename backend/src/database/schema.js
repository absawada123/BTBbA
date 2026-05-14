// backend/src/database/schema.js
const db = require('../config/db');

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS admins (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, email TEXT UNIQUE, password_hash TEXT, role TEXT, status TEXT, totp_secret TEXT, totp_enabled INTEGER, recovery_codes TEXT, last_login_at TEXT, last_login_ip TEXT, last_login_device TEXT, created_at TEXT, updated_at TEXT);
CREATE TABLE IF NOT EXISTS admin_sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, admin_id INTEGER, device_token TEXT, ip_address TEXT, user_agent TEXT, last_seen_at TEXT, expires_at TEXT, created_at TEXT);
CREATE TABLE IF NOT EXISTS login_attempts (id INTEGER PRIMARY KEY AUTOINCREMENT, ip_address TEXT, username TEXT, success INTEGER, attempted_at TEXT);
CREATE TABLE IF NOT EXISTS activity_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, admin_id INTEGER, action TEXT, target TEXT, detail TEXT, ip_address TEXT, created_at TEXT);
CREATE TABLE IF NOT EXISTS inquiries (id TEXT PRIMARY KEY, order_number TEXT, name TEXT, contact TEXT, phone4 TEXT, social TEXT, occasion TEXT, bouquet_type TEXT, bouquet_name TEXT, details TEXT, add_ons TEXT, preferred_budget TEXT, event_date TEXT, target_time TEXT, fulfillment TEXT, pickup_location TEXT, delivery_address TEXT, delivery_landmark TEXT, delivery_booker TEXT, delivery_tracking TEXT, receiver_name TEXT, receiver_contact TEXT, status TEXT, is_archived INTEGER, priority_tags TEXT, total_amount REAL, downpayment REAL, amount_paid REAL, payment_status TEXT, admin_notes TEXT, peg_image_url TEXT, created_at TEXT, updated_at TEXT);
CREATE TABLE IF NOT EXISTS inquiry_items (id INTEGER PRIMARY KEY AUTOINCREMENT, inquiry_id TEXT, item_type TEXT, name TEXT, description TEXT, quantity INTEGER, unit_price REAL, sort_order INTEGER, created_at TEXT);
CREATE TABLE IF NOT EXISTS inquiry_attachments (id INTEGER PRIMARY KEY AUTOINCREMENT, inquiry_id TEXT, attach_type TEXT, label TEXT, url TEXT, is_external INTEGER, uploaded_by TEXT, created_at TEXT);
CREATE TABLE IF NOT EXISTS inquiry_notes (id INTEGER PRIMARY KEY AUTOINCREMENT, inquiry_id TEXT, admin_id INTEGER, note TEXT, created_at TEXT);
CREATE TABLE IF NOT EXISTS inquiry_timeline (id INTEGER PRIMARY KEY AUTOINCREMENT, inquiry_id TEXT, admin_id INTEGER, event_type TEXT, from_status TEXT, to_status TEXT, description TEXT, created_at TEXT);
`;

function initSchema() {
    // Only run if db.exec exists (SQLite case)
    if (typeof db.exec === 'function') {
        db.exec(SCHEMA_SQL);
        console.log('✅ Local SQLite Schema initialized.');
    } else {
        console.log('⚠️ Skipping Schema Initialization (Supabase detected).');
    }
}

module.exports = { initSchema };