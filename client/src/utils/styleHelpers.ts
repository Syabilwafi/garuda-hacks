import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, TRANSITIONS, Z_INDEX } from "@/constants";
import type { CSSProperties } from "react";

export const buttonStyles = {
  primary: (disabled = false): CSSProperties => ({
    padding: `${SPACING.md} ${SPACING.lg}`,
    backgroundColor: disabled ? "#D1D5DB" : COLORS.primary,
    color: COLORS.white,
    border: "none",
    borderRadius: BORDER_RADIUS.full,
    fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: TRANSITIONS.base,
    opacity: disabled ? 0.6 : 1,
  }),

  secondary: (disabled = false): CSSProperties => ({
    padding: `${SPACING.md} ${SPACING.lg}`,
    backgroundColor: COLORS.borderLight,
    color: COLORS.moss,
    border: `1.5px solid ${COLORS.border}`,
    borderRadius: BORDER_RADIUS.md,
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: TRANSITIONS.base,
    opacity: disabled ? 0.6 : 1,
  }),

  tertiary: (disabled = false): CSSProperties => ({
    background: "none",
    border: "none",
    color: COLORS.moss60,
    cursor: disabled ? "not-allowed" : "pointer",
    fontSize: "0.85rem",
    fontWeight: 600,
    opacity: disabled ? 0.6 : 1,
  }),

  yes: (): CSSProperties => ({
    flex: 1,
    padding: "0.85rem",
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    border: "none",
    borderRadius: BORDER_RADIUS.full,
    fontWeight: 700,
    cursor: "pointer",
    transition: TRANSITIONS.base,
  }),

  no: (): CSSProperties => ({
    flex: 1,
    padding: "0.85rem",
    backgroundColor: COLORS.borderLight,
    color: COLORS.moss,
    border: `1px solid ${COLORS.border}`,
    borderRadius: BORDER_RADIUS.full,
    fontWeight: 700,
    cursor: "pointer",
    transition: TRANSITIONS.base,
  }),
} as const;

export const cardStyles = (): CSSProperties => ({
  backgroundColor: COLORS.white,
  borderRadius: BORDER_RADIUS.md,
  padding: SPACING.lg,
  boxShadow: SHADOWS.card,
  border: `1px solid ${COLORS.border}`,
  transition: TRANSITIONS.base,
});

export const containerStyles = (): CSSProperties => ({
  maxWidth: "1200px",
  margin: "0 auto",
  padding: `0 ${SPACING.lg}`,
  width: "100%",
  boxSizing: "border-box",
});

export const flexCenter = (): CSSProperties => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const flexBetween = (): CSSProperties => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

export const flexColumn = (): CSSProperties => ({
  display: "flex",
  flexDirection: "column",
});

export const gridResponsive = (columns: number = 3, gap = SPACING.lg): CSSProperties => ({
  display: "grid",
  gridTemplateColumns: `repeat(auto-fit, minmax(300px, 1fr))`,
  gap,
  alignItems: "start",
});
