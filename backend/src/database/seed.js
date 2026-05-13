// backend/src/database/seed.js

const db     = require('../config/db');
const bcrypt = require('bcrypt');

async function seedAdmin() {
    const existing = db.prepare(`SELECT id FROM admins WHERE username = ?`).get('admin');
    if (existing) {
        console.log('ℹ️  Admin already exists — skipping seed.');
        return;
    }

    const hash = await bcrypt.hash('btbbya2024', 12);

    db.prepare(`
        INSERT INTO admins (username, email, password_hash, role, status)
        VALUES (?, ?, ?, 'super_admin', 'active')
    `).run('admin', 'admin@btbbya.com', hash);

    console.log('✅ Seeded admin account.');
    console.log('   Username : admin');
    console.log('   Password : btbbya2024');
    console.log('   ⚠️  Change this password after first login.');
}

module.exports = { seedAdmin };