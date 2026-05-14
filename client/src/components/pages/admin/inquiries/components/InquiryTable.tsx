// client/src/components/pages/admin/inquiries/components/InquiryTable.tsx

import React from 'react';
import { Flower2, MapPin, Truck, ChevronRight, Loader2 } from 'lucide-react';
import type { Inquiry } from '../InquiriesPage';
import StatusBadge from './StatusBadge';
import PaymentBadge from './PaymentBadge';
import PriorityTags from './PriorityTags';

interface Props {
  inquiries: Inquiry[];
  loading: boolean;
  onRowClick: (id: string) => void;
  onRefresh: () => void;
}

const fmt = (n: number) =>
  n > 0 ? `₱${n.toLocaleString('en-PH', { minimumFractionDigits: 0 })}` : '—';

const fmtDate = (d: string | null) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
};

const InquiryTable: React.FC<Props> = ({ inquiries, loading, onRowClick }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3
                      bg-white rounded-2xl border border-[#EDE0E4]">
        <Loader2 size={24} className="text-[#C4717A] animate-spin" />
        <p className="text-sm text-[#2C2C2C]/40">Loading inquiries…</p>
      </div>
    );
  }

  if (!inquiries.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3
                      bg-white rounded-2xl border border-[#EDE0E4]">
        <Flower2 size={28} className="text-[#C4717A]/30" />
        <p className="text-sm text-[#2C2C2C]/40">No inquiries found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#EDE0E4] overflow-hidden">

      {/* ── Desktop Table ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#EDE0E4] bg-[#FAF6F0]">
              {['ID / Order', 'Customer', 'Bouquet', 'Date', 'Fulfillment',
                'Status', 'Payment', 'Total', ''].map(h => (
                <th key={h}
                  className="px-4 py-3 text-left text-[10px] font-bold uppercase
                             tracking-widest text-[#2C2C2C]/40 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EDE0E4]/60">
            {inquiries.map(inq => {
              const tags = inq.priority_tags ? JSON.parse(inq.priority_tags) : [];
              return (
                <tr
                  key={inq.id}
                  onClick={() => onRowClick(inq.id)}
                  className="hover:bg-[#FAF6F0] cursor-pointer transition-colors group"
                >
                  {/* ID */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <p className="text-[11px] font-bold text-[#C4717A]">{inq.id}</p>
                    {inq.order_number && (
                      <p className="text-[10px] text-[#2C2C2C]/40 mt-0.5">{inq.order_number}</p>
                    )}
                  </td>

                  {/* Customer */}
                  <td className="px-4 py-3">
                    <p className="font-semibold text-[#2C2C2C] truncate max-w-[130px]">{inq.name}</p>
                    <p className="text-[11px] text-[#2C2C2C]/40 truncate">{inq.contact}</p>
                  </td>

                  {/* Bouquet */}
                  <td className="px-4 py-3">
                    <p className="text-[#2C2C2C]/80 truncate max-w-[120px] text-xs font-medium">
                      {inq.bouquet_type}
                    </p>
                    {inq.occasion && (
                      <p className="text-[10px] text-[#2C2C2C]/40 truncate">{inq.occasion}</p>
                    )}
                    <PriorityTags tags={tags} />
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <p className="text-xs text-[#2C2C2C]/70">{fmtDate(inq.event_date)}</p>
                    {inq.target_time && (
                      <p className="text-[10px] text-[#2C2C2C]/40">{inq.target_time}</p>
                    )}
                  </td>

                  {/* Fulfillment */}
                  <td className="px-4 py-3">
                    {inq.fulfillment === 'pickup' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium
                                       text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        <MapPin size={10} /> Pickup
                      </span>
                    )}
                    {inq.fulfillment === 'delivery' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium
                                       text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                        <Truck size={10} /> Delivery
                      </span>
                    )}
                    {!inq.fulfillment && <span className="text-[#2C2C2C]/20 text-xs">—</span>}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <StatusBadge status={inq.status} />
                  </td>

                  {/* Payment */}
                  <td className="px-4 py-3">
                    <PaymentBadge status={inq.payment_status} />
                  </td>

                  {/* Total */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <p className="font-semibold text-[#2C2C2C]">{fmt(inq.total_amount)}</p>
                    {inq.balance > 0 && (
                      <p className="text-[10px] text-red-400">bal {fmt(inq.balance)}</p>
                    )}
                  </td>

                  {/* Arrow */}
                  <td className="px-3 py-3">
                    <ChevronRight size={14}
                      className="text-[#2C2C2C]/20 group-hover:text-[#C4717A] transition-colors" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Mobile Cards ── */}
      <div className="md:hidden divide-y divide-[#EDE0E4]/60">
        {inquiries.map(inq => {
          const tags = inq.priority_tags ? JSON.parse(inq.priority_tags) : [];
          return (
            <div
              key={inq.id}
              onClick={() => onRowClick(inq.id)}
              className="p-4 hover:bg-[#FAF6F0] active:bg-[#FAF6F0] cursor-pointer
                         transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold text-[#C4717A]">{inq.id}</span>
                    {inq.order_number && (
                      <span className="text-[10px] text-[#2C2C2C]/40">{inq.order_number}</span>
                    )}
                    <PriorityTags tags={tags} />
                  </div>
                  <p className="font-semibold text-[#2C2C2C] mt-0.5">{inq.name}</p>
                  <p className="text-xs text-[#2C2C2C]/50">{inq.bouquet_type}
                    {inq.occasion ? ` · ${inq.occasion}` : ''}
                  </p>
                </div>
                <ChevronRight size={16} className="text-[#2C2C2C]/20 shrink-0 mt-1" />
              </div>

              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <StatusBadge status={inq.status} />
                <PaymentBadge status={inq.payment_status} />
                {inq.fulfillment === 'delivery' && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium
                                   text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                    <Truck size={9} /> Delivery
                  </span>
                )}
                {inq.fulfillment === 'pickup' && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium
                                   text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    <MapPin size={9} /> Pickup
                  </span>
                )}
              </div>

              <div className="mt-2 flex items-center justify-between">
                <span className="text-[11px] text-[#2C2C2C]/40">{fmtDate(inq.event_date)}</span>
                <div className="text-right">
                  <span className="text-sm font-bold text-[#2C2C2C]">{fmt(inq.total_amount)}</span>
                  {inq.balance > 0 && (
                    <span className="ml-2 text-[10px] text-red-400">bal {fmt(inq.balance)}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InquiryTable;