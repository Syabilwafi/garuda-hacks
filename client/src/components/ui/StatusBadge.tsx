export type EvaluationStatus = "SESUAI" | "PERLU_PERBAIKAN" | "BERISIKO";
interface StatusBadgeProps {
  status: EvaluationStatus;
  size?: "sm" | "md" | "lg";
}
const STATUS_CONFIG: Record<
  EvaluationStatus,
  { label: string; bg: string; color: string; border: string; icon: string }
> = {
  SESUAI: {
    label: "Teknik Sesuai",
    bg: "#F0FDF4",
    color: "#166534",
    border: "#86EFAC",
    icon: "✓",
  },
  PERLU_PERBAIKAN: {
    label: "Perlu Perbaikan",
    bg: "#FEFCE8",
    color: "#854D0E",
    border: "#FDE047",
    icon: "⚠",
  },
  BERISIKO: {
    label: "Berisiko",
    bg: "#FEF2F2",
    color: "#991B1B",
    border: "#FCA5A5",
    icon: "✕",
  },
};
export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const sizeStyles = {
    sm: { padding: "0.2rem 0.5rem", fontSize: "0.75rem" },
    md: { padding: "0.375rem 0.875rem", fontSize: "0.875rem" },
    lg: { padding: "0.5rem 1.25rem", fontSize: "1rem" },
  };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        ...sizeStyles[size],
        backgroundColor: config.bg,
        color: config.color,
        border: `1.5px solid ${config.border}`,
        borderRadius: "999px",
        fontFamily: "var(--font-primary)",
        fontWeight: 600,
      }}
    >
      <span style={{ fontWeight: 700, fontSize: "0.9em" }}>{config.icon}</span>
      {config.label}
    </span>
  );
}
