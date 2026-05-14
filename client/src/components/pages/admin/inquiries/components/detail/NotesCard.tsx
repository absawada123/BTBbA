// client/src/components/pages/admin/inquiries/components/detail/NotesCard.tsx

import React, { useState } from 'react';
import { StickyNote, Send, Lock } from 'lucide-react';
import type { InquiryDetail } from '../../InquiryDetailPage';

interface Props { data: InquiryDetail; onRefresh: () => void }

const fmtTime = (d: string) =>
  new Date(d).toLocaleString('en-PH', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  });

const NotesCard: React.FC<Props> = ({ data, onRefresh }) => {
  const [note,    setNote]    = useState('');
  const [sending, setSending] = useState(false);

  const send = async () => {
    if (!note.trim()) return;
    setSending(true);
    await fetch(`/api/inquiries/${data.id}/notes`, {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note }),
    });
    setNote('');
    setSending(false);
    onRefresh();
  };

  return (
    <div className="bg-white rounded-2xl border border-[#EDE0E4] p-5 space-y-4">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-amber-50 flex items-center justify-center">
          <StickyNote size={15} className="text-amber-500" />
        </div>
        <h3 className="text-sm font-bold text-[#2C2C2C]">Internal Notes</h3>
        <span className="ml-auto inline-flex items-center gap-1 text-[9px] font-bold
                         text-[#2C2C2C]/30 bg-[#FAF6F0] px-2 py-0.5 rounded-full">
          <Lock size={8} /> Admin only
        </span>
      </div>

      {/* Notes list */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {data.notes.length === 0 && (
          <p className="text-xs text-[#2C2C2C]/25 text-center py-3">No notes yet.</p>
        )}
        {data.notes.map(n => (
          <div key={n.id} className="bg-amber-50/60 rounded-xl px-3 py-2.5">
            <p className="text-xs text-[#2C2C2C]/80 leading-relaxed">{n.note}</p>
            <p className="text-[9px] text-[#2C2C2C]/30 mt-1">{fmtTime(n.created_at)}</p>
          </div>
        ))}
      </div>

      {/* Add note */}
      <div className="flex gap-2 border-t border-[#EDE0E4] pt-3">
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) send(); }}
          placeholder="Add internal note… (Ctrl+Enter to send)"
          rows={2}
          className="flex-1 px-3 py-2 text-xs bg-[#FAF6F0] rounded-xl border
                     border-transparent focus:border-[#C4717A]/30 focus:outline-none
                     text-[#2C2C2C] placeholder:text-[#2C2C2C]/25 resize-none"
        />
        <button
          onClick={send}
          disabled={sending || !note.trim()}
          className="self-end flex items-center justify-center h-9 w-9 rounded-xl
                     bg-[#C4717A] text-white hover:bg-[#b05f68]
                     transition-all disabled:opacity-30"
          aria-label="Send note"
        >
          <Send size={13} className={sending ? 'animate-pulse' : ''} />
        </button>
      </div>
    </div>
  );
};

export default NotesCard;