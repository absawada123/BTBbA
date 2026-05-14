// client/src/components/pages/public/inquiry/InquiryForm.tsx
import React, { useState, useEffect } from 'react';
import { Check, Save, Trash2, ChevronLeft, ChevronRight, Flower2 } from 'lucide-react';
import logo from '../../../../assets/images/logo.png';
import { AnimatePresence, motion } from 'framer-motion';
import {
  STEPS, OCCASIONS, DRAFT_KEY, EMPTY, EMPTY_BOUQUET,
  FormData, BouquetItem,
} from './constants';
import SubmittedScreen from './SubmittedScreen';
import StepBouquets  from './steps/StepBouquets';
import StepSchedule  from './steps/StepSchedule';
import StepDelivery  from './steps/StepDelivery';
import StepDetails   from './steps/StepDetails';
import StepReview    from './steps/StepReview';

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

  // Draft load
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

  // Draft save
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
    return <SubmittedScreen form={form} orderNumber={orderNumber} />;
  }

  // ── Step Renders ────────────────────────────────────────────────────────────
  const renderStep = () => {
    switch (step) {
      case 0: return <StepBouquets form={form} setBouquet={setBouquet} addBouquet={addBouquet} removeBouquet={removeBouquet} />;
      case 1: return <StepSchedule form={form} set={set} />;
      case 2: return <StepDelivery form={form} set={set} />;
      case 3: return <StepDetails  form={form} set={set} />;
      case 4: return <StepReview   form={form} orderNumber={orderNumber} idLoading={idLoading} submitError={submitError} />;
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
            const done   = i < step;
            const active = i === step;
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