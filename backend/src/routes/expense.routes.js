// backend/src/routes/expense.routes.js
const express = require('express');
const db      = require('../config/db');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

// GET /api/expenses
router.get('/', authMiddleware, (req, res) => {
  const { category, date_from, date_to, page = 1, limit = 20 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  let where  = 'WHERE 1=1';
  const params = [];

  if (category) { where += ' AND category = ?'; params.push(category); }
  if (date_from){ where += ' AND date >= ?';    params.push(date_from); }
  if (date_to)  { where += ' AND date <= ?';    params.push(date_to); }

  const total  = db.prepare(`SELECT COUNT(*) as c FROM expenses ${where}`).get(...params).c;
  const sumAmt = db.prepare(`SELECT COALESCE(SUM(amount),0) as s FROM expenses ${where}`).get(...params).s;
  const rows   = db.prepare(`
    SELECT e.*, u.name as created_by_name FROM expenses e
    LEFT JOIN users u ON u.id = e.created_by
    ${where} ORDER BY e.date DESC, e.created_at DESC LIMIT ? OFFSET ?
  `).all(...params, Number(limit), offset);

  res.json({ data: rows, total, total_amount: sumAmt, page: Number(page), limit: Number(limit) });
});

// POST /api/expenses
router.post('/', authMiddleware, (req, res) => {
  const { category, description, amount, date, receipt_ref } = req.body;
  if (!category || !description || !amount)
    return res.status(400).json({ message: 'category, description, amount required' });

  const r = db.prepare(`
    INSERT INTO expenses (category, description, amount, date, receipt_ref, created_by)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(category, description, amount, date || new Date().toISOString().split('T')[0], receipt_ref || null, req.user.id);

  res.status(201).json({ id: r.lastInsertRowid, message: 'Expense recorded' });
});

// PUT /api/expenses/:id
router.put('/:id', authMiddleware, (req, res) => {
  const { category, description, amount, date, receipt_ref } = req.body;

  db.prepare(`
    UPDATE expenses SET category = ?, description = ?, amount = ?, date = ?, receipt_ref = ? WHERE id = ?
  `).run(category, description, amount, date, receipt_ref || null, req.params.id);

  res.json({ message: 'Expense updated' });
});

// DELETE /api/expenses/:id
router.delete('/:id', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM expenses WHERE id = ?').run(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;