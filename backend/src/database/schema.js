// backend/src/database/schema.js

const db = require('../config/db');

const SCHEMA_SQL = `

CREATE TABLE IF NOT EXISTS admins (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    username    TEXT UNIQUE NOT NULL,
    email       TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role        TEXT CHECK(role IN ('super_admin', 'admin')) NOT NULL DEFAULT 'admin',
    status      TEXT CHECK(status IN ('active', 'disabled')) NOT NULL DEFAULT 'active',
    totp_secret      TEXT,
    totp_enabled     INTEGER DEFAULT 0,
    recovery_codes   TEXT,
    last_login_at     TEXT,
    last_login_ip     TEXT,
    last_login_device TEXT,
    created_at  TEXT DEFAULT (datetime('now')),
    updated_at  TEXT DEFAULT (datetime('now'))
);

CREATE TRIGGER IF NOT EXISTS trg_admins_updated_at
AFTER UPDATE ON admins
BEGIN
    UPDATE admins SET updated_at = datetime('now') WHERE id = OLD.id;
END;

CREATE TABLE IF NOT EXISTS admin_sessions (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id     INTEGER NOT NULL,
    device_token TEXT NOT NULL,
    ip_address   TEXT,
    user_agent   TEXT,
    last_seen_at TEXT DEFAULT (datetime('now')),
    expires_at   TEXT NOT NULL,
    created_at   TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS login_attempts (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    ip_address TEXT NOT NULL,
    username   TEXT,
    success    INTEGER DEFAULT 0,
    attempted_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS activity_logs (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id   INTEGER,
    action     TEXT NOT NULL,
    target     TEXT,
    detail     TEXT,
    ip_address TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS inquiries (
    id                TEXT PRIMARY KEY,
    name              TEXT NOT NULL,
    contact           TEXT NOT NULL,
    phone4            TEXT NOT NULL,
    social            TEXT,
    occasion          TEXT,
    bouquet_type      TEXT NOT NULL,
    bouquet_name      TEXT,
    event_date        TEXT,
    target_time       TEXT,
    fulfillment       TEXT CHECK(fulfillment IN ('pickup', 'delivery')),
    pickup_location   TEXT,
    delivery_address  TEXT,
    delivery_landmark TEXT,
    delivery_booker   TEXT,
    receiver_name     TEXT,
    receiver_contact  TEXT,
    details           TEXT,
    add_ons           TEXT,
    preferred_budget  TEXT,
    peg_image_url     TEXT,
    status            TEXT CHECK(status IN ('pending','confirmed','in_progress','ready','out_for_delivery','completed','cancelled'))
                      NOT NULL DEFAULT 'pending',
    admin_notes       TEXT,
    created_at        TEXT DEFAULT (datetime('now')),
    updated_at        TEXT DEFAULT (datetime('now'))
);

CREATE TRIGGER IF NOT EXISTS trg_inquiries_updated_at
AFTER UPDATE ON inquiries
BEGIN
    UPDATE inquiries SET updated_at = datetime('now') WHERE id = OLD.id;
END;

`;

const MIGRATIONS_SQL = [
    `ALTER TABLE admins ADD COLUMN totp_enabled INTEGER DEFAULT 0`,
    `ALTER TABLE admins ADD COLUMN recovery_codes TEXT`,
    `ALTER TABLE admins ADD COLUMN last_login_device TEXT`,
];

function initSchema() {
    try {
        console.log('Initializing Database Schema...');
        db.exec(SCHEMA_SQL);

        MIGRATIONS_SQL.forEach(sql => {
            try {
                db.prepare(sql).run();
            } catch (e) {
                if (!e.message.includes('duplicate column name')) throw e;
            }
        });

        console.log('✅ Schema applied successfully.');
    } catch (error) {
        console.error('❌ Error applying schema:', error.message);
        throw error;
    }
}

module.exports = { initSchema };