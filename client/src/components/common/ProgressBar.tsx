"use client";
import { COLORS, SPACING } from "@/constants";

interface ProgressBarProps {
  percentage: number;
  label?: string;
}

export const ProgressBar = ({ percentage, label = "Progress" }: ProgressBarProps) => {
  return (
    <div style={{ marginBottom: SPACING.lg }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
        <span style={{ fontSize: "0.75rem", fontWeight: 600, color: COLORS.moss80 }}>
          {label}
        </span>
        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: COLORS.primary }}>
          {percentage}%
        </span>
      </div>
      <div style={{ width: "100%", height: "6px", backgroundColor: COLORS.linen, borderRadius: "999px", overflow: "hidden" }}>
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            backgroundColor: COLORS.primary,
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );
};
