const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const { initSchema } = require('./database/schema');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'production') {
  initSchema();
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', brand: 'Beyond the Bloom by A', ts: new Date().toISOString() });
});

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/inquiries', require('./routes/inquiry.routes'));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist', 'index.html'));
  });
}

app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

module.exports = app;