// client/src/components/pages/admin/inquiries/InquiryDetailPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Loader2, Flower2, MoreVertical,
  CheckCircle, RefreshCw,
} from 'lucide-react';
import StatusBadge from './components/StatusBadge';
import PaymentBadge from './components/PaymentBadge';
import PriorityTags from './components/PriorityTags';
import CustomerCard from './components/detail/CustomerCard';
import OrderCard from './components/detail/OrderCard';
import DeliveryCard from './components/detail/DeliveryCard';
import PaymentCard from './components/detail/PaymentCard';
import QuotationCard from './components/detail/QuotationCard';
import NotesCard from './components/detail/NotesCard';
import TimelineCard from './components/detail/TimelineCard';
import AttachmentsCard from './components/detail/AttachmentsCard';
import StatusActions from './components/detail/StatusActions';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InquiryDetail {
  id: string;
  order_number: string | null;
  name: string;
  contact: string;
  phone4: string;
  social: string | null;
  occasion: string | null;
  bouquet_type: string;
  bouquet_name: string | null;
  details: string | null;
  add_ons: string | null;
  preferred_budget: string | null;
  event_date: string | null;
  target_time: string | null;
  fulfillment: string | null;
  pickup_location: string | null;
  delivery_address: string | null;
  delivery_landmark: string | null;
  delivery_booker: string | null;
  delivery_tracking: string | null;
  receiver_name: string | null;
  receiver_contact: string | null;
  status: string;
  is_archived: number;
  priority_tags: string | null;
  total_amount: number;
  downpayment: number;
  amount_paid: number;
  balance: number;
  payment_status: string;
  created_at: string;
  updated_at: string;
  items: InquiryItem[];
  notes: InquiryNote[];
  attachments: InquiryAttachment[];
  timeline: InquiryTimeline[];
}

export interface InquiryItem {
  id: number;
  item_type: string;
  name: string;
  description: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  sort_order: number;
}

export interface InquiryNote {
  id: number;
  note: string;
  created_at: string;
}

export interface InquiryAttachment {
  id: number;
  attach_type: string;
  label: string | null;
  url: string;
  is_external: number;
  uploaded_by: string;
  created_at: string;
}

export interface InquiryTimeline {
  id: number;
  event_type: string;
  from_status: string | null;
  to_status: string | null;
  description: string | null;
  created_at: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

const InquiryDetailPage: React.FC = () => {
  const { id }    = useParams<{ id: string }>();
  const navigate  = useNavigate();

  const [data,       setData]       = useState<InquiryDetail | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error,      setError]      = useState('');

  // ── Fetch ────────────────────────────────────────────────────────────────

  const fetchDetail = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError('');

    try {
      const res = await fetch(`/api/inquiries/${id}`, { credentials: 'include' });
      if (!res.ok) { setError('Inquiry not found.'); return; }
      setData(await res.json());
    } catch {
      setError('Network error.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => { fetchDetail(); }, [fetchDetail]);

  const refresh = () => fetchDetail(true);

  // ── Actions ──────────────────────────────────────────────────────────────

  const confirmInquiry = async () => {
    const res = await fetch(`/api/inquiries/${id}/confirm`, {
      method: 'POST', credentials: 'include',
    });
    if (res.ok) refresh();
  };

  // ── Loading / Error ──────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={24} className="text-[#C4717A] animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <Flower2 size={28} className="text-[#C4717A]/30" />
        <p className="text-sm text-[#2C2C2C]/40">{error || 'Inquiry not found.'}</p>
        <button onClick={() => navigate(-1)}
          className="text-xs text-[#C4717A] hover:underline">← Back</button>
      </div>
    );
  }

  const tags = data.priority_tags ? JSON.parse(data.priority_tags) : [];

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5 pb-10">

      {/* ── Top bar ── */}
      <div className="flex items-start gap-3">
        <button
          onClick={() => navigate(-1)}
          className="mt-0.5 flex items-center justify-center h-8 w-8 rounded-lg
                     bg-white border border-[#EDE0E4] text-[#2C2C2C]/40
                     hover:text-[#C4717A] hover:border-[#C4717A]/30 transition-all shrink-0"
          aria-label="Back"
        >
          <ArrowLeft size={15} />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-bold text-[#2C2C2C]">{data.id}</h2>
            {data.order_number && (
              <span className="text-xs font-semibold text-[#2C2C2C]/40 bg-[#FAF6F0]
                               border border-[#EDE0E4] px-2 py-0.5 rounded-full">
                {data.order_number}
              </span>
            )}
            <StatusBadge status={data.status} />
            <PaymentBadge status={data.payment_status} />
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <p className="text-sm text-[#2C2C2C]/50">{data.name}</p>
            <PriorityTags tags={tags} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={refresh}
            disabled={refreshing}
            className="flex items-center justify-center h-8 w-8 rounded-lg bg-white
                       border border-[#EDE0E4] text-[#2C2C2C]/40 hover:text-[#C4717A]
                       transition-all disabled:opacity-40"
            aria-label="Refresh"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
          </button>

          {/* Confirm button — only if not yet confirmed */}
          {!data.order_number && (
            <button
              onClick={confirmInquiry}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg
                         bg-emerald-500 text-white text-xs font-bold
                         shadow shadow-emerald-500/25 hover:bg-emerald-600
                         active:scale-95 transition-all"
            >
              <CheckCircle size={13} />
              <span className="hidden sm:inline">Confirm</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Status Actions row ── */}
      <StatusActions data={data} onRefresh={refresh} />

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left column: Customer + Order + Delivery */}
        <div className="lg:col-span-2 space-y-5">
          <CustomerCard data={data} />
          <OrderCard data={data} />
          <DeliveryCard data={data} onRefresh={refresh} />
          <QuotationCard data={data} onRefresh={refresh} />
        </div>

        {/* Right column: Payment + Notes + Timeline + Attachments */}
        <div className="space-y-5">
          <PaymentCard data={data} onRefresh={refresh} />
          <AttachmentsCard data={data} onRefresh={refresh} />
          <NotesCard data={data} onRefresh={refresh} />
          <TimelineCard data={data} />
        </div>

      </div>
    </div>
  );
};

export default InquiryDetailPage;