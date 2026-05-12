// client/src/components/pages/public/InquiryForm.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Flower2, Calendar, MapPin, User, ClipboardList,
  CheckCircle, ChevronRight, ChevronLeft,
  Truck, ShoppingBag, Upload, Clock, Phone, Instagram,
  Trash2, Save, Copy, Check, Download,
} from 'lucide-react';
import logo from '../../../assets/images/logo.png';

// ─── Constants ────────────────────────────────────────────────────────────────

const OCCASIONS = [
  { id: 'birthday',    label: 'Birthday',     icon: '🎂' },
  { id: 'graduation',  label: 'Graduation',   icon: '🎓' },
  { id: 'monthsary',   label: 'Monthsary',    icon: '🗓️' },
  { id: 'anniversary', label: 'Anniversary',  icon: '💍' },
  { id: 'sympathy',    label: 'Sympathy',     icon: '🕊️' },
  { id: 'valentine',   label: "Valentine's",  icon: '💝' },
  { id: 'justbecause', label: 'Just Because', icon: '🌷' },
  { id: 'custom',      label: 'Custom',       icon: '✨' },
];

const BOUQUET_TYPES = [
  {
    id: 'mini', label: 'Mini Bouquets', range: 'starts at ₱99',
    desc: 'Mini Flower Bouquet ₱99 · Mini Sunflower Bouquet ₱150',
    items: ['Mini Flower Bouquet — ₱99', 'Mini Sunflower Bouquet — ₱150'],
  },
  {
    id: 'premium-mini', label: 'Premium Mini', range: 'starts at ₱300',
    desc: 'Mini Thumbelina · Single Sunflower · Single Stargazer Lily',
    items: ['Mini Thumbelina Bouquet — starts at ₱300', 'Single Sunflower Bouquet — starts at ₱450', 'Single Stargazer Lily Bouquet — starts at ₱300'],
  },
  {
    id: 'signature', label: 'Signature', range: 'starts at ₱800',
    desc: 'Carnation · Thumbelina · Sunflower · Grand · Red Rose',
    items: ['Carnation Bouquet — starts at ₱800', 'Thumbelina Bouquet — starts at ₱900', '3 Sunflower Bouquet — starts at ₱800', 'Grand Bouquet — starts at ₱1,300+', 'Red Rose Bouquet — starts at ₱1,000+'],
  },
  {
    id: 'custom', label: 'Custom Bouquet', range: 'Price varies',
    desc: "Tell us your dream bouquet — we'll make it happen.",
    items: [],
  },
];

const BUDGET_OPTIONS = [
  '₱99–₱200', '₱300–₱500', '₱500–₱900', '₱1,000–₱1,500', '₱1,500+', 'Flexible / Open',
];

const TIME_SLOTS = ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM', 'Custom'];

const PICKUP_LOCATIONS = [
  { id: 'krav', label: 'Krav Coffee', desc: 'Sta. Rosa, Laguna' },
  { id: 'dali', label: 'DALI',        desc: 'Brgy. Labas, Sta. Rosa City, Laguna' },
];

const ADD_ONS = [
  'Ribbon (custom color)', 'Chocolate', 'LED Lights', 'Message Card',
  'Dried Flowers', "Baby's Breath", 'Raffia Wrap',
];

const SHOP_ADDRESS = 'Barangay Labas, Sta. Rosa City, Laguna, Philippines';
const SHOP_COORDS  = '14.309361, 121.109694';
const MAPS_EMBED   = 'https://www.google.com/maps?q=14.309361,121.109694&output=embed';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  occasion: string;
  bouquetType: string;
  bouquetItem: string;
  targetDate: string;
  targetTime: string;
  customTime: string;
  fulfillment: 'pickup' | 'delivery' | '';
  pickupLocation: string;
  deliveryAddress: string;
  deliveryLandmark: string;
  receiverName: string;
  receiverContact: string;
  deliveryBooker: 'customer' | 'us' | '';
  customerName: string;
  customerContact: string;
  customerSocial: string;
  bouquetName: string;
  details: string;
  preferredBudget: string;
  addOns: string[];
  pegImage: File | null;
  pegPreview: string;
}

const EMPTY: FormData = {
  occasion: '', bouquetType: '', bouquetItem: '',
  targetDate: '', targetTime: '', customTime: '',
  fulfillment: '', pickupLocation: '',
  deliveryAddress: '', deliveryLandmark: '', receiverName: '', receiverContact: '',
  deliveryBooker: '',
  customerName: '', customerContact: '', customerSocial: '',
  bouquetName: '', details: '', preferredBudget: '', addOns: [],
  pegImage: null, pegPreview: '',
};

const DRAFT_KEY = 'btb_inquiry_draft';

const STEPS = [
  { label: 'Occasion',  icon: Flower2       },
  { label: 'Schedule',  icon: Calendar      },
  { label: 'Delivery',  icon: Truck         },
  { label: 'Details',   icon: User          },
  { label: 'Bouquet',   icon: ClipboardList },
  { label: 'Review',    icon: CheckCircle   },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FieldLabel: React.FC<{ children: React.ReactNode; optional?: boolean }> = ({ children, optional }) => (
  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#2C2C2C]/50">
    {children}
    {optional && <span className="normal-case tracking-normal font-normal text-[#2C2C2C]/35">(optional)</span>}
  </label>
);

const inputCls = 'w-full rounded-xl border border-[#C4717A]/20 bg-[#FAF6F0] px-4 py-3 text-sm text-[#2C2C2C] placeholder-[#2C2C2C]/30 focus:border-[#C4717A] focus:outline-none focus:ring-2 focus:ring-[#C4717A]/20 transition';
const TextInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>>       = (p) => <input    {...p} className={`${inputCls} ${p.className ?? ''}`} />;
const TextArea:  React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (p) => <textarea {...p} className={`${inputCls} resize-none ${p.className ?? ''}`} />;

const CopyButton: React.FC<{ text: string; label?: string }> = ({ text, label }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <button type="button" onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-full border border-[#C4717A]/20 bg-white px-3 py-1.5 text-xs font-semibold text-[#C4717A] transition hover:bg-[#C4717A]/5 active:scale-95 shrink-0">
      {copied ? <><Check className="h-3 w-3" />Copied!</> : <><Copy className="h-3 w-3" />{label ?? 'Copy'}</>}
    </button>
  );
};

// ─── Order Card (canvas-based downloadable image) ─────────────────────────────

const OrderCard: React.FC<{ form: FormData; orderNumber: string }> = ({ form, orderNumber }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [downloaded, setDownloaded] = useState(false);

  const displayTime = form.targetTime === 'Custom' ? form.customTime : form.targetTime;
  const pickupLabel = PICKUP_LOCATIONS.find(l => l.id === form.pickupLocation)?.label ?? '';

  const lines: { bold?: boolean; text: string; sub?: boolean }[] = [
    { bold: true,  text: '🌸 Beyond the Bloom by A' },
    { sub: true,   text: orderNumber },
    { text: '' },
    { bold: true,  text: `Name of customer: ${form.customerName}` },
    { text: `Contact: ${form.customerContact}` },
    ...(form.customerSocial ? [{ text: `Social: ${form.customerSocial}` }] : []),
    { text: '' },
    { bold: true,  text: `Target date: ${form.targetDate}` },
    { bold: true,  text: `Target time: ${displayTime}` },
    { bold: true,  text: `Pick-up / Delivery: ${form.fulfillment === 'pickup' ? `Pickup — ${pickupLabel}` : 'Delivery'}` },
    ...(form.fulfillment === 'delivery' && form.deliveryBooker === 'us' ? [
      { text: `Complete address: ${form.deliveryAddress}` },
      ...(form.deliveryLandmark ? [{ text: `Nearest landmark: ${form.deliveryLandmark}` }] : []),
      { text: `Name of receiver: ${form.receiverName}` },
      { text: `Contact number: ${form.receiverContact}` },
    ] : []),
    { text: '' },
    { bold: true,  text: `Name of bouquet: ${form.bouquetItem ? form.bouquetItem.split(' —')[0] : form.bouquetName}` },
    { text: `Occasion: ${OCCASIONS.find(o => o.id === form.occasion)?.label ?? ''}` },
    ...(form.preferredBudget ? [{ text: `Preferred budget: ${form.preferredBudget}` }] : []),
    { text: '' },
    { bold: true,  text: `Details: ${form.details || '—'}` },
    ...(form.addOns.length ? [{ text: `Add-ons: ${form.addOns.join(', ')}` }] : []),
    { text: '' },
    { sub: true,   text: 'Total: TBD upon approval' },
    { sub: true,   text: 'DP: TBD upon approval' },
    { sub: true,   text: 'Balance: TBD upon approval' },
    { text: '' },
    { sub: true,   text: 'btbya.com · Sta. Rosa, Laguna' },
  ];

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 600;
    const PAD = 36;
    const LINE_H = 22;

    // measure height
    const totalLines = lines.length;
    const H = PAD * 2 + totalLines * LINE_H + 60;
    canvas.width  = W;
    canvas.height = H;

    // background
    ctx.fillStyle = '#FAF6F0';
    ctx.fillRect(0, 0, W, H);

    // top accent bar
    const grad = ctx.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0, '#C4717A');
    grad.addColorStop(0.5, '#C9A84C');
    grad.addColorStop(1, '#6B7C5C');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, 5);

    // bottom accent bar
    ctx.fillStyle = grad;
    ctx.fillRect(0, H - 5, W, 5);

    // border
    ctx.strokeStyle = '#C4717A33';
    ctx.lineWidth   = 1;
    ctx.strokeRect(0.5, 5, W - 1, H - 10);

    let y = PAD + 20;
    for (const line of lines) {
      if (line.text === '') { y += LINE_H * 0.4; continue; }
      if (line.bold) {
        ctx.font      = 'bold 13px system-ui, sans-serif';
        ctx.fillStyle = '#2C2C2C';
      } else if (line.sub) {
        ctx.font      = '11px system-ui, sans-serif';
        ctx.fillStyle = '#2C2C2C99';
      } else {
        ctx.font      = '12px system-ui, sans-serif';
        ctx.fillStyle = '#2C2C2C';
      }

      // word wrap
      const words = line.text.split(' ');
      let row = '';
      for (const word of words) {
        const test = row ? `${row} ${word}` : word;
        if (ctx.measureText(test).width > W - PAD * 2) {
          ctx.fillText(row, PAD, y);
          y  += LINE_H;
          row = word;
        } else {
          row = test;
        }
      }
      if (row) { ctx.fillText(row, PAD, y); y += LINE_H; }
    }

    const a = document.createElement('a');
    a.href     = canvas.toDataURL('image/png');
    a.download = `${orderNumber}.png`;
    a.click();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <>
      <canvas ref={canvasRef} className="hidden" />
      <button
        type="button" onClick={download}
        className="inline-flex items-center gap-2 rounded-full bg-[#2C2C2C] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#444] active:scale-95"
      >
        {downloaded
          ? <><Check className="h-4 w-4" /> Downloaded!</>
          : <><Download className="h-4 w-4" /> Download Order Card</>}
      </button>
    </>
  );
};

// ─── Build plain-text summary ─────────────────────────────────────────────────

function buildSummaryText(form: FormData, orderNumber: string): string {
  const displayTime  = form.targetTime === 'Custom' ? form.customTime : form.targetTime;
  const pickupLabel  = PICKUP_LOCATIONS.find(l => l.id === form.pickupLocation)?.label ?? '';
  const bouquetLabel = form.bouquetItem ? form.bouquetItem.split(' —')[0] : form.bouquetName;
  const occasionLabel = OCCASIONS.find(o => o.id === form.occasion)?.label ?? '';

  const lines = [
    '🌸 Beyond the Bloom by A',
    `Order Reference: ${orderNumber}`,
    '',
    `Name of customer: ${form.customerName}`,
    `Contact: ${form.customerContact}`,
    ...(form.customerSocial ? [`Social: ${form.customerSocial}`] : []),
    '',
    `Target date: ${form.targetDate}`,
    `Target time: ${displayTime}`,
    `Pick-up / Delivery: ${form.fulfillment === 'pickup' ? `Pickup — ${pickupLabel}` : 'Delivery'}`,
    ...(form.fulfillment === 'delivery' && form.deliveryBooker === 'us' ? [
      `Complete address: ${form.deliveryAddress}`,
      ...(form.deliveryLandmark ? [`Nearest landmark: ${form.deliveryLandmark}`] : []),
      `Name of receiver: ${form.receiverName}`,
      `Contact number: ${form.receiverContact}`,
    ] : []),
    '',
    `Name of bouquet: ${bouquetLabel}`,
    `Occasion: ${occasionLabel}`,
    ...(form.preferredBudget ? [`Preferred budget: ${form.preferredBudget}`] : []),
    '',
    `Details: ${form.details || '—'}`,
    ...(form.addOns.length ? [`Notes / Add-ons: ${form.addOns.join(', ')}`] : []),
    '',
    'Total: TBD upon approval',
    'DP: TBD upon approval',
    'Balance: TBD upon approval',
  ];
  return lines.join('\n');
}

// ─── Main Component ───────────────────────────────────────────────────────────

const InquiryForm: React.FC = () => {
  const [step, setStep]             = useState(0);
  const [form, setForm]             = useState<FormData>(EMPTY);
  const [submitted, setSubmitted]   = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [orderNumber]               = useState(() => `BTB-INQ-${String(Date.now()).slice(-4)}`);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) { const p = JSON.parse(raw); setForm({ ...EMPTY, ...p, pegImage: null }); }
    } catch {}
  }, []);

  useEffect(() => {
    const { pegImage, ...saveable } = form;
    localStorage.setItem(DRAFT_KEY, JSON.stringify(saveable));
    setDraftSaved(true);
    const t = setTimeout(() => setDraftSaved(false), 2000);
    return () => clearTimeout(t);
  }, [form]);

  const set = (patch: Partial<FormData>) => setForm(prev => ({ ...prev, ...patch }));
  const toggleAddOn = (a: string) =>
    set({ addOns: form.addOns.includes(a) ? form.addOns.filter(x => x !== a) : [...form.addOns, a] });
  const clearDraft = () => { localStorage.removeItem(DRAFT_KEY); setForm(EMPTY); setStep(0); };
  const today = new Date().toISOString().split('T')[0];

  const canNext = (): boolean => {
    if (step === 0) return !!form.occasion && !!form.bouquetType;
    if (step === 1) return !!form.targetDate && !!form.targetTime && (form.targetTime !== 'Custom' || !!form.customTime);
    if (step === 2) {
      if (!form.fulfillment) return false;
      if (form.fulfillment === 'pickup') return !!form.pickupLocation;
      if (form.fulfillment === 'delivery') {
        if (!form.deliveryBooker) return false;
        // "customer books rider" — no delivery address needed
        if (form.deliveryBooker === 'customer') return true;
        // "we book" — need delivery details
        return !!form.deliveryAddress && !!form.receiverName && !!form.receiverContact;
      }
    }
    if (step === 3) return !!form.customerName && !!form.customerContact;
    return true;
  };

  // ── Submitted Screen ──────────────────────────────────────────────────────
  if (submitted) {
    const summaryText = buildSummaryText(form, orderNumber);
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#C4717A]/10 border border-[#C4717A]/20">
              <CheckCircle className="h-10 w-10 text-[#C4717A]" />
            </div>
            <h2 className="text-2xl font-bold text-[#2C2C2C]">Inquiry Received!</h2>
            <p className="mt-2 text-sm text-[#2C2C2C]/55 leading-relaxed">
              Thank you, <strong>{form.customerName}</strong>! We'll confirm your inquiry within 24 hours.
              Payment details will be shared once your order is approved.
            </p>
          </div>

          {/* Reference */}
          <div className="rounded-2xl border border-[#C4717A]/15 bg-white px-5 py-4 mb-4">
            <p className="text-xs text-[#C4717A]/60 font-semibold uppercase tracking-widest">Inquiry Reference</p>
            <p className="text-2xl font-bold text-[#C4717A] mt-0.5">{orderNumber}</p>
            <p className="text-xs text-[#2C2C2C]/40 mt-0.5">Save this to track your inquiry.</p>
          </div>

          {/* Summary text box */}
          <div className="rounded-2xl border border-[#C4717A]/10 bg-white mb-3 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#C4717A]/10">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#2C2C2C]/40">Order Summary</p>
              <CopyButton text={summaryText} label="Copy All" />
            </div>
            <pre className="px-4 py-4 text-xs text-[#2C2C2C]/70 leading-relaxed whitespace-pre-wrap font-sans max-h-56 overflow-y-auto">
              {summaryText}
            </pre>
          </div>

          {/* Download card */}
          <div className="flex flex-col gap-3 items-stretch mb-4">
            <OrderCard form={form} orderNumber={orderNumber} />
          </div>

          {/* Nav */}
          <div className="flex flex-col gap-3 sm:flex-row justify-center">
            <Link to="/track"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C4717A] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#b05f68]">
              Track My Inquiry
            </Link>
            <Link to="/"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#C4717A]/30 px-6 py-2.5 text-sm font-bold text-[#C4717A] transition hover:bg-[#C4717A]/5">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Step Renders ──────────────────────────────────────────────────────────
  const renderStep = () => {
    switch (step) {

      // STEP 1 — Occasion & Bouquet
      case 0: return (
        <div className="space-y-7">
          <div>
            <FieldLabel>Select Occasion</FieldLabel>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {OCCASIONS.map(o => (
                <button key={o.id} type="button" onClick={() => set({ occasion: o.id })}
                  className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3.5 text-center transition-all ${
                    form.occasion === o.id
                      ? 'border-[#C4717A] bg-[#C4717A]/8 shadow-sm'
                      : 'border-[#C4717A]/15 bg-[#FAF6F0] hover:border-[#C4717A]/40'}`}>
                  <span className="text-2xl">{o.icon}</span>
                  <span className={`text-xs font-semibold ${form.occasion === o.id ? 'text-[#C4717A]' : 'text-[#2C2C2C]/60'}`}>{o.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <FieldLabel>Choose Bouquet Type</FieldLabel>
            <p className="mb-3 text-xs text-[#2C2C2C]/40">Prices may vary depending on flower availability and season.</p>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {BOUQUET_TYPES.map(b => (
                <button key={b.id} type="button"
                  onClick={() => set({ bouquetType: b.id, bouquetName: b.label, bouquetItem: '' })}
                  className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                    form.bouquetType === b.id
                      ? 'border-[#C4717A] bg-[#C4717A]/8 shadow-sm'
                      : 'border-[#C4717A]/15 bg-[#FAF6F0] hover:border-[#C4717A]/40'}`}>
                  <div className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 flex items-center justify-center ${
                    form.bouquetType === b.id ? 'border-[#C4717A]' : 'border-[#C4717A]/30'}`}>
                    {form.bouquetType === b.id && <div className="h-2 w-2 rounded-full bg-[#C4717A]" />}
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${form.bouquetType === b.id ? 'text-[#C4717A]' : 'text-[#2C2C2C]'}`}>{b.label}</p>
                    <p className="mt-0.5 text-xs text-[#C9A84C] font-semibold">{b.range}</p>
                    <p className="mt-0.5 text-xs text-[#2C2C2C]/50">{b.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            {form.bouquetType && form.bouquetType !== 'custom' && (
              <div className="mt-3 space-y-1.5">
                <p className="text-xs font-semibold text-[#2C2C2C]/45 uppercase tracking-widest">Specific bouquet</p>
                {BOUQUET_TYPES.find(b => b.id === form.bouquetType)?.items.map(item => (
                  <button key={item} type="button"
                    onClick={() => set({ bouquetItem: item, bouquetName: item.split(' —')[0] })}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-left text-xs transition-all ${
                      form.bouquetItem === item
                        ? 'border-[#C4717A] bg-[#C4717A]/8 font-semibold text-[#C4717A]'
                        : 'border-[#C4717A]/10 bg-white text-[#2C2C2C]/60 hover:border-[#C4717A]/30'}`}>
                    <span>{item.split(' —')[0]}</span>
                    <span className="font-semibold text-[#C9A84C]">{item.split('— ')[1]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      );

      // STEP 2 — Schedule
      case 1: return (
        <div className="space-y-6">
          <div>
            <FieldLabel>Target Date</FieldLabel>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C4717A]/50 pointer-events-none" />
              <input type="date" value={form.targetDate} min={today}
                onChange={e => set({ targetDate: e.target.value })}
                className={`${inputCls} pl-10`} />
            </div>
            {form.targetDate && (() => {
              const d = new Date(form.targetDate + 'T00:00:00');
              return (d.getDay() !== 0 && d.getDay() !== 6) ? (
                <p className="mt-2 flex items-center gap-1.5 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-700">
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  We primarily operate on weekends. Weekday orders depend on availability — we'll confirm with you.
                </p>
              ) : null;
            })()}
          </div>

          <div>
            <FieldLabel>Preferred Time Slot</FieldLabel>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {TIME_SLOTS.map(t => (
                <button key={t} type="button"
                  onClick={() => set({ targetTime: t, customTime: t !== 'Custom' ? '' : form.customTime })}
                  className={`rounded-xl border py-2.5 text-xs font-semibold transition-all ${
                    form.targetTime === t
                      ? 'border-[#C4717A] bg-[#C4717A] text-white shadow-sm'
                      : 'border-[#C4717A]/20 bg-[#FAF6F0] text-[#2C2C2C]/60 hover:border-[#C4717A]/50'}`}>
                  {t}
                </button>
              ))}
            </div>
            {form.targetTime === 'Custom' && (
              <div className="mt-3">
                <TextInput value={form.customTime} onChange={e => set({ customTime: e.target.value })}
                  placeholder="e.g. 7:00 PM or morning" />
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-[#6B7C5C]/20 bg-[#6B7C5C]/5 px-4 py-3 text-xs text-[#6B7C5C]">
            <p className="font-semibold">Weekend availability notice</p>
            <p className="mt-0.5 text-[#6B7C5C]/70">Popups run Saturdays & Sundays. Pre-orders must be placed 2–3 days in advance.</p>
          </div>
        </div>
      );

      // STEP 3 — Pickup or Delivery
      case 2: return (
        <div className="space-y-6">
          <div>
            <FieldLabel>How would you like to receive your order?</FieldLabel>
            <div className="grid grid-cols-2 gap-3">
              {([
                { id: 'pickup',   Icon: ShoppingBag, label: 'Pickup',   sub: 'At our popup locations' },
                { id: 'delivery', Icon: Truck,       label: 'Delivery', sub: 'Weekend delivery only'  },
              ] as const).map(({ id, Icon, label, sub }) => (
                <button key={id} type="button" onClick={() => set({ fulfillment: id })}
                  className={`flex flex-col items-center gap-2 rounded-2xl border p-5 transition-all ${
                    form.fulfillment === id
                      ? 'border-[#C4717A] bg-[#C4717A]/8 shadow-sm'
                      : 'border-[#C4717A]/15 bg-[#FAF6F0] hover:border-[#C4717A]/40'}`}>
                  <Icon className={`h-6 w-6 ${form.fulfillment === id ? 'text-[#C4717A]' : 'text-[#2C2C2C]/40'}`} />
                  <span className={`text-sm font-bold ${form.fulfillment === id ? 'text-[#C4717A]' : 'text-[#2C2C2C]'}`}>{label}</span>
                  <span className="text-xs text-[#2C2C2C]/45">{sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* PICKUP */}
          {form.fulfillment === 'pickup' && (
            <div>
              <FieldLabel>Pickup Location</FieldLabel>
              <div className="space-y-2">
                {PICKUP_LOCATIONS.map(loc => (
                  <button key={loc.id} type="button" onClick={() => set({ pickupLocation: loc.id })}
                    className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                      form.pickupLocation === loc.id
                        ? 'border-[#C4717A] bg-[#C4717A]/8'
                        : 'border-[#C4717A]/15 bg-[#FAF6F0] hover:border-[#C4717A]/40'}`}>
                    <MapPin className={`h-4 w-4 shrink-0 ${form.pickupLocation === loc.id ? 'text-[#C4717A]' : 'text-[#2C2C2C]/40'}`} />
                    <div>
                      <p className={`text-sm font-bold ${form.pickupLocation === loc.id ? 'text-[#C4717A]' : 'text-[#2C2C2C]'}`}>{loc.label}</p>
                      <p className="text-xs text-[#2C2C2C]/50">{loc.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              <p className="mt-3 rounded-xl bg-[#FAF6F0] border border-[#C4717A]/10 px-4 py-2.5 text-xs text-[#2C2C2C]/55">
                Payment: <strong>Cash on pickup</strong> or <strong>online payment</strong> — QR code provided upon order approval.
              </p>
            </div>
          )}

          {/* DELIVERY */}
          {form.fulfillment === 'delivery' && (
            <div className="space-y-5">
              <div>
                <FieldLabel>Who will book the rider?</FieldLabel>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { id: 'customer', label: "I'll book the rider", sub: 'Via Lalamove or Angkas' },
                    { id: 'us',       label: 'Book for me',         sub: 'We arrange delivery' },
                  ] as const).map(({ id, label, sub }) => (
                    <button key={id} type="button" onClick={() => set({ deliveryBooker: id })}
                      className={`rounded-2xl border p-4 text-left transition-all ${
                        form.deliveryBooker === id
                          ? 'border-[#C4717A] bg-[#C4717A]/8 shadow-sm'
                          : 'border-[#C4717A]/15 bg-[#FAF6F0] hover:border-[#C4717A]/40'}`}>
                      <p className={`text-sm font-bold ${form.deliveryBooker === id ? 'text-[#C4717A]' : 'text-[#2C2C2C]'}`}>{label}</p>
                      <p className="mt-0.5 text-xs text-[#2C2C2C]/45">{sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer books — show our address + map only */}
              {form.deliveryBooker === 'customer' && (
                <div className="space-y-3">
                  <p className="text-xs text-[#2C2C2C]/55 leading-relaxed">
                    Book a rider from our location to your recipient. Use the address and pin below.
                  </p>
                  <div className="rounded-2xl border border-[#C4717A]/15 bg-[#FAF6F0] px-4 py-3 space-y-2">
                    <p className="text-xs font-semibold text-[#2C2C2C]/45 uppercase tracking-widest">Our Pickup Address</p>
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-medium text-[#2C2C2C] leading-relaxed">{SHOP_ADDRESS}</p>
                      <CopyButton text={SHOP_ADDRESS} />
                    </div>
                  </div>
                  <div className="rounded-2xl border border-[#C4717A]/15 bg-[#FAF6F0] px-4 py-3 space-y-2">
                    <p className="text-xs font-semibold text-[#2C2C2C]/45 uppercase tracking-widest">Pin Coordinates</p>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-mono font-medium text-[#2C2C2C]">{SHOP_COORDS}</p>
                      <CopyButton text={SHOP_COORDS} />
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-2xl border border-[#C4717A]/15">
                    <iframe title="Pickup Location" src={MAPS_EMBED}
                      width="100%" height="200" style={{ border: 0 }}
                      allowFullScreen loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade" className="w-full" />
                  </div>
                </div>
              )}

              {/* We book — show full delivery address fields */}
              {form.deliveryBooker === 'us' && (
                <div className="space-y-4">
                  <div>
                    <FieldLabel>Delivery Address</FieldLabel>
                    <TextArea rows={2} value={form.deliveryAddress}
                      onChange={e => set({ deliveryAddress: e.target.value })}
                      placeholder="House/Unit No., Street, Barangay, City" />
                  </div>
                  <div>
                    <FieldLabel optional>Nearest Landmark</FieldLabel>
                    <TextInput value={form.deliveryLandmark}
                      onChange={e => set({ deliveryLandmark: e.target.value })}
                      placeholder="e.g. Near SM Santa Rosa" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <FieldLabel>Name of Receiver</FieldLabel>
                      <TextInput value={form.receiverName}
                        onChange={e => set({ receiverName: e.target.value })}
                        placeholder="Full name" />
                    </div>
                    <div>
                      <FieldLabel>Receiver's Contact</FieldLabel>
                      <TextInput value={form.receiverContact}
                        onChange={e => set({ receiverContact: e.target.value })}
                        placeholder="09XX XXX XXXX" />
                    </div>
                  </div>
                  <p className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-700">
                    Delivery fee is shouldered by the customer. Available via Lalamove or Angkas on weekends.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      );

      // STEP 4 — Customer Details
      case 3: return (
        <div className="space-y-5">
          <div>
            <FieldLabel>Full Name</FieldLabel>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C4717A]/50 pointer-events-none" />
              <input value={form.customerName} onChange={e => set({ customerName: e.target.value })}
                placeholder="e.g. Maria Santos" className={`${inputCls} pl-10`} />
            </div>
          </div>
          <div>
            <FieldLabel>Mobile Number</FieldLabel>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C4717A]/50 pointer-events-none" />
              <input value={form.customerContact} onChange={e => set({ customerContact: e.target.value })}
                placeholder="09XX XXX XXXX" className={`${inputCls} pl-10`} />
            </div>
          </div>
          <div>
            <FieldLabel optional>Facebook / Instagram</FieldLabel>
            <div className="relative">
              <Instagram className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C4717A]/50 pointer-events-none" />
              <input value={form.customerSocial} onChange={e => set({ customerSocial: e.target.value })}
                placeholder="@yourhandle" className={`${inputCls} pl-10`} />
            </div>
          </div>
        </div>
      );

      // STEP 5 — Bouquet Details
      case 4: return (
        <div className="space-y-5">
          <div>
            <FieldLabel>Bouquet Name / Label</FieldLabel>
            <TextInput value={form.bouquetName} onChange={e => set({ bouquetName: e.target.value })}
              placeholder="e.g. Pink Premium Bouquet" />
          </div>
          <div>
            <FieldLabel optional>Order Details</FieldLabel>
            <TextArea rows={4} value={form.details} onChange={e => set({ details: e.target.value })}
              placeholder="Preferred flowers, colors, size, message for recipient, etc. You may leave this blank." />
          </div>
          <div>
            <FieldLabel optional>Add-Ons</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {ADD_ONS.map(a => (
                <button key={a} type="button" onClick={() => toggleAddOn(a)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    form.addOns.includes(a)
                      ? 'border-[#C9A84C] bg-[#C9A84C] text-white'
                      : 'border-[#C9A84C]/30 bg-white text-[#2C2C2C]/55 hover:border-[#C9A84C]/60'}`}>
                  {a}
                </button>
              ))}
            </div>
          </div>
          <div>
            <FieldLabel optional>Preferred Budget</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {BUDGET_OPTIONS.map(b => (
                <button key={b} type="button" onClick={() => set({ preferredBudget: b })}
                  className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-all ${
                    form.preferredBudget === b
                      ? 'border-[#C4717A] bg-[#C4717A] text-white'
                      : 'border-[#C4717A]/20 bg-white text-[#2C2C2C]/55 hover:border-[#C4717A]/50'}`}>
                  {b}
                </button>
              ))}
            </div>
          </div>
          <div>
            <FieldLabel optional>Peg / Inspiration Photo</FieldLabel>
            {form.pegPreview ? (
              <div className="relative w-full">
                <img src={form.pegPreview} alt="Peg" className="h-40 w-full rounded-2xl object-cover border border-[#C4717A]/15" />
                <button type="button" onClick={() => set({ pegImage: null, pegPreview: '' })}
                  className="absolute top-2 right-2 rounded-full bg-white p-1.5 shadow border border-red-100 text-red-400 hover:text-red-600 transition">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-[#C4717A]/20 bg-[#FAF6F0] py-8 text-center transition hover:border-[#C4717A]/40">
                <Upload className="h-6 w-6 text-[#C4717A]/40" />
                <span className="text-xs text-[#2C2C2C]/45">Upload Pinterest peg, TikTok screenshot, or any reference</span>
                <span className="text-xs text-[#C4717A]/60 font-semibold">Browse file</span>
                <input type="file" accept="image/*" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) set({ pegImage: f, pegPreview: URL.createObjectURL(f) }); }} />
              </label>
            )}
          </div>
        </div>
      );

      // STEP 6 — Review
      case 5: {
        const displayTime  = form.targetTime === 'Custom' ? form.customTime : form.targetTime;
        const pickupLabel  = PICKUP_LOCATIONS.find(l => l.id === form.pickupLocation)?.label ?? '';
        const bouquetLabel = form.bouquetItem ? form.bouquetItem.split(' —')[0] : form.bouquetName;
        const occasionLabel = OCCASIONS.find(o => o.id === form.occasion)?.label ?? '';

        const rows = [
          { label: 'Customer',    value: form.customerName },
          { label: 'Contact',     value: form.customerContact },
          ...(form.customerSocial ? [{ label: 'Social', value: form.customerSocial }] : []),
          { label: 'Occasion',    value: occasionLabel },
          { label: 'Bouquet',     value: bouquetLabel || '—' },
          { label: 'Date',        value: form.targetDate || '—' },
          { label: 'Time',        value: displayTime || '—' },
          { label: 'Fulfillment', value: form.fulfillment === 'pickup' ? `Pickup — ${pickupLabel}` : `Delivery (${form.deliveryBooker === 'customer' ? 'I book rider' : 'You book for me'})` },
          ...(form.fulfillment === 'delivery' && form.deliveryBooker === 'us' ? [
            { label: 'Address',  value: form.deliveryAddress },
            ...(form.deliveryLandmark ? [{ label: 'Landmark', value: form.deliveryLandmark }] : []),
            { label: 'Receiver', value: `${form.receiverName} · ${form.receiverContact}` },
          ] : []),
          ...(form.details        ? [{ label: 'Details',  value: form.details }] : []),
          ...(form.addOns.length  ? [{ label: 'Add-Ons',  value: form.addOns.join(', ') }] : []),
          ...(form.preferredBudget ? [{ label: 'Budget',  value: form.preferredBudget }] : []),
        ];

        return (
          <div className="space-y-4">
            <p className="text-xs text-[#2C2C2C]/45 uppercase tracking-widest font-semibold">Review your inquiry</p>
            <div className="rounded-2xl border border-[#C4717A]/20 bg-[#C4717A]/5 px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#C4717A]/60 font-semibold uppercase tracking-widest">Inquiry Reference</p>
                <p className="text-lg font-bold text-[#C4717A]">{orderNumber}</p>
              </div>
              <Flower2 className="h-8 w-8 text-[#C4717A]/30" />
            </div>
            <div className="rounded-2xl border border-[#6B7C5C]/20 bg-[#6B7C5C]/5 px-4 py-3 text-xs text-[#6B7C5C]">
              <p className="font-semibold">Payment information</p>
              <p className="mt-0.5 text-[#6B7C5C]/70">
                {form.fulfillment === 'pickup'
                  ? 'Cash on pickup or online payment. QR code shared upon approval.'
                  : 'Downpayment details sent once your order is approved. Delivery fee is separate.'}
              </p>
            </div>
            {rows.map(({ label, value }) => (
              <div key={label} className="flex gap-3 rounded-xl border border-[#C4717A]/10 bg-[#FAF6F0] px-4 py-3">
                <span className="w-24 shrink-0 text-xs font-semibold text-[#2C2C2C]/40 uppercase tracking-wide pt-0.5">{label}</span>
                <span className="text-sm text-[#2C2C2C] leading-relaxed break-words">{value}</span>
              </div>
            ))}
            {form.pegPreview && (
              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-[#2C2C2C]/40">Reference Photo</p>
                <img src={form.pegPreview} alt="Peg" className="h-32 w-full rounded-2xl object-cover border border-[#C4717A]/15" />
              </div>
            )}
          </div>
        );
      }

      default: return null;
    }
  };

  // ── Layout ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FAF6F0] py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">

        <div className="mb-8 text-center">
          <img src={logo} alt="Beyond the Bloom by A" className="mx-auto mb-4 h-14 w-14 object-contain" />
          <h1 className="text-2xl font-bold text-[#2C2C2C]">Place Your Order</h1>
          <p className="mt-1 text-xs text-[#2C2C2C]/45">Step-by-step · Takes less than 3 minutes</p>
        </div>

        {/* Progress */}
        <div className="mb-6 overflow-x-auto pb-1">
          <div className="flex min-w-max items-center px-1">
            {STEPS.map(({ label, icon: Icon }, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center gap-1">
                  <button type="button"
                    onClick={() => i < step && setStep(i)}
                    disabled={i > step}
                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all ${
                      i < step  ? 'border-[#C4717A] bg-[#C4717A] text-white cursor-pointer'
                      : i === step ? 'border-[#C4717A] bg-white text-[#C4717A] shadow-sm'
                      : 'border-[#C4717A]/20 bg-white text-[#2C2C2C]/25 cursor-default'}`}>
                    {i < step ? <CheckCircle className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </button>
                  <span className={`text-[9px] font-semibold uppercase tracking-wide ${i === step ? 'text-[#C4717A]' : 'text-[#2C2C2C]/30'}`}>
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-px w-6 shrink-0 mb-4 transition-all ${i < step ? 'bg-[#C4717A]' : 'bg-[#C4717A]/15'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-[#C4717A]/10 bg-white p-6 shadow-lg sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            {(() => { const { icon: Icon } = STEPS[step]; return <Icon className="h-5 w-5 text-[#C4717A]" />; })()}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#C4717A]/60">Step {step + 1} of {STEPS.length}</p>
              <h2 className="text-lg font-bold text-[#2C2C2C]">{STEPS[step].label}</h2>
            </div>
          </div>

          {renderStep()}

          <div className="mt-8 flex items-center justify-between gap-3">
            {step > 0 ? (
              <button type="button" onClick={() => setStep(s => s - 1)}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#C4717A]/20 px-5 py-2.5 text-sm font-semibold text-[#C4717A] transition hover:bg-[#C4717A]/5 active:scale-95">
                <ChevronLeft className="h-4 w-4" /> Back
              </button>
            ) : (
              <button type="button" onClick={clearDraft}
                className="inline-flex items-center gap-1.5 rounded-full border border-red-200 px-5 py-2.5 text-xs font-semibold text-red-400 transition hover:bg-red-50 active:scale-95">
                <Trash2 className="h-3.5 w-3.5" /> Clear
              </button>
            )}

            {step < STEPS.length - 1 ? (
              <button type="button" disabled={!canNext()} onClick={() => setStep(s => s + 1)}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#C4717A] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#C4717A]/25 transition hover:bg-[#b36370] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed">
                Continue <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button type="button"
                onClick={() => { localStorage.removeItem(DRAFT_KEY); setSubmitted(true); }}
                className="inline-flex items-center gap-2 rounded-full bg-[#C4717A] px-7 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#C4717A]/25 transition hover:bg-[#b36370] active:scale-95">
                <Flower2 className="h-4 w-4" /> Submit Inquiry
              </button>
            )}
          </div>
        </div>

        <div className={`mt-4 flex items-center justify-center gap-1.5 text-xs text-[#6B7C5C] transition-opacity duration-500 ${draftSaved ? 'opacity-100' : 'opacity-0'}`}>
          <Save className="h-3 w-3" /> Draft saved automatically
        </div>

        <p className="mt-4 text-center text-xs text-[#2C2C2C]/35">
          Already submitted?{' '}
          <Link to="/track" className="text-[#C4717A] hover:underline font-semibold">Track your inquiry</Link>
        </p>
      </div>
    </div>
  );
};

export default InquiryForm;