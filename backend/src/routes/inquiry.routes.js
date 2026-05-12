// backend/src/routes/inquiry.routes.js
const express = require('express');
const db      = require('../config/db');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

// Generate tracking ID
function generateTrackingId() {
  const year  = new Date().getFullYear();
  const count = db.prepare('SELECT COUNT(*) as c FROM inquiries').get().c + 1;
  return `BTB-${year}-${String(count).padStart(3, '0')}`;
}

// POST /api/inquiries — public (submit order)
router.post('/', (req, res) => {
  const { name, contact, email, service, budget, event_date, message } = req.body;

  if (!name || !contact || !service || !budget || !message)
    return res.status(400).json({ message: 'Required fields: name, contact, service, budget, message' });

  const tracking_id = generateTrackingId();

  // Upsert customer
  let customer = db.prepare('SELECT id FROM customers WHERE contact = ?').get(contact);
  if (!customer) {
    const r = db.prepare('INSERT INTO customers (name, contact, email) VALUES (?, ?, ?)').run(name, contact, email || null);
    customer = { id: r.lastInsertRowid };
  }

  const result = db.prepare(`
    INSERT INTO inquiries (tracking_id, customer_id, name, contact, email, service, budget, event_date, message)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(tracking_id, customer.id, name, contact, email || null, service, budget, event_date || null, message);

  res.status(201).json({
    id: result.lastInsertRowid,
    tracking_id,
    message: 'Inquiry submitted successfully',
  });
});

// GET /api/inquiries/track/:trackingId — public (track order)
router.get('/track/:trackingId', (req, res) => {
  const inquiry = db.prepare(`
    SELECT id, tracking_id, name, service, status, budget, event_date, message, created_at
    FROM inquiries WHERE tracking_id = ?
  `).get(req.params.trackingId);

  if (!inquiry) return res.status(404).json({ message: 'Order not found' });
  res.json(inquiry);
});

// --- Protected routes below ---

// GET /api/inquiries — list all (admin/staff)
router.get('/', authMiddleware, (req, res) => {
  const { status, service, search, page = 1, limit = 20 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  let where  = 'WHERE 1=1';
  const params = [];

  if (status)  { where += ' AND i.status = ?';  params.push(status); }
  if (service) { where += ' AND i.service = ?'; params.push(service); }
  if (search)  { where += ' AND (i.name LIKE ? OR i.contact LIKE ? OR i.tracking_id LIKE ?)'; params.push(`%${search}%`, `%${search}%`, `%${search}%`); }

  const total = db.prepare(`SELECT COUNT(*) as c FROM inquiries i ${where}`).get(...params).c;
  const rows  = db.prepare(`
    SELECT i.*, u.name as assigned_name
    FROM inquiries i
    LEFT JOIN users u ON u.id = i.assigned_to
    ${where}
    ORDER BY i.created_at DESC
    LIMIT ? OFFSET ?
  `).all(...params, Number(limit), offset);

  res.json({ data: rows, total, page: Number(page), limit: Number(limit) });
});

// GET /api/inquiries/:id
router.get('/:id', authMiddleware, (req, res) => {
  const row = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ message: 'Not found' });
  res.json(row);
});

// PATCH /api/inquiries/:id/status
router.patch('/:id/status', authMiddleware, (req, res) => {
  const { status, notes } = req.body;
  const valid = ['pending','confirmed','in_progress','ready','completed','cancelled'];
  if (!valid.includes(status))
    return res.status(400).json({ message: 'Invalid status' });

  db.prepare(`
    UPDATE inquiries SET status = ?, notes = COALESCE(?, notes), updated_at = datetime('now') WHERE id = ?
  `).run(status, notes || null, req.params.id);

  res.json({ message: 'Status updated' });
});

// DELETE /api/inquiries/:id
router.delete('/:id', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM inquiries WHERE id = ?').run(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;