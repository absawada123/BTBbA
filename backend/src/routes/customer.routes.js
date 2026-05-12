// backend/src/routes/customer.routes.js
const express = require('express');
const db      = require('../config/db');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

// GET /api/customers
router.get('/', authMiddleware, (req, res) => {
  const { search, page = 1, limit = 20 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  let where  = 'WHERE 1=1';
  const params = [];

  if (search) {
    where += ' AND (name LIKE ? OR contact LIKE ? OR email LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  const total = db.prepare(`SELECT COUNT(*) as c FROM customers ${where}`).get(...params).c;
  const rows  = db.prepare(`
    SELECT * FROM customers ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?
  `).all(...params, Number(limit), offset);

  res.json({ data: rows, total, page: Number(page), limit: Number(limit) });
});

// GET /api/customers/:id — with order history
router.get('/:id', authMiddleware, (req, res) => {
  const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id);
  if (!customer) return res.status(404).json({ message: 'Not found' });

  const inquiries    = db.prepare('SELECT * FROM inquiries WHERE customer_id = ? ORDER BY created_at DESC').all(req.params.id);
  const transactions = db.prepare('SELECT * FROM transactions WHERE customer_id = ? ORDER BY created_at DESC').all(req.params.id);

  res.json({ ...customer, inquiries, transactions });
});

// POST /api/customers
router.post('/', authMiddleware, (req, res) => {
  const { name, contact, email, address, notes } = req.body;
  if (!name || !contact)
    return res.status(400).json({ message: 'name and contact are required' });

  const exists = db.prepare('SELECT id FROM customers WHERE contact = ?').get(contact);
  if (exists) return res.status(409).json({ message: 'Customer with this contact already exists', id: exists.id });

  const r = db.prepare(`
    INSERT INTO customers (name, contact, email, address, notes) VALUES (?, ?, ?, ?, ?)
  `).run(name, contact, email || null, address || null, notes || null);

  res.status(201).json({ id: r.lastInsertRowid, message: 'Customer created' });
});

// PUT /api/customers/:id
router.put('/:id', authMiddleware, (req, res) => {
  const { name, contact, email, address, notes } = req.body;

  db.prepare(`
    UPDATE customers SET name = ?, contact = ?, email = ?, address = ?, notes = ?, updated_at = datetime('now')
    WHERE id = ?
  `).run(name, contact, email || null, address || null, notes || null, req.params.id);

  res.json({ message: 'Customer updated' });
});

// DELETE /api/customers/:id
router.delete('/:id', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM customers WHERE id = ?').run(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;