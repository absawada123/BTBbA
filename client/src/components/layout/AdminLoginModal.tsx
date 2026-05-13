// client/src/components/layout/AdminLoginModal.tsx

import { useState, useEffect } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Stage = 'credentials' | '2fa';

interface Admin {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AdminLoginModalProps {
  open: boolean;
  onClose: () => void;
  onLoginSuccess: (admin: Admin) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminLoginModal({ open, onClose, onLoginSuccess }: AdminLoginModalProps) {
  const [stage,        setStage]        = useState<Stage>('credentials');
  const [username,     setUsername]     = useState('');
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState('');
  const [tempToken,    setTempToken]    = useState('');
  const [totpCode,     setTotpCode]     = useState('');

  // Reset form every time modal opens
  useEffect(() => {
    if (open) {
      setStage('credentials');
      setUsername('');
      setPassword('');
      setError('');
      setTotpCode('');
      setShowPassword(false);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Google button render
  useEffect(() => {
    if (!open) return;
    // @ts-ignore
    if (!window.google) return;
    setTimeout(() => {
      // @ts-ignore
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleCallback,
      });
      const btn = document.getElementById('btbbya-google-btn');
      if (btn) {
        // @ts-ignore
        window.google.accounts.id.renderButton(btn, {
          theme: 'outline', size: 'large', width: '100%', text: 'signin_with',
        });
      }
    }, 100);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res  = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Login failed.'); return; }
      if (data.requires2FA) { setTempToken(data.tempToken); setStage('2fa'); return; }
      onClose();
      onLoginSuccess(data.admin);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleCallback(response: { credential: string }) {
    setError('');
    setLoading(true);
    try {
      const res  = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ credential: response.credential }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Google sign-in failed.'); return; }
      onClose();
      onLoginSuccess(data.admin);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handle2FA(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res  = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ tempToken, totpCode }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || '2FA failed.'); return; }
      onClose();
      onLoginSuccess(data.admin);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // ── Don't render anything if closed ─────────────────────────────────────────
  if (!open) return null;

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Admin Login"
      style={styles.overlay}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={styles.modal}>

        <div style={styles.accentBar} />

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logoMark}>🌸</div>
          <div>
            <h2 style={styles.title}>Hello</h2>
            <p style={styles.subtitle}>Beyond the Bloom by A Tracker</p>
          </div>
          <button onClick={onClose} style={styles.closeBtn} aria-label="Close login">✕</button>
        </div>

        {/* ── Credentials Stage ── */}
        {stage === 'credentials' && (
          <>
            <form onSubmit={handlePasswordLogin} style={styles.form} noValidate>
              <div style={styles.fieldGroup}>
                <label htmlFor="btbbya-username" style={styles.label}>Username</label>
                <input
                  id="btbbya-username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  style={styles.input}
                  required
                  autoFocus
                />
              </div>

              <div style={styles.fieldGroup}>
                <label htmlFor="btbbya-password" style={styles.label}>Password</label>
                <div style={styles.passwordWrap}>
                  <input
                    id="btbbya-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    style={{ ...styles.input, paddingRight: '2.75rem' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    style={styles.eyeBtn}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {error && <p style={styles.error} role="alert">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                style={{ ...styles.primaryBtn, opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <div style={styles.divider}>
              <span style={styles.dividerLine} />
              <span style={styles.dividerText}>or continue with</span>
              <span style={styles.dividerLine} />
            </div>

            <div id="btbbya-google-btn" style={styles.googleBtnWrap} />

            <p style={styles.forgotText}>
              Lost access?{' '}
              <a href="mailto:admin@btbbya.com" style={styles.link}>Contact support</a>
            </p>
          </>
        )}

        {/* ── 2FA Stage ── */}
        {stage === '2fa' && (
          <form onSubmit={handle2FA} style={styles.form} noValidate>
            <div style={styles.twoFaInfo}>
              <div style={styles.twoFaIcon}>🔐</div>
              <p style={styles.twoFaText}>
                New device detected. Enter your Google Authenticator code.
              </p>
            </div>

            <div style={styles.fieldGroup}>
              <label htmlFor="btbbya-totp" style={styles.label}>Authenticator Code</label>
              <input
                id="btbbya-totp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                style={{ ...styles.input, textAlign: 'center', letterSpacing: '0.35em', fontSize: '1.25rem' }}
                autoFocus
                required
              />
            </div>

            {error && <p style={styles.error} role="alert">{error}</p>}

            <button
              type="submit"
              disabled={loading || totpCode.length < 6}
              style={{ ...styles.primaryBtn, opacity: (loading || totpCode.length < 6) ? 0.6 : 1 }}
            >
              {loading ? 'Verifying…' : 'Verify & Sign In'}
            </button>

            <button
              type="button"
              onClick={() => { setStage('credentials'); setError(''); setTotpCode(''); }}
              style={styles.ghostBtn}
            >
              ← Back
            </button>
          </form>
        )}

      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 9999,
    background: 'rgba(0,0,0,0.55)',
    backdropFilter: 'blur(6px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '1rem',
  },
  modal: {
    background: '#fff', borderRadius: '1rem',
    width: '100%', maxWidth: '420px',
    boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
    overflow: 'hidden',
  },
  accentBar: {
    height: '4px',
    background: 'linear-gradient(90deg, #c084a0, #e8a0b8, #c084a0)',
  },
  header: {
    display: 'flex', alignItems: 'center', gap: '0.75rem',
    padding: '1.25rem 1.5rem 0.75rem',
  },
  logoMark:  { fontSize: '1.75rem', lineHeight: 1 },
  title: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '1.25rem', fontWeight: 700,
    color: '#2d1a24', margin: 0, lineHeight: 1.2,
  },
  subtitle:  { fontSize: '0.75rem', color: '#9a7486', margin: 0, marginTop: '2px' },
  closeBtn: {
    marginLeft: 'auto', background: 'none', border: 'none',
    fontSize: '1rem', color: '#9a7486', cursor: 'pointer',
    width: '32px', height: '32px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: '50%',
  },
  form:         { display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 1.5rem 0' },
  fieldGroup:   { display: 'flex', flexDirection: 'column', gap: '0.375rem' },
  label: {
    fontSize: '0.75rem', fontWeight: 600,
    color: '#6b4d5a', textTransform: 'uppercase', letterSpacing: '0.05em',
  },
  input: {
    width: '100%', padding: '0.625rem 0.875rem',
    border: '1.5px solid #e2d0d8', borderRadius: '0.5rem',
    fontSize: '0.9375rem', color: '#2d1a24',
    background: '#fdf9fb', outline: 'none',
    boxSizing: 'border-box',
  },
  passwordWrap: { position: 'relative' },
  eyeBtn: {
    position: 'absolute', right: '0.625rem',
    top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: '1rem', minWidth: '44px', minHeight: '44px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  error: {
    fontSize: '0.8125rem', color: '#c0445a',
    background: '#fdf1f3', borderRadius: '0.375rem',
    padding: '0.5rem 0.75rem', margin: 0,
  },
  primaryBtn: {
    padding: '0.75rem',
    background: 'linear-gradient(135deg, #c084a0, #a0607a)',
    color: '#fff', border: 'none', borderRadius: '0.5rem',
    fontSize: '0.9375rem', fontWeight: 600,
    cursor: 'pointer', minHeight: '44px',
  },
  ghostBtn: {
    padding: '0.625rem', background: 'none', color: '#9a7486',
    border: 'none', fontSize: '0.875rem', cursor: 'pointer', borderRadius: '0.5rem',
  },
  divider: {
    display: 'flex', alignItems: 'center', gap: '0.75rem',
    padding: '0.75rem 1.5rem 0',
  },
  dividerLine:  { flex: 1, height: '1px', background: '#e8d8e0' },
  dividerText:  { fontSize: '0.75rem', color: '#b08898', whiteSpace: 'nowrap' },
  googleBtnWrap:{ padding: '0 1.5rem' },
  forgotText: {
    fontSize: '0.8125rem', color: '#b08898',
    textAlign: 'center', padding: '0.75rem 1.5rem 1.5rem',
  },
  link:         { color: '#c084a0', textDecoration: 'underline' },
  twoFaInfo: {
    display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
    background: '#fdf5f8', borderRadius: '0.5rem', padding: '0.875rem',
  },
  twoFaIcon:    { fontSize: '1.5rem' },
  twoFaText:    { fontSize: '0.875rem', color: '#6b4d5a', margin: 0, lineHeight: 1.5 },
};