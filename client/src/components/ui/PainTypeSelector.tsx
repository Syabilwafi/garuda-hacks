"use client";
export type PainType =
  | "DULL_ACHE"
  | "SHARP"
  | "BURNING"
  | "THROBBING"
  | "PRESSURE";
interface PainTypeOption {
  value: PainType;
  label: string;
  emoji: string;
  description: string;
  color: string;
}
const PAIN_TYPES: PainTypeOption[] = [
  {
    value: "DULL_ACHE",
    label: "Dull Pain",
    emoji: "🟡",
    description: "Heavy and persistent pain",
    color: "#AFA406",
  },
  {
    value: "SHARP",
    label: "Sharp Pain",
    emoji: "🔴",
    description: "Stabbing or cutting pain",
    color: "#DC2626",
  },
  {
    value: "BURNING",
    label: "Burning Pain",
    emoji: "🟠",
    description: "Sensation of burning or heat",
    color: "#EA580C",
  },
  {
    value: "THROBBING",
    label: "Throbbing Pain",
    emoji: "🟣",
    description: "Rhythmic pain like a pulse",
    color: "#7C3AED",
  },
  {
    value: "PRESSURE",
    label: "Pressure Pain",
    emoji: "🔵",
    description: "Feeling of pressure or tightness",
    color: "#2563EB",
  },
];
interface PainTypeSelectorProps {
  selected: PainType;
  onSelect: (type: PainType) => void;
}
export default function PainTypeSelector({
  selected,
  onSelect,
}: PainTypeSelectorProps) {
  return (
    <div>
      <h3
        style={{
          fontFamily: "var(--font-primary)",
          fontWeight: 600,
          fontSize: "0.9rem",
          color: "var(--color-moss)",
          marginBottom: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        Select Pain Type
      </h3>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        {PAIN_TYPES.map((option) => {
          const isActive = selected === option.value;
          return (
            <button
              key={option.value}
              id={`pain-type-${option.value.toLowerCase()}`}
              onClick={() => onSelect(option.value)}
              className="hover-lift"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "0.875rem 1rem",
                borderRadius: isActive ? "24px 8px 24px 8px" : "12px 12px 12px 12px",
                border: isActive
                  ? `2px solid ${option.color}`
                  : "1px solid rgba(219, 221, 184, 0.6)",
                backgroundColor: isActive
                  ? `${option.color}0D` 
                  : "var(--color-white)",
                boxShadow: isActive ? `0 4px 12px ${option.color}22` : "none",
                cursor: "pointer",
                transition: "var(--transition-bounce)",
                textAlign: "left",
                width: "100%",
                transform: isActive ? "scale(1.02)" : "scale(1)",
                marginLeft: isActive ? "4px" : "0",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: option.color,
                  flexShrink: 0,
                  boxShadow: isActive ? `0 0 6px ${option.color}88` : "none",
                }}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                <span
                  style={{
                    fontFamily: "var(--font-primary)",
                    fontWeight: isActive ? 600 : 400,
                    fontSize: "0.9rem",
                    color: isActive ? option.color : "var(--color-moss)",
                  }}
                >
                  {option.label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-primary)",
                    fontSize: "0.75rem",
                    color: "var(--color-moss-60)",
                  }}
                >
                  {option.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
