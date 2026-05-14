// client/src/components/pages/admin/inquiries/components/detail/DeliveryCard.tsx

import React, { useState } from 'react';
import { Truck, MapPin, ExternalLink, Save } from 'lucide-react';
import type { InquiryDetail } from '../../InquiryDetailPage';

interface Props { data: InquiryDetail; onRefresh: () => void }

const DeliveryCard: React.FC<Props> = ({ data, onRefresh }) => {
  const [tracking, setTracking] = useState(data.delivery_tracking ?? '');
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);

  const save = async () => {
    setSaving(true);
    await fetch(`/api/inquiries/${data.id}/delivery`, {
      method: 'PATCH', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ delivery_tracking: tracking || null }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    onRefresh();
  };

  if (!data.fulfillment) return null;

  return (
    <div className="bg-white rounded-2xl border border-[#EDE0E4] p-5 space-y-4">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-[#C4717A]/10 flex items-center justify-center">
          {data.fulfillment === 'delivery'
            ? <Truck size={15} className="text-[#C4717A]" />
            : <MapPin size={15} className="text-[#C4717A]" />
          }
        </div>
        <h3 className="text-sm font-bold text-[#2C2C2C]">
          {data.fulfillment === 'delivery' ? 'Delivery Information' : 'Pickup Information'}
        </h3>
      </div>

      {data.fulfillment === 'pickup' ? (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#2C2C2C]/30">Pickup Location</p>
          <p className="text-sm text-[#2C2C2C]/80 mt-0.5">{data.pickup_location || '—'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {[
            ['Address',        data.delivery_address],
            ['Landmark',       data.delivery_landmark],
            ['Courier',        data.delivery_booker],
            ['Receiver Name',  data.receiver_name],
            ['Receiver Phone', data.receiver_contact],
          ].map(([label, value]) => value ? (
            <div key={label as string}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#2C2C2C]/30">{label}</p>
              <p className="text-sm text-[#2C2C2C]/80 mt-0.5">{value}</p>
            </div>
          ) : null)}

          {/* Tracking link */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#2C2C2C]/30 mb-1">
              Tracking Link
            </p>
            <div className="flex gap-2">
              <input
                value={tracking}
                onChange={e => setTracking(e.target.value)}
                placeholder="https://lalamove.com/track/…"
                className="flex-1 px-3 py-2 text-xs bg-[#FAF6F0] rounded-lg border
                           border-transparent focus:border-[#C4717A]/30 focus:outline-none
                           text-[#2C2C2C] placeholder:text-[#2C2C2C]/25"
              />
              {tracking && (
                <a href={tracking} target="_blank" rel="noreferrer"
                  className="flex items-center justify-center h-9 w-9 rounded-lg
                             bg-[#FAF6F0] text-[#2C2C2C]/40 hover:text-[#C4717A] transition-colors">
                  <ExternalLink size={14} />
                </a>
              )}
              <button
                onClick={save}
                disabled={saving}
                className="flex items-center justify-center h-9 w-9 rounded-lg
                           bg-[#C4717A] text-white hover:bg-[#b05f68]
                           transition-all disabled:opacity-40"
                aria-label="Save tracking"
              >
                <Save size={13} className={saving ? 'animate-pulse' : ''} />
              </button>
            </div>
            {saved && <p className="text-[10px] text-emerald-500 mt-1">Saved!</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryCard;