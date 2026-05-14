// client/src/components/pages/admin/inquiries/components/detail/CustomerCard.tsx

import React from 'react';
import { User, Phone, Share2, Copy, MessageCircle, Instagram } from 'lucide-react';
import type { InquiryDetail } from '../../InquiryDetailPage';

interface Props { data: InquiryDetail }

const Section: React.FC<{ label: string; value?: string | null; mono?: boolean }> = ({ label, value, mono }) => (
  <div>
    <p className="text-[10px] font-bold uppercase tracking-widest text-[#2C2C2C]/30">{label}</p>
    <p className={`text-sm text-[#2C2C2C] mt-0.5 ${mono ? 'font-mono' : 'font-medium'}`}>
      {value || <span className="text-[#2C2C2C]/20">—</span>}
    </p>
  </div>
);

const CustomerCard: React.FC<Props> = ({ data }) => {
  const copy = (text: string) => navigator.clipboard.writeText(text).catch(() => {});

  return (
    <div className="bg-white rounded-2xl border border-[#EDE0E4] p-5 space-y-4">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-[#C4717A]/10 flex items-center justify-center">
          <User size={15} className="text-[#C4717A]" />
        </div>
        <h3 className="text-sm font-bold text-[#2C2C2C]">Customer Details</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Section label="Name"    value={data.name} />
        <Section label="Contact" value={data.contact} mono />
        <Section label="Social"  value={data.social} />
        <Section label="Inquiry Code" value={data.id} mono />
      </div>

      {/* Quick actions */}
      <div className="flex items-center gap-2 pt-1 border-t border-[#EDE0E4] flex-wrap">
        <button
          onClick={() => copy(`${data.name} · ${data.contact}`)}
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold
                     text-[#2C2C2C]/50 hover:text-[#C4717A] transition-colors"
        >
          <Copy size={12} /> Copy Details
        </button>
        <span className="text-[#EDE0E4]">·</span>
        <a
          href={`https://m.me/${data.social?.replace('@', '') ?? ''}`}
          target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold
                     text-[#2C2C2C]/50 hover:text-[#C4717A] transition-colors"
        >
          <MessageCircle size={12} /> Messenger
        </a>
        <span className="text-[#EDE0E4]">·</span>
        <a
          href={`https://instagram.com/${data.social?.replace('@', '') ?? ''}`}
          target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold
                     text-[#2C2C2C]/50 hover:text-[#C4717A] transition-colors"
        >
          <Instagram size={12} /> Instagram
        </a>
      </div>
    </div>
  );
};

export default CustomerCard;