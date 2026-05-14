// client/src/components/pages/admin/inquiries/components/StatsBar.tsx

import React from 'react';
import { TrendingUp, Clock, CheckCircle, XCircle, Wallet } from 'lucide-react';
import type { Stats } from '../InquiriesPage';

interface Props {
  stats: Stats;
  archived: boolean;
}

const fmt = (n: number) =>
  n >= 1000 ? `₱${(n / 1000).toFixed(1)}k` : `₱${n.toLocaleString()}`;

const StatsBar: React.FC<Props> = ({ stats, archived }) => {
  const { paymentSummary: p, statusCounts } = stats;

  const getCount = (s: string) =>
    statusCounts.find(c => c.status === s)?.count ?? 0;

  const cards = archived
    ? [
        {
          label: 'Completed',
          value: getCount('completed'),
          icon: CheckCircle,
          color: 'text-emerald-500',
          bg: 'bg-emerald-50',
        },
        {
          label: 'Cancelled',
          value: getCount('cancelled'),
          icon: XCircle,
          color: 'text-red-400',
          bg: 'bg-red-50',
        },
        {
          label: 'Total Archived',
          value: stats.archiveCount,
          icon: Wallet,
          color: 'text-[#C4717A]',
          bg: 'bg-[#C4717A]/10',
        },
      ]
    : [
        {
          label: 'Active',
          value: p.total_active ?? 0,
          icon: TrendingUp,
          color: 'text-[#C4717A]',
          bg: 'bg-[#C4717A]/10',
        },
        {
          label: 'New',
          value: getCount('new_inquiry'),
          icon: Clock,
          color: 'text-amber-500',
          bg: 'bg-amber-50',
        },
        {
          label: 'Confirmed',
          value: getCount('confirmed') + getCount('preparing') + getCount('ready'),
          icon: CheckCircle,
          color: 'text-emerald-500',
          bg: 'bg-emerald-50',
        },
        {
          label: 'Outstanding',
          value: fmt(p.total_outstanding ?? 0),
          icon: Wallet,
          color: 'text-purple-500',
          bg: 'bg-purple-50',
        },
      ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {cards.map(({ label, value, icon: Icon, color, bg }) => (
        <div
          key={label}
          className="bg-white rounded-2xl border border-[#EDE0E4] p-4
                     flex items-center gap-3"
        >
          <div className={`h-9 w-9 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
            <Icon size={16} className={color} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-[#2C2C2C]/40 font-medium truncate">{label}</p>
            <p className="text-lg font-bold text-[#2C2C2C] leading-tight">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsBar;