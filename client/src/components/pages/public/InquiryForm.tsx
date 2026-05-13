// client/src/components/pages/public/InquiryForm.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Flower2, Calendar, MapPin, User, ClipboardList,
  CheckCircle, ChevronRight, ChevronLeft,
  Truck, ShoppingBag, Upload, Clock, Phone, Instagram,
  Trash2, Save, Copy, Check, Download, Plus, Minus,
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
  { id: 'krav', label: 'Krav Coffee',  desc: 'Sta. Rosa, Laguna' },
  { id: 'dali', label: 'DALI',         desc: 'Brgy. Labas, Sta. Rosa City, Laguna' },
];

const ADD_ONS = [
  'Ribbon (custom color)', 'Chocolate', 'LED Lights', 'Message Card',
  'Dried Flowers', "Baby's Breath", 'Raffia Wrap',
];

const SHOP_ADDRESS = 'Barangay Labas, Sta. Rosa City, Laguna, Philippines';
const SHOP_COORDS  = '14.309361, 121.109694';
const MAPS_EMBED   = 'https://www.google.com/maps?q=14.309361,121.109694&output=embed';

// ─── Types ────────────────────────────────────────────────────────────────────

interface BouquetItem {
  bouquetType: string;
  bouquetItem: string;
  bouquetName: string;
  occasion: string;
  details: string;
  addOns: string[];
  preferredBudget: string;
  pegImage: File | null;
  pegPreview: string;
}

interface FormData {
  bouquets: BouquetItem[];
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
}

const EMPTY_BOUQUET: BouquetItem = {
  bouquetType: '', bouquetItem: '', bouquetName: '',
  occasion: '', details: '', addOns: [], preferredBudget: '',
  pegImage: null, pegPreview: '',
};

const EMPTY: FormData = {
  bouquets: [{ ...EMPTY_BOUQUET }],
  targetDate: '', targetTime: '', customTime: '',
  fulfillment: '', pickupLocation: '',
  deliveryAddress: '', deliveryLandmark: '', receiverName: '', receiverContact: '',
  deliveryBooker: '',
  customerName: '', customerContact: '', customerSocial: '',
};

const DRAFT_KEY = 'btb_inquiry_draft';

const STEPS = [
  { label: 'Bouquets', icon: Flower2       },
  { label: 'Schedule', icon: Calendar      },
  { label: 'Delivery', icon: Truck         },
  { label: 'Details',  icon: User          },
  { label: 'Review',   icon: CheckCircle   },
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

// ─── Order Card (canvas) ──────────────────────────────────────────────────────

const OrderCard: React.FC<{ form: FormData; orderNumber: string }> = ({ form, orderNumber }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [downloaded, setDownloaded] = useState(false);

  const displayTime  = form.targetTime === 'Custom' ? form.customTime : form.targetTime;
  const pickupLabel  = PICKUP_LOCATIONS.find(l => l.id === form.pickupLocation)?.label ?? '';

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 600, PAD = 36, LINE_H = 22;

    const lines: { bold?: boolean; text: string; sub?: boolean }[] = [
      { bold: true, text: '🌸 Beyond the Bloom by A' },
      { sub:  true, text: orderNumber },
      { text: '' },
      { bold: true, text: `Customer: ${form.customerName}` },
      { text: `Contact: ${form.customerContact}` },
      ...(form.customerSocial ? [{ text: `Social: ${form.customerSocial}` }] : []),
      { text: '' },
      { bold: true, text: `Target date: ${form.targetDate}` },
      { bold: true, text: `Target time: ${displayTime}` },
      { bold: true, text: `Fulfillment: ${form.fulfillment === 'pickup' ? `Pickup — ${pickupLabel}` : 'Delivery'}` },
      ...(form.fulfillment === 'delivery' && form.deliveryBooker === 'us' ? [
        { text: `Address: ${form.deliveryAddress}` },
        ...(form.deliveryLandmark ? [{ text: `Landmark: ${form.deliveryLandmark}` }] : []),
        { text: `Receiver: ${form.receiverName} · ${form.receiverContact}` },
      ] : []),
      { text: '' },
      ...form.bouquets.flatMap((b, i) => [
        { bold: true, text: `Bouquet ${form.bouquets.length > 1 ? `#${i + 1}` : ''}: ${b.bouquetItem ? b.bouquetItem.split(' —')[0] : b.bouquetName}` },
        ...(b.occasion    ? [{ text: `Occasion: ${OCCASIONS.find(o => o.id === b.occasion)?.label ?? b.occasion}` }] : []),
        ...(b.preferredBudget ? [{ text: `Budget: ${b.preferredBudget}` }] : []),
        ...(b.details     ? [{ text: `Details: ${b.details}` }] : []),
        ...(b.addOns.length ? [{ text: `Add-ons: ${b.addOns.join(', ')}` }] : []),
        { text: '' },
      ]),
      { sub: true, text: 'Total: TBD upon approval' },
      { sub: true, text: 'DP: TBD upon approval' },
      { sub: true, text: 'btbya.com · Sta. Rosa, Laguna' },
    ];

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
        if (ctx.measureText(test).width > W - PAD * 2) { ctx.fillText(row, PAD, y); y += LINE_H; row = word; }
        else row = test;
      }
      if (row) { ctx.fillText(row, PAD, y); y += LINE_H; }
    }

    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `${orderNumber}.png`;
    a.click();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <>
      <canvas ref={canvasRef} className="hidden" />
      <button type="button" onClick={download}
        className="inline-flex items-center gap-2 rounded-full bg-[#2C2C2C] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#444] active:scale-95">
        {downloaded ? <><Check className="h-4 w-4" />Downloaded!</> : <><Download className="h-4 w-4" />Download Order Card</>}
      </button>
    </>
  );
};

// ─── Summary text ─────────────────────────────────────────────────────────────

function buildSummaryText(form: FormData, orderNumber: string): string {
  const displayTime = form.targetTime === 'Custom' ? form.customTime : form.targetTime;
  const pickupLabel = PICKUP_LOCATIONS.find(l => l.id === form.pickupLocation)?.label ?? '';

  return [
    '🌸 Beyond the Bloom by A',
    `Order Reference: ${orderNumber}`,
    '',
    `Customer: ${form.customerName}`,
    `Contact: ${form.customerContact}`,
    ...(form.customerSocial ? [`Social: ${form.customerSocial}`] : []),
    '',
    `Target date: ${form.targetDate}`,
    `Target time: ${displayTime}`,
    `Fulfillment: ${form.fulfillment === 'pickup' ? `Pickup — ${pickupLabel}` : 'Delivery'}`,
    ...(form.fulfillment === 'delivery' && form.deliveryBooker === 'us' ? [
      `Address: ${form.deliveryAddress}`,
      ...(form.deliveryLandmark ? [`Landmark: ${form.deliveryLandmark}`] : []),
      `Receiver: ${form.receiverName} · ${form.receiverContact}`,
    ] : []),
    '',
    ...form.bouquets.flatMap((b, i) => [
      `--- Bouquet ${form.bouquets.length > 1 ? `#${i + 1}` : ''} ---`,
      `Name: ${b.bouquetItem ? b.bouquetItem.split(' —')[0] : b.bouquetName}`,
      ...(b.occasion ? [`Occasion: ${OCCASIONS.find(o => o.id === b.occasion)?.label ?? b.occasion}`] : []),
      ...(b.preferredBudget ? [`Budget: ${b.preferredBudget}`] : []),
      ...(b.details  ? [`Details: ${b.details}`] : []),
      ...(b.addOns.length ? [`Add-ons: ${b.addOns.join(', ')}`] : []),
      '',
    ]),
    'Total: TBD upon approval',
    'DP: TBD upon approval',
  ].join('\n');
}

// ─── Bouquet Card (per bouquet in Step 1) ─────────────────────────────────────

const BouquetCard: React.FC<{
  bouquet: BouquetItem;
  index: number;
  total: number;
  onChange: (patch: Partial<BouquetItem>) => void;
  onRemove: () => void;
}> = ({ bouquet, index, total, onChange, onRemove }) => {
  const toggleAddOn = (a: string) =>
    onChange({ addOns: bouquet.addOns.includes(a) ? bouquet.addOns.filter(x => x !== a) : [...bouquet.addOns, a] });

  return (
    <div className="rounded-2xl border border-[#C4717A]/15 bg-white p-5 space-y-5 shadow-sm">
      {/* Card header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#C4717A]/10">
            <Flower2 className="h-3.5 w-3.5 text-[#C4717A]" />
          </div>
          <span className="text-sm font-bold text-[#2C2C2C]">
            {total > 1 ? `Bouquet #${index + 1}` : 'Your Bouquet'}
          </span>
        </div>
        {total > 1 && (
          <button type="button" onClick={onRemove}
            className="inline-flex items-center gap-1 rounded-full border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-400 transition hover:bg-red-50 active:scale-95">
            <Trash2 className="h-3 w-3" /> Remove
          </button>
        )}
      </div>

      {/* Bouquet Type */}
      <div>
        <FieldLabel>Bouquet Type</FieldLabel>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {BOUQUET_TYPES.map(b => (
            <button key={b.id} type="button"
              onClick={() => onChange({ bouquetType: b.id, bouquetName: b.label, bouquetItem: '' })}
              className={`flex items-start gap-3 rounded-2xl border p-3.5 text-left transition-all ${
                bouquet.bouquetType === b.id
                  ? 'border-[#C4717A] bg-[#C4717A]/8 shadow-sm'
                  : 'border-[#C4717A]/15 bg-[#FAF6F0] hover:border-[#C4717A]/40'}`}>
              <div className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 flex items-center justify-center ${
                bouquet.bouquetType === b.id ? 'border-[#C4717A]' : 'border-[#C4717A]/30'}`}>
                {bouquet.bouquetType === b.id && <div className="h-2 w-2 rounded-full bg-[#C4717A]" />}
              </div>
              <div>
                <p className={`text-sm font-bold ${bouquet.bouquetType === b.id ? 'text-[#C4717A]' : 'text-[#2C2C2C]'}`}>{b.label}</p>
                <p className="mt-0.5 text-xs text-[#C9A84C] font-semibold">{b.range}</p>
                <p className="mt-0.5 text-xs text-[#2C2C2C]/50">{b.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {bouquet.bouquetType && bouquet.bouquetType !== 'custom' && (
          <div className="mt-3 space-y-1.5">
            <p className="text-xs font-semibold text-[#2C2C2C]/45 uppercase tracking-widest">Specific bouquet</p>
            {BOUQUET_TYPES.find(b => b.id === bouquet.bouquetType)?.items.map(item => (
              <button key={item} type="button"
                onClick={() => onChange({ bouquetItem: item, bouquetName: item.split(' —')[0] })}
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-left text-xs transition-all ${
                  bouquet.bouquetItem === item
                    ? 'border-[#C4717A] bg-[#C4717A]/8 font-semibold text-[#C4717A]'
                    : 'border-[#C4717A]/10 bg-white text-[#2C2C2C]/60 hover:border-[#C4717A]/30'}`}>
                <span>{item.split(' —')[0]}</span>
                <span className="font-semibold text-[#C9A84C]">{item.split('— ')[1]}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Occasion (optional) */}
      <div>
        <FieldLabel optional>Occasion</FieldLabel>
        <div className="grid grid-cols-4 gap-2">
          {OCCASIONS.map(o => (
            <button key={o.id} type="button"
              onClick={() => onChange({ occasion: bouquet.occasion === o.id ? '' : o.id })}
              className={`flex flex-col items-center gap-1 rounded-2xl border p-2.5 text-center transition-all ${
                bouquet.occasion === o.id
                  ? 'border-[#C4717A] bg-[#C4717A]/8 shadow-sm'
                  : 'border-[#C4717A]/15 bg-[#FAF6F0] hover:border-[#C4717A]/40'}`}>
              <span className="text-xl">{o.icon}</span>
              <span className={`text-[10px] font-semibold leading-tight ${bouquet.occasion === o.id ? 'text-[#C4717A]' : 'text-[#2C2C2C]/60'}`}>{o.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Details */}
      <div>
        <FieldLabel optional>Order Details</FieldLabel>
        <TextArea rows={3} value={bouquet.details}
          onChange={e => onChange({ details: e.target.value })}
          placeholder="Preferred flowers, colors, size, message for recipient, etc." />
      </div>

      {/* Add-Ons */}
      <div>
        <FieldLabel optional>Add-Ons</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {ADD_ONS.map(a => (
            <button key={a} type="button" onClick={() => toggleAddOn(a)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                bouquet.addOns.includes(a)
                  ? 'border-[#C9A84C] bg-[#C9A84C] text-white'
                  : 'border-[#C9A84C]/30 bg-white text-[#2C2C2C]/55 hover:border-[#C9A84C]/60'}`}>
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div>
        <FieldLabel optional>Preferred Budget</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {BUDGET_OPTIONS.map(b => (
            <button key={b} type="button"
              onClick={() => onChange({ preferredBudget: bouquet.preferredBudget === b ? '' : b })}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-all ${
                bouquet.preferredBudget === b
                  ? 'border-[#C4717A] bg-[#C4717A] text-white'
                  : 'border-[#C4717A]/20 bg-white text-[#2C2C2C]/55 hover:border-[#C4717A]/50'}`}>
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Peg Image */}
      <div>
        <FieldLabel optional>Peg / Inspiration Photo</FieldLabel>
        {bouquet.pegPreview ? (
          <div className="relative w-full">
            <img src={bouquet.pegPreview} alt="Peg" className="h-40 w-full rounded-2xl object-cover border border-[#C4717A]/15" />
            <button type="button" onClick={() => onChange({ pegImage: null, pegPreview: '' })}
              className="absolute top-2 right-2 rounded-full bg-white p-1.5 shadow border border-red-100 text-red-400 hover:text-red-600 transition">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-[#C4717A]/20 bg-[#FAF6F0] py-6 text-center transition hover:border-[#C4717A]/40">
            <Upload className="h-5 w-5 text-[#C4717A]/40" />
            <span className="text-xs text-[#2C2C2C]/45">Pinterest peg, TikTok screenshot, or any reference</span>
            <span className="text-xs text-[#C4717A]/60 font-semibold">Browse file</span>
            <input type="file" accept="image/*" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) onChange({ pegImage: f, pegPreview: URL.createObjectURL(f) }); }} />
          </label>
        )}
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const InquiryForm: React.FC = () => {
  const [step, setStep]               = useState(0);
  const [form, setForm]               = useState<FormData>(EMPTY);
  const [submitted, setSubmitted]     = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [draftSaved, setDraftSaved]   = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [idLoading, setIdLoading]     = useState(true);

  // Fetch incremental order ID on mount
  useEffect(() => {
    fetch('/api/inquiries/next-id')
      .then(r => r.json())
      .then(data => setOrderNumber(data.nextId))
      .catch(() => setOrderNumber(`BTB-INQ-${String(Date.now()).slice(-4)}`))
      .finally(() => setIdLoading(false));
  }, []);

  // Draft save/load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        setForm({
          ...EMPTY,
          ...p,
          bouquets: (p.bouquets ?? [EMPTY_BOUQUET]).map((b: BouquetItem) => ({ ...EMPTY_BOUQUET, ...b, pegImage: null, pegPreview: '' })),
        });
      }
    } catch {}
  }, []);

  useEffect(() => {
    const saveable = {
      ...form,
      bouquets: form.bouquets.map(({ pegImage, ...rest }) => rest),
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(saveable));
    setDraftSaved(true);
    const t = setTimeout(() => setDraftSaved(false), 2000);
    return () => clearTimeout(t);
  }, [form]);

  const set = (patch: Partial<FormData>) => setForm(prev => ({ ...prev, ...patch }));

  const setBouquet = (index: number, patch: Partial<BouquetItem>) =>
    setForm(prev => ({
      ...prev,
      bouquets: prev.bouquets.map((b, i) => i === index ? { ...b, ...patch } : b),
    }));

  const addBouquet = () =>
    setForm(prev => ({ ...prev, bouquets: [...prev.bouquets, { ...EMPTY_BOUQUET }] }));

  const removeBouquet = (index: number) =>
    setForm(prev => ({ ...prev, bouquets: prev.bouquets.filter((_, i) => i !== index) }));

  const clearDraft = () => { localStorage.removeItem(DRAFT_KEY); setForm(EMPTY); setStep(0); };
  const today = new Date().toISOString().split('T')[0];

  const canNext = (): boolean => {
    if (step === 0) return form.bouquets.every(b => !!b.bouquetType);
    if (step === 1) return !!form.targetDate && !!form.targetTime && (form.targetTime !== 'Custom' || !!form.customTime);
    if (step === 2) {
      if (!form.fulfillment) return false;
      if (form.fulfillment === 'pickup') return !!form.pickupLocation;
      if (form.fulfillment === 'delivery') {
        if (!form.deliveryBooker) return false;
        if (form.deliveryBooker === 'customer') return true;
        return !!form.deliveryAddress && !!form.receiverName && !!form.receiverContact;
      }
    }
    if (step === 3) return !!form.customerName && !!form.customerContact;
    return true;
  };

  // ── Submitted Screen ────────────────────────────────────────────────────────
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
            </p>
          </div>

          <div className="rounded-2xl border border-[#C4717A]/15 bg-white px-5 py-4 mb-4">
            <p className="text-xs text-[#C4717A]/60 font-semibold uppercase tracking-widest">Inquiry Reference</p>
            <p className="text-2xl font-bold text-[#C4717A] mt-0.5">{orderNumber}</p>
            <p className="text-xs text-[#2C2C2C]/40 mt-0.5">Save this to track your inquiry.</p>
          </div>

          {form.bouquets.length > 1 && (
            <div className="rounded-2xl border border-[#C9A84C]/20 bg-[#C9A84C]/5 px-4 py-3 mb-4 text-xs text-[#C9A84C] font-semibold">
              🌸 {form.bouquets.length} bouquets included in this inquiry
            </div>
          )}

          <div className="rounded-2xl border border-[#C4717A]/10 bg-white mb-3 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#C4717A]/10">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#2C2C2C]/40">Order Summary</p>
              <CopyButton text={summaryText} label="Copy All" />
            </div>
            <pre className="px-4 py-4 text-xs text-[#2C2C2C]/70 leading-relaxed whitespace-pre-wrap font-sans max-h-56 overflow-y-auto">
              {summaryText}
            </pre>
          </div>

          <div className="flex flex-col gap-3 items-stretch mb-4">
            <OrderCard form={form} orderNumber={orderNumber} />
          </div>

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

  // ── Step Renders ────────────────────────────────────────────────────────────
  const renderStep = () => {
    switch (step) {

      // STEP 1 — Bouquets
      case 0: return (
        <div className="space-y-4">
          {form.bouquets.map((bouquet, i) => (
            <BouquetCard
              key={i}
              bouquet={bouquet}
              index={i}
              total={form.bouquets.length}
              onChange={patch => setBouquet(i, patch)}
              onRemove={() => removeBouquet(i)}
            />
          ))}

          {/* Add bouquet button */}
          <button type="button" onClick={addBouquet}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#C4717A]/20 py-4 text-sm font-semibold text-[#C4717A]/60 transition hover:border-[#C4717A]/50 hover:text-[#C4717A] hover:bg-[#C4717A]/3 active:scale-[0.99]">
            <Plus className="h-4 w-4" />
            Add Another Bouquet
          </button>

          {form.bouquets.length > 1 && (
            <p className="text-center text-xs text-[#2C2C2C]/40">
              All bouquets will share one order reference and schedule.
            </p>
          )}
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
                  We primarily operate on weekends. Weekday orders depend on availability.
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

      // STEP 3 — Delivery
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
            </div>
          )}

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

      // STEP 5 — Review
      case 4: {
        const displayTime  = form.targetTime === 'Custom' ? form.customTime : form.targetTime;
        const pickupLabel  = PICKUP_LOCATIONS.find(l => l.id === form.pickupLocation)?.label ?? '';

        return (
          <div className="space-y-4">
            <p className="text-xs text-[#2C2C2C]/45 uppercase tracking-widest font-semibold">Review your inquiry</p>

            {/* Reference */}
            <div className="rounded-2xl border border-[#C4717A]/20 bg-[#C4717A]/5 px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#C4717A]/60 font-semibold uppercase tracking-widest">Inquiry Reference</p>
                {idLoading
                  ? <div className="mt-1 h-6 w-36 animate-pulse rounded-lg bg-[#C4717A]/15" />
                  : <p className="text-lg font-bold text-[#C4717A]">{orderNumber}</p>
                }
              </div>
              <Flower2 className="h-8 w-8 text-[#C4717A]/30" />
            </div>

            {/* Schedule & Fulfillment */}
            <div className="rounded-2xl border border-[#C4717A]/10 bg-white divide-y divide-[#C4717A]/8 overflow-hidden">
              {[
                { label: 'Customer',    value: form.customerName },
                { label: 'Contact',     value: form.customerContact },
                ...(form.customerSocial ? [{ label: 'Social', value: form.customerSocial }] : []),
                { label: 'Date',        value: form.targetDate || '—' },
                { label: 'Time',        value: displayTime || '—' },
                { label: 'Fulfillment', value: form.fulfillment === 'pickup' ? `Pickup — ${pickupLabel}` : `Delivery (${form.deliveryBooker === 'customer' ? 'I book rider' : 'You book for me'})` },
                ...(form.fulfillment === 'delivery' && form.deliveryBooker === 'us' ? [
                  { label: 'Address',   value: form.deliveryAddress },
                  ...(form.deliveryLandmark ? [{ label: 'Landmark', value: form.deliveryLandmark }] : []),
                  { label: 'Receiver',  value: `${form.receiverName} · ${form.receiverContact}` },
                ] : []),
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-3 px-4 py-3">
                  <span className="w-24 shrink-0 text-xs font-semibold uppercase tracking-wide text-[#2C2C2C]/40 pt-0.5">{label}</span>
                  <span className="text-sm text-[#2C2C2C] break-words">{value}</span>
                </div>
              ))}
            </div>

            {/* Bouquets summary */}
            {form.bouquets.map((b, i) => (
              <div key={i} className="rounded-2xl border border-[#C4717A]/10 bg-white overflow-hidden">
                <div className="flex items-center gap-2 bg-[#C4717A]/5 px-4 py-2.5 border-b border-[#C4717A]/10">
                  <Flower2 className="h-3.5 w-3.5 text-[#C4717A]" />
                  <p className="text-xs font-bold text-[#C4717A] uppercase tracking-widest">
                    {form.bouquets.length > 1 ? `Bouquet #${i + 1}` : 'Bouquet'}
                  </p>
                </div>
                <div className="divide-y divide-[#C4717A]/8">
                  {[
                    { label: 'Type',    value: b.bouquetItem ? b.bouquetItem.split(' —')[0] : (b.bouquetName || '—') },
                    ...(b.occasion ? [{ label: 'Occasion', value: OCCASIONS.find(o => o.id === b.occasion)?.label ?? b.occasion }] : []),
                    ...(b.preferredBudget ? [{ label: 'Budget', value: b.preferredBudget }] : []),
                    ...(b.details ? [{ label: 'Details', value: b.details }] : []),
                    ...(b.addOns.length ? [{ label: 'Add-Ons', value: b.addOns.join(', ') }] : []),
                  ].map(({ label, value }) => (
                    <div key={label} className="flex gap-3 px-4 py-3">
                      <span className="w-24 shrink-0 text-xs font-semibold uppercase tracking-wide text-[#2C2C2C]/40 pt-0.5">{label}</span>
                      <span className="text-sm text-[#2C2C2C] break-words">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="rounded-2xl border border-[#6B7C5C]/20 bg-[#6B7C5C]/5 px-4 py-3 text-xs text-[#6B7C5C]">
              <p className="font-semibold">Payment</p>
              <p className="mt-0.5 text-[#6B7C5C]/70">
                {form.fulfillment === 'pickup'
                  ? 'Cash on pickup or online payment. QR code shared upon approval.'
                  : 'Downpayment details sent once your order is approved.'}
              </p>
            </div>

            {submitError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {submitError}
              </div>
            )}
          </div>
        );
      }

      default: return null;
    }
  };

  // ── Layout ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FAF6F0] py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-lg">

        {/* Header */}
        <div className="mb-6 text-center">
          <img src={logo} alt="BTBbyA" className="mx-auto mb-3 h-14 w-14 object-contain" />
          <h1 className="text-2xl font-bold text-[#2C2C2C]">Place an Inquiry</h1>
          <p className="mt-1 text-sm text-[#2C2C2C]/50">Beyond the Bloom by A · Sta. Rosa, Laguna</p>
        </div>

        {/* Step indicator */}
        <div className="mb-6 flex items-center justify-between gap-1">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const done    = i < step;
            const active  = i === step;
            return (
              <React.Fragment key={s.label}>
                <div className="flex flex-col items-center gap-1 min-w-0">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all ${
                    active  ? 'border-[#C4717A] bg-[#C4717A] text-white shadow-md shadow-[#C4717A]/30'
                    : done  ? 'border-[#C4717A] bg-[#C4717A]/10 text-[#C4717A]'
                            : 'border-[#C4717A]/20 bg-white text-[#2C2C2C]/30'}`}>
                    {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <span className={`text-[10px] font-semibold hidden sm:block ${active ? 'text-[#C4717A]' : done ? 'text-[#C4717A]/60' : 'text-[#2C2C2C]/30'}`}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-px flex-1 transition-all ${i < step ? 'bg-[#C4717A]/40' : 'bg-[#C4717A]/10'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Draft saved indicator */}
        <div className={`mb-3 flex items-center justify-between text-xs text-[#2C2C2C]/35 transition-opacity ${draftSaved ? 'opacity-100' : 'opacity-0'}`}>
          <span className="flex items-center gap-1"><Save className="h-3 w-3" /> Draft saved</span>
          <button type="button" onClick={clearDraft} className="flex items-center gap-1 text-red-300 hover:text-red-400 transition">
            <Trash2 className="h-3 w-3" /> Clear
          </button>
        </div>

        {/* Step content */}
        <div className="rounded-3xl border border-[#C4717A]/10 bg-white p-5 shadow-lg sm:p-6">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between gap-3">
          {step > 0 ? (
            <button type="button" onClick={() => setStep(s => s - 1)}
              className="inline-flex items-center gap-2 rounded-full border border-[#C4717A]/20 px-5 py-2.5 text-sm font-semibold text-[#C4717A] transition hover:bg-[#C4717A]/5 active:scale-95">
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < STEPS.length - 1 ? (
            <button type="button" onClick={() => canNext() && setStep(s => s + 1)}
              disabled={!canNext()}
              className="inline-flex items-center gap-2 rounded-full bg-[#C4717A] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#C4717A]/25 transition hover:bg-[#b36370] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed">
              Next <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button type="button"
              disabled={submitting || idLoading}
              onClick={async () => {
                setSubmitting(true);
                setSubmitError('');
                try {
                  // Replace the payload block inside the submit onClick:
const payload = {
  id:              orderNumber,
  occasion:        form.bouquets[0].occasion || null,
  bouquetType:     form.bouquets[0].bouquetType,
  bouquetName:     form.bouquets.map((b, i) =>
    form.bouquets.length > 1
      ? `#${i + 1}: ${b.bouquetItem ? b.bouquetItem.split(' —')[0] : b.bouquetName}`
      : (b.bouquetItem ? b.bouquetItem.split(' —')[0] : b.bouquetName)
  ).join(' | '),
  targetDate:      form.targetDate,
  targetTime:      form.targetTime === 'Custom' ? form.customTime : form.targetTime,
  fulfillment:     form.fulfillment,
  pickupLocation:  form.pickupLocation,
  deliveryAddress: form.deliveryAddress,
  deliveryLandmark:form.deliveryLandmark,
  deliveryBooker:  form.deliveryBooker,
  receiverName:    form.receiverName,
  receiverContact: form.receiverContact,
  customerName:    form.customerName,
  customerContact: form.customerContact,
  customerSocial:  form.customerSocial,
  details: form.bouquets.map((b, i) =>
    form.bouquets.length > 1
      ? `[Bouquet #${i + 1} — ${b.bouquetItem ? b.bouquetItem.split(' —')[0] : b.bouquetName}]${b.occasion ? ` (${OCCASIONS.find(o => o.id === b.occasion)?.label})` : ''}: ${b.details || '—'}`
      : b.details
  ).filter(Boolean).join('\n'),
  addOns:          [...new Set(form.bouquets.flatMap(b => b.addOns))],
  preferredBudget: form.bouquets.map(b => b.preferredBudget).filter(Boolean).join(', '),
};

                  const res = await fetch('/api/inquiries', {
                    method:  'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body:    JSON.stringify(payload),
                  });

                  if (!res.ok) {
                    const err = await res.json();
                    setSubmitError(err.error ?? 'Failed to submit. Please try again.');
                    return;
                  }

                  localStorage.removeItem(DRAFT_KEY);
                  setSubmitted(true);
                } catch {
                  setSubmitError('Network error. Please check your connection and try again.');
                } finally {
                  setSubmitting(false);
                }
              }}
              className="inline-flex items-center gap-2 rounded-full bg-[#C4717A] px-7 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#C4717A]/25 transition hover:bg-[#b36370] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting
                ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Submitting…</>
                : <><Flower2 className="h-4 w-4" />Submit Inquiry</>
              }
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default InquiryForm;