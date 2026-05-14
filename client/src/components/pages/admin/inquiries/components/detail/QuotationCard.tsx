// client/src/components/pages/admin/inquiries/components/detail/QuotationCard.tsx

import React, { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, Save, ChevronDown } from 'lucide-react';
import type { InquiryDetail, InquiryItem } from '../../InquiryDetailPage';

interface Props { data: InquiryDetail; onRefresh: () => void }

const TYPES = ['bouquet', 'addon', 'delivery', 'adjustment'];

const TYPE_COLOR: Record<string, string> = {
  bouquet:    'bg-[#C4717A]/10 text-[#C4717A]',
  addon:      'bg-purple-50 text-purple-600',
  delivery:   'bg-blue-50 text-blue-600',
  adjustment: 'bg-orange-50 text-orange-600',
};

interface EditItem {
  id?: number;
  item_type: string;
  name: string;
  description: string;
  quantity: number;
  unit_price: number;
}

const empty = (): EditItem => ({
  item_type: 'bouquet', name: '', description: '', quantity: 1, unit_price: 0,
});

const QuotationCard: React.FC<Props> = ({ data, onRefresh }) => {
  const [items,   setItems]   = useState<EditItem[]>([]);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setItems(data.items.map(i => ({
      id:          i.id,
      item_type:   i.item_type,
      name:        i.name,
      description: i.description ?? '',
      quantity:    i.quantity,
      unit_price:  i.unit_price,
    })));
  }, [data.items]);

  const total = items.reduce((s, i) => s + i.quantity * i.unit_price, 0);

  const update = (idx: number, patch: Partial<EditItem>) =>
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, ...patch } : it));

  const save = async () => {
    setSaving(true);
    await fetch(`/api/inquiries/${data.id}/quotation`, {
      method: 'PUT', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });
    setSaving(false);
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2000);
    onRefresh();
  };

  const fmt = (n: number) => `₱${n.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;

  return (
    <div className="bg-white rounded-2xl border border-[#EDE0E4] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-[#C4717A]/10 flex items-center justify-center">
            <FileText size={15} className="text-[#C4717A]" />
          </div>
          <h3 className="text-sm font-bold text-[#2C2C2C]">Quotation</h3>
        </div>
        <button
          onClick={() => setEditing(e => !e)}
          className="text-xs font-semibold text-[#C4717A] hover:underline"
        >
          {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {/* View mode */}
      {!editing && (
        <div>
          {items.length === 0 && (
            <p className="text-xs text-[#2C2C2C]/30 text-center py-4">No items yet. Click Edit to add.</p>
          )}
          <div className="space-y-2">
            {items.map((item, i) => (
              <div key={i}
                className="flex items-center justify-between gap-2 py-2
                           border-b border-[#EDE0E4]/60 last:border-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${TYPE_COLOR[item.item_type] ?? ''}`}>
                      {item.item_type}
                    </span>
                    <span className="text-sm font-medium text-[#2C2C2C] truncate">{item.name}</span>
                  </div>
                  {item.description && (
                    <p className="text-[11px] text-[#2C2C2C]/40 mt-0.5 truncate">{item.description}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-[#2C2C2C]">{fmt(item.quantity * item.unit_price)}</p>
                  <p className="text-[10px] text-[#2C2C2C]/40">{item.quantity} × {fmt(item.unit_price)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex items-center justify-between pt-3 border-t-2 border-[#C4717A]/20 mt-2">
            <span className="text-sm font-bold text-[#2C2C2C]">Total</span>
            <span className="text-lg font-bold text-[#C4717A]">{fmt(total)}</span>
          </div>
          {saved && <p className="text-[10px] text-emerald-500 text-center">Quotation saved!</p>}
        </div>
      )}

      {/* Edit mode */}
      {editing && (
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="rounded-xl border border-[#EDE0E4] p-3 space-y-2">
              <div className="flex items-center gap-2">
                <select
                  value={item.item_type}
                  onChange={e => update(i, { item_type: e.target.value })}
                  className="text-[11px] font-bold px-2 py-1 rounded-lg bg-[#FAF6F0]
                             border border-transparent focus:border-[#C4717A]/30
                             focus:outline-none text-[#2C2C2C]"
                >
                  {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <input
                  value={item.name}
                  onChange={e => update(i, { name: e.target.value })}
                  placeholder="Item name"
                  className="flex-1 px-2 py-1 text-sm bg-[#FAF6F0] rounded-lg border
                             border-transparent focus:border-[#C4717A]/30 focus:outline-none
                             text-[#2C2C2C] placeholder:text-[#2C2C2C]/25"
                />
                <button onClick={() => setItems(p => p.filter((_, idx) => idx !== i))}
                  className="text-red-300 hover:text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
              <input
                value={item.description}
                onChange={e => update(i, { description: e.target.value })}
                placeholder="Description (optional)"
                className="w-full px-2 py-1 text-xs bg-[#FAF6F0] rounded-lg border
                           border-transparent focus:border-[#C4717A]/30 focus:outline-none
                           text-[#2C2C2C]/70 placeholder:text-[#2C2C2C]/20"
              />
              <div className="flex items-center gap-2">
                <label className="text-[10px] text-[#2C2C2C]/40">Qty</label>
                <input
                  type="number" min={1}
                  value={item.quantity}
                  onChange={e => update(i, { quantity: parseInt(e.target.value) || 1 })}
                  className="w-16 px-2 py-1 text-sm text-center bg-[#FAF6F0] rounded-lg
                             border border-transparent focus:border-[#C4717A]/30 focus:outline-none"
                />
                <label className="text-[10px] text-[#2C2C2C]/40">× Price</label>
                <input
                  type="number" min={0} step={0.01}
                  value={item.unit_price}
                  onChange={e => update(i, { unit_price: parseFloat(e.target.value) || 0 })}
                  className="flex-1 px-2 py-1 text-sm bg-[#FAF6F0] rounded-lg border
                             border-transparent focus:border-[#C4717A]/30 focus:outline-none"
                />
                <span className="text-sm font-semibold text-[#C4717A] whitespace-nowrap">
                  = {fmt(item.quantity * item.unit_price)}
                </span>
              </div>
            </div>
          ))}

          <button
            onClick={() => setItems(p => [...p, empty()])}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl
                       border border-dashed border-[#C4717A]/30 text-xs font-semibold
                       text-[#C4717A]/60 hover:text-[#C4717A] hover:border-[#C4717A]/50
                       transition-colors"
          >
            <Plus size={13} /> Add Line Item
          </button>

          {/* Total preview */}
          <div className="flex items-center justify-between border-t-2 border-[#C4717A]/20 pt-2">
            <span className="text-sm font-bold text-[#2C2C2C]">Total</span>
            <span className="text-lg font-bold text-[#C4717A]">{fmt(total)}</span>
          </div>

          <button
            onClick={save}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
                       bg-[#C4717A] text-white text-sm font-bold
                       hover:bg-[#b05f68] active:scale-95 transition-all disabled:opacity-40"
          >
            <Save size={14} className={saving ? 'animate-pulse' : ''} />
            {saving ? 'Saving…' : 'Save Quotation'}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuotationCard;