// client/src/components/pages/admin/inquiries/components/PaymentBadge.tsx

import React from 'react';

const PAY_MAP: Record<string, { label: string; class: string }> = {
  unpaid:           { label: 'Unpaid',      class: 'bg-red-50 text-red-400 border-red-200' },
  downpayment_paid: { label: 'Downpayment', class: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
  fully_paid:       { label: 'Paid',        class: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  refunded:         { label: 'Refunded',    class: 'bg-blue-50 text-blue-500 border-blue-200' },
};

interface Props { status: string }

const PaymentBadge: React.FC<Props> = ({ status }) => {
  const cfg = PAY_MAP[status] ?? { label: status, class: 'bg-gray-100 text-gray-400 border-gray-200' };
  return (
    <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5
                      rounded-full border ${cfg.class} whitespace-nowrap`}>
      {cfg.label}
    </span>
  );
};

export default PaymentBadge;