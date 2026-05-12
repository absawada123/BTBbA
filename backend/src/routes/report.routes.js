// backend/src/routes/report.routes.js
const express = require('express');
const db      = require('../config/db');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

// GET /api/reports/dashboard — summary cards
router.get('/dashboard', authMiddleware, (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const monthStart = today.slice(0, 7) + '-01';

  const totalRevenue    = db.prepare(`SELECT COALESCE(SUM(total),0) as v FROM transactions WHERE payment_status='paid'`).get().v;
  const monthRevenue    = db.prepare(`SELECT COALESCE(SUM(total),0) as v FROM transactions WHERE payment_status='paid' AND date(created_at) >= ?`).get(monthStart).v;
  const todayRevenue    = db.prepare(`SELECT COALESCE(SUM(total),0) as v FROM transactions WHERE payment_status='paid' AND date(created_at) = ?`).get(today).v;
  const totalExpenses   = db.prepare(`SELECT COALESCE(SUM(amount),0) as v FROM expenses`).get().v;
  const monthExpenses   = db.prepare(`SELECT COALESCE(SUM(amount),0) as v FROM expenses WHERE date >= ?`).get(monthStart).v;
  const pendingInquiries= db.prepare(`SELECT COUNT(*) as v FROM inquiries WHERE status = 'pending'`).get().v;
  const totalOrders     = db.prepare(`SELECT COUNT(*) as v FROM inquiries`).get().v;
  const lowStock        = db.prepare(`SELECT COUNT(*) as v FROM products WHERE stock <= low_stock_at AND is_active = 1`).get().v;
  const totalCustomers  = db.prepare(`SELECT COUNT(*) as v FROM customers`).get().v;

  res.json({
    revenue:    { total: totalRevenue, month: monthRevenue, today: todayRevenue },
    expenses:   { total: totalExpenses, month: monthExpenses },
    profit:     { month: monthRevenue - monthExpenses },
    inquiries:  { pending: pendingInquiries, total: totalOrders },
    inventory:  { low_stock: lowStock },
    customers:  { total: totalCustomers },
  });
});

// GET /api/reports/revenue — chart data by day/month
router.get('/revenue', authMiddleware, (req, res) => {
  const { period = 'monthly', year = new Date().getFullYear() } = req.query;

  let rows;
  if (period === 'daily') {
    rows = db.prepare(`
      SELECT date(created_at) as label,
             COALESCE(SUM(total),0) as revenue,
             COALESCE(SUM(discount),0) as discounts,
             COUNT(*) as transactions
      FROM transactions
      WHERE payment_status = 'paid' AND strftime('%Y', created_at) = ?
      GROUP BY date(created_at)
      ORDER BY label ASC
    `).all(String(year));
  } else {
    rows = db.prepare(`
      SELECT strftime('%Y-%m', created_at) as label,
             COALESCE(SUM(total),0) as revenue,
             COALESCE(SUM(discount),0) as discounts,
             COUNT(*) as transactions
      FROM transactions
      WHERE payment_status = 'paid' AND strftime('%Y', created_at) = ?
      GROUP BY strftime('%Y-%m', created_at)
      ORDER BY label ASC
    `).all(String(year));
  }

  res.json(rows);
});

// GET /api/reports/expenses — chart data
router.get('/expenses', authMiddleware, (req, res) => {
  const { year = new Date().getFullYear() } = req.query;

  const byCategory = db.prepare(`
    SELECT category, COALESCE(SUM(amount),0) as total
    FROM expenses
    WHERE strftime('%Y', date) = ?
    GROUP BY category ORDER BY total DESC
  `).all(String(year));

  const byMonth = db.prepare(`
    SELECT strftime('%Y-%m', date) as label, COALESCE(SUM(amount),0) as total
    FROM expenses
    WHERE strftime('%Y', date) = ?
    GROUP BY label ORDER BY label ASC
  `).all(String(year));

  res.json({ by_category: byCategory, by_month: byMonth });
});

// GET /api/reports/top-products
router.get('/top-products', authMiddleware, (req, res) => {
  const rows = db.prepare(`
    SELECT ti.name, SUM(ti.qty) as units_sold, SUM(ti.subtotal) as revenue
    FROM transaction_items ti
    JOIN transactions t ON t.id = ti.transaction_id
    WHERE t.payment_status = 'paid'
    GROUP BY ti.name
    ORDER BY revenue DESC
    LIMIT 10
  `).all();
  res.json(rows);
});

// GET /api/reports/inquiries
router.get('/inquiries', authMiddleware, (req, res) => {
  const byStatus = db.prepare(`
    SELECT status, COUNT(*) as count FROM inquiries GROUP BY status
  `).all();

  const byService = db.prepare(`
    SELECT service, COUNT(*) as count FROM inquiries GROUP BY service ORDER BY count DESC
  `).all();

  res.json({ by_status: byStatus, by_service: byService });
});

module.exports = router;