// client/src/components/pages/admin/inquiries/InquiriesPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, RefreshCw, Archive, Flower2,
  ChevronDown, X, TrendingUp, Clock, CheckCircle,
  AlertCircle, Package, Star,
} from 'lucide-react';
import InquiryTable from './components/InquiryTable';
import StatsBar from './components/StatsBar';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Inquiry {
  id: string;
  order_number: string | null;
  name: string;
  contact: string;
  social: string | null;
  occasion: string | null;
  bouquet_type: string;
  bouquet_name: string | null;
  event_date: string | null;
  target_time: string | null;
  fulfillment: 'pickup' | 'delivery' | null;
  status: string;
  is_archived: number;
  priority_tags: string | null;
  total_amount: number;
  amount_paid: number;
  balance: number;
  payment_status: string;
  created_at: string;
  updated_at: string;
}

export interface Stats {
  statusCounts: { status: string; count: number }[];
  paymentSummary: {
    total_active: number;
    total_value: number;
    total_collected: number;
    total_outstanding: number;
  };
  archiveCount: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  { value: '',                    label: 'All Status' },
  { value: 'new_inquiry',         label: 'New Inquiry' },
  { value: 'reviewing',           label: 'Reviewing' },
  { value: 'waiting_for_customer',label: 'Waiting for Customer' },
  { value: 'quotation_sent',      label: 'Quotation Sent' },
  { value: 'confirmed',           label: 'Confirmed' },
  { value: 'preparing',           label: 'Preparing' },
  { value: 'ready',               label: 'Ready' },
  { value: 'completed',           label: 'Completed' },
  { value: 'cancelled',           label: 'Cancelled' },
];

const PAYMENT_OPTIONS = [
  { value: '',                 label: 'All Payments' },
  { value: 'unpaid',           label: 'Unpaid' },
  { value: 'downpayment_paid', label: 'Downpayment Paid' },
  { value: 'fully_paid',       label: 'Fully Paid' },
  { value: 'refunded',         label: 'Refunded' },
];

const FULFILLMENT_OPTIONS = [
  { value: '',         label: 'All Types' },
  { value: 'pickup',   label: 'Pickup' },
  { value: 'delivery', label: 'Delivery' },
];

// ─── Component ────────────────────────────────────────────────────────────────

const InquiriesPage: React.FC = () => {
  const navigate = useNavigate();

  const [inquiries, setInquiries]   = useState<Inquiry[]>([]);
  const [stats, setStats]           = useState<Stats | null>(null);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [archived, setArchived]     = useState(false);

  // Filters
  const [search,      setSearch]      = useState('');
  const [status,      setStatus]      = useState('');
  const [payment,     setPayment]     = useState('');
  const [fulfillment, setFulfillment] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);

    try {
      const params = new URLSearchParams();
      if (archived)    params.set('archived', '1');
      if (status)      params.set('status', status);
      if (payment)     params.set('payment_status', payment);
      if (fulfillment) params.set('fulfillment', fulfillment);
      if (search)      params.set('search', search);

      const [inqRes, statsRes] = await Promise.all([
        fetch(`/api/inquiries?${params}`, { credentials: 'include' }),
        fetch('/api/inquiries/stats',     { credentials: 'include' }),
      ]);

      if (inqRes.ok)   setInquiries(await inqRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [archived, status, payment, fulfillment, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => fetchData(), 400);
    return () => clearTimeout(t);
  }, [search]);

  const activeFilters = [status, payment, fulfillment].filter(Boolean).length;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5">

      {/* ── Stats Bar ── */}
      {stats && <StatsBar stats={stats} archived={archived} />}

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Flower2 size={18} className="text-[#C4717A] shrink-0" />
          <h2 className="text-lg font-bold text-[#2C2C2C]">
            {archived ? 'Archived Inquiries' : 'Inquiries'}
          </h2>
          <span className="ml-1 text-xs font-semibold text-[#C4717A]/70 bg-[#C4717A]/10
                           px-2 py-0.5 rounded-full">
            {inquiries.length}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:ml-auto flex-wrap">
          {/* Archive toggle */}
          <button
            onClick={() => setArchived(a => !a)}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2
                        rounded-lg border transition-all
                        ${archived
                          ? 'bg-[#C4717A]/10 text-[#C4717A] border-[#C4717A]/30'
                          : 'bg-white text-[#2C2C2C]/50 border-[#EDE0E4] hover:border-[#C4717A]/30'
                        }`}
          >
            <Archive size={13} />
            {archived ? 'View Active' : 'Archive'}
            {stats && (
              <span className="ml-0.5 text-[10px] text-[#C4717A]/60">
                ({stats.archiveCount})
              </span>
            )}
          </button>

          {/* Refresh */}
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="flex items-center justify-center h-8 w-8 rounded-lg bg-white
                       border border-[#EDE0E4] text-[#2C2C2C]/40 hover:text-[#C4717A]
                       hover:border-[#C4717A]/30 transition-all disabled:opacity-40"
            aria-label="Refresh"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* ── Search + Filters ── */}
      <div className="bg-white rounded-2xl border border-[#EDE0E4] p-3 space-y-3">
        <div className="flex gap-2">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2C2C2C]/30" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search name, ID, order number…"
              className="w-full pl-8 pr-3 py-2 text-sm bg-[#FAF6F0] rounded-lg
                         border border-transparent focus:border-[#C4717A]/30
                         focus:outline-none text-[#2C2C2C] placeholder:text-[#2C2C2C]/30"
            />
            {search && (
              <button onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#2C2C2C]/30 hover:text-[#2C2C2C]/60">
                <X size={12} />
              </button>
            )}
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setFiltersOpen(o => !o)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg
                        text-xs font-semibold border transition-all
                        ${filtersOpen || activeFilters > 0
                          ? 'bg-[#C4717A]/10 text-[#C4717A] border-[#C4717A]/30'
                          : 'bg-[#FAF6F0] text-[#2C2C2C]/50 border-transparent hover:border-[#C4717A]/20'
                        }`}
          >
            <Filter size={13} />
            Filters
            {activeFilters > 0 && (
              <span className="bg-[#C4717A] text-white text-[10px] rounded-full
                               h-4 w-4 flex items-center justify-center ml-0.5">
                {activeFilters}
              </span>
            )}
            <ChevronDown size={12} className={`transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Expanded filters */}
        {filtersOpen && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-[#EDE0E4]">
            {/* Status */}
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-[#FAF6F0] rounded-lg border
                         border-transparent focus:border-[#C4717A]/30 focus:outline-none
                         text-[#2C2C2C]"
            >
              {STATUS_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            {/* Payment */}
            <select
              value={payment}
              onChange={e => setPayment(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-[#FAF6F0] rounded-lg border
                         border-transparent focus:border-[#C4717A]/30 focus:outline-none
                         text-[#2C2C2C]"
            >
              {PAYMENT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            {/* Fulfillment */}
            <select
              value={fulfillment}
              onChange={e => setFulfillment(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-[#FAF6F0] rounded-lg border
                         border-transparent focus:border-[#C4717A]/30 focus:outline-none
                         text-[#2C2C2C]"
            >
              {FULFILLMENT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            {/* Clear filters */}
            {activeFilters > 0 && (
              <button
                onClick={() => { setStatus(''); setPayment(''); setFulfillment(''); }}
                className="sm:col-span-3 text-xs text-[#C4717A]/70 hover:text-[#C4717A]
                           text-left transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Table ── */}
      <InquiryTable
        inquiries={inquiries}
        loading={loading}
        onRowClick={(id) => navigate(`/dashboard/inquiries/${id}`)}
        onRefresh={() => fetchData(true)}
      />

    </div>
  );
};

export default InquiriesPage;