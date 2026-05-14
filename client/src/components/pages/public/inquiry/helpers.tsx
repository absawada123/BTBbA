// client/src/components/pages/public/inquiry/helpers.tsx
import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export const FieldLabel: React.FC<{ children: React.ReactNode; optional?: boolean }> = ({ children, optional }) => (
  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#2C2C2C]/50">
    {children}
    {optional && <span className="normal-case tracking-normal font-normal text-[#2C2C2C]/35">(optional)</span>}
  </label>
);

export const inputCls = 'w-full rounded-xl border border-[#C4717A]/20 bg-[#FAF6F0] px-4 py-3 text-sm text-[#2C2C2C] placeholder-[#2C2C2C]/30 focus:border-[#C4717A] focus:outline-none focus:ring-2 focus:ring-[#C4717A]/20 transition';

export const TextInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (p) => (
  <input {...p} className={`${inputCls} ${p.className ?? ''}`} />
);

export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (p) => (
  <textarea {...p} className={`${inputCls} resize-none ${p.className ?? ''}`} />
);

export const CopyButton: React.FC<{ text: string; label?: string }> = ({ text, label }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <button type="button" onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-full border border-[#C4717A]/20 bg-white px-3 py-1.5 text-xs font-semibold text-[#C4717A] transition hover:bg-[#C4717A]/5 active:scale-95 shrink-0">
      {copied ? <><Check className="h-3 w-3" />Copied!</> : <><Copy className="h-3 w-3" />{label ?? 'Copy'}</>}
    </button>
  );
};