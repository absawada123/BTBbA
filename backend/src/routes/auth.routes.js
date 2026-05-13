// backend/src/routes/auth.routes.js

const express        = require('express');
const bcrypt         = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');
const db             = require('../config/db');
const {
  generateAccessToken,
  generateDeviceToken,
  isSuspiciousLogin,
  rateLimitLogin,
  clearLoginAttempts,
  requireAuth,
} = require('../middleware/auth.middleware');

const router       = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const APPROVED_EMAILS = (process.env.APPROVED_GOOGLE_EMAILS || '')
  .split(',').map(e => e.trim().toLowerCase());

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure:   process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge:   24 * 60 * 60 * 1000,
};

// ─── Helper ──────────────────────────────────────────────────────────────────

function createSession(res, req, admin) {
  const deviceToken = generateDeviceToken(req);

  db.prepare(`
    UPDATE admins
    SET last_login_ip = ?, last_login_device = ?, last_login_at = datetime('now')
    WHERE id = ?
  `).run(req.ip, deviceToken, admin.id);

  // Log activity
  db.prepare(`
    INSERT INTO activity_logs (admin_id, action, ip_address)
    VALUES (?, 'login', ?)
  `).run(admin.id, req.ip);

  const token = generateAccessToken({
    id: admin.id, username: admin.username,
    email: admin.email, role: admin.role, deviceToken,
  });

  res.cookie('btbbya_session', token, COOKIE_OPTIONS);
  return res.json({
    success: true,
    admin: { id: admin.id, username: admin.username, email: admin.email, role: admin.role },
  });
}

// ─── POST /api/auth/login ─────────────────────────────────────────────────────

router.post('/login', rateLimitLogin, async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Username and password are required.' });

  try {
    const admin = db.prepare(
      `SELECT * FROM admins WHERE username = ? AND status = 'active' LIMIT 1`
    ).get(username.trim().toLowerCase());

    if (!admin) return res.status(401).json({ error: 'Invalid credentials.' });

    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) {
      db.prepare(
        `INSERT INTO login_attempts (ip_address, username, success) VALUES (?, ?, 0)`
      ).run(req.ip, username);
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    clearLoginAttempts(req.ip);

    if (isSuspiciousLogin(req, admin) && admin.totp_enabled) {
      return res.json({
        requires2FA: true,
        tempToken:   generateAccessToken({ id: admin.id, stage: '2fa_pending' }),
      });
    }

    return createSession(res, req, admin);
  } catch (err) {
    console.error('[AUTH] Login error:', err);
    return res.status(500).json({ error: 'Server error.' });
  }
});

// ─── POST /api/auth/google ────────────────────────────────────────────────────

router.post('/google', async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ error: 'Google credential missing.' });

  try {
    const ticket  = await googleClient.verifyIdToken({
      idToken:  credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const email = ticket.getPayload().email?.toLowerCase();

    if (!APPROVED_EMAILS.includes(email))
      return res.status(403).json({ error: 'Access denied. This Google account is not authorized.' });

    const admin = db.prepare(
      `SELECT * FROM admins WHERE email = ? AND status = 'active' LIMIT 1`
    ).get(email);

    if (!admin) return res.status(403).json({ error: 'No admin account found for this email.' });

    return createSession(res, req, admin);
  } catch (err) {
    console.error('[AUTH] Google error:', err);
    return res.status(401).json({ error: 'Invalid Google token.' });
  }
});

// ─── POST /api/auth/verify-2fa ────────────────────────────────────────────────

router.post('/verify-2fa', (req, res) => {
  const { tempToken, totpCode } = req.body;

  try {
    const jwt     = require('jsonwebtoken');
    const decoded = jwt.verify(
      tempToken,
      process.env.JWT_SECRET || 'btbbya_secret_change_in_prod'
    );

    if (decoded.stage !== '2fa_pending')
      return res.status(400).json({ error: 'Invalid 2FA flow.' });

    const admin = db.prepare(`SELECT * FROM admins WHERE id = ? LIMIT 1`).get(decoded.id);
    if (!admin) return res.status(404).json({ error: 'Admin not found.' });

    const { authenticator } = require('otplib');
    const valid = authenticator.verify({ token: totpCode, secret: admin.totp_secret });
    if (!valid) return res.status(401).json({ error: 'Invalid 2FA code.' });

    return createSession(res, req, admin);
  } catch (err) {
    console.error('[AUTH] 2FA error:', err);
    return res.status(401).json({ error: '2FA verification failed.' });
  }
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────

router.get('/me', requireAuth, (req, res) => {
  res.json({ admin: req.admin });
});

// ─── POST /api/auth/logout ────────────────────────────────────────────────────

router.post('/logout', requireAuth, (req, res) => {
  db.prepare(
    `INSERT INTO activity_logs (admin_id, action, ip_address) VALUES (?, 'logout', ?)`
  ).run(req.admin?.id ?? null, req.ip);

  res.clearCookie('btbbya_session');
  res.json({ success: true });
});

module.exports = router;