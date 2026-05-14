// client/src/components/pages/admin/inquiries/components/detail/PaymentCard.tsx

import React, { useState } from 'react';
import { Wallet, Save } from 'lucide-react';
import type { InquiryDetail } from '../../InquiryDetailPage';

interface Props { data: InquiryDetail; onRefresh: () => void }

const PAY_STATUSES = ['unpaid', 'downpayment_paid', 'fully_paid', 'refunded'];
const PAY_LABELS: Record<string, string> = {
  unpaid: 'Unpaid', downpayment_paid: 'Downpayment Paid',
  fully_paid: 'Fully Paid', refunded: 'Refunded',
};

const fmt = (n: number) => `₱${n.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;

const PaymentCard: React.FC<Props> = ({ data, onRefresh }) => {
  const [amountPaid,    setAmountPaid]    = useState(String(data.amount_paid));
  const [downpayment,   setDownpayment]   = useState(String(data.downpayment));
  const [payStatus,     setPayStatus]     = useState(data.payment_status);
  const [saving,        setSaving]        = useState(false);
  const [saved,         setSaved]         = useState(false);

  const save = async () => {
    setSaving(true);
    await fetch(`/api/inquiries/${data.id}/payment`, {
      method: 'PATCH', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount_paid:    parseFloat(amountPaid)  || 0,
        downpayment:    parseFloat(downpayment) || 0,
        payment_status: payStatus,
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    onRefresh();
  };

  const pct = data.total_amount > 0
    ? Math.min(100, (parseFloat(amountPaid) / data.total_amount) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-[#EDE0E4] p-5 space-y-4">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-[#C4717A]/10 flex items-center justify-center">
          <Wallet size={15} className="text-[#C4717A]" />
        </div>
        <h3 className="text-sm font-bold text-[#2C2C2C]">Payment</h3>
      </div>

      {/* Summary */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-[#2C2C2C]/40">Total</span>
          <span className="font-bold text-[#2C2C2C]">{fmt(data.total_amount)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-[#2C2C2C]/40">Paid</span>
          <span className="font-bold text-emerald-600">{fmt(parseFloat(amountPaid) || 0)}</span>
        </div>
        <div className="flex justify-between text-xs border-t border-[#EDE0E4] pt-2">
          <span className="text-[#2C2C2C]/40">Balance</span>
          <span className="font-bold text-red-400">
            {fmt(Math.max(0, data.total_amount - (parseFloat(amountPaid) || 0)))}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 rounded-full bg-[#EDE0E4] overflow-hidden">
          <div
            className="h-full bg-[#C4717A] rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-[10px] text-[#2C2C2C]/30 text-right">{pct.toFixed(0)}% paid</p>
      </div>

      {/* Editable fields */}
      <div className="space-y-2 border-t border-[#EDE0E4] pt-3">
        <label className="block">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#2C2C2C]/30">
            Amount Paid (₱)
          </span>
          <input
            type="number" min={0} step={0.01}
            value={amountPaid}
            onChange={e => setAmountPaid(e.target.value)}
            className="mt-1 w-full px-3 py-2 text-sm bg-[#FAF6F0] rounded-lg border
                       border-transparent focus:border-[#C4717A]/30 focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#2C2C2C]/30">
            Downpayment (₱)
          </span>
          <input
            type="number" min={0} step={0.01}
            value={downpayment}
            onChange={e => setDownpayment(e.target.value)}
            className="mt-1 w-full px-3 py-2 text-sm bg-[#FAF6F0] rounded-lg border
                       border-transparent focus:border-[#C4717A]/30 focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#2C2C2C]/30">
            Payment Status
          </span>
          <select
            value={payStatus}
            onChange={e => setPayStatus(e.target.value)}
            className="mt-1 w-full px-3 py-2 text-sm bg-[#FAF6F0] rounded-lg border
                       border-transparent focus:border-[#C4717A]/30 focus:outline-none
                       text-[#2C2C2C]"
          >
            {PAY_STATUSES.map(s => (
              <option key={s} value={s}>{PAY_LABELS[s]}</option>
            ))}
          </select>
        </label>

        <button
          onClick={save}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl
                     bg-[#C4717A] text-white text-xs font-bold
                     hover:bg-[#b05f68] active:scale-95 transition-all disabled:opacity-40"
        >
          <Save size={13} className={saving ? 'animate-pulse' : ''} />
          {saving ? 'Saving…' : 'Save Payment'}
        </button>
        {saved && <p className="text-[10px] text-emerald-500 text-center">Saved!</p>}
      </div>
    </div>
  );
};

export default PaymentCard;