// client/src/components/pages/admin/inquiries/components/detail/AttachmentsCard.tsx

import React, { useState } from 'react';
import { Paperclip, Plus, ExternalLink, Trash2, Image, FileText, Link } from 'lucide-react';
import type { InquiryDetail } from '../../InquiryDetailPage';

interface Props { data: InquiryDetail; onRefresh: () => void }

const TYPES = ['peg_image', 'receipt', 'screenshot', 'external_link', 'other'];

const TYPE_ICON: Record<string, React.ReactNode> = {
  peg_image:     <Image size={12} />,
  receipt:       <FileText size={12} />,
  screenshot:    <Image size={12} />,
  external_link: <Link size={12} />,
  other:         <Paperclip size={12} />,
};

const AttachmentsCard: React.FC<Props> = ({ data, onRefresh }) => {
  const [adding,     setAdding]     = useState(false);
  const [url,        setUrl]        = useState('');
  const [label,      setLabel]      = useState('');
  const [attachType, setAttachType] = useState('external_link');
  const [saving,     setSaving]     = useState(false);

  const add = async () => {
    if (!url.trim()) return;
    setSaving(true);
    await fetch(`/api/inquiries/${data.id}/attachments`, {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url,
        label:       label || null,
        attach_type: attachType,
        is_external: 1,
        uploaded_by: 'admin',
      }),
    });
    setUrl(''); setLabel(''); setAttachType('external_link');
    setSaving(false);
    setAdding(false);
    onRefresh();
  };

  const remove = async (attachId: number) => {
    await fetch(`/api/inquiries/${data.id}/attachments/${attachId}`, {
      method: 'DELETE', credentials: 'include',
    });
    onRefresh();
  };

  return (
    <div className="bg-white rounded-2xl border border-[#EDE0E4] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-[#C4717A]/10 flex items-center justify-center">
            <Paperclip size={15} className="text-[#C4717A]" />
          </div>
          <h3 className="text-sm font-bold text-[#2C2C2C]">Attachments</h3>
        </div>
        <button
          onClick={() => setAdding(a => !a)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#C4717A] hover:underline"
        >
          <Plus size={12} /> Add
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="space-y-2 bg-[#FAF6F0] rounded-xl p-3">
          <select
            value={attachType}
            onChange={e => setAttachType(e.target.value)}
            className="w-full px-2 py-1.5 text-xs bg-white rounded-lg border
                       border-[#EDE0E4] focus:border-[#C4717A]/30 focus:outline-none"
          >
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="URL or link (e.g. Pinterest, Google Drive…)"
            className="w-full px-2 py-1.5 text-xs bg-white rounded-lg border
                       border-[#EDE0E4] focus:border-[#C4717A]/30 focus:outline-none
                       text-[#2C2C2C] placeholder:text-[#2C2C2C]/25"
          />
          <input
            value={label}
            onChange={e => setLabel(e.target.value)}
            placeholder="Label (optional)"
            className="w-full px-2 py-1.5 text-xs bg-white rounded-lg border
                       border-[#EDE0E4] focus:border-[#C4717A]/30 focus:outline-none
                       text-[#2C2C2C] placeholder:text-[#2C2C2C]/25"
          />
          <div className="flex gap-2">
            <button
              onClick={add}
              disabled={saving || !url.trim()}
              className="flex-1 py-1.5 rounded-lg bg-[#C4717A] text-white text-xs font-bold
                         disabled:opacity-40 hover:bg-[#b05f68] transition-all"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              onClick={() => setAdding(false)}
              className="px-3 py-1.5 rounded-lg border border-[#EDE0E4] text-xs text-[#2C2C2C]/50
                         hover:bg-white transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {data.attachments.length === 0 && !adding && (
        <p className="text-xs text-[#2C2C2C]/25 text-center py-3">No attachments.</p>
      )}
      <div className="space-y-2">
        {data.attachments.map(a => (
          <div key={a.id}
            className="flex items-center gap-2 bg-[#FAF6F0] rounded-xl px-3 py-2">
            <span className="text-[#C4717A]/60 shrink-0">
              {TYPE_ICON[a.attach_type] ?? <Paperclip size={12} />}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[#2C2C2C] truncate">
                {a.label || a.attach_type}
              </p>
              <p className="text-[10px] text-[#2C2C2C]/30 truncate">{a.url}</p>
            </div>
            <a href={a.url} target="_blank" rel="noreferrer"
              className="text-[#2C2C2C]/30 hover:text-[#C4717A] transition-colors shrink-0">
              <ExternalLink size={12} />
            </a>
            <button
              onClick={() => remove(a.id)}
              className="text-[#2C2C2C]/20 hover:text-red-400 transition-colors shrink-0"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttachmentsCard;