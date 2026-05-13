// backend/src/app.js

const express        = require('express');
const cors           = require('cors');
const cookieParser   = require('cookie-parser');
const { initSchema } = require('./database/schema');
require('dotenv').config();

const app = express();

app.use(cors({
  origin:      process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

initSchema();

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', brand: 'Beyond the Bloom by A', ts: new Date().toISOString() });
});

app.use('/api/auth', require('./routes/auth.routes'));

// ── Uncomment as each module is built ──
// app.use('/api/inquiries',    require('./routes/inquiry.routes'));
// app.use('/api/products',     require('./routes/product.routes'));
// app.use('/api/customers',    require('./routes/customer.routes'));
// app.use('/api/transactions', require('./routes/transaction.routes'));
// app.use('/api/expenses',     require('./routes/expense.routes'));
// app.use('/api/reports',      require('./routes/report.routes'));

app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

module.exports = app;