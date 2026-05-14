// client/src/components/pages/public/inquiry/steps/StepBouquets.tsx
import React from 'react';
import { Plus } from 'lucide-react';
import { FormData, BouquetItem } from '../constants';
import BouquetCard from '../BouquetCard';

interface Props {
  form: FormData;
  setBouquet: (index: number, patch: Partial<BouquetItem>) => void;
  addBouquet: () => void;
  removeBouquet: (index: number) => void;
}

const StepBouquets: React.FC<Props> = ({ form, setBouquet, addBouquet, removeBouquet }) => (
  <div className="space-y-4">
    {form.bouquets.map((bouquet, i) => (
      <BouquetCard
        key={i}
        bouquet={bouquet}
        index={i}
        total={form.bouquets.length}
        onChange={patch => setBouquet(i, patch)}
        onRemove={() => removeBouquet(i)}
      />
    ))}

    <button type="button" onClick={addBouquet}
      className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#C4717A]/20 py-4 text-sm font-semibold text-[#C4717A]/60 transition hover:border-[#C4717A]/50 hover:text-[#C4717A] hover:bg-[#C4717A]/3 active:scale-[0.99]">
      <Plus className="h-4 w-4" />
      Add Another Bouquet
    </button>

    {form.bouquets.length > 1 && (
      <p className="text-center text-xs text-[#2C2C2C]/40">
        All bouquets will share one order reference and schedule.
      </p>
    )}
  </div>
);

export default StepBouquets;