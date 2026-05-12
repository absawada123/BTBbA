// backend/src/routes/product.routes.js
const express = require('express');
const db      = require('../config/db');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

// GET /api/products — public (shop listing)
router.get('/', (req, res) => {
  const { category, search, active = '1' } = req.query;

  let where  = 'WHERE 1=1';
  const params = [];

  if (active   !== 'all') { where += ' AND is_active = ?'; params.push(Number(active)); }
  if (category) { where += ' AND category = ?'; params.push(category); }
  if (search)   { where += ' AND (name LIKE ? OR description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }

  const rows = db.prepare(`SELECT * FROM products ${where} ORDER BY name ASC`).all(...params);
  res.json(rows);
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ message: 'Not found' });
  res.json(row);
});

// POST /api/products
router.post('/', authMiddleware, (req, res) => {
  const { name, category, description, price, stock, low_stock_at, sku } = req.body;
  if (!name || !category || price === undefined)
    return res.status(400).json({ message: 'name, category, price are required' });

  const r = db.prepare(`
    INSERT INTO products (name, category, description, price, stock, low_stock_at, sku)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(name, category, description || null, price, stock ?? 0, low_stock_at ?? 5, sku || null);

  res.status(201).json({ id: r.lastInsertRowid, message: 'Product created' });
});

// PUT /api/products/:id
router.put('/:id', authMiddleware, (req, res) => {
  const { name, category, description, price, stock, low_stock_at, sku, is_active } = req.body;

  db.prepare(`
    UPDATE products
    SET name = ?, category = ?, description = ?, price = ?, stock = ?,
        low_stock_at = ?, sku = ?, is_active = ?, updated_at = datetime('now')
    WHERE id = ?
  `).run(name, category, description || null, price, stock, low_stock_at ?? 5, sku || null, is_active ?? 1, req.params.id);

  res.json({ message: 'Product updated' });
});

// PATCH /api/products/:id/stock
router.patch('/:id/stock', authMiddleware, (req, res) => {
  const { adjustment, type = 'set' } = req.body; // type: 'set' | 'add' | 'subtract'

  const product = db.prepare('SELECT stock FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });

  let newStock;
  if (type === 'add')      newStock = product.stock + Number(adjustment);
  else if (type === 'subtract') newStock = Math.max(0, product.stock - Number(adjustment));
  else                     newStock = Number(adjustment);

  db.prepare("UPDATE products SET stock = ?, updated_at = datetime('now') WHERE id = ?").run(newStock, req.params.id);
  res.json({ stock: newStock });
});

// DELETE /api/products/:id
router.delete('/:id', authMiddleware, (req, res) => {
  db.prepare("UPDATE products SET is_active = 0, updated_at = datetime('now') WHERE id = ?").run(req.params.id);
  res.json({ message: 'Product deactivated' });
});

module.exports = router;