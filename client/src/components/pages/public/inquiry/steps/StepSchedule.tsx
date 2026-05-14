// client/src/components/pages/public/inquiry/steps/StepSchedule.tsx
import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { FormData, TIME_SLOTS } from '../constants';
import { inputCls, TextInput } from '../helpers';

interface Props {
  form: FormData;
  set: (patch: Partial<FormData>) => void;
}

const StepSchedule: React.FC<Props> = ({ form, set }) => {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#2C2C2C]/50">
          Target Date
        </label>
        <div className="relative">
          <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C4717A]/50 pointer-events-none" />
          <input type="date" value={form.targetDate} min={today}
            onChange={e => set({ targetDate: e.target.value })}
            className={`${inputCls} pl-10`} />
        </div>
        {form.targetDate && (() => {
          const d = new Date(form.targetDate + 'T00:00:00');
          return (d.getDay() !== 0 && d.getDay() !== 6) ? (
            <p className="mt-2 flex items-center gap-1.5 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-700">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              We primarily operate on weekends. Weekday orders depend on availability.
            </p>
          ) : null;
        })()}
      </div>

      <div>
        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#2C2C2C]/50">
          Preferred Time Slot
        </label>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {TIME_SLOTS.map(t => (
            <button key={t} type="button"
              onClick={() => set({ targetTime: t, customTime: t !== 'Custom' ? '' : form.customTime })}
              className={`rounded-xl border py-2.5 text-xs font-semibold transition-all ${
                form.targetTime === t
                  ? 'border-[#C4717A] bg-[#C4717A] text-white shadow-sm'
                  : 'border-[#C4717A]/20 bg-[#FAF6F0] text-[#2C2C2C]/60 hover:border-[#C4717A]/50'}`}>
              {t}
            </button>
          ))}
        </div>
        {form.targetTime === 'Custom' && (
          <div className="mt-3">
            <TextInput value={form.customTime} onChange={e => set({ customTime: e.target.value })}
              placeholder="e.g. 7:00 PM or morning" />
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-[#6B7C5C]/20 bg-[#6B7C5C]/5 px-4 py-3 text-xs text-[#6B7C5C]">
        <p className="font-semibold">Weekend availability notice</p>
        <p className="mt-0.5 text-[#6B7C5C]/70">Popups run Saturdays & Sundays. Pre-orders must be placed 2–3 days in advance.</p>
      </div>
    </div>
  );
};

export default StepSchedule;