// backend/src/middleware/auth.middleware.js

const jwt    = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET         = process.env.JWT_SECRET || 'btbbya_secret_change_in_prod';
const JWT_EXPIRY         = '24h';
const FORCED_REFRESH_DAYS = 7;

function generateAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

function generateDeviceToken(req) {
  const raw = [
    req.headers['user-agent']       || '',
    req.headers['accept-language']  || '',
    req.ip                          || '',
  ].join('|');
  return crypto.createHash('sha256').update(raw).digest('hex');
}

function requireAuth(req, res, next) {
  const token =
    req.cookies?.btbbya_session ||
    req.headers.authorization?.replace('Bearer ', '');

  if (!token) return res.status(401).json({ error: 'Unauthorized.' });

  try {
    const decoded     = jwt.verify(token, JWT_SECRET);
    const daysSince   = (Date.now() - decoded.iat * 1000) / (1000 * 60 * 60 * 24);

    if (daysSince >= FORCED_REFRESH_DAYS) {
      return res.status(401).json({ error: 'Session expired.', code: 'FORCED_REFRESH' });
    }

    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired session.' });
  }
}

function isSuspiciousLogin(req, admin) {
  if (!admin.last_login_device) return true;
  const currentDevice = generateDeviceToken(req);
  return currentDevice !== admin.last_login_device || req.ip !== admin.last_login_ip;
}

// In-memory brute-force protection
const loginAttempts = new Map();
const MAX_ATTEMPTS  = 5;
const LOCKOUT_MS    = 15 * 60 * 1000;

function rateLimitLogin(req, res, next) {
  const key    = req.ip;
  const now    = Date.now();
  const record = loginAttempts.get(key) || { count: 0, firstAttempt: now };

  if (now - record.firstAttempt > LOCKOUT_MS) {
    loginAttempts.set(key, { count: 1, firstAttempt: now });
    return next();
  }

  if (record.count >= MAX_ATTEMPTS) {
    const retry = Math.ceil((LOCKOUT_MS - (now - record.firstAttempt)) / 1000);
    return res.status(429).json({ error: `Too many attempts. Retry in ${retry}s.` });
  }

  record.count += 1;
  loginAttempts.set(key, record);
  next();
}

function clearLoginAttempts(ip) {
  loginAttempts.delete(ip);
}

module.exports = {
  generateAccessToken,
  generateDeviceToken,
  requireAuth,
  isSuspiciousLogin,
  rateLimitLogin,
  clearLoginAttempts,
};