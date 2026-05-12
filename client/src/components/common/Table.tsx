// client/src/components/common/Table.tsx

import React from 'react';
import { COLORS } from '../../utils/theme';

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyText?: string;
  onRowClick?: (row: T) => void;
}

export function Table<T extends { id?: number }>({
  columns, data, emptyText = 'No records found.', onRowClick
}: TableProps<T>) {
  if (!data.length) {
    return (
      <div style={{
        textAlign: 'center', padding: '40px 20px',
        color: COLORS.textMuted, fontSize: '14px',
      }}>
        {emptyText}
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={String(col.key)}
                style={{
                  padding: '10px 12px', textAlign: col.align || 'left',
                  background: COLORS.surfaceAlt, color: COLORS.textMuted,
                  fontWeight: 600, fontSize: '11px', whiteSpace: 'nowrap',
                  borderBottom: `1.5px solid ${COLORS.border}`,
                  width: col.width,
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={row.id ?? i}
              onClick={() => onRowClick?.(row)}
              style={{
                borderBottom: `1px solid ${COLORS.border}`,
                cursor: onRowClick ? 'pointer' : 'default',
                transition: 'background 0.1s',
                background: i % 2 === 0 ? '#fff' : COLORS.surfaceAlt,
              }}
              onMouseEnter={e => { if (onRowClick) (e.currentTarget as HTMLElement).style.background = COLORS.primaryLight; }}
              onMouseLeave={e => { if (onRowClick) (e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? '#fff' : COLORS.surfaceAlt; }}
            >
              {columns.map(col => (
                <td
                  key={String(col.key)}
                  style={{
                    padding: '10px 12px', textAlign: col.align || 'left',
                    color: COLORS.text, verticalAlign: 'middle', whiteSpace: 'nowrap',
                  }}
                >
                  {col.render
                    ? col.render(row)
                    : String((row as Record<string, unknown>)[col.key as string] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}