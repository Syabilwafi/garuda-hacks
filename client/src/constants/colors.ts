export const COLORS = {
  primary: "var(--color-martini)",
  moss: "var(--color-moss)",
  moss60: "var(--color-moss-60)",
  moss80: "var(--color-moss-80)",
  linen: "var(--color-linen)",
  sunflower: "var(--color-sunflower)",
  white: "#FFFFFF",
  black: "#000000",
  background: "#FDFCF8",
  card: "rgba(255, 255, 255, 0.7)",
  border: "#E5E7EB",
  borderLight: "#F3F4F6",
  text: "#111111",
  textMuted: "#4B5563",
  textMuted2: "#6B7280",
} as const;

export const PAIN_TYPE_COLORS: Record<string, string> = {
  DULL_ACHE: "#AFA406",
  SHARP: "#DC2626",
  BURNING: "#EA580C",
  THROBBING: "#7C3AED",
  PRESSURE: "#2563EB",
} as const;

export const TRIAGE_COLORS = {
  HIJAU: "#10B981",
  KUNING: "#F59E0B",
  MERAH_MENDESAK: "#EF4444",
  MERAH_DARURAT: "#DC2626",
} as const;
