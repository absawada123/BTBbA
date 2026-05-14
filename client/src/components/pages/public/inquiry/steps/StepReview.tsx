// client/src/components/pages/public/inquiry/steps/StepReview.tsx
import React from 'react';
import { Flower2 } from 'lucide-react';
import { FormData, OCCASIONS, PICKUP_LOCATIONS } from '../constants';

interface Props {
  form: FormData;
  orderNumber: string;
  idLoading: boolean;
  submitError: string;
}

const StepReview: React.FC<Props> = ({ form, orderNumber, idLoading, submitError }) => {
  const displayTime = form.targetTime === 'Custom' ? form.customTime : form.targetTime;
  const pickupLabel = PICKUP_LOCATIONS.find(l => l.id === form.pickupLocation)?.label ?? '';

  return (
    <div className="space-y-4">
      <p className="text-xs text-[#2C2C2C]/45 uppercase tracking-widest font-semibold">Review your inquiry</p>

      {/* Reference */}
      <div className="rounded-2xl border border-[#C4717A]/20 bg-[#C4717A]/5 px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-[#C4717A]/60 font-semibold uppercase tracking-widest">Inquiry Reference</p>
          {idLoading
            ? <div className="mt-1 h-6 w-36 animate-pulse rounded-lg bg-[#C4717A]/15" />
            : <p className="text-lg font-bold text-[#C4717A]">{orderNumber}</p>
          }
        </div>
        <Flower2 className="h-8 w-8 text-[#C4717A]/30" />
      </div>

      {/* Schedule & Fulfillment */}
      <div className="rounded-2xl border border-[#C4717A]/10 bg-white divide-y divide-[#C4717A]/8 overflow-hidden">
        {[
          { label: 'Customer',    value: form.customerName },
          { label: 'Contact',     value: form.customerContact },
          ...(form.customerSocial ? [{ label: 'Social', value: form.customerSocial }] : []),
          { label: 'Date',        value: form.targetDate || '—' },
          { label: 'Time',        value: displayTime || '—' },
          { label: 'Fulfillment', value: form.fulfillment === 'pickup' ? `Pickup — ${pickupLabel}` : `Delivery (${form.deliveryBooker === 'customer' ? 'I book rider' : 'You book for me'})` },
          ...(form.fulfillment === 'delivery' && form.deliveryBooker === 'us' ? [
            { label: 'Address',   value: form.deliveryAddress },
            ...(form.deliveryLandmark ? [{ label: 'Landmark', value: form.deliveryLandmark }] : []),
            { label: 'Receiver',  value: `${form.receiverName} · ${form.receiverContact}` },
          ] : []),
        ].map(({ label, value }) => (
          <div key={label} className="flex gap-3 px-4 py-3">
            <span className="w-24 shrink-0 text-xs font-semibold uppercase tracking-wide text-[#2C2C2C]/40 pt-0.5">{label}</span>
            <span className="text-sm text-[#2C2C2C] break-words">{value}</span>
          </div>
        ))}
      </div>

      {/* Bouquets summary */}
      {form.bouquets.map((b, i) => (
        <div key={i} className="rounded-2xl border border-[#C4717A]/10 bg-white overflow-hidden">
          <div className="flex items-center gap-2 bg-[#C4717A]/5 px-4 py-2.5 border-b border-[#C4717A]/10">
            <Flower2 className="h-3.5 w-3.5 text-[#C4717A]" />
            <p className="text-xs font-bold text-[#C4717A] uppercase tracking-widest">
              {form.bouquets.length > 1 ? `Bouquet #${i + 1}` : 'Bouquet'}
            </p>
          </div>
          <div className="divide-y divide-[#C4717A]/8">
            {[
              { label: 'Type',    value: b.bouquetItem ? b.bouquetItem.split(' —')[0] : (b.bouquetName || '—') },
              ...(b.occasion ? [{ label: 'Occasion', value: OCCASIONS.find(o => o.id === b.occasion)?.label ?? b.occasion }] : []),
              ...(b.preferredBudget ? [{ label: 'Budget', value: b.preferredBudget }] : []),
              ...(b.details ? [{ label: 'Details', value: b.details }] : []),
              ...(b.addOns.length ? [{ label: 'Add-Ons', value: b.addOns.join(', ') }] : []),
            ].map(({ label, value }) => (
              <div key={label} className="flex gap-3 px-4 py-3">
                <span className="w-24 shrink-0 text-xs font-semibold uppercase tracking-wide text-[#2C2C2C]/40 pt-0.5">{label}</span>
                <span className="text-sm text-[#2C2C2C] break-words">{value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="rounded-2xl border border-[#6B7C5C]/20 bg-[#6B7C5C]/5 px-4 py-3 text-xs text-[#6B7C5C]">
        <p className="font-semibold">Payment</p>
        <p className="mt-0.5 text-[#6B7C5C]/70">
          {form.fulfillment === 'pickup'
            ? 'Cash on pickup or online payment. QR code shared upon approval.'
            : 'Downpayment details sent once your order is approved.'}
        </p>
      </div>

      {submitError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {submitError}
        </div>
      )}
    </div>
  );
};

export default StepReview;