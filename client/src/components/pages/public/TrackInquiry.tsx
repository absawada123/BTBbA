// client/src/components/pages/public/TrackInquiry.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search, ShieldCheck, Clock, CheckCircle, Flower2,
  PackageCheck, Truck, XCircle, RefreshCw, Monitor,
  LogOut, AlertTriangle, Copy, Check, Download,
} from 'lucide-react';
import logo from '../../../assets/images/logo.png';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TrackResult {
  id: string;
  name: string;
  service: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'ready' | 'out_for_delivery' | 'completed' | 'cancelled';
  created_at: string;
  event_date: string | null;
  target_time: string | null;
  fulfillment: 'pickup' | 'delivery' | null;
  pickup_location: string | null;
  message: string;
  bouquet_name: string | null;
  add_ons: string | null;
  preferred_budget: string | null;
}

interface TrustedSession {
  orderId: string;
  phone4: string;
  verifiedAt: number;
  expiresAt: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SESSION_KEY  = 'btb_track_session';
const SESSION_DAYS = 14;
const SESSION_MS   = SESSION_DAYS * 24 * 60 * 60 * 1000;

const STATUS_CONFIG = {
  pending:          { label: 'Pending Review',   color: '#C9A84C', bg: '#C9A84C15', Icon: Clock        },
  confirmed:        { label: 'Confirmed',         color: '#6B7C5C', bg: '#6B7C5C15', Icon: CheckCircle  },
  in_progress:      { label: 'Being Crafted',     color: '#C4717A', bg: '#C4717A15', Icon: Flower2      },
  ready:            { label: 'Ready for Pickup',  color: '#6B7C5C', bg: '#6B7C5C15', Icon: PackageCheck },
  out_for_delivery: { label: 'Out for Delivery',  color: '#C4717A', bg: '#C4717A15', Icon: Truck        },
  completed:        { label: 'Completed',         color: '#6B7C5C', bg: '#6B7C5C15', Icon: ShieldCheck  },
  cancelled:        { label: 'Cancelled',         color: '#e57373', bg: '#e5737315', Icon: XCircle      },
};

const STEPS: (keyof typeof STATUS_CONFIG)[] = [
  'pending', 'confirmed', 'in_progress', 'ready', 'out_for_delivery', 'completed',
];

const STEP_DESCS: Record<string, string> = {
  pending:          "Inquiry received. We'll review and confirm shortly.",
  confirmed:        "Order confirmed! We'll start preparing your bouquet.",
  in_progress:      'Your bouquet is being handcrafted with love.',
  ready:            'Your bouquet is ready! Head to your pickup location.',
  out_for_delivery: 'Your bouquet is on its way to you.',
  completed:        'Order complete. Thank you for choosing BTBbyA!',
};

// ─── Session Helpers ──────────────────────────────────────────────────────────

function saveSession(orderId: string, phone4: string) {
  const session: TrustedSession = {
    orderId,
    phone4,
    verifiedAt: Date.now(),
    expiresAt:  Date.now() + SESSION_MS,
  };
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch {}
}

function loadSession(): TrustedSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s: TrustedSession = JSON.parse(raw);
    if (Date.now() > s.expiresAt) { localStorage.removeItem(SESSION_KEY); return null; }
    return s;
  } catch { return null; }
}

function clearSession() {
  try { localStorage.removeItem(SESSION_KEY); } catch {}
}

function normalizeOrderId(raw: string): string {
  const trimmed = raw.trim().toUpperCase();
  if (/^\d{1,4}$/.test(trimmed)) return `BTB-INQ-${trimmed.padStart(4, '0')}`;
  return trimmed;
}

function daysLeft(expiresAt: number): number {
  return Math.max(0, Math.ceil((expiresAt - Date.now()) / (24 * 60 * 60 * 1000)));
}

// ─── API ──────────────────────────────────────────────────────────────────────

async function fetchTracking(orderId: string, phone4: string): Promise<TrackResult> {
  const res = await fetch(`/api/inquiries/track/${encodeURIComponent(orderId)}`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ phone4 }),
  });
  if (res.status === 401 || res.status === 404) {
    throw new Error('Unable to verify order details. Please check your inputs.');
  }
  if (!res.ok) throw new Error('Something went wrong. Please try again.');
  return res.json();
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const inputCls = 'w-full rounded-xl border border-[#C4717A]/20 bg-[#FAF6F0] px-4 py-3 text-sm text-[#2C2C2C] placeholder-[#2C2C2C]/30 focus:border-[#C4717A] focus:outline-none focus:ring-2 focus:ring-[#C4717A]/20 transition';

const StatusBadge: React.FC<{ status: keyof typeof STATUS_CONFIG }> = ({ status }) => {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold"
      style={{ backgroundColor: cfg.bg, color: cfg.color }}
    >
      <cfg.Icon className="h-3.5 w-3.5" />
      {cfg.label}
    </span>
  );
};

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex gap-3 rounded-xl border border-[#C4717A]/10 bg-[#FAF6F0] px-4 py-3">
    <span className="w-28 shrink-0 text-xs font-semibold uppercase tracking-wide text-[#2C2C2C]/40 pt-0.5">{label}</span>
    <span className="text-sm text-[#2C2C2C] leading-relaxed break-words">{value}</span>
  </div>
);

const CopyButton: React.FC<{ text: string; label?: string; className?: string }> = ({ text, label = 'Copy', className = '' }) => {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      type="button"
      onClick={handle}
      className={`inline-flex items-center gap-1.5 rounded-full border border-[#C4717A]/20 bg-white px-3 py-1.5 text-xs font-semibold text-[#C4717A] transition hover:bg-[#C4717A]/5 active:scale-95 ${className}`}
    >
      {copied ? <><Check className="h-3 w-3" />Copied!</> : <><Copy className="h-3 w-3" />{label}</>}
    </button>
  );
};

// ─── Order Card Download (canvas) ─────────────────────────────────────────────

const DownloadCard: React.FC<{ result: TrackResult }> = ({ result }) => {
  const [downloaded, setDownloaded] = useState(false);

  const download = () => {
    const canvas = document.createElement('canvas');
    const W = 600, PAD = 36, LINE_H = 22;

    const lines: { bold?: boolean; sub?: boolean; text: string }[] = [
      { bold: true,  text: '🌸 Beyond the Bloom by A' },
      { sub:  true,  text: result.id },
      { text: '' },
      { bold: true,  text: `Name: ${result.name}` },
      { bold: true,  text: `Service: ${result.service}` },
      { bold: true,  text: `Status: ${STATUS_CONFIG[result.status]?.label ?? result.status}` },
      { text: '' },
      { text: `Submitted: ${new Date(result.created_at).toLocaleDateString('en-PH', { dateStyle: 'long' })}` },
      ...(result.event_date   ? [{ text: `Target Date: ${new Date(result.event_date).toLocaleDateString('en-PH', { dateStyle: 'long' })}` }] : []),
      ...(result.target_time  ? [{ text: `Target Time: ${result.target_time}` }] : []),
      ...(result.fulfillment  ? [{ text: `Fulfillment: ${result.fulfillment === 'pickup' ? `Pickup — ${result.pickup_location ?? ''}` : 'Delivery'}` }] : []),
      ...(result.bouquet_name ? [{ text: `Bouquet: ${result.bouquet_name}` }] : []),
      ...(result.message      ? [{ text: `Details: ${result.message}` }] : []),
      ...(result.add_ons      ? [{ text: `Add-Ons: ${result.add_ons}` }] : []),
      ...(result.preferred_budget ? [{ text: `Budget: ${result.preferred_budget}` }] : []),
      { text: '' },
      { sub: true, text: 'Total / DP / Balance: TBD upon approval' },
      { text: '' },
      { sub: true, text: 'btbya.com · Sta. Rosa, Laguna' },
    ];

    const ctx = canvas.getContext('2d')!;
    const H = PAD * 2 + lines.length * LINE_H + 60;
    canvas.width = W; canvas.height = H;

    ctx.fillStyle = '#FAF6F0';
    ctx.fillRect(0, 0, W, H);

    const grad = ctx.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0, '#C4717A');
    grad.addColorStop(0.5, '#C9A84C');
    grad.addColorStop(1, '#6B7C5C');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, 5);
    ctx.fillRect(0, H - 5, W, 5);

    ctx.strokeStyle = '#C4717A33';
    ctx.lineWidth   = 1;
    ctx.strokeRect(0.5, 5, W - 1, H - 10);

    let y = PAD + 20;
    for (const line of lines) {
      if (!line.text) { y += LINE_H * 0.4; continue; }
      ctx.font      = line.bold ? 'bold 13px system-ui,sans-serif' : line.sub ? '11px system-ui,sans-serif' : '12px system-ui,sans-serif';
      ctx.fillStyle = line.sub ? '#2C2C2C99' : '#2C2C2C';

      const words = line.text.split(' ');
      let row = '';
      for (const word of words) {
        const test = row ? `${row} ${word}` : word;
        if (ctx.measureText(test).width > W - PAD * 2) {
          ctx.fillText(row, PAD, y); y += LINE_H; row = word;
        } else { row = test; }
      }
      if (row) { ctx.fillText(row, PAD, y); y += LINE_H; }
    }

    const a = document.createElement('a');
    a.href     = canvas.toDataURL('image/png');
    a.download = `${result.id}.png`;
    a.click();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <button
      type="button"
      onClick={download}
      className="inline-flex items-center gap-2 rounded-full border border-[#2C2C2C]/15 bg-white px-4 py-2 text-xs font-semibold text-[#2C2C2C] transition hover:bg-[#2C2C2C]/5 active:scale-95"
    >
      {downloaded ? <><Check className="h-3.5 w-3.5 text-[#6B7C5C]" />Downloaded!</> : <><Download className="h-3.5 w-3.5" />Download Card</>}
    </button>
  );
};

// ─── Build plain-text summary ─────────────────────────────────────────────────

function buildSummaryText(result: TrackResult): string {
  const lines = [
    '🌸 Beyond the Bloom by A',
    `Order Reference: ${result.id}`,
    `Status: ${STATUS_CONFIG[result.status]?.label ?? result.status}`,
    '',
    `Name: ${result.name}`,
    `Service: ${result.service}`,
    '',
    `Submitted: ${new Date(result.created_at).toLocaleDateString('en-PH', { dateStyle: 'long' })}`,
    ...(result.event_date   ? [`Target Date: ${new Date(result.event_date).toLocaleDateString('en-PH', { dateStyle: 'long' })}`] : []),
    ...(result.target_time  ? [`Target Time: ${result.target_time}`] : []),
    ...(result.fulfillment  ? [`Fulfillment: ${result.fulfillment === 'pickup' ? `Pickup — ${result.pickup_location ?? ''}` : 'Delivery'}`] : []),
    ...(result.bouquet_name ? [`Bouquet: ${result.bouquet_name}`] : []),
    ...(result.message      ? [`Details: ${result.message}`] : []),
    ...(result.add_ons      ? [`Add-Ons: ${result.add_ons}`] : []),
    ...(result.preferred_budget ? [`Budget: ${result.preferred_budget}`] : []),
    '',
    'Total / DP / Balance: TBD upon approval',
  ];
  return lines.join('\n');
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const TrackInquiry: React.FC = () => {
  const [searchParams]          = useSearchParams();
  const [orderId, setOrderId]   = useState(searchParams.get('id') ?? '');
  const [phone4, setPhone4]     = useState('');
  const [remember, setRemember] = useState(true);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [attempts, setAttempts] = useState(0);
  const [result, setResult]     = useState<TrackResult | null>(null);
  const [session, setSession]   = useState<TrustedSession | null>(null);
  const [autoVerified, setAutoVerified] = useState(false);

  // ── FIX: useCallback so the function reference is stable for useEffect ──
  const autoVerify = useCallback(async (s: TrustedSession) => {
    setLoading(true);
    try {
      const data = await fetchTracking(s.orderId, s.phone4);
      setResult(data);
      setAutoVerified(true);
      // Refresh session expiry on successful auto-verify
      saveSession(s.orderId, s.phone4);
      setSession(loadSession());
    } catch {
      clearSession();
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── FIX: run ONCE on mount, stable autoVerify reference ──
  useEffect(() => {
    const s = loadSession();
    if (s) {
      setSession(s);
      setOrderId(s.orderId);
      autoVerify(s);
    }
  }, [autoVerify]);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim() || phone4.length < 4) return;
    if (attempts >= 5) {
      setError('Too many attempts. Please wait before trying again.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    const normalized = normalizeOrderId(orderId);
    try {
      const data = await fetchTracking(normalized, phone4.trim());
      setResult(data);
      setAttempts(0);
      if (remember) {
        saveSession(normalized, phone4.trim());
        setSession(loadSession());
      }
    } catch (err: any) {
      setAttempts(a => a + 1);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearSession();
    setSession(null);
    setResult(null);
    setOrderId('');
    setPhone4('');
    setAutoVerified(false);
    setError('');
    setAttempts(0);
  };

  const stepIndex = result ? STEPS.indexOf(result.status as any) : -1;

  // ── Locked out ────────────────────────────────────────────────────────────
  if (attempts >= 5) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 border border-red-200">
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-[#2C2C2C]">Too Many Attempts</h2>
          <p className="text-sm text-[#2C2C2C]/55">Please wait a few minutes before trying again.</p>
          <button onClick={() => setAttempts(0)}
            className="inline-flex items-center gap-2 rounded-full bg-[#C4717A] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#b05f68]">
            <RefreshCw className="h-4 w-4" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  // ── Result view ───────────────────────────────────────────────────────────
  if (result) {
    const summaryText = buildSummaryText(result);

    return (
      <div className="min-h-screen bg-[#FAF6F0] py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl space-y-4">

          {/* Header */}
          <div className="text-center mb-2">
            <img src={logo} alt="BTBbyA" className="mx-auto mb-3 h-12 w-12 object-contain" />
            <h1 className="text-2xl font-bold text-[#2C2C2C]">Order Tracker</h1>
          </div>

          {/* Trusted session banner */}
          {autoVerified && session && (
            <div className="flex items-center justify-between rounded-2xl border border-[#6B7C5C]/20 bg-[#6B7C5C]/5 px-4 py-3">
              <div className="flex items-center gap-2 text-xs text-[#6B7C5C]">
                <Monitor className="h-3.5 w-3.5 shrink-0" />
                <span>Trusted device · Expires in <strong>{daysLeft(session.expiresAt)} days</strong></span>
              </div>
              <button onClick={handleLogout}
                className="inline-flex items-center gap-1 rounded-full border border-[#6B7C5C]/30 px-3 py-1 text-xs font-semibold text-[#6B7C5C] hover:bg-[#6B7C5C]/10 transition">
                <LogOut className="h-3 w-3" /> Sign out
              </button>
            </div>
          )}

          {/* Order header card */}
          <div className="rounded-3xl border border-[#C4717A]/10 bg-white p-6 shadow-lg space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#2C2C2C]/40">Inquiry Reference</p>
                <h2 className="mt-0.5 text-xl font-bold text-[#C4717A]">{result.id}</h2>
                <p className="mt-0.5 text-sm font-semibold text-[#2C2C2C]">{result.name}</p>
                <p className="text-xs text-[#2C2C2C]/50">{result.service}</p>
              </div>
              <StatusBadge status={result.status} />
            </div>

            {/* Progress timeline */}
            {result.status !== 'cancelled' && (
              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#2C2C2C]/40">Progress</p>
                <div className="relative">
                  <div className="absolute left-4 top-4 h-[calc(100%-2rem)] w-px bg-[#C4717A]/15" />
                  <div className="space-y-4">
                    {STEPS.map((s, i) => {
                      const scfg   = STATUS_CONFIG[s];
                      const done   = i <= stepIndex;
                      const active = i === stepIndex;
                      return (
                        <div key={s} className="relative flex items-start gap-4 pl-10">
                          <div className={`absolute left-0 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${
                            done
                              ? active
                                ? 'border-[#C4717A] bg-[#C4717A] text-white shadow-md shadow-[#C4717A]/30'
                                : 'border-[#C4717A] bg-[#C4717A] text-white'
                              : 'border-[#C4717A]/20 bg-white text-[#2C2C2C]/25'
                          }`}>
                            <scfg.Icon className="h-3.5 w-3.5" />
                          </div>
                          <div className={`pb-1 ${done ? '' : 'opacity-40'}`}>
                            <p className={`text-sm font-bold ${active ? 'text-[#C4717A]' : 'text-[#2C2C2C]'}`}>{scfg.label}</p>
                            {active && (
                              <p className="mt-0.5 text-xs text-[#2C2C2C]/55 leading-relaxed">{STEP_DESCS[s]}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {result.status === 'cancelled' && (
              <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-500">
                This order has been cancelled.{' '}
                <Link to="/inquiry" className="font-bold underline">Place a new order</Link>
              </div>
            )}
          </div>

          {/* Order details */}
          <div className="rounded-3xl border border-[#C4717A]/10 bg-white p-6 shadow-sm space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#2C2C2C]/40 mb-1">Order Details</p>

            <DetailRow label="Submitted"  value={new Date(result.created_at).toLocaleDateString('en-PH', { dateStyle: 'long' })} />
            {result.event_date   && <DetailRow label="Target Date"  value={new Date(result.event_date).toLocaleDateString('en-PH', { dateStyle: 'long' })} />}
            {result.target_time  && <DetailRow label="Target Time"  value={result.target_time} />}
            {result.fulfillment  && <DetailRow label="Fulfillment"  value={result.fulfillment === 'pickup' ? `Pickup — ${result.pickup_location ?? ''}` : 'Delivery'} />}
            {result.bouquet_name && <DetailRow label="Bouquet"      value={result.bouquet_name} />}
            {result.message      && <DetailRow label="Details"      value={result.message} />}
            {result.add_ons      && <DetailRow label="Add-Ons"      value={result.add_ons} />}
            {result.preferred_budget && <DetailRow label="Budget"   value={result.preferred_budget} />}

            <div className="rounded-2xl border border-[#6B7C5C]/15 bg-[#6B7C5C]/5 px-4 py-3 text-xs text-[#6B7C5C] mt-2">
              <p className="font-semibold">Payment</p>
              <p className="mt-0.5 text-[#6B7C5C]/70">
                Payment and downpayment details will be shared once your order is confirmed.
              </p>
            </div>
          </div>

          {/* ── NEW: Copy & Download card ── */}
          <div className="rounded-3xl border border-[#C4717A]/10 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#2C2C2C]/40 mb-3">Save Your Order</p>

            {/* Summary preview */}
            <pre className="mb-3 max-h-40 overflow-y-auto rounded-2xl border border-[#C4717A]/10 bg-[#FAF6F0] px-4 py-3 text-xs text-[#2C2C2C]/70 leading-relaxed whitespace-pre-wrap font-sans">
              {summaryText}
            </pre>

            <div className="flex flex-wrap gap-2">
              <CopyButton text={summaryText} label="Copy Summary" />
              <CopyButton text={result.id}   label="Copy Ref #" />
              <DownloadCard result={result} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#C4717A]/20 px-6 py-2.5 text-sm font-semibold text-[#C4717A] transition hover:bg-[#C4717A]/5 active:scale-95">
              <Search className="h-4 w-4" /> Track Another Order
            </button>
            <Link to="/inquiry"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C4717A] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#b05f68] active:scale-95">
              <Flower2 className="h-4 w-4" /> Place New Order
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // ── Verification form ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">

        {/* Header */}
        <div className="text-center">
          <img src={logo} alt="BTBbyA" className="mx-auto mb-4 h-16 w-16 object-contain" />
          <h1 className="text-2xl font-bold text-[#2C2C2C]">Track Your Order</h1>
          <p className="mt-1.5 text-sm text-[#2C2C2C]/50">
            Enter your order reference and phone number to continue.
          </p>
        </div>

        {/* Auto-loading state */}
        {loading && (
          <div className="flex items-center justify-center gap-2 rounded-2xl border border-[#C4717A]/10 bg-white px-4 py-6 text-sm text-[#2C2C2C]/50">
            <RefreshCw className="h-4 w-4 animate-spin text-[#C4717A]" />
            Verifying trusted device…
          </div>
        )}

        {/* Form */}
        {!loading && (
          <form onSubmit={handleTrack}
            className="rounded-3xl border border-[#C4717A]/10 bg-white p-6 shadow-lg sm:p-8 space-y-5">

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#2C2C2C]/50">
                Order / Inquiry Number
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C4717A]/40 pointer-events-none" />
                <input
                  value={orderId}
                  onChange={e => setOrderId(e.target.value)}
                  placeholder="e.g. BTB-INQ-0042 or just 42"
                  className={`${inputCls} pl-10`}
                  autoComplete="off"
                />
              </div>
              {orderId && !/^BTB-/i.test(orderId.trim()) && orderId.trim().length > 0 && (
                <p className="mt-1.5 text-xs text-[#C4717A]/70">
                  Will search as: <strong>{normalizeOrderId(orderId)}</strong>
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#2C2C2C]/50">
                Last 4 Digits of Phone Number
              </label>
              <input
                value={phone4}
                onChange={e => setPhone4(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="e.g. 4821"
                maxLength={4}
                inputMode="numeric"
                className={inputCls}
              />
              <p className="mt-1.5 text-xs text-[#2C2C2C]/35">
                e.g. 0917-123-<strong>4821</strong> → enter <strong>4821</strong>
              </p>
            </div>

            {/* Remember device toggle */}
            <button
              type="button"
              onClick={() => setRemember(r => !r)}
              className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-[#C4717A]/10 bg-[#FAF6F0] px-4 py-3 transition hover:border-[#C4717A]/25 text-left"
            >
              <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all ${
                remember ? 'border-[#C4717A] bg-[#C4717A]' : 'border-[#C4717A]/30 bg-white'
              }`}>
                {remember && <Check className="h-3 w-3 text-white" />}
              </div>
              <div>
                <p className="text-xs font-semibold text-[#2C2C2C]">Remember this device</p>
                <p className="text-xs text-[#2C2C2C]/40">Skip verification for {SESSION_DAYS} days</p>
              </div>
            </button>

            {error && (
              <div className="flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                <AlertTriangle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-600">{error}</p>
                  {attempts > 1 && (
                    <p className="text-xs text-red-400 mt-0.5">{5 - attempts} attempt{5 - attempts !== 1 ? 's' : ''} remaining.</p>
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !orderId.trim() || phone4.length < 4}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#C4717A] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#C4717A]/25 transition hover:bg-[#b36370] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading
                ? <><RefreshCw className="h-4 w-4 animate-spin" /> Verifying…</>
                : <><ShieldCheck className="h-4 w-4" /> View My Order</>}
            </button>

            <p className="text-center text-xs text-[#2C2C2C]/35">
              Your data is protected · Only you can view your order details
            </p>
          </form>
        )}

        <p className="text-center text-xs text-[#2C2C2C]/40">
          No order yet?{' '}
          <Link to="/inquiry" className="text-[#C4717A] hover:underline font-semibold">
            Place a new order
          </Link>
        </p>

      </div>
    </div>
  );
};

export default TrackInquiry;