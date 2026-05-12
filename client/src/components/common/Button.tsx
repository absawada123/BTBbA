// client/src/components/common/Button.tsx

import React from 'react';
import { COLORS } from '../../utils/theme';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
type Size    = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary:   { background: COLORS.primary,     color: '#fff', border: 'none' },
  secondary: { background: COLORS.primaryLight,color: COLORS.primary, border: `1.5px solid ${COLORS.border}` },
  danger:    { background: COLORS.danger,       color: '#fff', border: 'none' },
  ghost:     { background: 'transparent',       color: COLORS.textMuted, border: `1.5px solid ${COLORS.border}` },
  success:   { background: COLORS.success,      color: '#fff', border: 'none' },
};

const sizeStyles: Record<Size, React.CSSProperties> = {
  sm: { padding: '6px 12px',  fontSize: '12px', borderRadius: '8px',  minHeight: '32px' },
  md: { padding: '10px 18px', fontSize: '14px', borderRadius: '10px', minHeight: '40px' },
  lg: { padding: '14px 24px', fontSize: '15px', borderRadius: '12px', minHeight: '48px' },
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary', size = 'md', loading = false,
  icon, fullWidth = false, children, disabled, style, ...rest
}) => (
  <button
    disabled={disabled || loading}
    style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      gap: '6px', fontWeight: 600, cursor: disabled || loading ? 'not-allowed' : 'pointer',
      transition: 'opacity 0.15s, transform 0.1s', width: fullWidth ? '100%' : undefined,
      opacity: disabled || loading ? 0.6 : 1,
      ...variantStyles[variant], ...sizeStyles[size], ...style,
    }}
    {...rest}
  >
    {loading ? <span style={{ fontSize: '13px' }}>⏳</span> : icon}
    {children}
  </button>
);