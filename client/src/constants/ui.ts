export const SPACING = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "2.5rem",
  "3xl": "3rem",
  "4xl": "4rem",
} as const;

export const BORDER_RADIUS = {
  sm: "var(--radius-sm)",
  md: "var(--radius-md)",
  organic: "var(--radius-organic)",
  full: "999px",
} as const;

export const SHADOWS = {
  card: "var(--shadow-card)",
  sm: "0 4px 6px -1px rgba(0, 0, 0, 0.02)",
  md: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
} as const;

export const TRANSITIONS = {
  base: "var(--transition-base)",
  bounce: "var(--transition-bounce)",
} as const;

export const Z_INDEX = {
  dropdown: 10,
  sticky: 20,
  fixed: 100,
  modal: 1000,
  toast: 9999,
} as const;

export const RESPONSIVE = {
  MOBILE: 640,
  TABLET: 1024,
  DESKTOP: 1200,
} as const;
