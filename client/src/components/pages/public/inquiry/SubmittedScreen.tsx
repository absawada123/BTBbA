// client/src/components/pages/public/inquiry/SubmittedScreen.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { FormData } from './constants';
import { CopyButton } from './helpers';
import OrderCard, { buildSummaryText } from './OrderCard';

interface Props {
  form: FormData;
  orderNumber: string;
}

const SubmittedScreen: React.FC<Props> = ({ form, orderNumber }) => {
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
};

export default SubmittedScreen;