// client/src/components/pages/public/inquiry/steps/StepDelivery.tsx
import React from 'react';
import { ShoppingBag, Truck, MapPin } from 'lucide-react';
import { FormData, PICKUP_LOCATIONS, SHOP_ADDRESS, SHOP_COORDS, MAPS_EMBED } from '../constants';
import { FieldLabel, TextInput, TextArea, CopyButton } from '../helpers';

interface Props {
  form: FormData;
  set: (patch: Partial<FormData>) => void;
}

const StepDelivery: React.FC<Props> = ({ form, set }) => (
  <div className="space-y-6">
    <div>
      <FieldLabel>How would you like to receive your order?</FieldLabel>
      <div className="grid grid-cols-2 gap-3">
        {([
          { id: 'pickup',   Icon: ShoppingBag, label: 'Pickup',   sub: 'At our popup locations' },
          { id: 'delivery', Icon: Truck,       label: 'Delivery', sub: 'Weekend delivery only'  },
        ] as const).map(({ id, Icon, label, sub }) => (
          <button key={id} type="button" onClick={() => set({ fulfillment: id })}
            className={`flex flex-col items-center gap-2 rounded-2xl border p-5 transition-all ${
              form.fulfillment === id
                ? 'border-[#C4717A] bg-[#C4717A]/8 shadow-sm'
                : 'border-[#C4717A]/15 bg-[#FAF6F0] hover:border-[#C4717A]/40'}`}>
            <Icon className={`h-6 w-6 ${form.fulfillment === id ? 'text-[#C4717A]' : 'text-[#2C2C2C]/40'}`} />
            <span className={`text-sm font-bold ${form.fulfillment === id ? 'text-[#C4717A]' : 'text-[#2C2C2C]'}`}>{label}</span>
            <span className="text-xs text-[#2C2C2C]/45">{sub}</span>
          </button>
        ))}
      </div>
    </div>

    {form.fulfillment === 'pickup' && (
      <div>
        <FieldLabel>Pickup Location</FieldLabel>
        <div className="space-y-2">
          {PICKUP_LOCATIONS.map(loc => (
            <button key={loc.id} type="button" onClick={() => set({ pickupLocation: loc.id })}
              className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                form.pickupLocation === loc.id
                  ? 'border-[#C4717A] bg-[#C4717A]/8'
                  : 'border-[#C4717A]/15 bg-[#FAF6F0] hover:border-[#C4717A]/40'}`}>
              <MapPin className={`h-4 w-4 shrink-0 ${form.pickupLocation === loc.id ? 'text-[#C4717A]' : 'text-[#2C2C2C]/40'}`} />
              <div>
                <p className={`text-sm font-bold ${form.pickupLocation === loc.id ? 'text-[#C4717A]' : 'text-[#2C2C2C]'}`}>{loc.label}</p>
                <p className="text-xs text-[#2C2C2C]/50">{loc.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    )}

    {form.fulfillment === 'delivery' && (
      <div className="space-y-5">
        <div>
          <FieldLabel>Who will book the rider?</FieldLabel>
          <div className="grid grid-cols-2 gap-3">
            {([
              { id: 'customer', label: "I'll book the rider", sub: 'Via Lalamove or Angkas' },
              { id: 'us',       label: 'Book for me',         sub: 'We arrange delivery' },
            ] as const).map(({ id, label, sub }) => (
              <button key={id} type="button" onClick={() => set({ deliveryBooker: id })}
                className={`rounded-2xl border p-4 text-left transition-all ${
                  form.deliveryBooker === id
                    ? 'border-[#C4717A] bg-[#C4717A]/8 shadow-sm'
                    : 'border-[#C4717A]/15 bg-[#FAF6F0] hover:border-[#C4717A]/40'}`}>
                <p className={`text-sm font-bold ${form.deliveryBooker === id ? 'text-[#C4717A]' : 'text-[#2C2C2C]'}`}>{label}</p>
                <p className="mt-0.5 text-xs text-[#2C2C2C]/45">{sub}</p>
              </button>
            ))}
          </div>
        </div>

        {form.deliveryBooker === 'customer' && (
          <div className="space-y-3">
            <p className="text-xs text-[#2C2C2C]/55 leading-relaxed">
              Book a rider from our location to your recipient. Use the address and pin below.
            </p>
            <div className="rounded-2xl border border-[#C4717A]/15 bg-[#FAF6F0] px-4 py-3 space-y-2">
              <p className="text-xs font-semibold text-[#2C2C2C]/45 uppercase tracking-widest">Our Pickup Address</p>
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-[#2C2C2C] leading-relaxed">{SHOP_ADDRESS}</p>
                <CopyButton text={SHOP_ADDRESS} />
              </div>
            </div>
            <div className="rounded-2xl border border-[#C4717A]/15 bg-[#FAF6F0] px-4 py-3 space-y-2">
              <p className="text-xs font-semibold text-[#2C2C2C]/45 uppercase tracking-widest">Pin Coordinates</p>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-mono font-medium text-[#2C2C2C]">{SHOP_COORDS}</p>
                <CopyButton text={SHOP_COORDS} />
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-[#C4717A]/15">
              <iframe title="Pickup Location" src={MAPS_EMBED}
                width="100%" height="200" style={{ border: 0 }}
                allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" className="w-full" />
            </div>
          </div>
        )}

        {form.deliveryBooker === 'us' && (
          <div className="space-y-4">
            <div>
              <FieldLabel>Delivery Address</FieldLabel>
              <TextArea rows={2} value={form.deliveryAddress}
                onChange={e => set({ deliveryAddress: e.target.value })}
                placeholder="House/Unit No., Street, Barangay, City" />
            </div>
            <div>
              <FieldLabel optional>Nearest Landmark</FieldLabel>
              <TextInput value={form.deliveryLandmark}
                onChange={e => set({ deliveryLandmark: e.target.value })}
                placeholder="e.g. Near SM Santa Rosa" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Name of Receiver</FieldLabel>
                <TextInput value={form.receiverName}
                  onChange={e => set({ receiverName: e.target.value })}
                  placeholder="Full name" />
              </div>
              <div>
                <FieldLabel>Receiver's Contact</FieldLabel>
                <TextInput value={form.receiverContact}
                  onChange={e => set({ receiverContact: e.target.value })}
                  placeholder="09XX XXX XXXX" />
              </div>
            </div>
            <p className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-700">
              Delivery fee is shouldered by the customer. Available via Lalamove or Angkas on weekends.
            </p>
          </div>
        )}
      </div>
    )}
  </div>
);

export default StepDelivery;