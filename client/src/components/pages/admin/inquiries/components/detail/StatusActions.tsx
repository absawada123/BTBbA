// client/src/components/pages/admin/inquiries/components/detail/StatusActions.tsx

import React, { useState } from 'react';
import type { InquiryDetail } from '../../InquiryDetailPage';

const FLOW: string[] = [
  'new_inquiry',
  'reviewing',
  'waiting_for_customer',
  'quotation_sent',
  'confirmed',
  'preparing',
  'ready',
  'completed',
];

const LABELS: Record<string, string> = {
  new_inquiry:          'New',
  reviewing:            'Reviewing',
  waiting_for_customer: 'Waiting',
  quotation_sent:       'Quotation Sent',
  confirmed:            'Confirmed',
  preparing:            'Preparing',
  ready:                'Ready',
  completed:            'Completed',
  cancelled:            'Cancelled',
};

interface Props {
  data: InquiryDetail;
  onRefresh: () => void;
}

const StatusActions: React.FC<Props> = ({ data, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [note,    setNote]    = useState('');

  const currentIdx = FLOW.indexOf(data.status);

  const setStatus = async (status: string) => {
    setLoading(true);
    try {
      await fetch(`/api/inquiries/${data.id}/status`, {
        method:  'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ status, note: note || undefined }),
      });
      setNote('');
      onRefresh();
    } finally {
      setLoading(false);
    }
  };

  const nextStatus = currentIdx >= 0 && currentIdx < FLOW.length - 1
    ? FLOW[currentIdx + 1] : null;

  const isCancelled = data.status === 'cancelled';
  const isCompleted = data.status === 'completed';

  return (
    <div className="bg-white rounded-2xl border border-[#EDE0E4] p-4 space-y-3">

      {/* Progress dots */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {FLOW.map((s, i) => {
          const done   = i < currentIdx;
          const active = i === currentIdx;
          return (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center shrink-0">
                <div className={`h-2.5 w-2.5 rounded-full transition-all ${
                  active ? 'bg-[#C4717A] ring-2 ring-[#C4717A]/30 ring-offset-1'
                  : done  ? 'bg-[#C4717A]/40'
                          : 'bg-[#EDE0E4]'
                }`} />
                <span className={`mt-1 text-[9px] font-medium whitespace-nowrap ${
                  active ? 'text-[#C4717A]' : done ? 'text-[#C4717A]/40' : 'text-[#2C2C2C]/20'
                }`}>
                  {LABELS[s]}
                </span>
              </div>
              {i < FLOW.length - 1 && (
                <div className={`flex-1 h-px shrink-0 min-w-[8px] ${i < currentIdx ? 'bg-[#C4717A]/30' : 'bg-[#EDE0E4]'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Action buttons row */}
      {!isCancelled && !isCompleted && (
        <div className="flex items-center gap-2 flex-wrap">
          {nextStatus && (
            <button
              disabled={loading}
              onClick={() => setStatus(nextStatus)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg
                         bg-[#C4717A] text-white text-xs font-bold
                         shadow shadow-[#C4717A]/20 hover:bg-[#b05f68]
                         active:scale-95 transition-all disabled:opacity-40"
            >
              Move to {LABELS[nextStatus]} →
            </button>
          )}

          {/* Cancel */}
          <button
            disabled={loading}
            onClick={() => setStatus('cancelled')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg
                       border border-red-200 text-red-400 text-xs font-semibold
                       hover:bg-red-50 active:scale-95 transition-all disabled:opacity-40"
          >
            Cancel
          </button>

          {/* Optional note */}
          <input
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Add note to this status change…"
            className="flex-1 min-w-[140px] px-3 py-2 text-xs bg-[#FAF6F0] rounded-lg
                       border border-transparent focus:border-[#C4717A]/30 focus:outline-none
                       text-[#2C2C2C] placeholder:text-[#2C2C2C]/30"
          />
        </div>
      )}

      {isCancelled && (
        <p className="text-xs text-gray-400 text-center py-1">This inquiry has been cancelled.</p>
      )}
      {isCompleted && (
        <p className="text-xs text-emerald-500 text-center py-1">✓ This inquiry is completed and archived.</p>
      )}
    </div>
  );
};

export default StatusActions;