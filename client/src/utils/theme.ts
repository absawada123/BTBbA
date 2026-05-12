// client/src/utils/theme.ts
export const theme = {
  colors: {
    rose:       '#C4717A',
    roseLight:  '#C4717A15',
    roseDark:   '#b05f68',
    sage:       '#6B7C5C',
    sageLight:  '#6B7C5C15',
    gold:       '#C9A84C',
    goldLight:  '#C9A84C15',
    cream:      '#FAF6F0',
    charcoal:   '#2C2C2C',
    white:      '#FFFFFF',
  },
  fonts: {
    sans:   "'Inter', system-ui, sans-serif",
    serif:  "'Georgia', 'Times New Roman', serif",
  },
} as const;

export type ThemeColor = keyof typeof theme.colors;