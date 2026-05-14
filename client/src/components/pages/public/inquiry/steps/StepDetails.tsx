// client/src/components/pages/public/inquiry/steps/StepDetails.tsx
import React from 'react';
import { User, Phone, Instagram } from 'lucide-react';
import { FormData } from '../constants';
import { inputCls, FieldLabel } from '../helpers';

interface Props {
  form: FormData;
  set: (patch: Partial<FormData>) => void;
}

const StepDetails: React.FC<Props> = ({ form, set }) => (
  <div className="space-y-5">
    <div>
      <FieldLabel>Full Name</FieldLabel>
      <div className="relative">
        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C4717A]/50 pointer-events-none" />
        <input value={form.customerName} onChange={e => set({ customerName: e.target.value })}
          placeholder="e.g. Maria Santos" className={`${inputCls} pl-10`} />
      </div>
    </div>
    <div>
      <FieldLabel>Mobile Number</FieldLabel>
      <div className="relative">
        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C4717A]/50 pointer-events-none" />
        <input value={form.customerContact} onChange={e => set({ customerContact: e.target.value })}
          placeholder="09XX XXX XXXX" className={`${inputCls} pl-10`} />
      </div>
    </div>
    <div>
      <FieldLabel optional>Facebook / Instagram</FieldLabel>
      <div className="relative">
        <Instagram className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C4717A]/50 pointer-events-none" />
        <input value={form.customerSocial} onChange={e => set({ customerSocial: e.target.value })}
          placeholder="@yourhandle" className={`${inputCls} pl-10`} />
      </div>
    </div>
  </div>
);

export default StepDetails;