// backend/src/routes/transaction.routes.js
const express = require('express');
const db      = require('../config/db');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

function generateRef() {
  const now   = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}`;
  const count = db.prepare('SELECT COUNT(*) as c FROM transactions').get().c + 1;
  return `TXN-${stamp}-${String(count).padStart(4,'0')}`;
}

// GET /api/transactions
router.get('/', authMiddleware, (req, res) => {
  const { type, payment_status, date_from, date_to, page = 1, limit = 20 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  let where  = 'WHERE 1=1';
  const params = [];

  if (type)           { where += ' AND type = ?';           params.push(type); }
  if (payment_status) { where += ' AND payment_status = ?'; params.push(payment_status); }
  if (date_from)      { where += ' AND date(created_at) >= ?'; params.push(date_from); }
  if (date_to)        { where += ' AND date(created_at) <= ?'; params.push(date_to); }

  const total   = db.prepare(`SELECT COUNT(*) as c FROM transactions ${where}`).get(...params).c;
  const revenue = db.prepare(`SELECT COALESCE(SUM(total),0) as s FROM transactions ${where} AND payment_status = 'paid'`).get(...params).s;
  const rows    = db.prepare(`
    SELECT * FROM transactions ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?
  `).all(...params, Number(limit), offset);

  res.json({ data: rows, total, revenue, page: Number(page), limit: Number(limit) });
});

// GET /api/transactions/:id — with items
router.get('/:id', authMiddleware, (req, res) => {
  const txn = db.prepare('SELECT * FROM transactions WHERE id = ?').get(req.params.id);
  if (!txn) return res.status(404).json({ message: 'Not found' });
  const items = db.prepare('SELECT * FROM transaction_items WHERE transaction_id = ?').all(req.params.id);
  res.json({ ...txn, items });
});

// POST /api/transactions — POS sale
router.post('/', authMiddleware, (req, res) => {
  const { customer_id, customer_name, type, items, discount = 0, payment_method, payment_status, notes } = req.body;

  if (!items?.length)
    return res.status(400).json({ message: 'items are required' });

  const total    = items.reduce((sum, i) => sum + (i.qty * i.unit_price), 0) - discount;
  const reference = generateRef();

  const insertTxn = db.transaction(() => {
    const r = db.prepare(`
      INSERT INTO transactions (reference, customer_id, customer_name, type, total, discount, payment_method, payment_status, notes, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(reference, customer_id || null, customer_name || null, type || 'sale', total, discount, payment_method || 'cash', payment_status || 'paid', notes || null, req.user.id);

    const txn_id = r.lastInsertRowid;

    for (const item of items) {
      const subtotal = item.qty * item.unit_price;
      db.prepare(`
        INSERT INTO transaction_items (transaction_id, product_id, name, qty, unit_price, subtotal)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(txn_id, item.product_id || null, item.name, item.qty, item.unit_price, subtotal);

      // Deduct stock if product_id given
      if (item.product_id) {
        db.prepare("UPDATE products SET stock = MAX(0, stock - ?), updated_at = datetime('now') WHERE id = ?")
          .run(item.qty, item.product_id);
      }
    }

    return txn_id;
  });

  const id = insertTxn();
  res.status(201).json({ id, reference, total, message: 'Transaction recorded' });
});

// DELETE /api/transactions/:id
router.delete('/:id', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM transactions WHERE id = ?').run(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;