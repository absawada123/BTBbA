// client/src/components/pages/admin/inquiries/components/detail/TimelineCard.tsx

import React from 'react';
import { Clock, CheckCircle, CreditCard, Paperclip, StickyNote, ArrowRight } from 'lucide-react';
import type { InquiryDetail } from '../../InquiryDetailPage';

interface Props { data: InquiryDetail }

const EVENT_ICONS: Record<string, React.ReactNode> = {
  status_change:    <ArrowRight size={11} />,
  confirmed:        <CheckCircle size={11} />,
  payment_update:   <CreditCard size={11} />,
  attachment_added: <Paperclip size={11} />,
  note_added:       <StickyNote size={11} />,
};

const fmtTime = (d: string) =>
  new Date(d).toLocaleString('en-PH', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  });

const TimelineCard: React.FC<Props> = ({ data }) => (
  <div className="bg-white rounded-2xl border border-[#EDE0E4] p-5 space-y-4">
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
        <Clock size={15} className="text-blue-500" />
      </div>
      <h3 className="text-sm font-bold text-[#2C2C2C]">Timeline</h3>
    </div>

    <div className="relative space-y-0">
      {/* Vertical line */}
      <div className="absolute left-[11px] top-2 bottom-2 w-px bg-[#EDE0E4]" />

      {data.timeline.length === 0 && (
        <p className="text-xs text-[#2C2C2C]/25 pl-8 py-3">No events yet.</p>
      )}

      {[...data.timeline].reverse().map(e => (
        <div key={e.id} className="relative flex gap-3 pb-4 last:pb-0">
          {/* Dot */}
          <div className="shrink-0 h-6 w-6 rounded-full bg-white border-2 border-[#C4717A]/30
                          flex items-center justify-center text-[#C4717A] z-10">
            {EVENT_ICONS[e.event_type] ?? <Clock size={11} />}
          </div>

          <div className="flex-1 min-w-0 pt-0.5">
            <p className="text-xs font-semibold text-[#2C2C2C]">
              {e.event_type.replace(/_/g, ' ')}
              {e.from_status && e.to_status && (
                <span className="text-[#2C2C2C]/40 font-normal ml-1">
                  {e.from_status.replace(/_/g, ' ')} → {e.to_status.replace(/_/g, ' ')}
                </span>
              )}
            </p>
            {e.description && (
              <p className="text-[11px] text-[#2C2C2C]/50 mt-0.5 leading-snug">{e.description}</p>
            )}
            <p className="text-[10px] text-[#2C2C2C]/25 mt-1">{fmtTime(e.created_at)}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default TimelineCard;