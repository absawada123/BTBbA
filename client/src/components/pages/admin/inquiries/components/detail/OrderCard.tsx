// client/src/components/pages/admin/inquiries/components/detail/OrderCard.tsx

import React from 'react';
import { ShoppingBag } from 'lucide-react';
import type { InquiryDetail } from '../../InquiryDetailPage';

interface Props { data: InquiryDetail }

const Row: React.FC<{ label: string; value?: string | null }> = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 py-2 border-b border-[#EDE0E4]/60 last:border-0">
    <span className="text-[11px] font-bold uppercase tracking-widest text-[#2C2C2C]/30 shrink-0">{label}</span>
    <span className="text-sm text-[#2C2C2C]/80 text-right font-medium">
      {value || <span className="text-[#2C2C2C]/20">—</span>}
    </span>
  </div>
);

const fmtDate = (d: string | null) => {
  if (!d) return null;
  return new Date(d).toLocaleDateString('en-PH', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });
};

const OrderCard: React.FC<Props> = ({ data }) => (
  <div className="bg-white rounded-2xl border border-[#EDE0E4] p-5 space-y-3">
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 rounded-full bg-[#C4717A]/10 flex items-center justify-center">
        <ShoppingBag size={15} className="text-[#C4717A]" />
      </div>
      <h3 className="text-sm font-bold text-[#2C2C2C]">Order Details</h3>
    </div>

    <div>
      <Row label="Bouquet Type"   value={data.bouquet_type} />
      <Row label="Bouquet Name"   value={data.bouquet_name} />
      <Row label="Occasion"       value={data.occasion} />
      <Row label="Target Date"    value={fmtDate(data.event_date)} />
      <Row label="Target Time"    value={data.target_time} />
      <Row label="Add-ons"        value={data.add_ons} />
      <Row label="Budget"         value={data.preferred_budget} />
    </div>

    {data.details && (
      <div className="pt-2 border-t border-[#EDE0E4]">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#2C2C2C]/30 mb-1">
          Special Instructions
        </p>
        <p className="text-sm text-[#2C2C2C]/70 whitespace-pre-wrap leading-relaxed">
          {data.details}
        </p>
      </div>
    )}
  </div>
);

export default OrderCard;