// client/src/components/common/Modal.tsx

import React, { useEffect } from 'react';
import { COLORS } from '../../utils/theme';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen, onClose, title, children, maxWidth = '520px', footer
}) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(26,26,46,0.45)',
        display: 'flex', alignItems: 'flex-end',
        justifyContent: 'center',
        backdropFilter: 'blur(2px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: '20px 20px 0 0',
          width: '100%', maxWidth, maxHeight: '92dvh',
          display: 'flex', flexDirection: 'column',
          animation: 'slideUp 0.25s ease',
          boxShadow: '0 -8px 32px rgba(231,84,128,0.12)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 20px 14px', borderBottom: `1px solid ${COLORS.border}`,
          flexShrink: 0,
        }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: COLORS.text }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: COLORS.primaryLight, border: 'none', borderRadius: '50%',
              width: '32px', height: '32px', cursor: 'pointer',
              fontSize: '16px', color: COLORS.primary, flexShrink: 0,
            }}
          >×</button>
        </div>

        {/* Body */}
        <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1 }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div style={{
            padding: '12px 20px', borderTop: `1px solid ${COLORS.border}`,
            flexShrink: 0,
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};