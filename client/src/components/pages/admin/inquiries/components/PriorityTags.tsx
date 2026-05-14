// client/src/components/pages/admin/inquiries/components/PriorityTags.tsx

import React from 'react';
import { Zap, Star, TrendingUp, Calendar } from 'lucide-react';

const TAG_MAP: Record<string, { label: string; class: string; icon: React.ReactNode }> = {
  rush:       { label: 'Rush',      class: 'bg-red-50 text-red-500 border-red-200',          icon: <Zap size={9} /> },
  vip:        { label: 'VIP',       class: 'bg-[#C4717A]/10 text-[#C4717A] border-[#C4717A]/20', icon: <Star size={9} /> },
  high_value: { label: 'High ₱',   class: 'bg-purple-50 text-purple-600 border-purple-200', icon: <TrendingUp size={9} /> },
  scheduled:  { label: 'Scheduled', class: 'bg-blue-50 text-blue-500 border-blue-200',       icon: <Calendar size={9} /> },
};

interface Props { tags: string[] }

const PriorityTags: React.FC<Props> = ({ tags }) => {
  if (!tags.length) return null;
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {tags.map(t => {
        const cfg = TAG_MAP[t];
        if (!cfg) return null;
        return (
          <span key={t}
            className={`inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5
                        rounded-full border ${cfg.class}`}>
            {cfg.icon}
            {cfg.label}
          </span>
        );
      })}
    </div>
  );
};

export default PriorityTags;