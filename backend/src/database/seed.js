// backend/src/database/seed.js
require('dotenv').config();
const bcrypt           = require('bcryptjs');
const db               = require('../config/db');
const { createSchema } = require('./schema');

async function seed() {
  createSchema();

  // Clear in dependency-safe order
  db.exec(`
    DELETE FROM transaction_items;
    DELETE FROM transactions;
    DELETE FROM expenses;
    DELETE FROM inquiries;
    DELETE FROM products;
    DELETE FROM customers;
    DELETE FROM users;
  `);

  // Admin user
  const hash = await bcrypt.hash('admin123', 12);
  db.prepare(`
    INSERT INTO users (name, email, password, role)
    VALUES (?, ?, ?, ?)
  `).run('Admin', 'admin@btbba.com', hash, 'admin');

  console.log('👤 Admin user created → admin@btbba.com / admin123');

  // Products
  const insertProduct = db.prepare(`
    INSERT INTO products (name, category, description, price, stock, sku)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  [
    ['Garden Rose Bouquet',       'bouquet',     'Fresh garden roses, hand-tied with ribbon',     850,  10, 'BTB-BQ-001'],
    ['Pastel Peony Arrangement',  'arrangement', 'Soft peonies with eucalyptus sprigs',           1200,  5, 'BTB-AR-001'],
    ['Sunflower Pop Bundle',      'bouquet',     'Bright sunflowers for celebrations',             650,   8, 'BTB-BQ-002'],
    ['Dried Pampas Set',          'dried',       'Long-lasting dried pampas grass arrangement',   950,   6, 'BTB-DR-001'],
    ['Red Rose Classic (12pcs)',  'bouquet',     'Classic red roses for romance',                1500,   7, 'BTB-BQ-003'],
    ['White Lily Arrangement',    'arrangement', 'Elegant white lilies for weddings or sympathy',1100,   4, 'BTB-AR-002'],
    ['Single Stem Rose',          'stem',        'Individual fresh stems, choose your color',      85,  50, 'BTB-ST-001'],
    ['Ribbon & Wrap Accessory',   'accessory',   'Premium kraft wrapping and satin ribbon',       120,  30, 'BTB-AC-001'],
    ['Lavender Bunch',            'seasonal',    'Fragrant dried lavender bundles',               550,  12, 'BTB-SE-001'],
    ['Mixed Wildflower Bouquet',  'bouquet',     'Seasonal wildflowers, rustic and charming',     750,   9, 'BTB-BQ-004'],
  ].forEach(p => insertProduct.run(...p));

  console.log('🌸 Products seeded');

  // Customers
  const insertCustomer = db.prepare(`
    INSERT INTO customers (name, contact, email) VALUES (?, ?, ?)
  `);
  const c1 = insertCustomer.run('Maria Santos',  '09171234567', 'maria@email.com');
  const c2 = insertCustomer.run('Jose Reyes',    '09281234567', null);
  const c3 = insertCustomer.run('Ana Dela Cruz', '09391234567', 'ana@email.com');

  console.log('👥 Customers seeded');

  // Inquiries
  const insertInquiry = db.prepare(`
    INSERT INTO inquiries (tracking_id, customer_id, name, contact, email, service, budget, event_date, message, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertInquiry.run('BTB-2026-001', c1.lastInsertRowid, 'Maria Santos',  '09171234567', 'maria@email.com', 'Custom Bouquet',       '₱500–₱1,000',  '2026-05-20', 'Pink and white bouquet for our anniversary.',            'confirmed');
  insertInquiry.run('BTB-2026-002', c2.lastInsertRowid, 'Jose Reyes',    '09281234567', null,              'Pre-Order',            '₱1,000–₱2,500','2026-05-25', 'Sunflower and rose arrangement for a birthday surprise.','in_progress');
  insertInquiry.run('BTB-2026-003', c3.lastInsertRowid, 'Ana Dela Cruz', '09391234567', 'ana@email.com',   'Custom Bouquet',       'Under ₱500',   null,         'Simple but pretty bouquet for a friend.',                'pending');
  insertInquiry.run('BTB-2026-004', null,               'Guest User',    '09501234567', null,              'Flower Shop Pick-Up',  'Under ₱500',   null,         'Just want to pick up a single bouquet.',                 'pending');

  console.log('📋 Inquiries seeded');

  // Expenses
  const insertExpense = db.prepare(`
    INSERT INTO expenses (category, description, amount, date, created_by)
    VALUES (?, ?, ?, ?, ?)
  `);
  insertExpense.run('supplies',  'Fresh roses from supplier',     1200, '2026-05-01', 1);
  insertExpense.run('supplies',  'Kraft wrapping paper bulk buy',  450, '2026-05-03', 1);
  insertExpense.run('transport', 'Delivery to customer - Sta Cruz',150, '2026-05-05', 1);
  insertExpense.run('marketing', 'Facebook Ads boost - May',       500, '2026-05-07', 1);

  console.log('💸 Expenses seeded');

  console.log('\n✅ Seed complete!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔐 Login: admin@btbba.com');
  console.log('🔑 Password: admin123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});