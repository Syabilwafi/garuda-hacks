"use client";
import { COLORS, SPACING } from "@/constants";
import { getTriageMessage, type TriageStatus } from "@/utils/screeningHelpers";

interface TriageAlertProps {
  status: TriageStatus;
}

export const TriageAlert = ({ status }: TriageAlertProps) => {
  const { title, content } = getTriageMessage(status);

  return (
    <div
      style={{
        backgroundColor: "#F9FAFB",
        border: `1px solid ${COLORS.border}`,
        padding: SPACING.md,
        borderRadius: "var(--radius-sm)",
        fontSize: "0.85rem",
        color: COLORS.moss,
        textAlign: "left",
        lineHeight: 1.5,
      }}
    >
      <strong>{title}:</strong> {content}
    </div>
  );
};
