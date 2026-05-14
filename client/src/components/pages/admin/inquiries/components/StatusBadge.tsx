// client/src/components/pages/admin/inquiries/components/StatusBadge.tsx

import React from 'react';

const STATUS_MAP: Record<string, { label: string; class: string }> = {
  new_inquiry:          { label: 'New',             class: 'bg-amber-50 text-amber-600 border-amber-200' },
  reviewing:            { label: 'Reviewing',        class: 'bg-blue-50 text-blue-600 border-blue-200' },
  waiting_for_customer: { label: 'Waiting',          class: 'bg-orange-50 text-orange-500 border-orange-200' },
  quotation_sent:       { label: 'Quotation Sent',   class: 'bg-violet-50 text-violet-600 border-violet-200' },
  confirmed:            { label: 'Confirmed',        class: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  preparing:            { label: 'Preparing',        class: 'bg-teal-50 text-teal-600 border-teal-200' },
  ready:                { label: 'Ready',            class: 'bg-green-50 text-green-600 border-green-200' },
  completed:            { label: 'Completed',        class: 'bg-[#C4717A]/10 text-[#C4717A] border-[#C4717A]/20' },
  cancelled:            { label: 'Cancelled',        class: 'bg-gray-100 text-gray-400 border-gray-200' },
};

interface Props { status: string }

const StatusBadge: React.FC<Props> = ({ status }) => {
  const cfg = STATUS_MAP[status] ?? { label: status, class: 'bg-gray-100 text-gray-400 border-gray-200' };
  return (
    <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5
                      rounded-full border ${cfg.class} whitespace-nowrap`}>
      {cfg.label}
    </span>
  );
};

export default StatusBadge;