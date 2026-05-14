// client/src/components/pages/public/inquiry/BouquetCard.tsx
import React from 'react';
import { Flower2, Trash2, Upload } from 'lucide-react';
import { BOUQUET_TYPES, OCCASIONS, ADD_ONS, BUDGET_OPTIONS, BouquetItem } from './constants';
import { FieldLabel, TextArea } from './helpers';

const BouquetCard: React.FC<{
  bouquet: BouquetItem;
  index: number;
  total: number;
  onChange: (patch: Partial<BouquetItem>) => void;
  onRemove: () => void;
}> = ({ bouquet, index, total, onChange, onRemove }) => {
  const toggleAddOn = (a: string) =>
    onChange({ addOns: bouquet.addOns.includes(a) ? bouquet.addOns.filter(x => x !== a) : [...bouquet.addOns, a] });

  return (
    <div className="rounded-2xl border border-[#C4717A]/15 bg-white p-5 space-y-5 shadow-sm">
      {/* Card header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#C4717A]/10">
            <Flower2 className="h-3.5 w-3.5 text-[#C4717A]" />
          </div>
          <span className="text-sm font-bold text-[#2C2C2C]">
            {total > 1 ? `Bouquet #${index + 1}` : 'Your Bouquet'}
          </span>
        </div>
        {total > 1 && (
          <button type="button" onClick={onRemove}
            className="inline-flex items-center gap-1 rounded-full border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-400 transition hover:bg-red-50 active:scale-95">
            <Trash2 className="h-3 w-3" /> Remove
          </button>
        )}
      </div>

      {/* Bouquet Type */}
      <div>
        <FieldLabel>Bouquet Type</FieldLabel>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {BOUQUET_TYPES.map(b => (
            <button key={b.id} type="button"
              onClick={() => onChange({ bouquetType: b.id, bouquetName: b.label, bouquetItem: '' })}
              className={`flex items-start gap-3 rounded-2xl border p-3.5 text-left transition-all ${
                bouquet.bouquetType === b.id
                  ? 'border-[#C4717A] bg-[#C4717A]/8 shadow-sm'
                  : 'border-[#C4717A]/15 bg-[#FAF6F0] hover:border-[#C4717A]/40'}`}>
              <div className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 flex items-center justify-center ${
                bouquet.bouquetType === b.id ? 'border-[#C4717A]' : 'border-[#C4717A]/30'}`}>
                {bouquet.bouquetType === b.id && <div className="h-2 w-2 rounded-full bg-[#C4717A]" />}
              </div>
              <div>
                <p className={`text-sm font-bold ${bouquet.bouquetType === b.id ? 'text-[#C4717A]' : 'text-[#2C2C2C]'}`}>{b.label}</p>
                <p className="mt-0.5 text-xs text-[#C9A84C] font-semibold">{b.range}</p>
                <p className="mt-0.5 text-xs text-[#2C2C2C]/50">{b.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {bouquet.bouquetType && bouquet.bouquetType !== 'custom' && (
          <div className="mt-3 space-y-1.5">
            <p className="text-xs font-semibold text-[#2C2C2C]/45 uppercase tracking-widest">Specific bouquet</p>
            {BOUQUET_TYPES.find(b => b.id === bouquet.bouquetType)?.items.map(item => (
              <button key={item} type="button"
                onClick={() => onChange({ bouquetItem: item, bouquetName: item.split(' —')[0] })}
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-left text-xs transition-all ${
                  bouquet.bouquetItem === item
                    ? 'border-[#C4717A] bg-[#C4717A]/8 font-semibold text-[#C4717A]'
                    : 'border-[#C4717A]/10 bg-white text-[#2C2C2C]/60 hover:border-[#C4717A]/30'}`}>
                <span>{item.split(' —')[0]}</span>
                <span className="font-semibold text-[#C9A84C]">{item.split('— ')[1]}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Occasion (optional) */}
      <div>
        <FieldLabel optional>Occasion</FieldLabel>
        <div className="grid grid-cols-4 gap-2">
          {OCCASIONS.map(o => (
            <button key={o.id} type="button"
              onClick={() => onChange({ occasion: bouquet.occasion === o.id ? '' : o.id })}
              className={`flex flex-col items-center gap-1 rounded-2xl border p-2.5 text-center transition-all ${
                bouquet.occasion === o.id
                  ? 'border-[#C4717A] bg-[#C4717A]/8 shadow-sm'
                  : 'border-[#C4717A]/15 bg-[#FAF6F0] hover:border-[#C4717A]/40'}`}>
              <span className="text-xl">{o.icon}</span>
              <span className={`text-[10px] font-semibold leading-tight ${bouquet.occasion === o.id ? 'text-[#C4717A]' : 'text-[#2C2C2C]/60'}`}>{o.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Details */}
      <div>
        <FieldLabel optional>Order Details</FieldLabel>
        <TextArea rows={3} value={bouquet.details}
          onChange={e => onChange({ details: e.target.value })}
          placeholder="Preferred flowers, colors, size, message for recipient, etc." />
      </div>

      {/* Add-Ons */}
      <div>
        <FieldLabel optional>Add-Ons</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {ADD_ONS.map(a => (
            <button key={a} type="button" onClick={() => toggleAddOn(a)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                bouquet.addOns.includes(a)
                  ? 'border-[#C9A84C] bg-[#C9A84C] text-white'
                  : 'border-[#C9A84C]/30 bg-white text-[#2C2C2C]/55 hover:border-[#C9A84C]/60'}`}>
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div>
        <FieldLabel optional>Preferred Budget</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {BUDGET_OPTIONS.map(b => (
            <button key={b} type="button"
              onClick={() => onChange({ preferredBudget: bouquet.preferredBudget === b ? '' : b })}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-all ${
                bouquet.preferredBudget === b
                  ? 'border-[#C4717A] bg-[#C4717A] text-white'
                  : 'border-[#C4717A]/20 bg-white text-[#2C2C2C]/55 hover:border-[#C4717A]/50'}`}>
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Peg Image */}
      <div>
        <FieldLabel optional>Peg / Inspiration Photo</FieldLabel>
        {bouquet.pegPreview ? (
          <div className="relative w-full">
            <img src={bouquet.pegPreview} alt="Peg" className="h-40 w-full rounded-2xl object-cover border border-[#C4717A]/15" />
            <button type="button" onClick={() => onChange({ pegImage: null, pegPreview: '' })}
              className="absolute top-2 right-2 rounded-full bg-white p-1.5 shadow border border-red-100 text-red-400 hover:text-red-600 transition">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-[#C4717A]/20 bg-[#FAF6F0] py-6 text-center transition hover:border-[#C4717A]/40">
            <Upload className="h-5 w-5 text-[#C4717A]/40" />
            <span className="text-xs text-[#2C2C2C]/45">Pinterest peg, TikTok screenshot, or any reference</span>
            <span className="text-xs text-[#C4717A]/60 font-semibold">Browse file</span>
            <input type="file" accept="image/*" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) onChange({ pegImage: f, pegPreview: URL.createObjectURL(f) }); }} />
          </label>
        )}
      </div>
    </div>
  );
};

export default BouquetCard;