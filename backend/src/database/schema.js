// backend/src/database/schema.js
const db = require('../config/db');

function createSchema() {
  db.exec(`
    -- Users (admin/staff)
    CREATE TABLE IF NOT EXISTS users (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      name         TEXT    NOT NULL,
      email        TEXT    NOT NULL UNIQUE,
      password     TEXT    NOT NULL,
      role         TEXT    NOT NULL DEFAULT 'staff' CHECK(role IN ('admin','staff')),
      is_active    INTEGER NOT NULL DEFAULT 1,
      created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at   TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    -- Customers
    CREATE TABLE IF NOT EXISTS customers (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      name         TEXT    NOT NULL,
      contact      TEXT    NOT NULL,
      email        TEXT,
      address      TEXT,
      notes        TEXT,
      total_orders INTEGER NOT NULL DEFAULT 0,
      created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at   TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    -- Inquiries / Orders
    CREATE TABLE IF NOT EXISTS inquiries (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      tracking_id  TEXT    NOT NULL UNIQUE,
      customer_id  INTEGER REFERENCES customers(id),
      name         TEXT    NOT NULL,
      contact      TEXT    NOT NULL,
      email        TEXT,
      service      TEXT    NOT NULL CHECK(service IN ('Custom Bouquet','Pop-Up Event','Pre-Order','Flower Shop Pick-Up')),
      budget       TEXT    NOT NULL,
      event_date   TEXT,
      message      TEXT    NOT NULL,
      status       TEXT    NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','confirmed','in_progress','ready','completed','cancelled')),
      notes        TEXT,
      assigned_to  INTEGER REFERENCES users(id),
      created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at   TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    -- Products / Inventory
    CREATE TABLE IF NOT EXISTS products (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      name         TEXT    NOT NULL,
      category     TEXT    NOT NULL CHECK(category IN ('bouquet','arrangement','stem','accessory','dried','seasonal')),
      description  TEXT,
      price        REAL    NOT NULL DEFAULT 0,
      stock        INTEGER NOT NULL DEFAULT 0,
      low_stock_at INTEGER NOT NULL DEFAULT 5,
      sku          TEXT    UNIQUE,
      is_active    INTEGER NOT NULL DEFAULT 1,
      created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at   TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    -- POS Transactions
    CREATE TABLE IF NOT EXISTS transactions (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      reference      TEXT    NOT NULL UNIQUE,
      customer_id    INTEGER REFERENCES customers(id),
      customer_name  TEXT,
      type           TEXT    NOT NULL DEFAULT 'sale' CHECK(type IN ('sale','popup','preorder','refund')),
      total          REAL    NOT NULL DEFAULT 0,
      discount       REAL    NOT NULL DEFAULT 0,
      payment_method TEXT    NOT NULL DEFAULT 'cash' CHECK(payment_method IN ('cash','gcash','maya','bank','other')),
      payment_status TEXT    NOT NULL DEFAULT 'paid' CHECK(payment_status IN ('paid','pending','partial','refunded')),
      notes          TEXT,
      created_by     INTEGER REFERENCES users(id),
      created_at     TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    -- Transaction Items
    CREATE TABLE IF NOT EXISTS transaction_items (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      transaction_id INTEGER NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
      product_id     INTEGER REFERENCES products(id),
      name           TEXT    NOT NULL,
      qty            INTEGER NOT NULL DEFAULT 1,
      unit_price     REAL    NOT NULL DEFAULT 0,
      subtotal       REAL    NOT NULL DEFAULT 0
    );

    -- Expenses
    CREATE TABLE IF NOT EXISTS expenses (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      category     TEXT    NOT NULL CHECK(category IN ('supplies','transport','marketing','utilities','salary','other')),
      description  TEXT    NOT NULL,
      amount       REAL    NOT NULL DEFAULT 0,
      date         TEXT    NOT NULL DEFAULT (date('now')),
      receipt_ref  TEXT,
      created_by   INTEGER REFERENCES users(id),
      created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    -- Indexes
    CREATE INDEX IF NOT EXISTS idx_inquiries_tracking ON inquiries(tracking_id);
    CREATE INDEX IF NOT EXISTS idx_inquiries_status   ON inquiries(status);
    CREATE INDEX IF NOT EXISTS idx_transactions_date  ON transactions(created_at);
    CREATE INDEX IF NOT EXISTS idx_products_category  ON products(category);
    CREATE INDEX IF NOT EXISTS idx_expenses_date      ON expenses(date);
  `);

  console.log('✅ Schema created successfully');
}

module.exports = { createSchema };